import { test, expect } from "@playwright/test";
import { users } from "../../data/users";
import { AuthPage } from "../../pages/auth.page";
import { SignInPasswordPage } from "../../pages/sign-in-password.page";
import { HomePage } from "../../pages/home.page";
import AppRoutes from "../../../src/AppRoutes";

test.describe("Authentication > Sign out", () => {
  let authPage: AuthPage;
  let signInPage: SignInPasswordPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    signInPage = new SignInPasswordPage(page);
    homePage = new HomePage(page);
  });

  test("signs out an authenticated user and returns to unauthenticated state", async ({ page }) => {
    await authPage.goto();
    await authPage.enterEmail(users.existing.email);
    await authPage.submit();
    
    await signInPage.waitForVisible();
    await signInPage.enterPassword(users.existing.password);
    await homePage.assertIsAuthenticated();

    // Navigate to signout
    await page.goto(AppRoutes.client.protected.SIGN_OUT);
    
    // Verify we are back to root/unauthenticated
    await page.waitForURL(`**${AppRoutes.client.public.ROOT}*`, { timeout: 10000 });
    await expect(page.getByRole("button", { name: /^(Enter|Sign In)$/i }).first()).toBeVisible();
  });
});
