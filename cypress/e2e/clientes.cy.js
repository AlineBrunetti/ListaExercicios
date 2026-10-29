describe('CRUD de Clientes', () => {
  it('Cria, edita e exclui um cliente', () => {
    cy.visit('/clientes');
    
    // Create
    cy.contains('Novo Cliente').click();
    cy.get('input[name="nome"]').type('Cliente Teste');
    cy.get('input[name="contato"]').type('11999999999');
    cy.get('input[name="endereco"]').type('Rua Teste, 123');
    cy.get('button[type="submit"]').click();
    
    // Edit
    cy.contains('Cliente Teste').parents('tr').find('a').contains('Editar').click();
    cy.get('input[name="nome"]').clear().type('Cliente Teste Editado');
    cy.get('button[type="submit"]').click();
    
    // Delete
    cy.on('window:confirm', () => true);
    cy.contains('Cliente Teste Editado').parents('tr').find('button').contains('Excluir').click();
    
    cy.contains('Cliente Teste Editado').should('not.exist');
  });
});
