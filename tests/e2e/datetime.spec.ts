import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite for DateTimeChecker
 * 
 * Test cases aligned with Template_Unit Test Case.xls
 * - Sheet: CheckDate (Function1 - isValidDate) 
 * - Sheet: DayInMonth (Function2 - daysInMonth)
 * 
 * All tests go through the full UI → API → Server → Response flow.
 */

test.describe('Date Time Checker App - UI Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-UI-01: should display all UI elements correctly', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Date Time Checker');
    await expect(page.locator('label[for="day"]')).toHaveText('Day');
    await expect(page.locator('label[for="month"]')).toHaveText('Month');
    await expect(page.locator('label[for="year"]')).toHaveText('Year');
    await expect(page.locator('[data-test="day-input"]')).toBeVisible();
    await expect(page.locator('[data-test="month-input"]')).toBeVisible();
    await expect(page.locator('[data-test="year-input"]')).toBeVisible();
    await expect(page.locator('[data-test="clear-button"]')).toBeVisible();
    await expect(page.locator('[data-test="check-button"]')).toBeVisible();
  });

  test('TC-UI-02: should clear inputs and hide message when Clear is clicked', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '25');
    await page.fill('[data-test="month-input"]', '5');
    await page.fill('[data-test="year-input"]', '2026');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toBeVisible();

    await page.click('[data-test="clear-button"]');

    await expect(page.locator('[data-test="day-input"]')).toHaveValue('');
    await expect(page.locator('[data-test="month-input"]')).toHaveValue('');
    await expect(page.locator('[data-test="year-input"]')).toHaveValue('');
    await expect(page.locator('[data-test="result-message"]')).not.toBeVisible();
  });

  test('TC-UI-03: should reject non-numeric Day format', async ({ page }) => {
    await page.fill('[data-test="day-input"]', 'abc');
    await page.fill('[data-test="month-input"]', '12');
    await page.fill('[data-test="year-input"]', '2020');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('Input data for Day is incorrect format!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/error/);
  });

  test('TC-UI-04: should reject non-numeric Month format', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '15');
    await page.fill('[data-test="month-input"]', 'xy');
    await page.fill('[data-test="year-input"]', '2020');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('Input data for Month is incorrect format!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/error/);
  });

  test('TC-UI-05: should reject non-numeric Year format', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '15');
    await page.fill('[data-test="month-input"]', '08');
    await page.fill('[data-test="year-input"]', '12a');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('Input data for Year is incorrect format!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/error/);
  });

});

