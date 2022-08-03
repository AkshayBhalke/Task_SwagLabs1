///<reference types="cypress"/>

describe("TS01-Task ", function () {
    let user;
    before(function () {
        cy.fixture('example').then ((values1) => {
            user = values1
        })
    })
    it("TC-01 Login The Page", function () {

        cy.visit("https://www.saucedemo.com/")
        cy.get("#user-name").type("standard_user")
        cy.get("#password").type("secret_sauce")
        cy.get("#login-button").click()
        cy.url().should('contain', "https://www.saucedemo.com/inventory.html")
    })

    it("TC-02 Add to cart & Checkout the product", function () {
        let price = []
        cy.visit("https://www.saucedemo.com/")
    //below used the userDefined Command ==> cypress/support/cpmmands.js
        cy.login()
        cy.get(".inventory_item_price").each(function (el) {
            //get all the price and store in array
            price.push(el.text())
        }).then(function () {
            let k = price.join("")
            price = k.split("$")
            let z = []
            price.forEach(function (el, index) {
                if (index > 0) {
                    z.push(Number(el))
                }
            })
            //sort for least price and take second least price
            z.sort(function (a, b) { return a - b });
            let least2 = "$"+z[1]
            return least2
        }).then(function(el){
            cy.get(".inventory_item").each(function(dv){
                if(dv.text().includes(el)){
                    cy.wrap(dv).find(".btn.btn_primary.btn_small.btn_inventory").click()
                    //assert the cart 
                   cy.get(".shopping_cart_badge").should('have.text',1)
                   .click()
                //assert the cart page
                   cy.url().should('contain',"https://www.saucedemo.com/cart.html")
                   cy.get('.inventory_item_price').should('have.text',el)
                   cy.get("#checkout").click()
                //    providing below user data from fixture file
                   cy.get("#first-name").type(user.fName)
                   cy.get("#last-name").type(user.lName)
                   cy.get("#postal-code").type(user.pin)
                   cy.get("#continue").click()
                   cy.get("#finish").click()
                //    assert at the end
                   cy.get('.pony_express').should("be.visible")
                   cy.get('.complete-header').should('be.visible')
                   cy.get('.complete-text').should('contain',"Your order has been dispatched, and will arrive just as fast as the pony can get there!")
                }
            })
        })
    })
})
