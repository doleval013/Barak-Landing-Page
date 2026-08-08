import { test, expect } from '@playwright/test';

const sections = [
  'hero',
  'about',
  'highlight',
  'goals',
  'process',
  'why',
  'testimonials',
  'faqs',
  'contact',
];

const mobileView = { width: 375, height: 812 };
const desktopView = { width: 1280, height: 900 };

for (const viewport of [mobileView, desktopView]) {
  test.describe(`responsive checks ${viewport.width}x${viewport.height}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
    });

    test('main sections are present', async ({ page }) => {
      for (const id of sections) {
        await expect(page.locator(`#${id}`)).toBeVisible();
      }
    });

    test('hero CTA button is visible', async ({ page }) => {
      const heroButton = page.locator('#hero a.button-primary');
      await expect(heroButton).toBeVisible();
      await expect(heroButton).toHaveText('לבדיקת התאמה למוסד');
    });

    test('page uses white-blue palette and correct heading text', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('ברק אלוני סדנאות כלבנות והעצמה');
      const bodyBg = await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundImage);
      expect(bodyBg).toContain('linear-gradient');
    });

    test('recommendations page shows expandable recommendation blocks', async ({ page }) => {
      await page.goto('http://localhost:3000/recommendations');
      const cards = page.locator('details.recommendation-card');
      await expect(cards).toHaveCount(4);
      await cards.nth(0).locator('summary').click();
      await expect(cards.nth(0)).toHaveAttribute('open', '');
      await expect(cards.nth(0).locator('img')).toBeVisible();
    });

    test('recommendation image opens overlay and closes on button click', async ({ page }) => {
      await page.goto('http://localhost:3000/recommendations');
      const firstCard = page.locator('details.recommendation-card').first();
      const firstImage = firstCard.locator('.recommendation-card-body img');
      const overlay = page.locator('.image-overlay');
      const overlayImage = page.locator('#overlayImage');
      const closeButton = page.locator('#overlayClose');

      await expect(overlay).toBeHidden();
      await firstCard.locator('summary').click();
      await expect(firstImage).toBeVisible();
      const imageSrc = await firstImage.getAttribute('src');
      await firstImage.click();
      await expect(overlay).toBeVisible();
      await expect(overlayImage).toHaveAttribute('src', imageSrc || '');
      await expect(closeButton).toBeVisible();
      await closeButton.click();
      await expect(overlay).toBeHidden();
    });

    test('recommendation overlay closes on Escape key', async ({ page }) => {
      await page.goto('http://localhost:3000/recommendations');
      const firstCard = page.locator('details.recommendation-card').first();
      const firstImage = firstCard.locator('.recommendation-card-body img');
      const overlay = page.locator('.image-overlay');

      await expect(overlay).toBeHidden();
      await firstCard.locator('summary').click();
      await expect(firstImage).toBeVisible();
      await firstImage.click();
      await expect(overlay).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(overlay).toBeHidden();
    });
  });
}

test('recommendations page is accessible', async ({ page }) => {
  await page.goto('http://localhost:3000/recommendations');
  await expect(page.locator('h1')).toHaveText('המלצות');
  await expect(page.locator('.recommendation-card')).toHaveCount(4);
});
