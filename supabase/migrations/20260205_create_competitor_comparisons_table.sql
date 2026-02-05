-- Migration: Create Competitor Comparisons Table with Multi-Tenancy Support
-- Date: 2026-02-05
-- Description: Creates competitor_comparisons table for comparing user keyword rankings with competitors, showing ranking gaps, and identifying quick-win opportunities

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create opportunity type enum
DO $$ BEGIN
    CREATE TYPE opportunity_type AS ENUM ('quick-win', 'medium-effort', 'long-term');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create competitor_comparisons table
CREATE TABLE IF NOT EXISTS competitor_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    keyword_id UUID NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,

    -- User ranking data
    user_current_rank INTEGER,
    user_url TEXT,

    -- Competitor ranking data
    competitor_domains TEXT[] DEFAULT '{}', -- Array of competitor domains being tracked
    competitor_ranks JSONB DEFAULT '{}'::jsonb, -- Object mapping domain -> rank for this keyword
    competitor_urls JSONB DEFAULT '{}'::jsonb, -- Object mapping domain -> ranking URL

    -- Gap analysis
    ranking_gaps JSONB DEFAULT '[]'::jsonb, -- Array of gap objects: {domain, gap_size, opportunity_type}
    gap_to_first_page INTEGER, -- Positions needed to reach first page (1-10)
    gap_to_top_3 INTEGER, -- Positions needed to reach top 3
    gap_to_position_1 INTEGER, -- Positions needed to reach #1

    -- Opportunity assessment
    opportunity_type opportunity_type DEFAULT 'medium-effort',
    opportunity_score INTEGER CHECK (opportunity_score >= 0 AND opportunity_score <= 100),

    -- Competitor strength indicators
    avg_competitor_rank NUMERIC(5, 2),
    strongest_competitor_domain TEXT,
    strongest_competitor_rank INTEGER,

    -- Trend data
    previous_rank INTEGER, -- User's previous rank for trend calculation
    rank_trend VARCHAR(10) CHECK (rank_trend IN ('up', 'down', 'stable')),

    -- Device and location for this comparison
    device VARCHAR(10) DEFAULT 'desktop',
    location TEXT DEFAULT 'us',

    -- Status tracking
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    last_analyzed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_organization_id ON competitor_comparisons(organization_id);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_product_id ON competitor_comparisons(product_id);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_keyword_id ON competitor_comparisons(keyword_id);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_user_current_rank ON competitor_comparisons(user_current_rank);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_opportunity_type ON competitor_comparisons(opportunity_type);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_opportunity_score ON competitor_comparisons(opportunity_score);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_is_active ON competitor_comparisons(is_active);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_device ON competitor_comparisons(device);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_location ON competitor_comparisons(location);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_last_analyzed_at ON competitor_comparisons(last_analyzed_at);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_org_product ON competitor_comparisons(organization_id, product_id);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_org_keyword ON competitor_comparisons(organization_id, keyword_id);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_competitor_domains ON competitor_comparisons USING gin(competitor_domains);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_ranking_gaps ON competitor_comparisons USING gin(ranking_gaps);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_metadata ON competitor_comparisons USING gin(metadata);
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_created_at ON competitor_comparisons(created_at);

-- Create index for quick-win queries
CREATE INDEX IF NOT EXISTS idx_competitor_comparisons_quick_wins ON competitor_comparisons(organization_id, opportunity_type)
    WHERE is_active = true AND opportunity_type = 'quick-win';

-- Create trigger for automatic updated_at updates
DROP TRIGGER IF EXISTS update_competitor_comparisons_updated_at ON competitor_comparisons;
CREATE TRIGGER update_competitor_comparisons_updated_at
    BEFORE UPDATE ON competitor_comparisons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE competitor_comparisons ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Service role has full access to competitor_comparisons" ON competitor_comparisons;
DROP POLICY IF EXISTS "Competitor comparisons are viewable by organization members" ON competitor_comparisons;
DROP POLICY IF EXISTS "Competitor comparisons can be created by organization members" ON competitor_comparisons;
DROP POLICY IF EXISTS "Competitor comparisons can be updated by organization admins" ON competitor_comparisons;
DROP POLICY IF EXISTS "Competitor comparisons can be deleted by organization owners" ON competitor_comparisons;

-- RLS Policies for competitor_comparisons table

