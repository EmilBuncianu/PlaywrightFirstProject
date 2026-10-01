import { Page } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly backpackAddToCartButton: any;
    readonly bikeLightAddToCartButton: any;
    readonly shoppingCartLink: any;

    constructor(page: Page) {
        this.page = page;
        this.backpackAddToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.bikeLightAddToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    }

// pages/InventoryPage.ts
    async addMultipleProductsFlow() {
        await this.backpackAddToCartButton.click();
        await this.bikeLightAddToCartButton.click();
        await this.shoppingCartLink.click();
}

}
