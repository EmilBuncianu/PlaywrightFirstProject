import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { SauceLabsPage } from '../pages/SauceLabsPage';

test.describe('SauceDemo - Full Automation Suite', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let checkoutPage: CheckoutPage;
    let sauceLabsPage: SauceLabsPage;

    // Acest beforeEach se rulează pentru absolut TOATE testele din fișier
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        checkoutPage = new CheckoutPage(page);
        sauceLabsPage = new SauceLabsPage(page);
    });

    // SUB-GRUP 1: Teste care verifică doar comportamentul paginii de Login
    test.describe('Login Validations', () => {
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

    // SUB-GRUP 2: Teste end-to-end care pornesc DIRECT din starea logată
    test.describe('Post-Login Actions', () => {
        // CORECȚIE: Am adăugat { page } și aici pentru că apelam metodele lui loginPage
        test.beforeEach(async ({ page }) => {
            await loginPage.navigateToLogin();
            await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
        });

        test('Should execute full purchase flow and checkout successfully', async ({ page }) => {
            await inventoryPage.addMultipleProductsFlow();
            await checkoutPage.completeCheckout('John', 'Ross', '1234');
            await expect(page).toHaveURL(/.*checkout-complete.html/);
        });

        test('Should display error when checkout form is incomplete', async ({ page }) => {
            await inventoryPage.addMultipleProductsFlow();
            await checkoutPage.fillCheckoutInformation('', '', '');

            const errorContainer = page.locator('[data-test="error"]');
            await expect(errorContainer).toBeVisible();
            await expect(errorContainer).toContainText('Error: First Name is required');
        });

        // CORECȚIE: Am adăugat ({ page }) în semnătura funcției de test
        test('Should navigate to Sauce Labs Trust Center via Sidebar Menu', async ({ page }) => {
            await inventoryPage.goToAboutPage();
            const trustCenterTab = await sauceLabsPage.openTrustCenter();

            await trustCenterTab.getByRole('tab', { name: 'Resources' }).click();
            await trustCenterTab.getByRole('tab', { name: 'Subprocessors' }).click();
            await trustCenterTab.getByRole('tab', { name: 'Controls' }).click();
            await trustCenterTab.getByRole('tab', { name: 'Updates' }).click();
            
            // Linia 81 nu va mai avea nicio eroare acum
            await expect(trustCenterTab).toHaveURL(/.*trust.saucelabs.com.*/);
        });
    });
});
