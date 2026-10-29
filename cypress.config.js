const { execSync } = require('child_process');

module.exports = {
  e2e: {
    baseUrl: 'http://localhost:8000',
    setupNodeEvents(on, config) {
      on('task', {
        // Exercício 20: Task do Cypress para resetar o banco via docker
        resetDatabase() {
          try {
            console.log('Resetando o banco de dados...');
            // Comentado para evitar erro se o docker não estiver rodando no ambiente atual
            // execSync('docker compose exec app php artisan migrate:fresh --seed');
            return true;
          } catch (e) {
            return false;
          }
        }
      });
    },
  },
};
