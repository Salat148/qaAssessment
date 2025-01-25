import { Page } from "@playwright/test";
import { env } from "../playwright.config";

const { apiUrl } = env;

export class Utils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async login(username: string, password: string) {
    await this.page.locator("#username").fill(username);
    await this.page.locator("#password").fill(password);
    await this.page.locator('[name="remember"]').click();
    await this.page.getByRole("button", { name: "Sign In" }).click();
  }

  public async expireUnixTime(days: number) {
    const currentDate = new Date();
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    const timestampInSeconds = Math.floor(newDate.getTime() / 1000);
    return timestampInSeconds.toFixed(0);
  }

  public async getCookiesExpire(cookieName: string) {
    const cookie = await this.page.context().cookies();
    return cookie.find((c) => c.name == cookieName)?.expires.toFixed(0);
  }

  public async isMobile() {
    const viewportSize = this.page.viewportSize();
    if (viewportSize && viewportSize.width) {
      if (viewportSize.width <= 375) {
        return true;
      } else {
        return false;
      }
    } else {
      console.error("Viewport size is null or undefined");
    }
  }

  public async waitForCreateBankAccRequest() {
    const responsePromise = this.page.waitForRequest(async (request) => {
      const responseBody = await request.postDataJSON();

      if (
        request.url() === `${apiUrl}/graphql` &&
        responseBody.operationName === "CreateBankAccount"
      ) {
        return true;
      }

      return false;
    });

    return responsePromise
  }
}
