# Software Quality Assurance & Testing — SauceDemo and Library-DB-Express

Test suites built for the **SE 2226 Software Quality Assurance and Testing** course at Yaşar University (2026, team project of 4 students).
Two applications were tested: [SauceDemo](https://www.saucedemo.com) as a black-box e-commerce site, and **Library-DB-Express**, a small Express + Sequelize book catalogue app tested locally (the app itself is not part of this repository).

## Results at a glance

| Application | Tool | What it covers | Result |
|---|---|---|---|
| SauceDemo | Playwright (TypeScript) | 21 test cases × Chromium, Firefox, WebKit | 63 runs |
| SauceDemo | Selenium IDE | 7 recorded GUI flows (cart, checkout, logout, locked-out user…) | — |
| SauceDemo | Selenium WebDriver (Java, JUnit 4) | Valid and invalid login | 2 tests |
| Library-DB-Express | Jest + Supertest | 48 route tests (list, search, create, validation, update, delete, 404) | 48 / 48 passed |
| Library-DB-Express | Jest coverage | Statements / branches / functions | 97.4 % / 78.3 % / 100 % |
| Library-DB-Express | Stryker | Mutation testing of routes and error handlers | 60.2 % mutation score |
| Library-DB-Express | JMeter | Load test on `/books` with 10, 50 and 100 users | see [results](library-db-express/jmeter/load-test-results.docx) |

## Bugs found

The Jest suite found the same defect in three Library-DB-Express routes: when a book id does not exist, `GET /books/:id`, `POST /books/:id` and `POST /books/:id/delete` crash with **500** instead of returning **404**, because the route uses the book object without checking for `null`. The tests document this behaviour (see the comments in `books.test.js`).

## Test design (SauceDemo)

The Playwright cases were designed with classic black-box techniques — the full list is in [`TEST_CASES.txt`](saucedemo/playwright/TEST_CASES.txt):

- **Equivalence Class Partitioning** — valid / invalid username and password classes, empty fields
- **Boundary Value Analysis** — minimum and maximum length inputs, locked-out user
- **Decision Table Testing** — combinations of username and password states
- **Use Case Testing** — end-to-end flows: add to cart, checkout, sorting, product details, logout

## Repository layout

```
saucedemo/
  playwright/               Playwright tests + config
  selenium-ide/             Selenium IDE project (.side)
  selenium-webdriver-java/  Maven project, JUnit 4 + Selenium 4
library-db-express/
  jest/                     books.test.js + coverage output
  stryker/                  Stryker config + mutation report output
  jmeter/                   JMeter test plan (.jmx) + results
```

## Running

**Windows, one click:** double-click `run_tests.bat` and pick Playwright, Selenium or both (Playwright starts automatically after 15 seconds). It installs what is missing, runs the tests and opens the Playwright HTML report.

**Manual steps:**

**Playwright** (Node.js 18+):
```
cd saucedemo/playwright
npm install
npx playwright install
npm test
```
The login steps are shared through a small `login()` helper, and the site address is set once as `baseURL` in `playwright.config.ts`.

**Selenium WebDriver (Java)** (JDK 17+, Maven, Chrome):
```
cd saucedemo/selenium-webdriver-java
mvn test
```

**Library-DB-Express tests:** copy `jest/books.test.js` into the root of the Library-DB-Express project (next to `app.js`; it imports `./app` and `./models`). Setup steps are in the comment at the top of the file. Then run `npx jest --coverage` and, with `stryker.config.json` copied next to `package.json`, `npx stryker run`.

**Selenium IDE:** open `selenium-ide/saucedemo.side` in the Selenium IDE browser extension.
