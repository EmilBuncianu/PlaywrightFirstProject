// pages/SauceLabsPage.ts
import { Page, Locator } from '@playwright/test';

export class SauceLabsPage {
    readonly page: Page;
    readonly acceptCookiesButton: Locator;
    readonly trustCenterLink: Locator;

    constructor(page: Page) {
        this.page = page;
        // REZOLVARE: Schimbăm expresia regulată ca să caute exact textul 'Accept All'
        this.acceptCookiesButton = page.getByRole('button', { name: 'Accept All' });
        this.trustCenterLink = page.getByRole('link', { name: 'Visit the Trust Center' });
    }

    async openTrustCenter() {
        // Așteptăm ca structura DOM a paginii Sauce Labs să fie încărcată
        await this.page.waitForLoadState('domcontentloaded');

        // Dacă apare bannerul de cookies, dăm click pe 'Accept All' ca să eliberăm ecranul
        if (await this.acceptCookiesButton.isVisible()) {
            await this.acceptCookiesButton.click();
        }
        
        // Dăm scroll automat până la link înainte de a da click
        await this.trustCenterLink.scrollIntoViewIfNeeded();

        // Configurăm așteptarea noului tab (pop-up)
        const popupPromise = this.page.waitForEvent('popup');
        await this.trustCenterLink.click();
        const trustCenterPage = await popupPromise;
        
        // Așteptăm ca și noul tab să se încarce complet înainte de a-l returna testului
        await trustCenterPage.waitForLoadState('load');
        return trustCenterPage;
    }
}
