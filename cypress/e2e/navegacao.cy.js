describe('Navegação pelo Menu', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Visita a página de Produtos', () => {
    cy.contains('Produtos').click();
    cy.url().should('include', '/produtos');
  });

  it('Visita a página de Clientes', () => {
    cy.contains('Clientes').click();
    cy.url().should('include', '/clientes');
  });

  it('Visita a página de Pedidos', () => {
    cy.contains('Pedidos').click();
    cy.url().should('include', '/pedidos');
  });

  it('Visita a página de Fretes', () => {
    cy.contains('Fretes').click();
    cy.url().should('include', '/fretes');
  });
});