-- Policy: Service role has full access (for server-side operations)
CREATE POLICY "Service role has full access to competitor_comparisons"
ON competitor_comparisons
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Users can view competitor comparisons from their organizations
CREATE POLICY "Competitor comparisons are viewable by organization members"
ON competitor_comparisons
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_members.organization_id = competitor_comparisons.organization_id
        AND organization_members.user_id = auth.uid()::text
    )
);

-- Policy: Organization members can create competitor comparisons
CREATE POLICY "Competitor comparisons can be created by organization members"
ON competitor_comparisons
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_members.organization_id = competitor_comparisons.organization_id
        AND organization_members.user_id = auth.uid()::text
        AND organization_members.role IN ('owner', 'admin', 'member')
    )
);

-- Policy: Organization admins can update competitor comparisons
CREATE POLICY "Competitor comparisons can be updated by organization admins"
ON competitor_comparisons
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_members.organization_id = competitor_comparisons.organization_id
        AND organization_members.user_id = auth.uid()::text
        AND organization_members.role IN ('owner', 'admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_members.organization_id = competitor_comparisons.organization_id
        AND organization_members.user_id = auth.uid()::text
        AND organization_members.role IN ('owner', 'admin')
    )
);

-- Policy: Only owners can delete competitor comparisons
CREATE POLICY "Competitor comparisons can be deleted by organization owners"
ON competitor_comparisons
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_members.organization_id = competitor_comparisons.organization_id
        AND organization_members.user_id = auth.uid()::text
        AND organization_members.role = 'owner'
    )
);