// ============================================================================
// SHEET: CheckDate — Function1 / isValidDate() E2E Tests
// Aligned with Template_Unit Test Case.xls → Sheet "CheckDate"
// ============================================================================
test.describe('CheckDate (isValidDate)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Normal Test Cases (3) ──

  test('UTCID01 - CheckDate Normal: Day=15, Month=6, Year=2023 → True', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '15');
    await page.fill('[data-test="month-input"]', '6');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('15/6/2023 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID02 - CheckDate Normal: Day=31, Month=1, Year=2023 → True', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '31');
    await page.fill('[data-test="month-input"]', '1');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('31/1/2023 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID03 - CheckDate Normal: Day=28, Month=2, Year=2021 → True', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '28');
    await page.fill('[data-test="month-input"]', '2');
    await page.fill('[data-test="year-input"]', '2021');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('28/2/2021 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  // ── Boundary Test Cases (6) ──

  test('UTCID04 - CheckDate Boundary: Day=1, Month=1, Year=2023 → True (min valid)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '1');
    await page.fill('[data-test="month-input"]', '1');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('1/1/2023 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID05 - CheckDate Boundary: Day=31, Month=12, Year=2023 → True (max month/day)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '31');
    await page.fill('[data-test="month-input"]', '12');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('31/12/2023 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID06 - CheckDate Boundary: Day=29, Month=2, Year=2000 → True (leap year ÷400)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '29');
    await page.fill('[data-test="month-input"]', '2');
    await page.fill('[data-test="year-input"]', '2000');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('29/2/2000 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID07 - CheckDate Boundary: Day=29, Month=2, Year=2021 → False (non-leap)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '29');
    await page.fill('[data-test="month-input"]', '2');
    await page.fill('[data-test="year-input"]', '2021');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('29/2/2021 is NOT correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/error/);
  });

  test('UTCID08 - CheckDate Boundary: Day=30, Month=4, Year=2023 → True (30-day month)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '30');
    await page.fill('[data-test="month-input"]', '4');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('30/4/2023 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID09 - CheckDate Boundary: Day=31, Month=4, Year=2023 → False (Apr has 30 days)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '31');
    await page.fill('[data-test="month-input"]', '4');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('31/4/2023 is NOT correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/error/);
  });

  // ── Abnormal Test Cases (2) ──

  test('UTCID10 - CheckDate Abnormal: Day=0, Month=6, Year=2023 → Exception (Day out of range)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '0');
    await page.fill('[data-test="month-input"]', '6');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('Input data for Day is out of range!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/error/);
  });

  test('UTCID11 - CheckDate Abnormal: Day=32, Month=1, Year=2023 → Exception (Day out of range)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '32');
    await page.fill('[data-test="month-input"]', '1');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('Input data for Day is out of range!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/error/);
  });

});

// ============================================================================
// SHEET: DayInMonth — Function2 / daysInMonth() E2E Tests (indirect via UI)
// Aligned with Template_Unit Test Case.xls → Sheet "DayInMonth"
// 
// Note: daysInMonth() is a unit-level function tested directly in 
// DateTimeServiceTest.java. These E2E tests verify the function indirectly
// through the UI validation flow.
// ============================================================================
test.describe('DayInMonth (daysInMonth)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Normal Test Cases (3) — daysInMonth returns 31 or 30 ──

  test('UTCID01 - DayInMonth Normal: Month=1, Year=2023 → daysInMonth=31', async ({ page }) => {
    // Jan has 31 days → verify by checking 31/1/2023 is valid
    await page.fill('[data-test="day-input"]', '31');
    await page.fill('[data-test="month-input"]', '1');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('31/1/2023 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID02 - DayInMonth Normal: Month=4, Year=2023 → daysInMonth=30', async ({ page }) => {
    // Apr has 30 days → 30/4 valid, 31/4 invalid
    await page.fill('[data-test="day-input"]', '30');
    await page.fill('[data-test="month-input"]', '4');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('30/4/2023 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID03 - DayInMonth Normal: Month=7, Year=2023 → daysInMonth=31', async ({ page }) => {
    // Jul has 31 days → verify by checking 31/7/2023 is valid
    await page.fill('[data-test="day-input"]', '31');
    await page.fill('[data-test="month-input"]', '7');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('31/7/2023 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  // ── Boundary Test Cases (6) — Leap year and month-end boundaries ──

  test('UTCID04 - DayInMonth Boundary: Month=2, Year=2000 → daysInMonth=29 (leap year ÷400)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '29');
    await page.fill('[data-test="month-input"]', '2');
    await page.fill('[data-test="year-input"]', '2000');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('29/2/2000 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID05 - DayInMonth Boundary: Month=2, Year=2020 → daysInMonth=29 (leap year ÷4)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '29');
    await page.fill('[data-test="month-input"]', '2');
    await page.fill('[data-test="year-input"]', '2020');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('29/2/2020 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID06 - DayInMonth Boundary: Month=2, Year=1900 → daysInMonth=28 (century non-leap)', async ({ page }) => {
    // 1900 ÷ 100 = 19, not ÷400 → not leap year → 28 days
    await page.fill('[data-test="day-input"]', '28');
    await page.fill('[data-test="month-input"]', '2');
    await page.fill('[data-test="year-input"]', '1900');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('28/2/1900 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID07 - DayInMonth Boundary: Month=2, Year=2021 → daysInMonth=28 (non-leap)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '28');
    await page.fill('[data-test="month-input"]', '2');
    await page.fill('[data-test="year-input"]', '2021');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('28/2/2021 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID08 - DayInMonth Boundary: Month=12, Year=2023 → daysInMonth=31', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '31');
    await page.fill('[data-test="month-input"]', '12');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('31/12/2023 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  test('UTCID09 - DayInMonth Boundary: Month=1, Year=2023 → daysInMonth=31 (duplicate boundary check)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '31');
    await page.fill('[data-test="month-input"]', '1');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('31/1/2023 is correct date time!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/success/);
  });

  // ── Abnormal Test Cases (3) — Invalid month values ──

  test('UTCID10 - DayInMonth Abnormal: Month=0, Year=2023 → Exception (invalid month)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '15');
    await page.fill('[data-test="month-input"]', '0');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    // Controller catches invalid month before calling daysInMonth
    await expect(page.locator('[data-test="result-message"]')).toHaveText('Input data for Month is out of range!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/error/);
  });

  test('UTCID11 - DayInMonth Abnormal: Month=13, Year=2023 → Exception (invalid month)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '15');
    await page.fill('[data-test="month-input"]', '13');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toHaveText('Input data for Month is out of range!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/error/);
  });

  test('UTCID12 - DayInMonth Abnormal: Month empty, Year=2023 → Exception (format error)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '15');
    await page.fill('[data-test="month-input"]', '');
    await page.fill('[data-test="year-input"]', '2023');
    await page.click('[data-test="check-button"]');
    // Empty month → regex ^\d+$ fails → format error
    await expect(page.locator('[data-test="result-message"]')).toHaveText('Input data for Month is incorrect format!');
    await expect(page.locator('[data-test="result-message"]')).toHaveClass(/error/);
  });

});

// ============================================================================
// Additional: Close Window / Exit Modal Tests
// ============================================================================
test.describe('Close Window / Exit Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-EXIT-01: should show Close button and confirm modal', async ({ page }) => {
    await expect(page.locator('[data-test="close-button"]')).toBeVisible();
    await expect(page.locator('.window-title')).toHaveText('Date Time Checker');
    await page.click('[data-test="close-button"]');
    await expect(page.locator('[data-test="confirm-modal"]')).toBeVisible();
    await expect(page.locator('[data-test="confirm-modal"] .modal-body')).toContainText('Are you sure you want to exit?');
  });

  test('TC-EXIT-02: should hide modal and keep form active when clicking No', async ({ page }) => {
    await page.click('[data-test="close-button"]');
    await page.click('[data-test="confirm-no"]');
    await expect(page.locator('[data-test="confirm-modal"]')).not.toBeVisible();
    const opacity = await page.locator('.form-container').evaluate(el => window.getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });

  test('TC-EXIT-03: should exit application when clicking Yes', async ({ page }) => {
    await page.click('[data-test="close-button"]');
    await page.click('[data-test="confirm-yes"]');
    await expect(page.locator('[data-test="confirm-modal"]')).not.toBeVisible();
    const opacity = await page.locator('.form-container').evaluate(el => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeLessThan(0.2);
    const pointerEvents = await page.locator('.form-container').evaluate(el => window.getComputedStyle(el).pointerEvents);
    expect(pointerEvents).toBe('none');
  });

});
