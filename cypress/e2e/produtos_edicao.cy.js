describe('Edição e Exclusão de Produtos', () => {
  beforeEach(() => {
    cy.visit('/produtos');
  });

  // Exercício 10: Edição de produto
  it('Edita um produto existente', () => {
    // Presume-se um botão de edição na primeira linha
    cy.get('table tbody tr').first().find('a').contains('Editar').click();
    
    cy.get('input[name="preco"]').clear().type('30.00');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/produtos');
    cy.contains('30.00'); // Ou mensagem de sucesso
  });

  // Exercício 11: Exclusão de produto
  it('Exclui um produto', () => {
    // Intercepta e confirma o alert do navegador (Cypress faz isso por padrão)
    cy.on('window:confirm', () => true);
    
    // Cadastrar primeiro para ter um alvo específico
    cy.visit('/produtos/create');
    cy.get('input[name="nome"]').type('Produto para Excluir');
    cy.get('select[name="categoria"]').select('Doces');
    cy.get('input[name="preco"]').type('25.50');
    cy.get('input[name="estoque"]').type('10');
    cy.get('input[name="estoque_minimo"]').type('5');
    cy.get('button[type="submit"]').click();

    // Excluir
    cy.contains('Produto para Excluir').parents('tr').find('button').contains('Excluir').click();
    
    // Validação
    cy.contains('Produto para Excluir').should('not.exist');
  });
});
