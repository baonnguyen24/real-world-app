import { User, Contact } from "../../../src/models";

const apiContacts = `${Cypress.env("apiUrl")}/contacts`;

type contactContext = {
  allUser? : User[];
  userAuthenticated? : User;
  contact? : Contact;
}

describe("Contacts API", function () {

  let ctx : contactContext = {};

  beforeEach(() => {
    cy.task("db:seed");

    cy.database("filter", "users").then((users : User[]) => {
      ctx.userAuthenticated = users[0];
      ctx.allUser = users;

      return cy.loginByApi(ctx.userAuthenticated.username);
    });

    cy.database("find", "contacts").then((contact: Contact) => {
      ctx.contact = contact;
    })
  
  });

  context("GET /contacts/:username", function () {
    it("gets a list of contacts by username", function () {
      const username = ctx.userAuthenticated!.username;

      cy.request("GET", `${apiContacts}/${username}`).then((response) => {
        expect(response.status).to.be.eq(200);
        expect(response.body.contacts[0]).to.have.property("userId");
      }); 
    });
  });

  context("POST /contacts", function () {
    it("creates a new contact", function () {
      const userId = ctx.userAuthenticated!.id;

      const contactUserId = ctx.contact!.id; // This line is just used for logging the output to console later
      
      cy.request("POST", `${apiContacts}`, {
        contactUserId : contactUserId,
      }).then((response) => {
        console.log("contactUserID: ", contactUserId);
        expect(response.status).to.be.eq(200);
        expect(response.body.contact.id).to.be.a("string");
        expect(response.body.contact.userId).to.be.eq(userId);
        console.log("UserID: ", userId);
      })
    });

    it("errors when invalid contactUserId", function () {
      cy.request({
        method: "POST", 
        url: `${apiContacts}`, 
        failOnStatusCode: false,
        body: { contactUserId: "1234"}
      }).then((response) => {
        expect(response.status).to.be.eq(422);
        expect(response.body.errors).to.be.an("array").that.has.length(1);
      });
    });
  });

  context("DELETE /contacts/:contactId", function () {
    it("deletes a contact", function () {
      cy.request("DELETE", `${apiContacts}/${ctx.contact!.id}`).then((response) => {
        expect(response.status).to.be.eq(200);
      })
    });
  });
});
