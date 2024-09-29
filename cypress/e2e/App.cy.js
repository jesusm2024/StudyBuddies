/* globals cy */
    
describe ('Test Launch', () => {

    it ('launches', () => {
      cy.visit ('/');
    });
  
  });

describe ('Test Content', () => {

    it ('login with Google button exists and has text', () => {
      cy.visit ('/');
      cy.get('[class=btn-text]').should('contain', 'Login');
    });

});

/*describe ('Test Interaction', () => {

    it('shows popup when Interested button is clicked', () => {
        cy.visit ('/suggestions');
        cy.get('[id=interestedButton]').click();
        cy.get('[data-cy=newMatch]').should('contain' ,'Study Buddy');
    });
});*/