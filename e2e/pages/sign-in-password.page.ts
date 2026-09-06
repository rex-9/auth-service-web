import { expect, type Locator, type Page } from "@playwright/test";

export class SignInPasswordPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly inputs: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", {
      name: /^Enter your passcode$/i,
    });
    this.inputs = page.locator('input[id^="signin-password-"]');
    this.submitButton = page.locator('[role="dialog"] button[type="submit"]');
    this.forgotPasswordLink = page.getByText(/Forgot (your )?passcode\?/i);
  }

  async waitForVisible() {
    // Wait for the specific numeric password input on SigninPasswordDialog
    await this.inputs.first().waitFor({ state: "visible", timeout: 10000 });
  }

  async enterPassword(password: string) {
    await this.waitForVisible();
    const firstInput = this.inputs.first();
    await firstInput.waitFor({ state: "visible", timeout: 10000 });

    const isLocked = await this.page
      .getByText(/Too many attempts|Try again in/i)
      .first()
      .isVisible()
      .catch(() => false);
    if (isLocked) {
      return;
    }

    await expect(firstInput).toBeEnabled({ timeout: 10000 });

    for (let i = 0; i < 6; i++) {
      const input = this.inputs.nth(i);
      if (await input.isVisible()) {
        await input.fill("");
      }
    }
    await firstInput.click();
    await this.page.keyboard.type(password, { delay: 60 });
  }

  async submit() {
    if (
      (await this.submitButton.isVisible()) &&
      (await this.submitButton.isEnabled())
    ) {
      await this.submitButton.click().catch(() => {});
    }
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.waitFor({ state: "visible" });
    await this.forgotPasswordLink.click();
  }
}
