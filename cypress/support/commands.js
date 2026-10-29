Cypress.Commands.add('criarProduto', (dados) => {
  cy.visit('/produtos/create');
  cy.get('input[name="nome"]').type(dados.nome);
  cy.get('select[name="categoria"]').select(dados.categoria);
  cy.get('input[name="preco"]').type(dados.preco);
  cy.get('input[name="estoque"]').type(dados.estoque);
  cy.get('input[name="estoque_minimo"]').type(dados.estoque_minimo);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('criarCliente', (dados) => {
  cy.visit('/clientes/create');
  cy.get('input[name="nome"]').type(dados.nome);
  cy.get('input[name="contato"]').type(dados.contato);
  cy.get('input[name="endereco"]').type(dados.endereco);
  cy.get('button[type="submit"]').click();
});
