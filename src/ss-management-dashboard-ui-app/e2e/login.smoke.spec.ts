import { expect, test } from '@playwright/test';

test('loads the modern login experience', async ({ page }) => {
  const browserErrors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') {
      browserErrors.push(message.text());
    }
  });
  page.on('pageerror', error => browserErrors.push(error.message));

  await page.goto('/#/login');

  await expect(page).toHaveTitle('OnScreenSync Dashboard');
  await expect(page.getByRole('heading', { name: 'Manage every screen in one place' })).toBeVisible();
  await expect(page.getByLabel('Email address')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  expect(browserErrors).toEqual([]);
});
