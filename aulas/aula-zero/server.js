const WebSocket = require('ws');

const servidor = new WebSocket.Server({ port: 8080 });
const nomes = new Map();

function enviarParaTodos(objeto) {
  const mensagem = JSON.stringify(objeto);

  for (const cliente of servidor.clients) {
    if (cliente.readyState === WebSocket.OPEN) {
      cliente.send(mensagem);
    }
  }
}

servidor.on('connection', (ws) => {
  console.log('Nova conexao recebida.');

  ws.on('message', (dados) => {
    let mensagem;

    try {
      mensagem = JSON.parse(dados.toString());
    } catch (erro) {
      ws.send(
        JSON.stringify({
          type: 'system',
          text: 'Mensagem invalida.'
        })
      );
      return;
    }

    if (mensagem.type === 'join') {
      const nome = (mensagem.name || '').trim() || 'Anonimo';
      nomes.set(ws, nome);

      enviarParaTodos({
        type: 'system',
        text: `${nome} entrou no chat.`
      });

      return;
    }

    if (mensagem.type === 'chat') {
      const nome = nomes.get(ws) || 'Anonimo';
      const texto = (mensagem.text || '').trim();

      if (!texto) {
        return;
      }

      enviarParaTodos({
        type: 'chat',
        name: nome,
        text: texto
      });
    }
  });

  ws.on('close', () => {
    const nome = nomes.get(ws);
    nomes.delete(ws);

    if (nome) {
      enviarParaTodos({
        type: 'system',
        text: `${nome} saiu do chat.`
      });
    }
  });
});

console.log('Servidor WebSocket executando em ws://localhost:8080');
