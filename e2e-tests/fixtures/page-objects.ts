import { Page, Locator } from '@playwright/test';

export class PasswordPage {
  readonly page: Page;
  readonly passwordInput: Locator;
  readonly continueButton: Locator;
  readonly errorSummary: Locator;

  constructor(page: Page) {
    this.page = page;
    this.passwordInput = page.getByLabel(/password/i);
    this.continueButton = page.getByRole('button', { name: /continue/i });
    this.errorSummary = page.locator('.govuk-error-summary');
  }

  async goto() {
    await this.page.goto('/password');
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.continueButton.click();
  }

  async submitWithPassword(password: string) {
    await this.enterPassword(password);
    await this.submit();
  }
}
