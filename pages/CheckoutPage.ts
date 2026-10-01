import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
    private readonly page: Page;
    private readonly checkoutButton: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly postalCodeInput: Locator;
    private readonly continueButton: Locator;
    private readonly finishButton: Locator;
    private readonly backToProductsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    }

// pages/CheckoutPage.ts
    async completeCheckout(firstName: string, lastName: string, postalCode: string) {
        await this.checkoutButton.click(); // Dacă fluxul tău pornește din coș
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
        await this.finishButton.click();
}

}
