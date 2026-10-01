import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('SauceDemo - Full Automation Suite', () => {
    // Declarăm variabilele global în interiorul suitei pentru a fi accesibile tuturor testelor
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let checkoutPage: CheckoutPage;

    // Înainte de fiecare test, inițializăm paginile cu instanța curentă de 'page'
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        checkoutPage = new CheckoutPage(page);
    });

    test('Should login successfully with valid credentials', async ({ page }) => {
        await loginPage.navigateToLogin();
        await loginPage.login('standard_user', 'secret_sauce');
        
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('Should display error message with invalid credentials', async ({ page }) => {
        await loginPage.navigateToLogin();
        await loginPage.login('locked_out_user', 'secret_sauce');
        
        const errorContainer = page.locator('[data-test="error"]');
        await expect(errorContainer).toBeVisible();
        await expect(errorContainer).toContainText('Sorry, this user has been locked out');
    });

    test('Should execute full purchase flow and checkout successfully', async ({ page }) => {
        await loginPage.navigateToLogin();
        await loginPage.login('standard_user', 'secret_sauce');

        // Folosim metoda curățată din InventoryPage
        await inventoryPage.addMultipleProductsFlow();

        // Finalizăm comanda
        await checkoutPage.completeCheckout('John', 'Ross', '1234');

        // Verificăm că am ajuns la ecranul de succes complet
        await expect(page).toHaveURL(/.*checkout-complete.html/);
    });
    
});
