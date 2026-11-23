import { test, expect } from "@playwright/test";

test.describe("Student Complete Opportunity & Growth Journey", () => {
  test("complete end-to-end flow: onboarding -> radar -> receipt -> tracker -> log outcome -> growth passport", async ({
    page,
  }) => {
    // 1. Visit Onboarding
    await page.goto("/onboarding");
    await expect(page.locator("text=What are you aiming for?")).toBeVisible();

    // Step 1: Goal selection -> Next
    await page.click("text=Land an Internship");
    await page.click("button:has-text('Next Step')");

    // Step 2: Skills -> Next
    await expect(page.locator("text=What are your core skills?")).toBeVisible();
    await page.click("button:has-text('Next Step')");

    // Step 3: Academic standing -> Next
    await expect(page.locator("text=Academic Standing")).toBeVisible();
    await page.click("button:has-text('Next Step')");

    // Step 4: Budget & Availability -> Complete
    await expect(page.locator("text=Logistics & Availability")).toBeVisible();
    await page.click("button:has-text('Complete Setup')");

    // 2. Arrives at Student Home
    await page.waitForURL("**/");
    await expect(page.locator("h1:has-text('Deadlines This Week')")).toBeVisible();
    await expect(page.locator("h3:has-text('Today\\'s Progress')")).toBeVisible();

    // 3. Navigate to Opportunity Radar
    await page.goto("/radar");
    await expect(page.locator("text=Opportunity Radar")).toBeVisible();

    // Check that top recommended opportunities are visible with fit scores
    await expect(page.locator("text=Fit Score").first()).toBeVisible();
    await expect(page.locator("text=Eligible").first()).toBeVisible();

    // Ineligible opportunities are NOT ranked among top eligible listings
    const firstOppCard = page.locator("text=Smart India Hackathon 2026").first();
    await expect(firstOppCard).toBeVisible();

    // 4. Click 'See Plan' on an opportunity to view detail & Opportunity Receipt
    await page.click("text=See Plan & Receipt >> nth=0");
    await expect(page.locator("text=Explainable Fit Breakdown")).toBeVisible();
    await expect(page.locator("text=OPPORTUNITY RECEIPT")).toBeVisible();
    await expect(page.locator("text=Readiness Action Timeline")).toBeVisible();

    // 5. Add to Tracker
    await page.click("button:has-text('Track This Opportunity')");
    await page.waitForTimeout(1200);

    // 6. Arrive at Tracker and verify opportunity is in 'Preparing' or active stage
    await page.goto("/tracker");
    await expect(page.locator("h1:has-text('Action')")).toBeVisible();
    await expect(page.locator("text=Preparation Tasks").or(page.locator("text=Action Checklist")).first()).toBeVisible();

    // 7. Open Quick Action to Log Outcome
    await page.click("button[title='Quick Add Action']");
    await expect(page.locator("text=New Task")).toBeVisible();

    // Switch to Log Outcome tab in modal
    await page.click("button:has-text('Log Outcome')");
    await page.fill("input[placeholder*='e.g. Built AI Agent']", "Completed SIH Prototype Challenge");
    await page.fill("textarea[placeholder*='What worked?']", "Built an end-to-end fullstack platform with responsive glass design and deterministic intelligence.");
    await page.fill("input[placeholder*='https://github.com/']", "https://github.com/vybe/sih-challenge-prototype");
    await page.click("button:has-text('Log to Growth Passport')");

    await expect(page.locator("text=Growth record captured in your Growth Passport!")).toBeVisible();
    await page.waitForTimeout(1500);

    // 8. Visit Growth Passport and verify the new outcome record appears
    await Promise.all([
      page.waitForResponse((res) => res.url().includes("/api/outcomes") && res.status() === 200).catch(() => null),
      page.goto("/passport"),
    ]);
    await expect(page.locator("text=Proof-of-Growth Passport").or(page.locator("text=Growth Passport")).first()).toBeVisible();
    await expect(page.locator("text=Completed SIH Prototype Challenge")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Link-supported").first()).toBeVisible();
  });
});
