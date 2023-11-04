import AddEmployeePage from "../../support/pageObjects/mainPages/addEmployeePage";
import AddEntitlementsPage from "../../support/pageObjects/mainPages/Leave/Entitlements/AddEntitlementsPage";
import ApplyLeavePage from "../../support/pageObjects/mainPages/Leave/ApplyLeavePage";
import LoginPage from "../../support/pageObjects/mainPages/LoginPage";
import LeaveListPage from "../../support/pageObjects/mainPages/Leave/LeaveListPage";
import Sidebar from "../../support/pageObjects/subPages/sidebar";
import MyleavePage from "../../support/pageObjects/mainPages/Leave/MyLeavePage";
import table from "../../support/pageObjects/objects/table";

const myLoginPage: LoginPage = new LoginPage();
const myAddEmployeePage: AddEmployeePage = new AddEmployeePage()
const myAddEntitlementsPage: AddEntitlementsPage = new AddEntitlementsPage();
const myApplyLeavePage: ApplyLeavePage = new ApplyLeavePage();
const myLeaveListPage: LeaveListPage = new LeaveListPage();
const mySidebar: Sidebar = new Sidebar();
const MyLeavePage: MyleavePage = new MyleavePage();


describe('Scenario #1 - create and approve leave', () => {

    before('Create New Employee With Login Details',() => {

        // visiting home page and login as admain
        cy.visit("/");
        myLoginPage.login("Admin", "admin123");

        // using a fixture that contain dummy data for new emplyee
        cy.fixture('empData').as('empData');

        // Create a new Employee using empData
        cy.get('@empData').then((empData: any) => {
            myAddEmployeePage.addWithLoginViaAPI(empData).then(({userName,employee}:any) => {
                empData.empNumber = employee.empNumber;
                empData.username = userName;

                // adding entitlement to the new employee (API)
                myAddEntitlementsPage.addEntitlementViaAPI(empData);
            });
        })

        // admain logout
        myLoginPage.logout();
    })

    it('user login an apply for leave',() => {

        //using the new empployee data to login
        cy.get('@empData').then((empData: any) => {
            myLoginPage.login(empData.username, empData.password);
            cy.wait(2500);
            //  employee requests a leave day  (API)
            myApplyLeavePage.applyLeaveViaAPI(empData.leaveInfo).then(({id}: any) => {
                empData.leaveInfo.leaveId = id;
            })
            .then(() => {

                // emplyee logout from the system and admin login to the system to approve the req
                myLoginPage.logout();
                myLoginPage.login("Admin", "admin123");
                cy.wait(2000);

                // admin approves the leave request (API)
                myLeaveListPage.approveLeaveViaAPI(empData.leaveInfo.leaveId);
            })

            //admin logout from the system
            myLoginPage.logout();

            // employee login to the system to Open 'My Leave' page
            myLoginPage.login(empData.username, empData.password);
            cy.wait(2000);
            mySidebar.getPage('Leave').click();

            // cheack The leave existnce in the table records with status 'Scheduled'
            const myTable:table = MyLeavePage.createTable();
            myTable.checkValue(1,'Status','Scheduled')

        })

    })
})