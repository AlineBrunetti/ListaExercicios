<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RotasTest extends TestCase
{
    // Exercício 22: Rota inicial com GET e assertStatus 200
    public function test_rota_inicial_responde_com_200(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    // Exercício 23: Rotas dos módulos (produtos, clientes, pedidos, fretes)
    public function test_rota_produtos_responde_com_200(): void
    {
        $response = $this->get('/produtos');
        $response->assertStatus(200);
    }

    public function test_rota_clientes_responde_com_200(): void
    {
        $response = $this->get('/clientes');
        $response->assertStatus(200);
    }

    public function test_rota_pedidos_responde_com_200(): void
    {
        $response = $this->get('/pedidos');
        $response->assertStatus(200);
    }

    public function test_rota_fretes_responde_com_200(): void
    {
        $response = $this->get('/fretes');
        $response->assertStatus(200);
    }

    // Exercício 24: Conteúdo da página (assertSee)
    public function test_listagem_de_produtos_exibe_texto_esperado(): void
    {
        $response = $this->get('/produtos');
        $response->assertSee('Produtos'); // Exemplo de texto na view
    }

    // Exercício 25: Rota inexistente (assertNotFound / 404)
    public function test_rota_inexistente_retorna_404(): void
    {
        $response = $this->get('/rota-que-nao-existe');
        $response->assertNotFound();
    }
}
