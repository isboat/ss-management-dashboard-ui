import { expect, test } from '@playwright/test';

test('loads the modern login experience', async ({ page }) => {
  await page.goto('/#/login');

  await expect(page).toHaveTitle('OnScreenSync Dashboard');
  await expect(page.getByRole('heading', { name: 'Manage every screen in one place' })).toBeVisible();
  await expect(page.getByLabel('Email address')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});
