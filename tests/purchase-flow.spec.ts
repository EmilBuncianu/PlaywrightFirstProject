import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { SauceLabsPage } from '../pages/SauceLabsPage';

test.describe('SauceDemo - End to End Purchase & Navigation Suite', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let checkoutPage: CheckoutPage;
    let sauceLabsPage: SauceLabsPage;

    // Inițializăm toate paginile necesare fluxurilor
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        checkoutPage = new CheckoutPage(page);
        sauceLabsPage = new SauceLabsPage(page);

        // Executăm logarea automată în fundal înainte de fiecare test e2e
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

    test('Should navigate to Sauce Labs Trust Center via Sidebar Menu', async ({ page }) => {
        await inventoryPage.goToAboutPage();
        const trustCenterTab = await sauceLabsPage.openTrustCenter();

        await trustCenterTab.getByRole('tab', { name: 'Resources' }).click();
        await trustCenterTab.getByRole('tab', { name: 'Subprocessors' }).click();
        await trustCenterTab.getByRole('tab', { name: 'Controls' }).click();
        await trustCenterTab.getByRole('tab', { name: 'Updates' }).click();
        
        await expect(trustCenterTab).toHaveURL(/.*:\/\/trust\.saucelabs\.com.*/);


    });
});