-- Helper function to create or update competitor comparison
CREATE OR REPLACE FUNCTION upsert_competitor_comparison(
    p_organization_id UUID,
    p_product_id UUID,
    p_keyword_id UUID,
    p_user_current_rank INTEGER DEFAULT NULL,
    p_user_url TEXT DEFAULT NULL,
    p_competitor_domains TEXT[] DEFAULT NULL,
    p_competitor_ranks JSONB DEFAULT NULL,
    p_competitor_urls JSONB DEFAULT NULL,
    p_opportunity_type opportunity_type DEFAULT 'medium-effort',
    p_opportunity_score INTEGER DEFAULT NULL,
    p_device VARCHAR(10) DEFAULT 'desktop',
    p_location TEXT DEFAULT 'us',
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS competitor_comparisons AS $$
DECLARE
    v_result competitor_comparisons;
    v_gap_to_first_page INTEGER;
    v_gap_to_top_3 INTEGER;
    v_gap_to_position_1 INTEGER;
    v_avg_competitor_rank NUMERIC(5, 2);
    v_strongest_domain TEXT;
    v_strongest_rank INTEGER;
    v_ranking_gaps JSONB;
    v_previous_rank INTEGER;
    v_rank_trend VARCHAR(10);
BEGIN
    -- Get previous rank for trend calculation
    SELECT cc.user_current_rank INTO v_previous_rank
    FROM competitor_comparisons cc
    WHERE cc.keyword_id = p_keyword_id
    AND cc.device = p_device
    AND cc.location = p_location
    ORDER BY cc.last_analyzed_at DESC
    LIMIT 1;

    -- Calculate rank trend
    IF v_previous_rank IS NOT NULL AND p_user_current_rank IS NOT NULL THEN
        IF p_user_current_rank < v_previous_rank THEN
            v_rank_trend := 'up';
        ELSIF p_user_current_rank > v_previous_rank THEN
            v_rank_trend := 'down';
        ELSE
            v_rank_trend := 'stable';
        END IF;
    ELSE
        v_rank_trend := 'stable';
    END IF;

    -- Calculate gaps to top positions
    IF p_user_current_rank IS NOT NULL THEN
        v_gap_to_position_1 := GREATEST(p_user_current_rank - 1, 0);
        v_gap_to_top_3 := GREATEST(p_user_current_rank - 3, 0);
        v_gap_to_first_page := GREATEST(p_user_current_rank - 10, 0);
    ELSE
        v_gap_to_position_1 := NULL;
        v_gap_to_top_3 := NULL;
        v_gap_to_first_page := NULL;
    END IF;

    -- Find strongest competitor (lowest rank = best)
    IF p_competitor_ranks IS NOT NULL AND jsonb_typeof(p_competitor_ranks) = 'object' THEN
        SELECT
            key,
            (value->>'rank')::INTEGER
        INTO v_strongest_domain, v_strongest_rank
        FROM jsonb_each_text(p_competitor_ranks)
        ORDER BY (value->>'rank')::INTEGER ASC
        LIMIT 1;

        -- Calculate average competitor rank
        SELECT AVG((value->>'rank')::NUMERIC)
        INTO v_avg_competitor_rank
        FROM jsonb_each_text(p_competitor_ranks);
    END IF;

    -- Build ranking gaps array
    IF p_competitor_ranks IS NOT NULL AND p_user_current_rank IS NOT NULL THEN
        SELECT jsonb_agg(jsonb_build_object(
            'domain', key,
            'rank', (value->>'rank')::INTEGER,
            'gap_size', p_user_current_rank - (value->>'rank')::INTEGER,
            'opportunity_type',
            CASE
                WHEN p_user_current_rank - (value->>'rank')::INTEGER <= 3 THEN 'quick-win'
                WHEN p_user_current_rank - (value->>'rank')::INTEGER <= 10 THEN 'medium-effort'
                ELSE 'long-term'
            END
        ))
        INTO v_ranking_gaps
        FROM jsonb_each_text(p_competitor_ranks)
        WHERE (value->>'rank')::INTEGER < p_user_current_rank;
    END IF;

    -- Insert or update competitor comparison
    INSERT INTO competitor_comparisons (
        organization_id,
        product_id,
        keyword_id,
        user_current_rank,
        user_url,
        competitor_domains,
        competitor_ranks,
        competitor_urls,
        ranking_gaps,
        gap_to_first_page,
        gap_to_top_3,
        gap_to_position_1,
        opportunity_type,
        opportunity_score,
        avg_competitor_rank,
        strongest_competitor_domain,
        strongest_competitor_rank,
        previous_rank,
        rank_trend,
        device,
        location,
        last_analyzed_at,
        metadata
    ) VALUES (
        p_organization_id,
        p_product_id,
        p_keyword_id,
        p_user_current_rank,
        p_user_url,
        COALESCE(p_competitor_domains, '{}'::TEXT[]),
        COALESCE(p_competitor_ranks, '{}'::jsonb),
        COALESCE(p_competitor_urls, '{}'::jsonb),
        COALESCE(v_ranking_gaps, '[]'::jsonb),
        v_gap_to_first_page,
        v_gap_to_top_3,
        v_gap_to_position_1,
        p_opportunity_type,
        p_opportunity_score,
        v_avg_competitor_rank,
        v_strongest_domain,
        v_strongest_rank,
        v_previous_rank,
        v_rank_trend,
        p_device,
        p_location,
        NOW(),
        p_metadata
    )
    ON CONFLICT (keyword_id, device, location)
    DO UPDATE SET
        user_current_rank = EXCLUDED.user_current_rank,
        user_url = EXCLUDED.user_url,
        competitor_domains = EXCLUDED.competitor_domains,
        competitor_ranks = EXCLUDED.competitor_ranks,
        competitor_urls = EXCLUDED.competitor_urls,
        ranking_gaps = EXCLUDED.ranking_gaps,
        gap_to_first_page = EXCLUDED.gap_to_first_page,
        gap_to_top_3 = EXCLUDED.gap_to_top_3,
        gap_to_position_1 = EXCLUDED.gap_to_position_1,
        opportunity_type = EXCLUDED.opportunity_type,
        opportunity_score = EXCLUDED.opportunity_score,
        avg_competitor_rank = EXCLUDED.avg_competitor_rank,
        strongest_competitor_domain = EXCLUDED.strongest_competitor_domain,
        strongest_competitor_rank = EXCLUDED.strongest_competitor_rank,
        previous_rank = EXCLUDED.previous_rank,
        rank_trend = EXCLUDED.rank_trend,
        last_analyzed_at = EXCLUDED.last_analyzed_at,
        metadata = EXCLUDED.metadata
    RETURNING * INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get competitor comparisons for a keyword
CREATE OR REPLACE FUNCTION get_keyword_competitor_comparison(
    p_keyword_id UUID,
    p_device VARCHAR(10) DEFAULT 'desktop',
    p_location TEXT DEFAULT 'us'
)
RETURNS TABLE (
    id UUID,
    keyword_id UUID,
    user_current_rank INTEGER,
    user_url TEXT,
    competitor_domains TEXT[],
    competitor_ranks JSONB,
    ranking_gaps JSONB,
    gap_to_first_page INTEGER,
    gap_to_top_3 INTEGER,
    gap_to_position_1 INTEGER,
    opportunity_type opportunity_type,
    opportunity_score INTEGER,
    avg_competitor_rank NUMERIC,
    strongest_competitor_domain TEXT,
    strongest_competitor_rank INTEGER,
    rank_trend VARCHAR(10),
    last_analyzed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cc.id,
        cc.keyword_id,
        cc.user_current_rank,
        cc.user_url,
        cc.competitor_domains,
        cc.competitor_ranks,
        cc.ranking_gaps,
        cc.gap_to_first_page,
        cc.gap_to_top_3,
        cc.gap_to_position_1,
        cc.opportunity_type,
        cc.opportunity_score,
        cc.avg_competitor_rank,
        cc.strongest_competitor_domain,
        cc.strongest_competitor_rank,
        cc.rank_trend,
        cc.last_analyzed_at
    FROM competitor_comparisons cc
    WHERE cc.keyword_id = p_keyword_id
    AND cc.device = p_device
    AND cc.location = p_location
    AND cc.is_active = true
    ORDER BY cc.last_analyzed_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get competitor comparisons for a product
CREATE OR REPLACE FUNCTION get_product_competitor_comparisons(
    p_product_id UUID,
    p_device VARCHAR(10) DEFAULT NULL,
    p_location TEXT DEFAULT NULL,
    p_opportunity_type opportunity_type DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    keyword_id UUID,
    user_current_rank INTEGER,
    competitor_domains TEXT[],
    ranking_gaps JSONB,
    opportunity_type opportunity_type,
    opportunity_score INTEGER,
    gap_to_first_page INTEGER,
    last_analyzed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cc.id,
        cc.keyword_id,
        cc.user_current_rank,
        cc.competitor_domains,
        cc.ranking_gaps,
        cc.opportunity_type,
        cc.opportunity_score,
        cc.gap_to_first_page,
        cc.last_analyzed_at
    FROM competitor_comparisons cc
    WHERE cc.product_id = p_product_id
    AND cc.is_active = true
    AND (p_device IS NULL OR cc.device = p_device)
    AND (p_location IS NULL OR cc.location = p_location)
    AND (p_opportunity_type IS NULL OR cc.opportunity_type = p_opportunity_type)
    ORDER BY cc.opportunity_score DESC NULLS LAST, cc.last_analyzed_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get competitor comparisons for an organization
CREATE OR REPLACE FUNCTION get_organization_competitor_comparisons(
    p_organization_id UUID,
    p_product_id UUID DEFAULT NULL,
    p_opportunity_type opportunity_type DEFAULT NULL,
    p_quick_wins_only BOOLEAN DEFAULT FALSE,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    product_id UUID,
    keyword_id UUID,
    user_current_rank INTEGER,
    competitor_domains TEXT[],
    ranking_gaps JSONB,
    opportunity_type opportunity_type,
    opportunity_score INTEGER,
    gap_to_first_page INTEGER,
    rank_trend VARCHAR(10),
    last_analyzed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cc.id,
        cc.product_id,
        cc.keyword_id,
        cc.user_current_rank,
        cc.competitor_domains,
        cc.ranking_gaps,
        cc.opportunity_type,
        cc.opportunity_score,
        cc.gap_to_first_page,
        cc.rank_trend,
        cc.last_analyzed_at
    FROM competitor_comparisons cc
    WHERE cc.organization_id = p_organization_id
    AND cc.is_active = true
    AND (p_product_id IS NULL OR cc.product_id = p_product_id)
    AND (p_opportunity_type IS NULL OR cc.opportunity_type = p_opportunity_type)
    AND (NOT p_quick_wins_only OR cc.opportunity_type = 'quick-win')
    ORDER BY
        CASE
            WHEN p_quick_wins_only THEN 0
            ELSE 1
        END,
        cc.opportunity_score DESC NULLS LAST,
        cc.last_analyzed_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get quick-win opportunities
CREATE OR REPLACE FUNCTION get_quick_win_opportunities(
    p_organization_id UUID,
    p_product_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    product_id UUID,
    keyword_id UUID,
    user_current_rank INTEGER,
    gap_to_first_page INTEGER,
    gap_to_top_3 INTEGER,
    opportunity_score INTEGER,
    competitor_domains TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cc.id,
        cc.product_id,
        cc.keyword_id,
        cc.user_current_rank,
        cc.gap_to_first_page,
        cc.gap_to_top_3,
        cc.opportunity_score,
        cc.competitor_domains
    FROM competitor_comparisons cc
    WHERE cc.organization_id = p_organization_id
    AND cc.is_active = true
    AND (p_product_id IS NULL OR cc.product_id = p_product_id)
    AND cc.opportunity_type = 'quick-win'
    AND cc.gap_to_first_page IS NOT NULL
    AND cc.gap_to_first_page <= 5
    ORDER BY cc.opportunity_score DESC NULLS LAST, cc.gap_to_first_page ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user can access a competitor comparison
CREATE OR REPLACE FUNCTION can_access_competitor_comparison(p_competitor_comparison_id UUID, p_user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM competitor_comparisons cc
        JOIN organization_members om ON cc.organization_id = om.organization_id
        WHERE cc.id = p_competitor_comparison_id
        AND om.user_id = p_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON TABLE competitor_comparisons IS 'Competitor ranking comparisons for keywords with gap analysis and opportunity identification';
COMMENT ON COLUMN competitor_comparisons.id IS 'Unique identifier for the competitor comparison';
COMMENT ON COLUMN competitor_comparisons.organization_id IS 'Reference to the owning organization';
COMMENT ON COLUMN competitor_comparisons.product_id IS 'Reference to the associated product (optional)';
COMMENT ON COLUMN competitor_comparisons.keyword_id IS 'Reference to the keyword being compared';
COMMENT ON COLUMN competitor_comparisons.user_current_rank IS 'User''s current ranking position for this keyword';
COMMENT ON COLUMN competitor_comparisons.user_url IS 'User''s URL that is ranking for this keyword';
COMMENT ON COLUMN competitor_comparisons.competitor_domains IS 'Array of competitor domains being tracked';
COMMENT ON COLUMN competitor_comparisons.competitor_ranks IS 'JSON object mapping competitor domains to their rank positions';
COMMENT ON COLUMN competitor_comparisons.competitor_urls IS 'JSON object mapping competitor domains to their ranking URLs';
COMMENT ON COLUMN competitor_comparisons.ranking_gaps IS 'JSON array of gaps between user and each competitor';
COMMENT ON COLUMN competitor_comparisons.gap_to_first_page IS 'Positions needed to reach first page (rank 1-10)';
COMMENT ON COLUMN competitor_comparisons.gap_to_top_3 IS 'Positions needed to reach top 3 positions';
COMMENT ON COLUMN competitor_comparisons.gap_to_position_1 IS 'Positions needed to reach position 1';
COMMENT ON COLUMN competitor_comparisons.opportunity_type IS 'Opportunity classification: quick-win, medium-effort, or long-term';
COMMENT ON COLUMN competitor_comparisons.opportunity_score IS 'Calculated opportunity score (0-100) based on ranking gaps';
COMMENT ON COLUMN competitor_comparisons.avg_competitor_rank IS 'Average ranking position of all competitors';
COMMENT ON COLUMN competitor_comparisons.strongest_competitor_domain IS 'Domain of the highest-ranking competitor';
COMMENT ON COLUMN competitor_comparisons.strongest_competitor_rank IS 'Rank of the highest-ranking competitor';
COMMENT ON COLUMN competitor_comparisons.previous_rank IS 'User''s previous rank for trend calculation';
COMMENT ON COLUMN competitor_comparisons.rank_trend IS 'Ranking trend direction: up, down, or stable';
COMMENT ON COLUMN competitor_comparisons.device IS 'Device type for comparison: desktop, mobile, or tablet';
COMMENT ON COLUMN competitor_comparisons.location IS 'ISO country code for location-specific comparison';
COMMENT ON COLUMN competitor_comparisons.is_active IS 'Whether this comparison is actively tracked';
COMMENT ON COLUMN competitor_comparisons.last_analyzed_at IS 'Timestamp when the comparison was last analyzed';

-- Grant necessary permissions
GRANT ALL ON competitor_comparisons TO authenticated;
GRANT ALL ON competitor_comparisons TO service_role;
GRANT EXECUTE ON FUNCTION upsert_competitor_comparison TO authenticated;
GRANT EXECUTE ON FUNCTION get_keyword_competitor_comparison TO authenticated;
GRANT EXECUTE ON FUNCTION get_product_competitor_comparisons TO authenticated;
GRANT EXECUTE ON FUNCTION get_organization_competitor_comparisons TO authenticated;
GRANT EXECUTE ON FUNCTION get_quick_win_opportunities TO authenticated;
GRANT EXECUTE ON FUNCTION can_access_competitor_comparison TO authenticated;
