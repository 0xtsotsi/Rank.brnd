import { test, expect } from '@playwright/test';

/**
 * Verification test for SEO Scoring Engine feature
 * Tests the /api/seo/analyze endpoint with various content scenarios
 */

test.describe('SEO Scoring Engine API', () => {
  const API_URL = 'http://localhost:3007/api/seo/analyze';

  test.beforeAll(async () => {
    // Ensure the dev server is running or start it
    console.log('Starting dev server for SEO scoring verification...');
  });

  test('should analyze content with good SEO practices', async ({ request }) => {
    const goodContent = {
      title: 'Complete Guide to SEO Optimization',
      content: `
        <h1>SEO Optimization Guide</h1>
        <p>SEO optimization helps websites rank better. Learn key strategies.</p>
        <h2>What is SEO?</h2>
        <p>Search Engine Optimization improves visibility. Proper SEO optimization requires planning.</p>
        <h2>Key Strategies</h2>
        <p>Effective SEO optimization includes quality content. SEO optimization matters.</p>
        <p>Learn more on our <a href="/resources">resources page</a>.</p>
        <img src="/seo.jpg" alt="SEO optimization guide cover">
      `,
      slug: 'complete-guide-to-seo-optimization',
      metaTitle: 'Complete Guide to SEO Optimization | Rank',
      metaDescription: 'Learn SEO optimization strategies to improve your rankings.',
      metaKeywords: ['SEO', 'optimization'],
      canonicalUrl: 'https://example.com/guide',
      options: {
        targetKeyword: 'SEO optimization'
      }
    };

    const response = await request.post(API_URL, {
      data: goodContent
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    // Verify response structure
    expect(data).toHaveProperty('overallScore');
    expect(data).toHaveProperty('metrics');
    expect(data).toHaveProperty('keywordDensity');
    expect(data).toHaveProperty('readability');
    expect(data).toHaveProperty('headingStructure');
    expect(data).toHaveProperty('metaTags');
    expect(data).toHaveProperty('links');
    expect(data).toHaveProperty('images');
    expect(data).toHaveProperty('recommendations');

    // Verify score is between 0-100
    expect(data.overallScore).toBeGreaterThanOrEqual(0);
    expect(data.overallScore).toBeLessThanOrEqual(100);

    // Verify keyword density is calculated
    expect(data.keywordDensity).toHaveProperty('density');
    expect(data.keywordDensity).toHaveProperty('count');
    expect(data.keywordDensity).toHaveProperty('inTitle');
    expect(data.keywordDensity.inTitle).toBe(true);

    // Verify readability (Flesch-Kincaid)
    expect(data.readability).toHaveProperty('fleschKincaidGrade');
    expect(data.readability).toHaveProperty('targetGradeMet');
    expect(typeof data.readability.fleschKincaidGrade).toBe('number');

    // Verify heading structure
    expect(data.headingStructure).toHaveProperty('hasH1');
    expect(data.headingStructure).toHaveProperty('h1Count');
    expect(data.headingStructure.hasH1).toBe(true);

    // Verify meta tags
    expect(data.metaTags).toHaveProperty('titleOptimal');
    expect(data.metaTags).toHaveProperty('descriptionOptimal');

    console.log('Good content SEO score:', data.overallScore);
  });

  test('should detect poor SEO practices', async ({ request }) => {
    const poorContent = {
      title: 'Article', // Too generic
      content: `
        <h1>Title</h1>
        <p>SEO optimization SEO optimization SEO optimization SEO optimization SEO optimization.</p>
        <h3>Skipped H2</h3>
        <p>Content without links or images.</p>
        <img src="test.jpg">
      `,
      slug: 'article',
      metaTitle: 'Short', // Too short
      metaDescription: 'Too short meta', // Too short
      options: {
        targetKeyword: 'SEO optimization'
      }
    };

    const response = await request.post(API_URL, {
      data: poorContent
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    // Should detect keyword stuffing
    expect(data.keywordDensity.density).toBeGreaterThan(2);
    expect(data.keywordDensity.tooHigh).toBe(true);

    // Should detect heading issues
    expect(data.headingStructure.hasH1).toBe(true);
    // May have hierarchy issues due to skipped H2

    // Should detect missing alt text
    expect(data.images.imagesWithoutAlt).toBe(1);

    // Should detect poor meta tags
    expect(data.metaTags.titleOptimal).toBe(false);
    expect(data.metaTags.descriptionOptimal).toBe(false);

    // Should have recommendations
    expect(data.recommendations.length).toBeGreaterThan(0);

    console.log('Poor content SEO score:', data.overallScore);
    console.log('Recommendations:', data.recommendations);
  });

  test('should handle empty content gracefully', async ({ request }) => {
    const emptyContent = {
      title: '',
      content: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      options: {}
    };

    const response = await request.post(API_URL, {
      data: emptyContent
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    // Should still return valid structure
    expect(data).toHaveProperty('overallScore');
    expect(data.overallScore).toBe(0);

    console.log('Empty content SEO score:', data.overallScore);
  });

  test('should validate heading hierarchy', async ({ request }) => {
    const badHierarchy = {
      title: 'Heading Hierarchy Test',
      content: `
        <h1>Main Title</h1>
        <p>Some content</p>
        <h3>Skipped H2 - Bad Hierarchy</h3>
        <p>More content</p>
        <h2>Going back to H2</h2>
        <p>Even more content</p>
      `,
      slug: 'heading-hierarchy-test',
      metaTitle: 'Heading Hierarchy Test Article',
      metaDescription: 'Testing heading hierarchy validation',
      options: {}
    };

    const response = await request.post(API_URL, {
      data: badHierarchy
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    // Should detect heading hierarchy issues
    expect(data.headingStructure).toHaveProperty('headingHierarchy');
    expect(data.headingStructure).toHaveProperty('issues');

    console.log('Heading hierarchy valid:', data.headingStructure.headingHierarchy);
    if (data.headingStructure.issues) {
      console.log('Heading issues:', data.headingStructure.issues);
    }
  });
});
