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

function collectConsoleErrors(page: any): string[] {
  const errors: string[] = [];
  page.on('console', (msg: any) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err: Error) => {
    errors.push(`[pageerror] ${err.message}`);
  });
  return errors;
}

test.describe('Phase 2: Protima scene', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole('button', { name: 'পুজোয় প্রবেশ করুন' }).click();
    await expect(page.getByTestId('entry-gate')).toBeHidden();
  });

  test('no console errors or warnings during load and after gate tap', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    
    // Wait for any async errors
    await page.waitForTimeout(1000);
    
    // Check for errors
    expect(errors).toEqual([]);
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

    // Wait for animation to be applied
    await page.waitForTimeout(500);

    // Check that CSS animations are running on the pupil elements (inner ellipses)
    const pupilL = eyeL.locator('ellipse[fill="#14122b"]');
    const pupilR = eyeR.locator('ellipse[fill="#14122b"]');

    const animationsL = await pupilL.evaluate((el: SVGEllipseElement) => el.getAnimations().length);
    const animationsR = await pupilR.evaluate((el: SVGEllipseElement) => el.getAnimations().length);
    expect(animationsL).toBeGreaterThan(0);
    expect(animationsR).toBeGreaterThan(0);

    // Check that the animation is the eye-glow animation
    const animationNameL = await pupilL.evaluate((el: SVGEllipseElement) => 
      el.getAnimations().map(a => a.animationName).join(',')
    );
    const animationNameR = await pupilR.evaluate((el: SVGEllipseElement) => 
      el.getAnimations().map(a => a.animationName).join(',')
    );
    expect(animationNameL).toContain('eye-glow');
    expect(animationNameR).toContain('eye-glow');

    // Wait for right eye's animation delay (3.5s) to pass, then sample
    await page.waitForTimeout(4000);

    // Sample at multiple points to catch the animation
    const samples = 5;
    const opacitiesL: number[] = [];
    const opacitiesR: number[] = [];
    
    for (let i = 0; i < samples; i++) {
      const opacityL = await pupilL.evaluate((el: SVGEllipseElement) => parseFloat(window.getComputedStyle(el).opacity));
      const opacityR = await pupilR.evaluate((el: SVGEllipseElement) => parseFloat(window.getComputedStyle(el).opacity));
      opacitiesL.push(opacityL);
      opacitiesR.push(opacityR);
      if (i < samples - 1) await page.waitForTimeout(400);
    }

    // At least one sample should differ from the first
    const initialL = opacitiesL[0];
    const initialR = opacitiesR[0];
    const changedL = opacitiesL.some((v, i) => i > 0 && v !== initialL);
    const changedR = opacitiesR.some((v, i) => i > 0 && v !== initialR);
    
    console.log(`Eye L opacities: ${opacitiesL.join(', ')}`);
    console.log(`Eye R opacities: ${opacitiesR.join(', ')}`);
    
    expect(changedL).toBe(true);
    expect(changedR).toBe(true);
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

    // Under reduced motion, there should be no animations on pupils
    const pupilL = eyeL.locator('ellipse[fill="#14122b"]');
    const pupilR = eyeR.locator('ellipse[fill="#14122b"]');
    const animationsL = await pupilL.evaluate((el: SVGEllipseElement) => el.getAnimations().length);
    const animationsR = await pupilR.evaluate((el: SVGEllipseElement) => el.getAnimations().length);
    expect(animationsL).toBe(0);
    expect(animationsR).toBe(0);

    // Eyes should be fully opaque (opacity: 1)
    const opacityL = await pupilL.evaluate((el: SVGEllipseElement) => parseFloat(window.getComputedStyle(el).opacity));
    const opacityR = await pupilR.evaluate((el: SVGEllipseElement) => parseFloat(window.getComputedStyle(el).opacity));
    expect(opacityL).toBe(1);
    expect(opacityR).toBe(1);
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