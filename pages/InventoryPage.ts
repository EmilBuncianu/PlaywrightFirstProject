import { Page, Locator } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly backpackAddToCartButton: Locator;
    readonly bikeLightAddToCartButton: Locator;
    readonly shoppingCartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.backpackAddToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.bikeLightAddToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    }

    async addMultipleProductsFlow() {
        await this.backpackAddToCartButton.click();
        await this.bikeLightAddToCartButton.click();
        await this.shoppingCartLink.click();
    }

// pages/InventoryPage.ts

// ... restul clasei tale rămâne la fel

async goToAboutPage() {
    // În SauceDemo, meniul are ID-ul #react-burger-menu-btn, iar link-ul are atributul specific data-test
    const menuButton = this.page.locator('#react-burger-menu-btn');
    const aboutSidebarLink = this.page.locator('[data-test="about-sidebar-link"]');

    // Deschidem meniul lateral
    await menuButton.click();
    
    // BUNA PRACTICA: Așteptăm ca meniul să devină vizibil și complet extins
    await aboutSidebarLink.waitFor({ state: 'visible' });
    
    // Accesăm pagina About
    await aboutSidebarLink.click();
}

}
