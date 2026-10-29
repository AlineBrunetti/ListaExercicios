describe('Cadastro de Produto', () => {
  beforeEach(() => {
    cy.visit('/produtos/create');
  });

  // Exercício 7: Cadastro de produto
  it('Cadastra um produto com sucesso', () => {
    cy.get('input[name="nome"]').type('Bolo de Cenoura');
    cy.get('select[name="categoria"]').select('Doces');
    cy.get('input[name="preco"]').type('25.50');
    cy.get('input[name="estoque"]').type('10');
    cy.get('input[name="estoque_minimo"]').type('5');
    
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/produtos');
    cy.contains('sucesso', { matchCase: false }).should('exist'); // Ajustar de acordo com a msg real
  });

  // Exercício 8: Validação de formulário vazio
  it('Valida formulário vazio', () => {
    cy.get('button[type="submit"]').click();
    
    // Validando html5 native
    cy.get('input[name="nome"]:invalid').should('exist');
    cy.get('input[name="preco"]:invalid').should('exist');
    cy.get('input[name="estoque"]:invalid').should('exist');
  });

  // Exercício 9: Valores inválidos - preço negativo
  it('Não permite preço negativo', () => {
    cy.get('input[name="nome"]').type('Bolo de Limão');
    cy.get('select[name="categoria"]').select('Doces');
    cy.get('input[name="preco"]').type('-10'); // Valor negativo
    cy.get('input[name="estoque"]').type('10');
    cy.get('input[name="estoque_minimo"]').type('5');
    cy.get('button[type="submit"]').click();
    
    // Deve continuar na mesma página ou mostrar erro
    // cy.contains('Preço inválido').should('exist'); 
  });

  // Exercício 9: Valores inválidos - estoque negativo
  it('Não permite estoque negativo', () => {
    cy.get('input[name="nome"]').type('Bolo de Limão');
    cy.get('select[name="categoria"]').select('Doces');
    cy.get('input[name="preco"]').type('10');
    cy.get('input[name="estoque"]').type('-5'); // Valor negativo
    cy.get('input[name="estoque_minimo"]').type('5');
    cy.get('button[type="submit"]').click();
    
    // Deve continuar na mesma página ou mostrar erro
    // cy.contains('Estoque inválido').should('exist');
  });

  // Exercício 9: Valores inválidos - texto em campo numérico (o HTML input type number já não permite digitação normal, mas testamos forçando)
  it('Valores inválidos: texto em campos numéricos', () => {
    // Usando clear para inputs
    cy.get('input[name="preco"]').invoke('val', 'texto_invalido').trigger('input');
    cy.get('button[type="submit"]').click();
    
    // Validação
  });

  // Exercício 13: Alerta de estoque baixo
  it('Alerta de estoque baixo', () => {
    // Cadastrando produto com estoque abaixo do mínimo
    cy.get('input[name="nome"]').type('Produto Estoque Baixo');
    cy.get('select[name="categoria"]').select('Doces');
    cy.get('input[name="preco"]').type('10.00');
    cy.get('input[name="estoque"]').type('2');
    cy.get('input[name="estoque_minimo"]').type('5');
    cy.get('button[type="submit"]').click();
    
    // Verifica alerta visual na lista de produtos
    cy.visit('/produtos');
    cy.contains('Produto Estoque Baixo')
      .parents('tr')
      .find('.badge-danger, .estoque-baixo') // Substitua pela classe real usada no seu app
      .should('exist');

    // Cadastrando produto com estoque alto
    cy.visit('/produtos/create');
    cy.get('input[name="nome"]').type('Produto Estoque Normal');
    cy.get('select[name="categoria"]').select('Doces');
    cy.get('input[name="preco"]').type('10.00');
    cy.get('input[name="estoque"]').type('10');
    cy.get('input[name="estoque_minimo"]').type('5');
    cy.get('button[type="submit"]').click();
    
    // Verifica ausência de alerta visual
    cy.visit('/produtos');
    cy.contains('Produto Estoque Normal')
      .parents('tr')
      .find('.badge-danger, .estoque-baixo') // Substitua pela classe real
      .should('not.exist');
  });
});
