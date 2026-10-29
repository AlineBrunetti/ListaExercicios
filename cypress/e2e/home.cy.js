describe('Home Page', () => {
  it('Visits the homepage and checks for "Doce Gestão"', () => {
    cy.visit('/');
    cy.contains('Doce Gestão');
  });
});
