describe('Pedidos e Fluxos', () => {
  // Exercício 14 e 15: Fixtures e Commands customizados
  it('Usa fixtures e commands customizados', () => {
    cy.fixture('produto').then((produtoData) => {
      cy.criarProduto(produtoData);
    });

    cy.fixture('cliente').then((clienteData) => {
      cy.criarCliente(clienteData);
    });
  });

  // Exercício 16: Paginação
  it('Paginação', () => {
    // Presume que o backend tem paginação configurada para um número X, e criamos registros suficientes.
    // Aqui usamos um loop simbólico (em um cenário real, você rodaria a factory do Laravel via task para popular dados)
    /*
    for(let i=0; i<15; i++) {
        cy.criarProduto({ nome: `Produto ${i}`, categoria: 'Doces', preco: '10', estoque: '10', estoque_minimo: '2'});
    }
    */
    
    cy.visit('/produtos');
    // Verifica botão de próxima
    cy.get('.pagination').contains('Próxima', { matchCase: false }).click();
    
    // Valida que url mudou (normalmente adiciona ?page=2)
    cy.url().should('include', 'page=2');
    
    // Verifica botão de anterior
    cy.get('.pagination').contains('Anterior', { matchCase: false }).click();
    cy.url().should('include', '/produtos'); // Pode ser page=1 ou ausência de query string
  });

  // Exercício 17: Fluxo completo de pedido
  it('Fluxo completo de pedido', () => {
    // 1. Setup
    const qtdPedido = '2';
    
    cy.fixture('produto').then((produto) => {
      cy.criarProduto(produto);
    });
    cy.fixture('cliente').then((cliente) => {
      cy.criarCliente(cliente);
    });

    // 2. Lê estoque inicial
    cy.visit('/produtos');
    // Pegando o estoque da linha do "Brigadeiro" (criado via fixture)
    let estoqueInicial = 0;
    cy.contains('td', 'Brigadeiro').siblings().eq(3).invoke('text').then((texto) => {
      estoqueInicial = parseInt(texto);
    });

    // 3. Criar pedido
    cy.visit('/pedidos/create');
    cy.get('select[name="cliente_id"]').select('João da Silva'); // Criado via fixture
    cy.get('select[name="produto_id"]').select('Brigadeiro'); // Criado via fixture
    cy.get('input[name="quantidade"]').type(qtdPedido);
    cy.get('button[type="submit"]').click();

    // 4. Validar status do pedido
    cy.contains('João da Silva')
      .parents('tr')
      .should('contain', 'Pendente'); // Ajuste o status inicial

    // 5. Validar estoque descontado
    cy.visit('/produtos');
    cy.contains('td', 'Brigadeiro').siblings().eq(3).invoke('text').then((texto) => {
      const estoqueFinal = parseInt(texto);
      expect(estoqueFinal).to.equal(estoqueInicial - parseInt(qtdPedido));
    });
  });

  // Exercício 18: Estoque insuficiente
  it('Estoque insuficiente', () => {
    cy.visit('/pedidos/create');
    cy.get('select[name="cliente_id"]').select('João da Silva'); 
    cy.get('select[name="produto_id"]').select('Brigadeiro'); // Produto da fixture (Estoque: 100 - 2 = 98)
    cy.get('input[name="quantidade"]').type('200'); // Maior que estoque
    cy.get('button[type="submit"]').click();

    // Validação
    cy.contains('Estoque insuficiente', { matchCase: false }).should('exist');
  });

  // Exercício 19: Fluxo de frete
  it('Fluxo de frete', () => {
    // Precisa ter um pedido criado
    cy.visit('/fretes/create');
    cy.get('select[name="pedido_id"]').select('1'); // Exemplo
    cy.get('input[name="endereco"]').type('Rua das Entregas, 99');
    cy.get('input[name="taxa"]').type('15.50');
    cy.get('input[name="data_prevista"]').type('2024-12-31');
    cy.get('input[name="rastreio"]').type('BR123456789');
    cy.get('button[type="submit"]').click();

    // Atualiza status
    cy.visit('/fretes');
    cy.contains('BR123456789').parents('tr').find('a').contains('Atualizar').click(); // Exemplo de botão
    cy.get('select[name="status"]').select('Entregue');
    cy.get('button[type="submit"]').click();
    
    // Valida
    cy.contains('BR123456789').parents('tr').should('contain', 'Entregue');
  });

  // Exercício 20: Interceptação e teste ponta a ponta
  it('Interceptação e teste ponta a ponta E2E', () => {
    // Reseta banco de dados usando a task configurada no cypress.config.js
    cy.task('resetDatabase');
    
    // Setup - criar dependencias
    cy.fixture('produto').then(p => cy.criarProduto(p));
    cy.fixture('cliente').then(c => cy.criarCliente(c));

    // Interceptar POST de pedido
    cy.intercept('POST', '/pedidos').as('criarPedido');

    // Executar
    cy.visit('/pedidos/create');
    cy.get('select[name="cliente_id"]').select('João da Silva');
    cy.get('select[name="produto_id"]').select('Brigadeiro');
    cy.get('input[name="quantidade"]').type('2');
    cy.get('button[type="submit"]').click();

    // Validar status HTTP
    cy.wait('@criarPedido').its('response.statusCode').should('be.oneOf', [200, 201, 302]); // Laravel costuma retornar 302 redirect após POST com sucesso
  });
});
