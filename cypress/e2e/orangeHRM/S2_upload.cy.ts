import AddVacancyPage from "../../support/pageObjects/mainPages/AddVacancyPage";
import LoginPage from "../../support/pageObjects/mainPages/LoginPage";
import Vacancies from "../../support/pageObjects/mainPages/Recruitment/Vacancies";
import table from "../../support/pageObjects/objects/table";
import Sidebar from "../../support/pageObjects/subPages/sidebar";

const myLoginPage: LoginPage = new LoginPage();
const myAddVacancyPage: AddVacancyPage = new AddVacancyPage();
const mySideBar: Sidebar = new Sidebar();
const myVacanciesPage: Vacancies = new Vacancies();

describe("Scenario #2 - Add File To a Vacancy Attachments", () => {
  before("Creating New Vacancy Record", () => {
    // login to the system
    cy.visit("web/index.php/auth/login");
    myLoginPage.login("Admin", "admin123");

    // using a fixture that contain dummy data for new Vacancy Record
    cy.fixture("vacancyData").as("vacancyData");

    // Creating New Vacancy Record to ensure that records are not zero (UI)
    cy.get("@vacancyData").then((vacancyData: any) => {
      cy.intercept(
        "POST",
        "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/recruitment/vacancies"
      ).as("addVacancyAPI");
      mySideBar.getPage("Recruitment").click();
      myVacanciesPage.elements.VacanciesPageBTN().click();
      myVacanciesPage.elements.addVacancyBTN().click();
      myAddVacancyPage.addVacancy(vacancyData).then((vacancyId: number) => {
        vacancyData.vacancyId = vacancyId;
      });
    });
  });

  it("Add File To a Vacancy Attachments", () => {
    cy.get("@vacancyData").then((vacancyData: any) => {
      //opening vacancy edit form using the vacancyId
      myAddVacancyPage.visitVacancy(vacancyData.vacancyId);

      /* user clicks on 'Add' button in the Attachments section
            then The user uploads a file (pic.jpg) from the  vacancyData fixture
             and saves the form by clicking save button */

      myAddVacancyPage.addAttachment(vacancyData.path);

      // cheacking the file existence in table records using the fileName from fixtures
      const myAttachmentsTable: table =
        myAddVacancyPage.createAttachmentsTable();

      // construct the file name by splitting the path into array based on slash
      // and take the last elemnt
      const fileName = vacancyData.path.split("/").pop();
      myAttachmentsTable.checkValue(1, "File Name", fileName);
    });
  });
});
