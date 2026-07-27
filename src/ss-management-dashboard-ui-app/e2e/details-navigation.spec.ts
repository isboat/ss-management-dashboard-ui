import { expect, test } from '@playwright/test';

const token = `header.${Buffer.from(JSON.stringify({
  email: 'test@example.com',
  exp: 4102444800,
  role: 'Admin'
})).toString('base64url')}.signature`;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(value => localStorage.setItem('token', value), token);
});

test('activates screen details from a direct hash URL', async ({ page }) => {
  const screenId = '51bf6674cf0347e2a338933379747beb';

  await page.goto(`/#/screen-details/${screenId}`);

  await expect(page.getByRole('status')).toContainText('Loading screen details');
  await expect(page).toHaveURL(new RegExp(`/screen-details/${screenId}$`));
});

test('activates menu details from its hash URL', async ({ page }) => {
  await page.goto('/#/menu-details/menu-1');

  await expect(page.getByRole('status')).toContainText('Loading menu details');
  await expect(page).toHaveURL(/\/menu-details\/menu-1$/);
});
