// Servidor Node.js para gerenciar as operações com o MySQL
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createConnection, setupDatabase } = require('./mysql-config');

// Inicializa o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Configura o banco de dados ao iniciar o servidor
setupDatabase().then(success => {
  if (!success) {
    console.error('Falha ao configurar o banco de dados. O servidor pode não funcionar corretamente.');
  }
});

// Rota para adicionar um novo convidado
app.post('/api/guests', async (req, res) => {
  try {
    const guest = req.body;
    
    // Valida os dados do convidado
    if (!guest.name || !guest.phone || !guest.attendance) {
      return res.status(400).json({ error: 'Dados incompletos. Nome, telefone e confirmação são obrigatórios.' });
    }
    
    // Cria uma conexão com o banco de dados
    const connection = await createConnection();
    
    // Insere o convidado no banco de dados
    const [result] = await connection.execute(
      'INSERT INTO guests (name, phone, attendance, message, date) VALUES (?, ?, ?, ?, ?)',
      [guest.name, guest.phone, guest.attendance, guest.message || '', new Date().toISOString()]
    );
    
    // Fecha a conexão
    await connection.end();
    
    // Retorna o ID do convidado inserido
    res.status(201).json({ id: result.insertId, ...guest });
  } catch (error) {
    console.error('Erro ao adicionar convidado:', error);
    res.status(500).json({ error: 'Erro ao adicionar convidado' });
  }
});

// Rota para obter todos os convidados
app.get('/api/guests', async (req, res) => {
  try {
    // Cria uma conexão com o banco de dados
    const connection = await createConnection();
    
    // Obtém todos os convidados do banco de dados
    const [rows] = await connection.execute('SELECT * FROM guests');
    
    // Fecha a conexão
    await connection.end();
    
    // Retorna os convidados
    res.json(rows);
  } catch (error) {
    console.error('Erro ao obter convidados:', error);
    res.status(500).json({ error: 'Erro ao obter convidados' });
  }
});

// Rota para exportar os dados como CSV
app.get('/api/guests/export', async (req, res) => {
  try {
    // Cria uma conexão com o banco de dados
    const connection = await createConnection();
    
    // Obtém todos os convidados do banco de dados
    const [rows] = await connection.execute('SELECT * FROM guests');
    
    // Fecha a conexão
    await connection.end();
    
    // Verifica se há convidados
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum convidado confirmado ainda.' });
    }
    
    // Cabeçalho do CSV
    let csv = 'Nome,Telefone,Confirmação,Mensagem,Data\n';
    
    // Adiciona cada convidado ao CSV
    rows.forEach(guest => {
      csv += `"${guest.name}","${guest.phone}","${guest.attendance}","${guest.message || ''}","${guest.date}"\n`;
    });
    
    // Define o tipo de conteúdo como CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=confirmacoes_aniversario.csv');
    
    // Retorna o CSV
    res.send(csv);
  } catch (error) {
    console.error('Erro ao exportar convidados:', error);
    res.status(500).json({ error: 'Erro ao exportar convidados' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT}`);
});