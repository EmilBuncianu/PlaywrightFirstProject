import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // Rulează testele în paralel pentru viteză maximă
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : undefined, // Ajustează numărul de workers în cloud
  reporter: 'html',
  use: {
    baseURL: 'https://saucedemo.com', // Setează URL-ul de bază ca să nu-l mai repeți în teste
    screenshot: 'only-on-failure', // Salvează screenshot automat dacă testul pică
    video: 'retain-on-failure',     // Înregistrează video, dar îl păstrează doar dacă testul pică
    trace: 'on-first-retry',
  },

  /* Configurarea browserelor pe care se vor executa testele */
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
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
