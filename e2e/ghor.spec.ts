import { test, expect } from '@playwright/test';

test.describe('Phase 1 shell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('stage uses a full-viewport camera with a centered safe area', async ({ page }) => {
    const viewport = page.viewportSize()!;
    await expect(page.getByTestId('stage')).toHaveCSS('height', `${viewport.height}px`);

    const svg = page.locator('svg.stage-svg');
    await expect(svg).toBeVisible();

    const svgBox = await svg.boundingBox();
    const expectedWidth = Math.min(viewport.height * 0.8, viewport.width);
    expect(svgBox?.width).toBeCloseTo(expectedWidth, 1);

    const svgLeft = svgBox?.x ?? 0;
    const expectedLeft = (viewport.width - expectedWidth) / 2;
    expect(svgLeft).toBeCloseTo(expectedLeft, 1);
  });

  test('gate is visible before entry', async ({ page }) => {
    await expect(page.getByTestId('entry-gate')).toBeVisible();
    await expect(page.getByRole('button', { name: 'পুজোয় প্রবেশ করুন' })).toBeFocused();
  });

  test('entry removes gate and resumes the audio context', async ({ page }) => {
    await page.getByRole('button', { name: 'পুজোয় প্রবেশ করুন' }).click();

    await expect(page.getByTestId('entry-gate')).toBeHidden();
    await expect(page.locator('main')).toHaveAttribute('data-entered', 'true');
    await expect(page.locator('main')).toHaveAttribute('data-audio-context', 'running');
    await expect(page.getByTestId('pujo-clock')).toHaveText('মহালয়া · 4:12 am');
  });

  test('mixer slider updates the store-backed input', async ({ page }) => {
    await page.getByRole('button', { name: 'পুজোয় প্রবেশ করুন' }).click();
    await expect(page.getByTestId('entry-gate')).toBeHidden();

    await expect(page.getByTestId('mixer-controls')).toBeHidden();
    await page.getByRole('button', { name: 'mixer' }).click();
    const slider = page.getByTestId('mixer-dhaak');
    await slider.fill('0.25');
    await expect(slider).toHaveValue('0.25');
    await expect(slider).toHaveClass(/mixer-range/);
  });

  test('mute persists across a reload', async ({ page }) => {
    await page.getByRole('button', { name: 'পুজোয় প্রবেশ করুন' }).click();
    await expect(page.getByTestId('entry-gate')).toBeHidden();

    await page.getByTestId('mute-button').click();
    await expect(page.getByTestId('mute-button')).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    await page.getByRole('button', { name: 'পুজোয় প্রবেশ করুন' }).click();
    await expect(page.getByTestId('entry-gate')).toBeHidden();
    await expect(page.getByTestId('mute-button')).toHaveAttribute('aria-pressed', 'true');
  });

  test('gate screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('entry-gate.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
  });

  test('post-gate screenshot', async ({ page }) => {
    await page.getByRole('button', { name: 'পুজোয় প্রবেশ করুন' }).click();
    await expect(page.getByTestId('entry-gate')).toBeHidden();
    await expect(page).toHaveScreenshot('post-gate.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
  });
});