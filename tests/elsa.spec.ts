import { expect, test, type Page } from "@playwright/test";

async function createClassReservation(page: Page, classId: string, stamp: string | number, index = 0) {
  return page.request.post("/api/inquiries", {
    data: {
      classId,
      studentName: `Capacity Student ${stamp}-${index}`,
      age: 9,
      guardianName: "Capacity Parent",
      email: `capacity-${stamp}-${index}@example.com`,
      phone: "514-555-0166",
      preferredLanguage: "en",
      experience: "beginner",
      message: "Capacity regression test."
    }
  });
}

test("public site supports core multilingual sections", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: "Elsa Dance School", exact: true })).toBeVisible();
  await expect(page.getByText("8220 Mayrand, Montreal, Quebec").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Classes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Chinese Dance Foundation" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open enrollment|Waitlist/ }).first()).toBeVisible();
  const elsaHeading = page.getByRole("heading", { name: "Elsa" }).last();
  const helenHeading = page.getByRole("heading", { name: "Helen" });
  await expect(elsaHeading).toBeVisible();
  await expect(helenHeading).toBeVisible();
  const teacherHeadings = await page.locator("#about h3").evaluateAll((nodes) =>
    nodes.map((node) => node.textContent?.trim())
  );
  expect(teacherHeadings.indexOf("Elsa")).toBeLessThan(teacherHeadings.indexOf("Helen"));

  await page.getByRole("link", { name: "Switch to fr" }).click();
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.getByRole("heading", { name: "Cours" })).toBeVisible();

  await page.getByRole("link", { name: "Switch to zh" }).click();
  await expect(page).toHaveURL(/\/zh$/);
  await expect(page.getByRole("heading", { name: "课程", exact: true })).toBeVisible();
});

test("reservation flow saves a pay-at-school pending reservation", async ({ page }) => {
  const stamp = Date.now();
  const studentName = `Playwright Student ${stamp}`;

  await page.goto("/en#register");
  await page.getByLabel("Class").selectOption("kids-chinese-foundation");
  await page.getByLabel("Student name").fill(studentName);
  await page.getByRole("spinbutton", { name: "Age" }).fill("8");
  await page.getByLabel("Parent/guardian name").fill("Test Parent");
  await page.getByLabel("Email").fill(`student-${stamp}@example.com`);
  await page.getByLabel("Phone").fill("514-555-0101");
  await page.getByLabel("Preferred language").selectOption("en");
  await page.getByLabel("Experience").selectOption("beginner");
  await page.getByLabel("Message").fill("Regression test reservation.");
  await page.getByRole("button", { name: /Reserve spot/ }).click();

  await expect(page.getByRole("status")).toContainText(/Reservation received|waiting list/);
});

test("admin can view and confirm a reservation", async ({ page }) => {
  const stamp = Date.now();
  const studentName = `Admin Flow ${stamp}`;

  const response = await page.request.post("/api/inquiries", {
    data: {
      classId: "kids-chinese-foundation",
      studentName,
      age: 9,
      guardianName: "Admin Parent",
      email: `admin-flow-${stamp}@example.com`,
      phone: "514-555-0199",
      preferredLanguage: "en",
      experience: "some",
      message: "Created by Playwright."
    }
  });
  expect(response.ok()).toBeTruthy();

  const login = await page.request.post("/api/admin/login", {
    data: { password: process.env.ADMIN_PASSWORD || "admin-local" }
  });
  expect(login.ok()).toBeTruthy();
  await page.goto("/en/admin");

  const classSection = page.getByRole("region", {
    name: /class: Chinese Dance Foundation/
  });
  const classToggle = classSection.getByRole("button", { name: /Expand Chinese Dance Foundation/ });
  await expect(classToggle).toHaveAttribute("aria-expanded", "false");
  await classToggle.click();
  await expect(classSection.getByRole("button", { name: /Collapse Chinese Dance Foundation/ })).toHaveAttribute("aria-expanded", "true");
  await expect(classSection.getByText(studentName)).toBeVisible({ timeout: 15000 });
  const row = classSection.getByRole("row").filter({ hasText: studentName });
  await row.getByRole("combobox").selectOption("Confirmed");
  await expect(row.getByRole("combobox")).toHaveValue("Confirmed");

  await classSection.getByRole("button", { name: /Collapse Chinese Dance Foundation/ }).click();
  await expect(row).toBeHidden();
  await classSection.getByRole("button", { name: /Expand Chinese Dance Foundation/ }).click();
  await expect(row).toBeVisible();
});

