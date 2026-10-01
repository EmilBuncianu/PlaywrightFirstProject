/// <reference types="node" />

import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
export default defineConfig({
  // Directorul unde Playwright va căuta testele
  testDir: './tests',
  
  // Rulează testele din fișiere în paralel
  fullyParallel: true,
  
  // Eșuează build-ul în CI dacă ai uitat din greșeală un test.only în cod
  forbidOnly: !!process.env.CI,
  
  // Reîncearcă testul automat o singură dată în CI dacă pică din motive de rețea
  retries: process.env.CI ? 1 : 0,
  
  // Numărul de thread-uri paralele (în CI rulează pe un singur worker pentru stabilitate)
  workers: process.env.CI ? 1 : undefined,
  
  // Tipul de raport generat nativ (raport HTML complet)
  reporter: 'html',

  // Configurații globale valabile pentru toate proiectele/browserele
  use: {
    // FIXED: Setat URL-ul de bază global. În teste vei scrie doar: await page.goto('/')
    baseURL: 'https://saucedemo.com',

    // Colectează Trace-ul (Time-Travel Debugger) doar la prima reîncercare a unui test eșuat
    trace: 'on-first-retry',
    
    // Face screenshot automat la finalul testului doar dacă acesta a picat (la fel ca în Selenium)
    screenshot: 'only-on-failure',
  },

  // Matricea de browsere (Proiectele de rulare)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit', // WebKit este motorul din spatele Safari (Apple)
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
