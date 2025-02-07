// check this file using TypeScript if available
// @ts-check

import { User, Comment } from "../../../src/models";
const apiComments = `${Cypress.env("apiUrl")}/comments`;

type TestCommentContext = {
  authenticatedUser? : User;
  transactionId? : string;
};

describe("Comments API", function () {

  let ctx : TestCommentContext = {};

  beforeEach(() => {
    cy.task("db:seed");

    cy.database("find", "users").then((user : User) => {
      ctx.authenticatedUser = user;

      return cy.loginByApi(ctx.authenticatedUser.username);
    })

    cy.database("find", "comments").then((comment : Comment) => {
      ctx.transactionId = comment.transactionId;
    }) 
  });
 
  context("GET /comments/:transactionId", function () {
    it("gets a list of comments for a transaction", function () {
      const transactionId = ctx.transactionId;
      cy.request("GET", `${apiComments}/${transactionId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.comments).to.be.an("array").that.has.length(1);
        console.log(response.body.comments);
      });
    });
  });

  context("POST /comments/:transactionId", function () {
    it("creates a new comment for a transaction", function () {
      const transactionId = ctx.transactionId;
      cy.request("POST", `${apiComments}/${transactionId}`, {
        content: "Test comment"
      }).then((response) => {
        expect(response.status).to.eq(200);
      })
    });
  });
});
