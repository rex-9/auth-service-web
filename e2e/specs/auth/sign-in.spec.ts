import { test, expect } from "@playwright/test";
import { users, generateTestUser } from "../../data/users";
import { createUnconfirmedUser, cleanupUser } from "../../helpers/api";
import { AuthPage } from "../../pages/auth.page";
import { SignInPasswordPage } from "../../pages/sign-in-password.page";
import { ConfirmEmailPage } from "../../pages/confirm-email.page";
import { HomePage } from "../../pages/home.page";

test.describe("Authentication > Sign in", () => {
  let authPage: AuthPage;
  let signInPage: SignInPasswordPage;
  let homePage: HomePage;
  let confirmPage: ConfirmEmailPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    signInPage = new SignInPasswordPage(page);
    homePage = new HomePage(page);
    confirmPage = new ConfirmEmailPage(page);
  });

  test("allows an existing user to sign in with email and password", async () => {
    await authPage.goto();
    await authPage.enterEmail(users.existing.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await signInPage.enterPassword(users.existing.password);
    await homePage.assertIsAuthenticated();
  });

  test("rejects an incorrect password and shows remaining attempts", async ({ page }) => {
    await authPage.goto();
    await authPage.enterEmail(users.existing.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await signInPage.enterPassword("000000"); // Wrong password
    
    await expect(page.getByText(/Incorrect password|Incorrect passcode/i)).toBeVisible();
    await expect(page.getByText(/attempts remaining/i)).toBeVisible();

    // Sign in with correct password to reset attempt limiter
    await signInPage.enterPassword(users.existing.password);
    await homePage.assertIsAuthenticated();
  });

  test("preserves the email address across the password step", async ({ page }) => {
    await authPage.goto();
    await authPage.enterEmail(users.existing.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await expect(page.getByText(users.existing.email)).toBeVisible();
  });

  test("activates cooldown after maximum failed attempts", async ({ page }) => {
    await authPage.goto();
    await authPage.enterEmail(users.superAdmin.email);
    await authPage.submit();

    await signInPage.waitForVisible();

    // Enter wrong password up to 4 times to trigger lockout
    for (let i = 0; i < 4; i++) {
      const isLocked = await page
        .getByText(/Too many attempts|Try again in/i)
        .first()
        .isVisible();
      if (isLocked) break;

      await signInPage.enterPassword("000000");

      await Promise.race([
        page
          .getByText(/Too many attempts|Try again in/i)
          .first()
          .waitFor({ state: "visible", timeout: 6000 })
          .catch(() => null),
        page
          .getByText(
            /Incorrect password|Incorrect passcode|attempts remaining/i,
          )
          .first()
          .waitFor({ state: "visible", timeout: 6000 })
          .catch(() => null),
      ]);
      await page.waitForTimeout(300);
    }

    await expect(
      page.getByText(/Too many attempts|Try again in/i).first(),
    ).toBeVisible({ timeout: 10000 });
    await expect(signInPage.submitButton).toBeDisabled();
  });

  test("redirects unconfirmed user directly to confirm email OTP when returning after drop-off", async ({ page }) => {
    const unconfirmedUser = generateTestUser("unconf_drop");
    
    // 1. Create unconfirmed user in backend (via POST /signup)
    await createUnconfirmedUser(unconfirmedUser);

    // 2. User returns to auth screen and enters email
    await authPage.goto();
    await authPage.enterEmail(unconfirmedUser.email);
    await authPage.submit();

    // 3. User is routed directly to ConfirmEmail dialog (confirm OTP)
    await confirmPage.waitForVisible();
    await expect(page.getByText(unconfirmedUser.email)).toBeVisible();

    // 4. Verify password signin and password creation screens are NOT shown
    await expect(signInPage.inputs.first()).not.toBeVisible();

    await cleanupUser(unconfirmedUser.email);
  });
});
