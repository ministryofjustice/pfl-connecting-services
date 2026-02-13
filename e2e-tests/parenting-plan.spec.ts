import { test, expect } from '@playwright/test';

test.describe('Parenting Plan', () => {
  test('should display the page with correct title', async ({ page }) => {
    await page.goto('/parenting-plan');

    await expect(page).toHaveTitle('Explore: Making a parenting plan – Get help finding a child arrangement option – GOV.UK');
  });

  test('should display correct page heading', async ({ page }) => {
    await page.goto('/parenting-plan');

    await expect(page.locator('h1')).toHaveText('Explore: Making a parenting plan');
  });

  test('should display "Why this could be right for you" section', async ({ page }) => {
    await page.goto('/parenting-plan');

    await expect(page.locator('h2').first()).toHaveText('Why this could be right for you');
    await expect(page.locator('text=You do not have to do any official paperwork')).toBeVisible();
  });

  test('should display "Important things to consider" section', async ({ page }) => {
    await page.goto('/parenting-plan');

    await expect(page.locator('text=Important things to consider')).toBeVisible();
    await expect(page.locator('text=No court:')).toBeVisible();
    await expect(page.locator('text=No cost:')).toBeVisible();
    await expect(page.locator('text=Easy to review and change:')).toBeVisible();
    await expect(page.locator('text=Make it legally binding:')).toBeVisible();
  });

  test('should display "Next step: Make a plan" section', async ({ page }) => {
    await page.goto('/parenting-plan');

    await expect(page.locator('text=Next step: Make a plan')).toBeVisible();
    await expect(page.locator('text=where your children will live')).toBeVisible();
    await expect(page.locator('text=when they spend time with each parent')).toBeVisible();
  });

  test('should display "Other ways to agree" section', async ({ page }) => {
    await page.goto('/parenting-plan');

    await expect(page.locator('text=Other ways to agree without going to court')).toBeVisible();
    await expect(page.locator('h3:has-text("Mediation")')).toBeVisible();
  });

  test('should display mediation voucher inset text', async ({ page }) => {
    await page.goto('/parenting-plan');

    await expect(page.locator('.govuk-inset-text')).toContainText('voucher worth up to £500');
  });

  test('should display help and support table with services', async ({ page }) => {
    await page.goto('/parenting-plan');

    await expect(page.locator('text=Help and support')).toBeVisible();
    await expect(page.locator('.govuk-table')).toContainText('Advice Now');
    await expect(page.locator('.govuk-table')).toContainText('Cafcass');
    await expect(page.locator('.govuk-table')).toContainText('Cafcass Cymru');
  });

  test('should display related content section', async ({ page }) => {
    await page.goto('/parenting-plan');

    const relatedContent = page.locator('.govuk-prototype-kit-common-templates-related-items');
    await expect(relatedContent).toContainText('Related content');
    await expect(relatedContent).toContainText('Making child arrangements if you divorce or separate');
    await expect(relatedContent).toContainText('Propose a child arrangements plan');
    await expect(relatedContent).toContainText('Child maintenance');
    await expect(relatedContent).toContainText('Parental rights and responsibilities');
  });

  test('should display Exit this page button', async ({ page }) => {
    await page.goto('/parenting-plan');

    await expect(page.locator('text=Exit this page')).toBeVisible();
  });

  test('should display Print this page button', async ({ page }) => {
    await page.goto('/parenting-plan');

    await expect(page.locator('button:has-text("Print this page")')).toBeVisible();
  });

  test('should have Advice Now link pointing to correct URL', async ({ page }) => {
    await page.goto('/parenting-plan');

    const adviceNowLink = page.locator('a:has-text("Advice Now")');
    await expect(adviceNowLink).toHaveAttribute('href', 'https://www.advicenow.org.uk/get-help/family-and-children/child-arrangements');
  });

  test('should have Cafcass link pointing to correct URL', async ({ page }) => {
    await page.goto('/parenting-plan');

    const cafcassLink = page.locator('a:has-text("Children and Family Court Advisory and Support Service (Cafcass)")');
    await expect(cafcassLink).toHaveAttribute('href', 'https://www.cafcass.gov.uk/parent-carer-or-family-member/my-family-involved-private-law-proceedings/resources-help-you-make-arrangements-are-your-childs-best-interests/how-parenting-plan-can-help');
  });

  test('should have Cafcass Cymru link pointing to correct URL', async ({ page }) => {
    await page.goto('/parenting-plan');

    const cafcassCymruLink = page.locator('a:has-text("Cafcass Cymru")');
    await expect(cafcassCymruLink).toHaveAttribute('href', 'https://www.gov.wales/parenting-plan-cafcass-cymru');
  });

  test('should have related content links pointing to correct URLs', async ({ page }) => {
    await page.goto('/parenting-plan');

    const makingArrangementsLink = page.locator('a:has-text("Making child arrangements if you divorce or separate")');
    await expect(makingArrangementsLink).toHaveAttribute('href', 'https://www.gov.uk/looking-after-children-divorce');

    const proposeAPlanLink = page.locator('.govuk-prototype-kit-common-templates-related-items a:has-text("Propose a child arrangements plan")');
    await expect(proposeAPlanLink).toHaveAttribute('href', 'https://www.gov.uk/looking-after-children-divorce/if-you-agree');

    const childMaintenanceLink = page.locator('a:has-text("Child maintenance")');
    await expect(childMaintenanceLink).toHaveAttribute('href', 'https://www.gov.uk/child-maintenance-service');

    const parentalRightsLink = page.locator('a:has-text("Parental rights and responsibilities")');
    await expect(parentalRightsLink).toHaveAttribute('href', 'https://www.gov.uk/parental-rights-responsibilities');
  });

  test('should have mediation link pointing to internal mediation page', async ({ page }) => {
    await page.goto('/parenting-plan');

    const mediationLink = page.locator('a:has-text("Explore: Mediation")');
    await expect(mediationLink).toHaveAttribute('href', '/mediation');
  });

  test('should have find out more link pointing to correct URL', async ({ page }) => {
    await page.goto('/parenting-plan');

    const findOutMoreLink = page.locator('a:has-text("Find out more about what to do if you agree on child arrangements")');
    await expect(findOutMoreLink).toHaveAttribute('href', 'https://www.gov.uk/looking-after-children-divorce/if-you-agree');
  });
});
