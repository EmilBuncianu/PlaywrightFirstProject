import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { SauceLabsPage } from '../pages/SauceLabsPage';

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

test('Should display error when checkout form is incomplete', async ({ page }) => {
    await loginPage.navigateToLogin();
    await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);

    await inventoryPage.addMultipleProductsFlow();
    
    // Apelăm DOAR completarea formularului (fără pasul de Finish)
    await checkoutPage.fillCheckoutInformation('', '', '');

    // Validăm direct eroarea din imagine
    const errorContainer = page.locator('[data-test="error"]');
    await expect(errorContainer).toBeVisible();
    await expect(errorContainer).toContainText('Error: First Name is required');
});

test('Should navigate to Sauce Labs Trust Center via Sidebar Menu', async ({ page }) => {
    const sauceLabsPage = new SauceLabsPage(page);

    // 1. Autentificare securizată din .env
    await loginPage.navigateToLogin();
    await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);

    // 2. Deschis meniu lateral și accesat pagina About (folosind noul POM helper)
    await inventoryPage.goToAboutPage();

    // 3. Gestionare tab nou și deschidere Trust Center
    const trustCenterTab = await sauceLabsPage.openTrustCenter();

    // 4. Interacțiunea cu tab-urile de pe pagina de conformitate (folosind instanța noului tab)
    await trustCenterTab.getByRole('tab', { name: 'Resources' }).click();
    await trustCenterTab.getByRole('tab', { name: 'Subprocessors' }).click();
    await trustCenterTab.getByRole('tab', { name: 'Controls' }).click();
    await trustCenterTab.getByRole('tab', { name: 'Updates' }).click();
    
    // Verificare finală de siguranță pe noul tab
    await expect(trustCenterTab).toHaveURL(/.*trust.saucelabs.com.*/);
});

});
