import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('SauceDemo - Full Automation Suite', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        checkoutPage = new CheckoutPage(page);
    });

    test('Should login successfully with valid credentials from .env', async ({ page }) => {
        await loginPage.navigateToLogin();
        // Extragere credențiale din fișierul securizat .env
        await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('Should display error message with locked out user', async ({ page }) => {
        await loginPage.navigateToLogin();
        await loginPage.login('locked_out_user', process.env.SAUCE_PASSWORD!);
        
        const errorContainer = page.locator('[data-test="error"]');
        await expect(errorContainer).toBeVisible();
        await expect(errorContainer).toContainText('Sorry, this user has been locked out');
    });

    // SCENARIU NEGATIV NOU: Parolă greșită
    test('Should display error message with invalid password', async ({ page }) => {
        await loginPage.navigateToLogin();
        await loginPage.login(process.env.SAUCE_USERNAME!, 'parola_gresita_123');
        
        const errorContainer = page.locator('[data-test="error"]');
        await expect(errorContainer).toBeVisible();
        await expect(errorContainer).toContainText('Username and password do not match any user in this service');
    });

    test('Should execute full purchase flow and checkout successfully', async ({ page }) => {
        await loginPage.navigateToLogin();
        await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);

        await inventoryPage.addMultipleProductsFlow();
        await checkoutPage.completeCheckout('John', 'Ross', '1234');

        await expect(page).toHaveURL(/.*checkout-complete.html/);
    });

    // SCENARIU NEGATIV NOU: Câmpuri lipsă la Checkout
    test('Should display error when checkout form is incomplete', async ({ page }) => {
        await loginPage.navigateToLogin();
        await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);

        await inventoryPage.addMultipleProductsFlow();
        
        // Trimitem date goale pentru a forța o eroare de validare
        await checkoutPage.completeCheckout('', '', '');

        const errorContainer = page.locator('[data-test="error"]');
        await expect(errorContainer).toBeVisible();
        await expect(errorContainer).toContainText('Error: First Name is required');
    });
    
});
