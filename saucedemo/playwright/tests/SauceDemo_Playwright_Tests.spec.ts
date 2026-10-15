import { test, expect, Page } from '@playwright/test';

// Opens the login page (baseURL is set in playwright.config.ts) and submits the form.
async function login(page: Page, username: string, password: string) {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

test.describe('SauceDemo Comprehensive Testing Suite', () => {

  // ===== Equivalence Class Partitioning (ECP) =====

  test('TC01 - ECP: Valid Credentials', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC02 - ECP: Invalid Password', async ({ page }) => {
    await login(page, 'standard_user', 'wrong_pass');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  test('TC03 - ECP: Invalid Username', async ({ page }) => {
    await login(page, 'invalid_user', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  test('TC04 - ECP: Empty Username', async ({ page }) => {
    await login(page, '', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('TC05 - ECP: Empty Password', async ({ page }) => {
    await login(page, 'standard_user', '');
    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
  });

  // ===== Boundary Value Analysis (BVA) =====

  test('TC06 - BVA: Locked Out User', async ({ page }) => {
    await login(page, 'locked_out_user', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

  test('TC07 - BVA: Max Length Username', async ({ page }) => {
    await login(page, 'a'.repeat(100), 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  test('TC08 - BVA: Min Length Username (1 char)', async ({ page }) => {
    await login(page, 'a', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  // ===== Decision Table =====

  test('TC09 - Decision Table: Both Empty', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('TC10 - Decision Table: Valid User + Wrong Password', async ({ page }) => {
    await login(page, 'standard_user', 'wrong123');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  test('TC11 - Decision Table: Invalid User + Valid Password', async ({ page }) => {
    await login(page, 'unknown_user', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  test('TC12 - Decision Table: Locked User + Valid Password', async ({ page }) => {
    await login(page, 'locked_out_user', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

  // ===== Use Case =====

  test('TC13 - Use Case: End-to-End Purchase', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Ege');
    await page.locator('[data-test="lastName"]').fill('Test');
    await page.locator('[data-test="postalCode"]').fill('35000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('TC14 - Use Case: Remove Item From Cart', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="cart-item"]')).toHaveCount(0);
  });

  test('TC15 - Use Case: Sort Products A to Z', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.locator('[data-test="product-sort-container"]').selectOption('az');
    const firstItem = page.locator('.inventory_item_name').first();
    await expect(firstItem).toHaveText('Sauce Labs Backpack');
  });

  test('TC16 - Use Case: Logout', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('TC17 - Use Case: Sort Products Z to A', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await page.locator('[data-test="product-sort-container"]').selectOption('za');

    const productNames = await page.locator('.inventory_item_name').allTextContents();
    const sortedNames = [...productNames].sort().reverse();

    expect(productNames).toEqual(sortedNames);
  });

  test('TC18 - Use Case: Sort Products Price Low to High', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    const priceTexts = await page.locator('.inventory_item_price').allTextContents();
    const prices = priceTexts.map(price => Number(price.replace('$', '')));
    const sortedPrices = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sortedPrices);
  });

  test('TC19 - Use Case: Sort Products Price High to Low', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');

    const priceTexts = await page.locator('.inventory_item_price').allTextContents();
    const prices = priceTexts.map(price => Number(price.replace('$', '')));
    const sortedPrices = [...prices].sort((a, b) => b - a);

    expect(prices).toEqual(sortedPrices);
  });

  test('TC20 - Use Case: Product Detail Page and Add to Cart From Detail View', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack');

    await page.locator('[data-test="add-to-cart"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('TC21 - Use Case: Cart Badge Count and Reset App State', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');

    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="reset-sidebar-link"]').click();

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toBeHidden();
  });
});
