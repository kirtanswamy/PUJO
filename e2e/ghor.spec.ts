import { test, expect } from '@playwright/test';

test.describe('Greybox ghor scene', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('stage renders with 4:5 aspect and all layers', async ({ page }) => {
    const stage = page.getByTestId('stage');
    await expect(stage).toBeVisible();

    const layers = stage.locator('[data-layer]');
    await expect(layers).toHaveCount(9);

    const layerNames = await layers.evaluateAll((els) =>
      els.map((el) => el.getAttribute('data-layer')),
    );
    expect(layerNames).toEqual([
      'sky', 'structure', 'protima', 'lights', 'fx',
      'foreground', 'smoke', 'tone', 'grain',
    ]);
  });

  test('caption shows scene title and clock', async ({ page }) => {
    const caption = page.getByTestId('caption');
    await expect(caption).toBeVisible();
    await expect(caption).toContainText('Ghor');
    await expect(caption).toContainText('ঘর');
  });

  test('screenshot at current viewport', async ({ page }) => {
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('ghor-scene.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});
