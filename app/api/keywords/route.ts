/**
 * Keyword Research API Route
 * Handles CRUD operations for keyword research data
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Mock keyword data - replace with actual database queries
const mockKeywords: any[] = [
  {
    id: '1',
    keyword: 'best running shoes',
    searchVolume: 45000,
    cpc: 1.85,
    competition: 0.72,
    difficulty: 'hard',
    intent: 'transactional',
    status: 'tracking',
    currentRank: 12,
    targetUrl: '/blog/best-running-shoes-2024',
    tags: ['ecommerce', 'running'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    lastChecked: new Date('2024-01-20'),
  },
  {
    id: '2',
    keyword: 'how to tie running shoes',
    searchVolume: 3200,
    cpc: 0.45,
    competition: 0.15,
    difficulty: 'easy',
    intent: 'informational',
    status: 'tracking',
    currentRank: 3,
    targetUrl: '/blog/how-to-tie-running-shoes',
    tags: ['tutorial', 'running'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    lastChecked: new Date('2024-01-18'),
  },
  {
    id: '3',
    keyword: 'running shoes near me',
    searchVolume: 18500,
    cpc: 2.15,
    competition: 0.85,
    difficulty: 'very-hard',
    intent: 'navigational',
    status: 'opportunity',
    tags: ['local', 'running'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    keyword: 'marathon training plan',
    searchVolume: 22000,
    cpc: 1.25,
    competition: 0.45,
    difficulty: 'medium',
    intent: 'informational',
    status: 'tracking',
    currentRank: 8,
    targetUrl: '/guides/marathon-training-plan',
    tags: ['training', 'running'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-19'),
    lastChecked: new Date('2024-01-19'),
  },
  {
    id: '5',
    keyword: 'buy nike running shoes',
    searchVolume: 8100,
    cpc: 2.85,
    competition: 0.65,
    difficulty: 'medium',
    intent: 'transactional',
    status: 'paused',
    currentRank: 25,
    targetUrl: '/shop/nike-running-shoes',
    tags: ['ecommerce', 'nike'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-17'),
    lastChecked: new Date('2024-01-17'),
  },
  {
    id: '6',
    keyword: 'running shoe reviews',
    searchVolume: 35000,
    cpc: 1.45,
    competition: 0.58,
    difficulty: 'hard',
    intent: 'commercial',
    status: 'tracking',
    currentRank: 5,
    targetUrl: '/reviews/running-shoes',
    tags: ['reviews', 'running'],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-20'),
    lastChecked: new Date('2024-01-20'),
  },
  {
    id: '7',
    keyword: 'minimalist running shoes',
    searchVolume: 6700,
    cpc: 1.15,
    competition: 0.32,
    difficulty: 'easy',
    intent: 'commercial',
    status: 'opportunity',
    tags: ['minimalist', 'running'],
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '8',
    keyword: 'waterproof running shoes',
    searchVolume: 4200,
    cpc: 1.35,
    competition: 0.28,
    difficulty: 'very-easy',
    intent: 'transactional',
    status: 'tracking',
    currentRank: 1,
    targetUrl: '/blog/waterproof-running-shoes',
    tags: ['waterproof', 'running'],
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-19'),
    lastChecked: new Date('2024-01-19'),
  },
];

/**
 * GET /api/keywords
 * Fetch all keywords with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const intent = searchParams.get('intent') || 'all';
    const difficulty = searchParams.get('difficulty') || 'all';
    const status = searchParams.get('status') || 'all';
    const sortField = searchParams.get('sort') || 'keyword';
    const sortDirection = searchParams.get('order') || 'asc';

    // Filter keywords
    let filtered = [...mockKeywords];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (k) =>
          k.keyword.toLowerCase().includes(searchLower) ||
          k.tags?.some((t: string) => t.toLowerCase().includes(searchLower))
      );
    }

    if (intent !== 'all') {
      filtered = filtered.filter((k) => k.intent === intent);
    }

    if (difficulty !== 'all') {
      filtered = filtered.filter((k) => k.difficulty === difficulty);
    }

    if (status !== 'all') {
      filtered = filtered.filter((k) => k.status === status);
    }

    // Sort keywords
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'keyword':
          comparison = a.keyword.localeCompare(b.keyword);
          break;
        case 'searchVolume':
          comparison = (a.searchVolume || 0) - (b.searchVolume || 0);
          break;
        case 'difficulty':
          const difficultyOrder = [
            'very-easy',
            'easy',
            'medium',
            'hard',
            'very-hard',
          ];
          comparison =
            difficultyOrder.indexOf(a.difficulty) -
            difficultyOrder.indexOf(b.difficulty);
          break;
        case 'intent':
          comparison = a.intent.localeCompare(b.intent);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'currentRank':
          comparison = (a.currentRank || 999) - (b.currentRank || 999);
          break;
        case 'createdAt':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return NextResponse.json({
      keywords: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/keywords
 * Create a new keyword or bulk import
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bulk, keywords } = body;

    if (bulk && Array.isArray(keywords)) {
      // Bulk import
      const results = {
        total: keywords.length,
        successful: 0,
        failed: 0,
        errors: [] as Array<{ row: number; keyword: string; error: string }>,
      };

      keywords.forEach((kw: any, index: number) => {
        try {
          // Validate keyword
          if (!kw.keyword || typeof kw.keyword !== 'string') {
            results.failed++;
            results.errors.push({
              row: index + 1,
              keyword: kw.keyword || 'unknown',
              error: 'Invalid keyword',
            });
            return;
          }

          // Create new keyword (in real app, save to database)
          const newKeyword = {
            id: `${Date.now()}-${index}`,
            keyword: kw.keyword,
            searchVolume: kw.searchVolume
              ? parseInt(kw.searchVolume)
              : undefined,
            cpc: kw.cpc ? parseFloat(kw.cpc) : undefined,
            difficulty: kw.difficulty || 'medium',
            intent: kw.intent || 'informational',
            status: 'tracking',
            tags: kw.tags
              ? kw.tags.split(',').map((t: string) => t.trim())
              : [],
            targetUrl: kw.targetUrl,
            notes: kw.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          mockKeywords.push(newKeyword);
          results.successful++;
        } catch (err) {
          results.failed++;
          results.errors.push({
            row: index + 1,
            keyword: kw.keyword || 'unknown',
            error: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      });

      return NextResponse.json(results);
    }

    // Single keyword creation
    const {
      keyword,
      searchVolume,
      cpc,
      difficulty,
      intent,
      tags,
      targetUrl,
      notes,
    } = body;

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }

    const newKeyword = {
      id: `${Date.now()}`,
      keyword,
      searchVolume: searchVolume || undefined,
      cpc: cpc || undefined,
      difficulty: difficulty || 'medium',
      intent: intent || 'informational',
      status: 'tracking',
      tags: tags || [],
      targetUrl,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockKeywords.push(newKeyword);

    return NextResponse.json(newKeyword, { status: 201 });
  } catch (error) {
    console.error('Error creating keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/keywords
 * Delete a keyword
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Keyword ID is required' },
        { status: 400 }
      );
    }

    const index = mockKeywords.findIndex((k) => k.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Keyword not found' }, { status: 404 });
    }

    mockKeywords.splice(index, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    return NextResponse.json(
      { error: 'Failed to delete keyword' },
      { status: 500 }
    );
  }
}
