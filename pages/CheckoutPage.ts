// pages/CheckoutPage.ts
import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly checkoutButton: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly errorContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.errorContainer = page.locator('[data-test="error"]');
    }

async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.checkoutButton.click(); // Deschide formularul din coș
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click(); // Se apasă butonul din dreapta jos
}

async completeCheckout(firstName: string, lastName: string, postalCode: string) {
    await this.fillCheckoutInformation(firstName, lastName, postalCode);
    await this.finishButton.click(); // Folosit doar în testul de succes (flow-ul complet)
}
}
