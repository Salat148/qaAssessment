import { test, expect } from "@playwright/test";
import { env } from "../playwright.config";
import { users } from "../data/database.json";
import { User } from "../src/models/users";
import { Utils } from "../utils/utils";
import axios from "axios";

const { apiUrl } = env;
const user = User.fromJSON(users[0]);

test.describe("User Sign-up and Login", () => {
  let utils: Utils;

  test.beforeEach(async ({}) => {
    try {
      await axios.post(`${apiUrl}/testData/seed`);
    } catch (error) {
      console.error("Error seeding test data:", error);
      throw error;
    }
  });

  test("should redirect unauthenticated user to signin page", async ({
    page,
  }, testInfo) => {
    await page.goto("/personal");
    await expect(page).toHaveURL(/signin/);
    await expect(page).toHaveScreenshot(
      `${testInfo.title}-RedirectToSignIn.png`
    );
  });

  test("should redirect to the home page after login", async ({ page }) => {
    await page.goto("/signin");
    utils = new Utils(page);
    await utils.login(user.username, "s3cret");
    await expect(page).toHaveURL("/");
  });

  test("should remember a user for 30 days after login", async ({
    page,
  }, testInfo) => {
    await page.goto("/signin");
    utils = new Utils(page);
    await utils.login(user.username, "s3cret");
    await expect(page).toHaveURL("/");
    const cookieExpire = await utils.getCookiesExpire("connect.sid");
    const expectedExpire = (await utils.expireUnixTime(30)).slice(0, -1);
    expect(cookieExpire?.slice(0, -1)).toBe(expectedExpire);
    if (await utils.isMobile()) {
      await page.getByTestId("sidenav-toggle").click();
    }
    await page.click("text=Logout");
    await expect(page).toHaveURL(/signin/);
    await expect(page).toHaveScreenshot(
      `${testInfo.title}-RedirectToSignIn.png`
    );
  });

  test("should allow a visitor to sign-up, login, and logout", async ({
    page,
  }, testInfo) => {
    utils = new Utils(page);
    const userInfo = {
      firstName: "Bob",
      lastName: "Ross",
      username: "PainterJoy90",
      password: "s3cret",
    };
    await page.goto("/");
    await page.getByTestId("signup").click();
    await page.getByTestId("signup").click();
    await expect(page.getByTestId("signup-title")).toContainText("Sign Up");
    await expect(page).toHaveScreenshot(`${testInfo.title}-signUpTitle.png`);
    await page.locator("#firstName").fill(userInfo.firstName);
    await page.locator("#lastName").fill(userInfo.lastName);
    await page.locator("#username").fill(userInfo.username);
    await page.locator("#password").fill(userInfo.password);
    await page.locator("#confirmPassword").fill(userInfo.password);
    await expect(page).toHaveScreenshot(`${testInfo.title}-aboutToSignUp.png`);

    const request = page.waitForRequest("**/users");
    await page.getByTestId("signup-submit").click();
    let req = await request;
    expect(req.method()).toBe("POST");

    // Login User
    await utils.login(userInfo.username, userInfo.password);

    // Onboarding
    await page.getByTestId("user-onboarding-dialog").isVisible();
    await page.getByTestId("list-skeleton").isHidden();
    await page.getByTestId("nav-top-notifications-count").isVisible();
    await expect(page).toHaveScreenshot(
      `${testInfo.title}-userOnboardingDialog.png`
    );
    await page.getByTestId("user-onboarding-next").click();
    await expect(
      page.getByTestId("user-onboarding-dialog-title")
    ).toContainText("Create Bank Account");
    await page.getByPlaceholder("Bank Name").fill("The Best Bank");
    await page.getByPlaceholder("Routing Number").fill("123456789");
    await page.getByPlaceholder("Account Number").fill("987654321");
    await expect(page).toHaveScreenshot(
      `${testInfo.title}-aboutToCompleteUserOnboarding.png`
    );

    const responsePromise = utils.waitForCreateBankAccRequest();
    await page.getByTestId("bankaccount-submit").click();
    const response = await responsePromise;
    expect(response.postData()).toContain(
      '"operationName":"CreateBankAccount"'
    );
    await expect(
      page.getByTestId("user-onboarding-dialog-title")
    ).toContainText("Finished");
    await expect(
      page.getByTestId("user-onboarding-dialog-content")
    ).toContainText("You're all set!");
    await expect(page).toHaveScreenshot(
      `${testInfo.title}-finishedUserOnboarding.png`
    );
    await page.getByTestId("user-onboarding-next").click();
    await expect(page.getByTestId("transaction-list")).toBeVisible();
    await expect(page).toHaveScreenshot(
      `${testInfo.title}-transactionListIsVisibleAfterUserOnboarding.png`
    );

    // Logout User
    if (await utils.isMobile()) {
      await page.getByTestId("sidenav-toggle").click();
    }
    await page.click("text=Logout");
    await expect(page).toHaveURL(/signin/);
    await expect(page).toHaveScreenshot(
      `${testInfo.title}-RedirectToSignIn.png`
    );
  });
});
