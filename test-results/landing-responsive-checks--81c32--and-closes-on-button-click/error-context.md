# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing.spec.ts >> responsive checks 375x812 >> recommendation image opens overlay and closes on button click
- Location: tests\landing.spec.ts:52:9

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('#overlayImage')
Expected: "/content/recommendations/pics/%D7%90%D7%91%D7%9F%20%D7%A8%D7%95%D7%A9%D7%93.png"
Received: "http://localhost:3000/content/recommendations/pics/%D7%90%D7%91%D7%9F%20%D7%A8%D7%95%D7%A9%D7%93.png"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('#overlayImage')
    14 × locator resolved to <img id="overlayImage" alt="המלצה מאבן רושד" src="http://localhost:3000/content/recommendations/pics/%D7%90%D7%91%D7%9F%20%D7%A8%D7%95%D7%A9%D7%93.png"/>
       - unexpected value "http://localhost:3000/content/recommendations/pics/%D7%90%D7%91%D7%9F%20%D7%A8%D7%95%D7%A9%D7%93.png"

```

```yaml
- img "המלצה מאבן רושד"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const sections = [
  4  |   'hero',
  5  |   'about',
  6  |   'highlight',
  7  |   'goals',
  8  |   'process',
  9  |   'why',
  10 |   'testimonials',
  11 |   'faqs',
  12 |   'contact',
  13 | ];
  14 | 
  15 | const mobileView = { width: 375, height: 812 };
  16 | const desktopView = { width: 1280, height: 900 };
  17 | 
  18 | for (const viewport of [mobileView, desktopView]) {
  19 |   test.describe(`responsive checks ${viewport.width}x${viewport.height}`, () => {
  20 |     test.beforeEach(async ({ page }) => {
  21 |       await page.setViewportSize(viewport);
  22 |       await page.goto('http://localhost:3000');
  23 |     });
  24 | 
  25 |     test('main sections are present', async ({ page }) => {
  26 |       for (const id of sections) {
  27 |         await expect(page.locator(`#${id}`)).toBeVisible();
  28 |       }
  29 |     });
  30 | 
  31 |     test('hero CTA button is visible', async ({ page }) => {
  32 |       const heroButton = page.locator('#hero a.button-primary');
  33 |       await expect(heroButton).toBeVisible();
  34 |       await expect(heroButton).toHaveText('יצירת קשר');
  35 |     });
  36 | 
  37 |     test('page uses white-blue palette and correct heading text', async ({ page }) => {
  38 |       await expect(page.locator('h1')).toContainText('ברק אלוני סדנאות כלבנות והעצמה');
  39 |       const bodyBg = await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundImage);
  40 |       expect(bodyBg).toContain('linear-gradient');
  41 |     });
  42 | 
  43 |     test('recommendations page shows expandable recommendation blocks', async ({ page }) => {
  44 |       await page.goto('http://localhost:3000/recommendations');
  45 |       const cards = page.locator('details.recommendation-card');
  46 |       await expect(cards).toHaveCount(4);
  47 |       await cards.nth(0).locator('summary').click();
  48 |       await expect(cards.nth(0)).toHaveAttribute('open', '');
  49 |       await expect(cards.nth(0).locator('img')).toBeVisible();
  50 |     });
  51 | 
  52 |     test('recommendation image opens overlay and closes on button click', async ({ page }) => {
  53 |       await page.goto('http://localhost:3000/recommendations');
  54 |       const firstCard = page.locator('details.recommendation-card').first();
  55 |       const firstImage = firstCard.locator('.recommendation-card-body img');
  56 |       const overlay = page.locator('.image-overlay');
  57 |       const overlayImage = page.locator('#overlayImage');
  58 |       const closeButton = page.locator('#overlayClose');
  59 | 
  60 |       await expect(overlay).toBeHidden();
  61 |       await firstCard.locator('summary').click();
  62 |       await expect(firstImage).toBeVisible();
  63 |       const imageSrc = await firstImage.getAttribute('src');
  64 |       await firstImage.click();
  65 |       await expect(overlay).toBeVisible();
> 66 |       await expect(overlayImage).toHaveAttribute('src', imageSrc || '');
     |                                  ^ Error: expect(locator).toHaveAttribute(expected) failed
  67 |       await expect(closeButton).toBeVisible();
  68 |       await closeButton.click();
  69 |       await expect(overlay).toBeHidden();
  70 |     });
  71 | 
  72 |     test('recommendation overlay closes on Escape key', async ({ page }) => {
  73 |       await page.goto('http://localhost:3000/recommendations');
  74 |       const firstCard = page.locator('details.recommendation-card').first();
  75 |       const firstImage = firstCard.locator('.recommendation-card-body img');
  76 |       const overlay = page.locator('.image-overlay');
  77 | 
  78 |       await expect(overlay).toBeHidden();
  79 |       await firstCard.locator('summary').click();
  80 |       await expect(firstImage).toBeVisible();
  81 |       await firstImage.click();
  82 |       await expect(overlay).toBeVisible();
  83 |       await page.keyboard.press('Escape');
  84 |       await expect(overlay).toBeHidden();
  85 |     });
  86 |   });
  87 | }
  88 | 
  89 | test('recommendations page is accessible', async ({ page }) => {
  90 |   await page.goto('http://localhost:3000/recommendations');
  91 |   await expect(page.locator('h1')).toHaveText('המלצות');
  92 |   await expect(page.locator('.recommendation-card')).toHaveCount(4);
  93 | });
  94 | 
```