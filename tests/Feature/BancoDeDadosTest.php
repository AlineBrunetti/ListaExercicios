<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Produto;
use App\Models\Cliente;
use App\Models\Pedido;

class BancoDeDadosTest extends TestCase
{
    use RefreshDatabase; // Necessário para o Exercício 26

    // Exercício 26: Banco de dados com RefreshDatabase
    public function test_produto_criado_esta_no_banco()
    {
        $produto = Produto::factory()->create([
            'nome' => 'Bolo Teste DB',
            'preco' => 50.00
        ]);

        $this->assertDatabaseHas('produtos', [
            'nome' => 'Bolo Teste DB',
            'preco' => 50.00
        ]);
    }

    // Exercício 27: Cadastro via POST e assertRedirect
    public function test_cadastro_de_cliente_via_post()
    {
        $dados = [
            'nome' => 'Maria Souza',
            'contato' => '22999999999',
            'endereco' => 'Rua B, 45'
        ];

        $response = $this->post('/clientes', $dados);
        $response->assertRedirect('/clientes');

        $this->assertDatabaseHas('clientes', ['nome' => 'Maria Souza']);
    }

    // Exercício 28: Validação de dados (assertSessionHasErrors)
    public function test_validacao_produto_sem_nome()
    {
        $dados = [
            // 'nome' => '',
            'categoria' => 'Doces',
            'preco' => 10.00,
            'estoque' => 5,
            'estoque_minimo' => 1
        ];

        $response = $this->post('/produtos', $dados);
        $response->assertSessionHasErrors(['nome']);
    }

    // Exercício 28 (continuação)
    public function test_validacao_produto_com_preco_invalido()
    {
        $dados = [
            'nome' => 'Bolo de Morango',
            'categoria' => 'Doces',
            'preco' => 'preco_invalido', // Texto em vez de número
            'estoque' => 5,
            'estoque_minimo' => 1
        ];

        $response = $this->post('/produtos', $dados);
        $response->assertSessionHasErrors(['preco']);
    }

    // Exercício 29: Atualização e exclusão
    public function test_atualizacao_de_produto()
    {
        $produto = Produto::factory()->create([
            'preco' => 20.00
        ]);

        $response = $this->put("/produtos/{$produto->id}", [
            'nome' => $produto->nome,
            'categoria' => $produto->categoria,
            'preco' => 30.00, // Preço atualizado
            'estoque' => $produto->estoque,
            'estoque_minimo' => $produto->estoque_minimo
        ]);

        $this->assertDatabaseHas('produtos', [
            'id' => $produto->id,
            'preco' => 30.00
        ]);
    }

    // Exercício 29 (continuação)
    public function test_exclusao_de_cliente()
    {
        $cliente = Cliente::factory()->create();

        $response = $this->delete("/clientes/{$cliente->id}");

        $this->assertDatabaseMissing('clientes', [
            'id' => $cliente->id
        ]);
    }

    // Exercício 30: Baixa de estoque
    public function test_baixa_de_estoque_apos_pedido()
    {
        $produto = Produto::factory()->create(['estoque' => 10]);
        $cliente = Cliente::factory()->create();

        $response = $this->post('/pedidos', [
            'cliente_id' => $cliente->id,
            'produto_id' => $produto->id,
            'quantidade' => 3
        ]);

        // Recarrega do banco
        $produto->refresh();

        $this->assertEquals(7, $produto->estoque);
    }

    // Exercício 30 (continuação)
    public function test_erro_ao_pedir_mais_que_estoque()
    {
        $produto = Produto::factory()->create(['estoque' => 10]);
        $cliente = Cliente::factory()->create();

        $response = $this->post('/pedidos', [
            'cliente_id' => $cliente->id,
            'produto_id' => $produto->id,
            'quantidade' => 15 // Maior que 10
        ]);

        $response->assertSessionHasErrors(['quantidade']); // Ou nome do erro customizado
        
        $produto->refresh();
        $this->assertEquals(10, $produto->estoque); // Confirma que não abaixou
        $this->assertDatabaseCount('pedidos', 0); // Confirma que pedido não foi criado
    }
}
