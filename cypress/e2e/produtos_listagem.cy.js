describe('Listagem de Produtos', () => {
  beforeEach(() => {
    cy.visit('/produtos');
  });

  // Exercício 4: Listagem de produtos. Tabela com ao menos uma linha e cabeçalhos.
  it('Verifica a tabela e seus cabeçalhos', () => {
    // Usando seletores normais
    cy.get('table').should('exist');
    cy.get('table tbody tr').should('have.length.at.least', 1);
    
    cy.get('table thead th').contains('Nome');
    cy.get('table thead th').contains('Categoria');
    cy.get('table thead th').contains('Preço');
    cy.get('table thead th').contains('Estoque');
  });

  // Exercício 5: Formulário de novo produto e presença de campos.
  it('Abre o formulário de novo produto e valida os campos', () => {
    cy.contains('Criar Produto').click();
    cy.url().should('include', '/produtos/create');
    
    cy.get('input[name="nome"]').should('exist');
    cy.get('select[name="categoria"]').should('exist');
    cy.get('input[name="preco"]').should('exist');
    cy.get('input[name="estoque"]').should('exist');
    cy.get('input[name="estoque_minimo"]').should('exist');
  });

  // Exercício 6: Usar atributos data-cy nas views
  it('Verifica a tabela usando data-cy (Exercício 6)', () => {
    // Exemplo de como seria se houvesse atributos data-cy na tabela
    // cy.get('[data-cy="tabela-produtos"]').should('exist');
    // cy.get('[data-cy="tabela-produtos"] tbody tr').should('have.length.at.least', 1);
  });
});
