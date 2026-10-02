import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('SauceDemo - Login Validations Suite', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
    });

    test('Should login successfully with valid credentials from .env', async ({ page }) => {
        await loginPage.navigateToLogin();
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

    test('Should display error message with invalid password', async ({ page }) => {
        await loginPage.navigateToLogin();
        await loginPage.login(process.env.SAUCE_USERNAME!, 'parola_gresita_123');
        
        const errorContainer = page.locator('[data-test="error"]');
        await expect(errorContainer).toBeVisible();
        await expect(errorContainer).toContainText('Username and password do not match any user in this service');
    });
});
