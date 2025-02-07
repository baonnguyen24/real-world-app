import { User } from "../../../src/models";

const apiBankTransfer = `${Cypress.env("apiUrl")}/bankTransfers`;

type TestBankTransferContext = {
  authenticatedUser?: User;
}

describe("Bank Transfer API", function () {

  let userContext: TestBankTransferContext = {};
  
  beforeEach(() => {
    cy.task("db:seed");
  
    cy.database("find", "users").then((user:User) => {
      userContext.authenticatedUser = user;
  
      return cy.loginByApi(userContext.authenticatedUser.username);
    });
  });
  
  // 1st. Get the userID from the user that logged in
  // 2nd. Call API to get all the transactions of the user
  // 3rd. Get any transaction -> get userId and then compare
  context("GET /bankTransfer", function () {
    it("gets a list of bank transfers for user", function () {
      const userId = userContext.authenticatedUser!.id;
      cy.request("GET", `${apiBankTransfer}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.transfers[0].userId).to.eq(userId);
        console.log(response.body.transfers);
        console.log(response.body.transfers[0]);
      });
    });
  });
});
