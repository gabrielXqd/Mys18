// Configuração do MySQL
const mysql = require('mysql2/promise');

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',      // Altere para seu usuário do MySQL se necessário
  password: '',      // Altere para sua senha do MySQL
  database: 'aniversario_db'
};

// Função para criar a conexão com o banco de dados
async function createConnection() {
  try {
    // Cria uma conexão com o MySQL
    const connection = await mysql.createConnection(dbConfig);
    
    // Verifica se a conexão foi estabelecida
    console.log('Conexão com o MySQL estabelecida com sucesso!');
    
    return connection;
  } catch (error) {
    console.error('Erro ao conectar com o MySQL:', error);
    throw error;
  }
}

// Função para criar o banco de dados e a tabela se não existirem
async function setupDatabase() {
  try {
    // Cria uma conexão temporária sem especificar o banco de dados
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    // Cria o banco de dados se não existir
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    
    // Fecha a conexão temporária
    await tempConnection.end();
    
    // Cria uma conexão com o banco de dados criado
    const connection = await createConnection();
    
    // Cria a tabela de convidados se não existir
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS guests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        attendance VARCHAR(10) NOT NULL,
        message TEXT,
        date DATETIME NOT NULL
      )
    `);
    
    console.log('Banco de dados e tabela configurados com sucesso!');
    
    // Fecha a conexão
    await connection.end();
    
    return true;
  } catch (error) {
    console.error('Erro ao configurar o banco de dados:', error);
    return false;
  }
}

// Exporta as funções
module.exports = {
  createConnection,
  setupDatabase,
  dbConfig
};