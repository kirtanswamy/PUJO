import { test, expect } from '@playwright/test';

const REQUIRED_IDS = [
  'sky',
  'structure',
  'chalchitra',
  'protima',
  'eye-l',
  'eye-r',
  'lights',
  'lamp-pradip',
  'foreground',
];

test.describe('Phase 2: Protima scene', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole('button', { name: 'পুজোয় প্রবেশ করুন' }).click();
    await expect(page.getByTestId('entry-gate')).toBeHidden();
  });

  test('all required SVG layer IDs exist in ghor scene', async ({ page }) => {
    await page.evaluate(() => {
      const store = (window as any).__PUJO_STORE__;
      if (store) store.getState().setScene('ghor');
    });

    const svg = page.locator('svg.stage-svg');
    await expect(svg).toBeVisible();

    for (const id of REQUIRED_IDS) {
      const element = svg.locator(`#${id}`);
      await expect(element).toHaveCount(1);
    }
  });

  test('all required SVG layer IDs exist in shashthi scene', async ({ page }) => {
    await page.evaluate(() => {
      const store = (window as any).__PUJO_STORE__;
      if (store) store.getState().setScene('shashthi');
    });

    const svg = page.locator('svg.stage-svg');
    await expect(svg).toBeVisible();

    for (const id of REQUIRED_IDS) {
      const element = svg.locator(`#${id}`);
      await expect(element).toHaveCount(1);
    }
  });

  test('reduced-motion disables eye animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.getByRole('button', { name: 'পুজোয় প্রবেশ করুন' }).click();

    const svg = page.locator('svg.stage-svg');
    const eyeL = svg.locator('#eye-l');
    const eyeR = svg.locator('#eye-r');

    await expect(eyeL).toBeVisible();
    await expect(eyeR).toBeVisible();

    const pupilL = eyeL.locator('ellipse[fill="#14122b"]');
    const pupilR = eyeR.locator('ellipse[fill="#14122b"]');

    const initialOpacityL = await pupilL.evaluate((el: SVGEllipseElement) => el.style.opacity);
    const initialOpacityR = await pupilR.evaluate((el: SVGEllipseElement) => el.style.opacity);

    await page.waitForTimeout(200);

    const afterOpacityL = await pupilL.evaluate((el: SVGEllipseElement) => el.style.opacity);
    const afterOpacityR = await pupilR.evaluate((el: SVGEllipseElement) => el.style.opacity);

    expect(initialOpacityL).toBe(afterOpacityL);
    expect(initialOpacityR).toBe(afterOpacityR);
  });

test('eye glow animation runs under normal conditions', async ({ page }) => {
    const svg = page.locator('svg.stage-svg');
    const eyeL = svg.locator('#eye-l');
    const eyeR = svg.locator('#eye-r');

    await expect(eyeL).toBeVisible();
    await expect(eyeR).toBeVisible();

    // Verify eyes are separate sibling layers (not nested in protima)
    const protima = svg.locator('#protima');
    const eyeLInProtima = protima.locator('#eye-l');
    const eyeRInProtima = protima.locator('#eye-r');
    await expect(eyeLInProtima).toHaveCount(0);
    await expect(eyeRInProtima).toHaveCount(0);

    const pupilL = eyeL.locator('ellipse[fill="#14122b"], ellipse[fill="rgb(20, 18, 43)"]');
    const pupilR = eyeR.locator('ellipse[fill="#14122b"], ellipse[fill="rgb(20, 18, 43)"]');

    // Wait for animation to start (it uses requestAnimationFrame)
    await page.waitForTimeout(1000);

    const initialOpacityL = await pupilL.evaluate((el: SVGEllipseElement) => parseFloat(el.style.opacity) || 0);
    const initialOpacityR = await pupilR.evaluate((el: SVGEllipseElement) => parseFloat(el.style.opacity) || 0);

    console.log(`Initial - Eye L: ${initialOpacityL}, Eye R: ${initialOpacityR}`);

    // Wait for animation to progress (7s cycle, check at ~1500ms to see change)
    await page.waitForTimeout(2000);

    const afterOpacityL = await pupilL.evaluate((el: SVGEllipseElement) => parseFloat(el.style.opacity) || 0);
    const afterOpacityR = await pupilR.evaluate((el: SVGEllipseElement) => parseFloat(el.style.opacity) || 0);

    const computedAfterL = await pupilL.evaluate((el: SVGEllipseElement) => window.getComputedStyle(el).opacity);
    const computedAfterR = await pupilR.evaluate((el: SVGEllipseElement) => window.getComputedStyle(el).opacity);
    console.log(`After style - Eye L: ${afterOpacityL}, Eye R: ${afterOpacityR}`);
    console.log(`After computed - Eye L: ${computedAfterL}, Eye R: ${computedAfterR}`);

    // Opacity should have changed (animation running)
    expect(afterOpacityL).not.toBe(initialOpacityL);
    expect(afterOpacityR).not.toBe(initialOpacityR);
  });

  test('reduced-motion disables string lights flicker', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.getByRole('button', { name: 'পুজোয় প্রবেশ করুন' }).click();

    const bulbs = page.locator('.string-bulb');
    await expect(bulbs.first()).toBeVisible();

    const initialOpacities: number[] = [];
    const count = await bulbs.count();
    for (let i = 0; i < count; i++) {
      initialOpacities.push(await bulbs.nth(i).evaluate((el: HTMLElement) => parseFloat(el.style.opacity)));
    }

    await page.waitForTimeout(500);

    const afterOpacities: number[] = [];
    for (let i = 0; i < count; i++) {
      afterOpacities.push(await bulbs.nth(i).evaluate((el: HTMLElement) => parseFloat(el.style.opacity)));
    }

    for (let i = 0; i < count; i++) {
      expect(afterOpacities[i]).toBeCloseTo(initialOpacities[i], 2);
    }
  });

  test('reduced-motion disables parallax', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.getByRole('button', { name: 'পুজোয় প্রবেশ করুন' }).click();

    const svg = page.locator('svg.stage-svg');
    const protima = svg.locator('#protima');

    const initialTransform = await protima.evaluate((el: SVGGElement) => el.style.transform);
    await page.mouse.move(100, 100);
    await page.waitForTimeout(100);
    const afterTransform = await protima.evaluate((el: SVGGElement) => el.style.transform);

    expect(initialTransform).toBe(afterTransform);
  });
});

test.describe('Phase 2: Screenshots', () => {
  const scenes = ['ghor', 'shashthi'] as const;
  const viewports = [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'desktop', width: 1280, height: 960 },
    { name: 'desktop-16x9', width: 1920, height: 1080 },
  ] as const;

  for (const scene of scenes) {
    for (const vp of viewports) {
      test(`${scene} screenshot at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.getByRole('button', { name: 'পুজোয় প্রবেশ করুন' }).click();
        await expect(page.getByTestId('entry-gate')).toBeHidden();

        await page.evaluate((sceneId) => {
          const store = (window as any).__PUJO_STORE__;
          if (store) store.getState().setScene(sceneId);
        }, scene);

        await page.waitForTimeout(500);

        await expect(page).toHaveScreenshot(`${scene}-${vp.name}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.05,
        });
      });
    }
  }
});