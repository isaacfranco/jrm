const WebSocket = require('ws');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function iniciarCliente(nome) {
  const socket = new WebSocket('ws://localhost:8080');

  socket.on('open', () => {
    console.log('Conectado ao servidor.');
    console.log('Digite sua mensagem e pressione Enter.');
    console.log('Para sair, pressione Ctrl+C.');

    socket.send(
      JSON.stringify({
        type: 'join',
        name: nome
      })
    );
  });

  socket.on('message', (dados) => {
    let mensagem;

    try {
      mensagem = JSON.parse(dados.toString());
    } catch (erro) {
      console.log('[erro] Mensagem recebida em formato invalido.');
      return;
    }

    if (mensagem.type === 'system') {
      console.log(`[sistema] ${mensagem.text}`);
      return;
    }

    if (mensagem.type === 'chat') {
      console.log(`${mensagem.name}: ${mensagem.text}`);
    }
  });

  socket.on('close', () => {
    console.log('Conexao encerrada.');
    process.exit(0);
  });

  socket.on('error', () => {
    console.log('Erro ao conectar com o servidor.');
    process.exit(1);
  });

  rl.on('line', (linha) => {
    const texto = linha.trim();

    if (!texto) {
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.log('[erro] O cliente ainda nao esta conectado.');
      return;
    }

    socket.send(
      JSON.stringify({
        type: 'chat',
        text: texto
      })
    );
  });
}

rl.question('Digite seu nome: ', (nome) => {
  const nomeFinal = nome.trim() || 'Anonimo';
  iniciarCliente(nomeFinal);
});
