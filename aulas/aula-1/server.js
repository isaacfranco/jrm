const WebSocket = require('ws');

const PORTA = 8080;
const LARGURA_ARENA = 5;
const ALTURA_ARENA = 5;
const VIDA_INICIAL = 3;

const DIRECOES = {
  north: { dx: 0, dy: -1 },
  south: { dx: 0, dy: 1 },
  west: { dx: -1, dy: 0 },
  east: { dx: 1, dy: 0 }
};

const servidor = new WebSocket.Server({ port: PORTA });
const jogadores = new Map();
let proximoId = 1;

function enviar(ws, objeto) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(objeto));
  }
}

function enviarParaTodos(objeto) {
  const mensagem = JSON.stringify(objeto);

  for (const cliente of servidor.clients) {
    if (cliente.readyState === WebSocket.OPEN) {
      cliente.send(mensagem);
    }
  }
}

function gerarEstado(youId = null) {
  return {
    type: 'state',
    width: LARGURA_ARENA,
    height: ALTURA_ARENA,
    youId,
    players: []
  };
}

function enviarEstado(ws) {
  const jogador = jogadores.get(ws);
  const youId = jogador ? jogador.id : null;
  enviar(ws, gerarEstado(youId));
}

function enviarEstadoParaTodos() {
  for (const cliente of servidor.clients) {
    enviarEstado(cliente);
  }
}

function encontrarPosicaoLivre() {
  // TODO: percorrer a arena e retornar a primeira posicao livre
  return null;
}

function entrarNoJogo(ws, nomeInformado) {
  // TODO:
  // 1. impedir entrada duplicada
  // 2. normalizar o nome
  // 3. escolher uma posicao inicial livre
  // 4. criar o objeto do jogador
  // 5. salvar no Map jogadores
  // 6. avisar os clientes e enviar o estado atualizado
  enviar(ws, {
    type: 'system',
    text: 'TODO: implementar entrada no jogo.'
  });
}

function moverJogador(ws, direcaoInformada) {
  // TODO:
  // 1. localizar o jogador da conexao
  // 2. validar a direcao informada
  // 3. calcular a nova posicao
  // 4. impedir saida da arena
  // 5. impedir movimento para celula ocupada
  // 6. atualizar a posicao e retransmitir o estado
  enviar(ws, {
    type: 'system',
    text: `TODO: implementar movimento para ${direcaoInformada}.`
  });
}

function atacar(ws) {
  // TODO:
  // 1. localizar o atacante
  // 2. encontrar jogadores adjacentes
  // 3. reduzir a vida do alvo escolhido
  // 4. tratar derrota e respawn, se desejar
  // 5. retransmitir evento e estado
  enviar(ws, {
    type: 'system',
    text: 'TODO: implementar ataque.'
  });
}

function tratarMensagem(ws, dados) {
  let mensagem;

  try {
    mensagem = JSON.parse(dados.toString());
  } catch (erro) {
    enviar(ws, {
      type: 'error',
      text: 'Mensagem invalida.'
    });
    return;
  }

  if (mensagem.type === 'join_game') {
    entrarNoJogo(ws, mensagem.name);
    return;
  }

  if (mensagem.type === 'move') {
    moverJogador(ws, mensagem.direction);
    return;
  }

  if (mensagem.type === 'attack') {
    atacar(ws);
    return;
  }

  if (mensagem.type === 'state') {
    enviarEstado(ws);
    return;
  }

  enviar(ws, {
    type: 'error',
    text: 'Tipo de mensagem desconhecido.'
  });
}

servidor.on('connection', (ws) => {
  console.log('Nova conexao recebida.');

  ws.on('message', (dados) => {
    tratarMensagem(ws, dados);
  });

  ws.on('close', () => {
    // TODO:
    // 1. remover o jogador do estado
    // 2. avisar os demais clientes
    // 3. reenviar o estado atualizado
  });
});

console.log(`Servidor da arena executando em ws://localhost:${PORTA}`);
