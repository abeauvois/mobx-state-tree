/// <reference types="Cypress" />

context("Navigation", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/")
        cy.get(".App-menu")
            .contains("Your cart")
            .click()
    })

    it("cy.go() - go back or forward in the browser's history", () => {
        // https://on.cypress.io/go

        cy.location("pathname").should("include", "cart")

        cy.go("back")
        cy.location("pathname").should("not.include", "navigation")
    })
})
