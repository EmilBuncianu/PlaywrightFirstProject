# SauceDemo Full Automation Suite 🚀

Proiect profesional de testare automatizată de tip End-to-End (E2E), construit folosind **Playwright**, **TypeScript** și arhitectura **Page Object Model (POM)**. Framework-ul este complet integrat cu un pipeline de **CI/CD în GitHub Actions** și configurat pentru rulare multi-browser securizată.

---

## 🏗️ Arhitectura Proiectului (POM)

Proiectul este structurat modular pentru a asigura mentenanță ușoară, reutilizarea codului și separarea completă a scenariilor de testare de logica paginilor:

```text
PlaywrightProject/
├── .github/workflows/
│   └── playwright.yml        # Configurația pipeline-ului CI/CD (GitHub Actions)
├── pages/                    # LOGICA PAGINILOR (Page Object Model)
│   ├── LoginPage.ts          # Locatori și acțiuni pentru autentificare
│   ├── InventoryPage.ts      # Gestionarea produselor și a meniului lateral
│   └── CheckoutPage.ts       # Validarea și finalizarea fluxului de comandă
├── tests/                    # SCENARIILE DE TESTARE (Spec Files)
│   ├── login.spec.ts         # Teste dedicate exclusiv validării autentificării
│   └── purchase-flow.spec.ts # Fluxuri complete de cumpărare și navigare asincronă
├── .env                      # Fișier securizat pentru credențiale (local)
├── playwright.config.ts      # Configurația globală Playwright (Multi-browser, Parallel)
└── README.md                 # Documentația proiectului
```

---

## 🛠️ Caracteristici Cheie & Bune Practici

* **Page Object Model (POM):** Fiecare pagină din magazinul SauceDemo are o clasă dedicată în folderul `pages/`, eliminând duplicarea locatorilor.
* **Rulare Multi-Browser în Paralel:** Testele rulează concomitent pe **Chromium (Chrome)**, **Firefox** și **WebKit (Safari)**, utilizând setarea `fullyParallel: true` pentru optimizarea timpului de execuție.
* **Securitate (.env):** Datele de autentificare sensibile sunt extrase din variabile de mediu prin pachetul `dotenv` și sunt protejate prin `.gitignore` pentru a nu fi expuse în mod public.
* **Depanare Avansată (Artefacte):** Framework-ul este configurat să înregistreze automat **videoclipuri, screenshot-uri și Playwright Traces** direct în cloud, exclusiv pentru testele care eșuează (`only-on-failure`).
* **GitHub Actions CI Pipeline:** Integrare continuă automată care rulează întreaga suită de teste la fiecare `push` sau `pull_request` pe branch-urile principale, injectând secretele din GitHub Secrets.

---

## 🚀 Ghid de Rulare Locală

### 1. Clonarea proiectului & Instalarea dependențelor
```bash
git clone <url-repository>
cd PlaywrightProject
npm ci
```

### 2. Instalarea browserelor Playwright
```bash
npx playwright install --with-deps
```

### 3. Configurarea fișierului de mediu
Creează un fișier numit `.env` în rădăcina proiectului și adaugă credențialele:
```env
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
```

### 4. Executarea testelor
```bash
# Rulează toate testele pe toate browserele în fundal (Headless)
npx playwright test

# Rulează testele pe un browser specific
npx playwright test --project=chromium

# Rulează testele în modul vizibil (Headful / UI Mode)
npx playwright test --ui
```

### 5. Vizualizarea raportului local
```bash
npx playwright show-report
```

---

## 📋 Scenarii de Testare Implementate

### Mapează `tests/login.spec.ts` (Login Validations)
* **Succes:** Logare cu credențiale valide preluate din `.env`.
* **Blocat:** Verificarea mesajului de eroare pentru un utilizator de tip `locked_out_user`.
* **Scenariu Negativ:** Validarea erorii de sistem atunci când parola introdusă este incorectă.

### Mapează `tests/purchase-flow.spec.ts` (E2E & Post-Login)
* **Flux complet (Pozitiv):** Autentificare, adăugare de produse multiple în coș, completare date livrare și finalizare comandă cu succes.
* **Scenariu Negativ Checkout:** Încercarea de a finaliza o comandă cu formularul gol, testul validând dinamic apariția erorii de completare fără a bloca execuția (fără timeout-uri).
* **Navigare Complexă (Tab Pop-up):** Deschiderea meniului lateral din SauceDemo, navigarea pe pagina externă Sauce Labs și gestionarea asincronă a unui tab secundar deschis în browser (`popup` event) pentru interacțiunea cu portalul *Trust Center*.

---
_Notă: Acest framework a fost construit urmând cele mai stricte standarde din industrie pentru testarea modernă în TypeScript._
