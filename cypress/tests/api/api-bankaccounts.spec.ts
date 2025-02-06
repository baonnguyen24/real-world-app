// FLOW:
// In order to test the Bank Account, we need of course, the User and Bank Account API. 
// So, -- (1st) import them
// -- (2nd) Create a temporary type of TestBankAccountContext to store neccessary fields that we use
// Before each test, we need to seed data from db. And then store the data into the temporary variable to easier invoke
// That's why we need -- (3rd) use the cy.database to retrieve data
import {User, BankAccount} from "../../../src/models";

const apiBankAccount = `${Cypress.env("apiUrl")}/bankAccounts`;

type TestBankAccountsContext = {
  allUsers?: User[];
  authenticatedUser?: User;
  bankAccounts?: BankAccount[];
}
describe('Bank Account API', () =>{

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


  context('Get bank account', () => {
    it('should get list of bank accounts of a user', () => {
      const { id: userId } = userContext.authenticatedUser!;
      cy.request('GET', `${apiBankAccount}`).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.results[0].userId).to.eq(userId);
        console.log(response.body.results[0]);
      });
    });

    it('should get a specific bank account', () => {

    })

    it('should return a code if a bank account doesnt exist', () => {

    });
  });

  context('Create bank account', () => {
    it('should create a bank account', () => {

    });

    it('should not create a bank account with not enough info', () => {

    });
  });

  context('Delete bank account', () => {
    it('should delete a bank account successfully', () => {

    });
  });
});