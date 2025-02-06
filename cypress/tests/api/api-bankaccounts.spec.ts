// FLOW:
// In order to test the Bank Account, we need of course, the User and Bank Account API. 
// So, -- (1st) import them
// -- (2nd) Create a temporary type of TestBankAccountContext to store neccessary fields that we use
// Before each test, we need to seed data from db. And then store the data into the temporary variable to easier invoke
// That's why we need -- (3rd) use the cy.database to retrieve data
import {User, BankAccount} from "../../../src/models";
import { faker } from "@faker-js/faker";

const apiBankAccount = `${Cypress.env("apiUrl")}/bankAccounts`;

type TestBankAccountsContext = {
  allUsers?: User[];
  authenticatedUser?: User;
  bankAccounts?: BankAccount[];
}
describe("Bank Account API", () =>{

  let userContext: TestBankAccountsContext = {};

  beforeEach(() => {
    cy.task("db:seed");

    cy.database("filter", "users").then((user:User[]) => {
      userContext.authenticatedUser = user[0];
      userContext.allUsers = user;

      return cy.loginByApi(userContext.authenticatedUser.username);
    });

    cy.database("filter", "bankaccounts").then((bankAccount: BankAccount[]) => {
      userContext.bankAccounts = bankAccount;
    });
  });


  context("Get bank account", () => {
    it('should get list of bank accounts of a user', () => {
      const userId = userContext.authenticatedUser!.id;
      cy.request("GET", `${apiBankAccount}`).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.results[0].userId).to.eq(userId);
        console.log(response.body.results[0]);
      });
    });

    it('should get a specific bank account', () => {
      const userId = userContext.authenticatedUser!.id;
      const bankAccountId = userContext.bankAccounts![0].id;
      cy.request("GET", `${apiBankAccount}/${bankAccountId}`).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.account.userId).to.eq(userId);
        console.log(response.body);
        console.log(response.body.account);
        console.log(response.body.account.userId);
      });
    });
  });

  context("Create bank account", () => {
    it('should create a bank account', () => {
      const userId = userContext.authenticatedUser!.id;

      cy.request("POST", `${apiBankAccount}`, {
        bankName: `${faker.company.companyName()} Bank`,
        accountNumber: faker.finance.account(10),
        routingNumber: faker.finance.account(9),
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.account.id).to.be.a("string");
        expect(response.body.account.userId).to.eq(userId);
        console.log(response.body.account);
      })
    });
  });

  context('Delete bank account', () => {
    it('should delete a bank account successfully', () => {
      const bankAccountId = userContext.bankAccounts![0].id;
      cy.request("DELETE", `${apiBankAccount}/${bankAccountId}`).then((response) => {
        expect(response.status).to.eq(200);
      })
    });
  });
});