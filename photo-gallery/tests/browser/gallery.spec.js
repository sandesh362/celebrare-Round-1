import { expect, test } from '@playwright/test';

const photos = Array.from({ length: 30 }, (_, id) => ({
  id: String(id),
  author: id % 2 === 0 ? 'Alice Smith' : 'Bob Jones',
}));

async function mockPhotos(page) {
  await page.route('https://picsum.photos/v2/list?limit=30', (route) => route.fulfill({ json: photos }));
  await page.route('https://picsum.photos/id/**', (route) => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#d9dcd3"/></svg>',
  }));
}

for (const [width, columns] of [[390, 1], [768, 2], [1440, 4]]) {
  test(`uses ${columns} grid columns at ${width}px without horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await mockPhotos(page);
    await page.goto('/');
    await expect(page.getByRole('article')).toHaveCount(30);
    const grid = page.getByLabel('Photo collection');
    expect(await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(columns);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('search makes no new API requests and favourites survive real reloads', async ({ page }) => {
  await mockPhotos(page);
  let listRequests = 0;
  page.on('request', (request) => {
    if (request.url().includes('/v2/list')) listRequests += 1;
  });
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(30);
  const beforeSearch = listRequests;
  await page.getByRole('searchbox').fill('  ALICE  ');
  await expect(page.getByRole('article')).toHaveCount(15);
  await page.getByRole('searchbox').fill('nobody');
  await expect(page.getByText('No matching photographers')).toBeVisible();
  await page.getByRole('searchbox').fill('');
  await expect(page.getByRole('article')).toHaveCount(30);
  expect(listRequests).toBe(beforeSearch);

  await page.getByRole('button', { name: 'Add photo 0 by Alice Smith to favourites', exact: true }).click();
  await page.reload();
  const selected = page.getByRole('button', { name: 'Remove photo 0 by Alice Smith from favourites', exact: true });
  await expect(selected).toHaveAttribute('aria-pressed', 'true');
  await selected.click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Add photo 0 by Alice Smith to favourites', exact: true })).toHaveAttribute('aria-pressed', 'false');
});

test('shows the loading state while waiting for the API', async ({ page }) => {
  let release;
  const ready = new Promise((resolve) => { release = resolve; });
  await page.route('**/v2/list?limit=30', async (route) => {
    await ready;
    await route.fulfill({ json: photos });
  });
  await page.goto('/');
  await expect(page.getByText('Loading photos...')).toBeVisible();
  release();
  await expect(page.getByRole('article')).toHaveCount(30);
});

test('shows a readable API error', async ({ page }) => {
  await page.route('**/v2/list?limit=30', (route) => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Check your connection');
  await expect(page.getByText('Loading photos...')).toHaveCount(0);
});

test('supports keyboard search and favourite toggling', async ({ page }) => {
  await mockPhotos(page);
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(30);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('searchbox')).toBeFocused();
  await page.keyboard.press('Tab');
  const firstHeart = page.getByRole('button').first();
  await expect(firstHeart).toBeFocused();
  await page.keyboard.press('Space');
  await expect(firstHeart).toHaveAttribute('aria-pressed', 'true');
});