test("event reserve flow records ticket interest for admin", async ({ page }) => {
  const stamp = Date.now();
  const studentName = `Ticket Flow ${stamp}`;

  await page.goto("/en#events");
  await page.getByRole("link", { name: "Reserve tickets" }).first().click();
  await expect(page).toHaveURL(/eventId=place-des-arts-gala/);
  await expect(page.getByText("Event ticket request")).toBeVisible();

  await page.getByLabel("Student name").fill(studentName);
  await page.getByRole("spinbutton", { name: "Age" }).fill("10");
  await page.getByLabel("Parent/guardian name").fill("Ticket Parent");
  await page.getByLabel("Email").fill(`ticket-${stamp}@example.com`);
  await page.getByLabel("Phone").fill("514-555-0123");
  await page.getByLabel("Preferred language").selectOption("en");
  await page.getByLabel("Experience").selectOption("beginner");
  await page.getByLabel("Message").fill("Ticket booking regression test.");
  await page.getByRole("button", { name: /Reserve spot/ }).click();

  await expect(page.getByRole("heading", { name: "Ticket booking links" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Book through Elsa Dance School" })).toBeVisible();

  const login = await page.request.post("/api/admin/login", {
    data: { password: process.env.ADMIN_PASSWORD || "admin-local" }
  });
  expect(login.ok()).toBeTruthy();
  await page.goto("/en/admin");

  const eventSection = page.getByRole("region", {
    name: /event: Annual Gala at Place des Arts/
  });
  await expect(eventSection).toContainText("Event");
  await eventSection.getByRole("button", { name: /Expand Annual Gala at Place des Arts/ }).click();
  const row = eventSection.getByRole("row").filter({ hasText: studentName });
  await expect(row).toContainText("ticket-links-shown");

  const downloadPromise = page.waitForEvent("download");
  await eventSection.getByRole("button", { name: "CSV" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain("event-annual-gala-at-place-des-arts");
});

test("private coaching schedule opens one-hour Wednesday sessions", async ({ page }) => {
  const stamp = Date.now();
  const studentName = `Private Coaching ${stamp}`;
  const preferredSchedule = "Wednesday 12:00-13:00";

  await page.goto("/en#classes");
  const privateCard = page.getByRole("article").filter({ hasText: "Private Coaching" });
  await privateCard.getByRole("link", { name: "By appointment" }).click();

  await expect(page).toHaveURL(/classId=private-coaching/);
  await expect(page.getByLabel("Class")).toHaveValue("private-coaching");
  await expect(page.getByLabel("Preferred session")).toBeVisible();
  await page.getByLabel("Preferred session").selectOption(preferredSchedule);

  await page.getByLabel("Student name").fill(studentName);
  await page.getByRole("spinbutton", { name: "Age" }).fill("15");
  await page.getByLabel("Parent/guardian name").fill("Private Parent");
  await page.getByLabel("Email").fill(`private-${stamp}@example.com`);
  await page.getByLabel("Phone").fill("514-555-0188");
  await page.getByLabel("Preferred language").selectOption("en");
  await page.getByLabel("Experience").selectOption("some");
  await page.getByRole("button", { name: /Reserve spot/ }).click();

  await expect(page.getByRole("status")).toContainText("Reservation received");

  const login = await page.request.post("/api/admin/login", {
    data: { password: process.env.ADMIN_PASSWORD || "admin-local" }
  });
  expect(login.ok()).toBeTruthy();
  await page.goto("/en/admin");

  const privateSection = page.getByRole("region", {
    name: /class: Private Coaching/
  });
  await privateSection.getByRole("button", { name: /Expand Private Coaching/ }).click();
  const row = privateSection.getByRole("row").filter({ hasText: studentName });
  await expect(row).toContainText(`Preferred: ${preferredSchedule}`);
});

test("summer camp books by July or August week", async ({ page }) => {
  const stamp = Date.now();
  const studentName = `Summer Camp ${stamp}`;
  const preferredSchedule = "August 10-14, 2026";

  await page.goto("/en#classes");
  const campCard = page.getByRole("article").filter({ hasText: "Summer Dance Camp" });
  await campCard.getByRole("link", { name: "July-August weekly sessions" }).click();

  await expect(page).toHaveURL(/classId=summer-camp-2026/);
  await expect(page.getByLabel("Class")).toHaveValue("summer-camp-2026");
  await expect(page.getByLabel("Camp week")).toBeVisible();
  await page.getByLabel("Camp week").selectOption(preferredSchedule);

  await page.getByLabel("Student name").fill(studentName);
  await page.getByRole("spinbutton", { name: "Age" }).fill("8");
  await page.getByLabel("Parent/guardian name").fill("Camp Parent");
  await page.getByLabel("Email").fill(`camp-${stamp}@example.com`);
  await page.getByLabel("Phone").fill("514-555-0177");
  await page.getByLabel("Preferred language").selectOption("en");
  await page.getByLabel("Experience").selectOption("beginner");
  await page.getByRole("button", { name: /Reserve spot/ }).click();

  await expect(page.getByRole("status")).toContainText("Reservation received");

  const login = await page.request.post("/api/admin/login", {
    data: { password: process.env.ADMIN_PASSWORD || "admin-local" }
  });
  expect(login.ok()).toBeTruthy();
  await page.goto("/en/admin");

  const campSection = page.getByRole("region", {
    name: /class: Summer Dance Camp/
  });
  await campSection.getByRole("button", { name: /Expand Summer Dance Camp/ }).click();
  const row = campSection.getByRole("row").filter({ hasText: studentName });
  await expect(row).toContainText(`Preferred: ${preferredSchedule}`);
});

test("class capacity waitlists reservations after 30 active students", async ({ page }) => {
  const stamp = Date.now();
  const classId = `capacity-test-${stamp}`;

  for (let index = 0; index < 30; index += 1) {
    const response = await createClassReservation(page, classId, stamp, index);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.inquiry.status).toBe("Reserved - Payment Pending");
  }

  const waitlistResponse = await createClassReservation(page, classId, stamp, 30);
  expect(waitlistResponse.ok()).toBeTruthy();
  const waitlistBody = await waitlistResponse.json();
  expect(waitlistBody.inquiry.status).toBe("Waitlisted");
});

test("full class card displays waitlist button", async ({ page }) => {
  const stamp = Date.now();

  for (let index = 0; index < 30; index += 1) {
    const response = await createClassReservation(page, "contemporary-mixed", `visible-${stamp}`, index);
    expect(response.ok()).toBeTruthy();
  }

  await page.goto("/en#classes");
  const classCard = page.getByRole("article").filter({ hasText: "Contemporary Technique" });
  await expect(classCard.getByRole("link", { name: /Waitlist/ })).toBeVisible();
});
