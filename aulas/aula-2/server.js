const http = require('http');
const fs = require('fs');
const path = require('path');
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

const publicDir = path.join(__dirname, 'public');
const jogadores = new Map();
let proximoId = 1;

function obterTipoDeConteudo(caminho) {
  const extensao = path.extname(caminho);

  if (extensao === '.html') {
    return 'text/html; charset=utf-8';
  }

  if (extensao === '.js') {
    return 'application/javascript; charset=utf-8';
  }

  if (extensao === '.css') {
    return 'text/css; charset=utf-8';
  }

  return 'text/plain; charset=utf-8';
}

function responderArquivo(req, res) {
  const caminhoRequisitado = req.url === '/' ? '/index.html' : req.url;
  const caminhoSeguro = path.normalize(caminhoRequisitado).replace(/^(\.\.[/\\])+/, '');
  const caminhoCompleto = path.join(publicDir, caminhoSeguro);

  fs.readFile(caminhoCompleto, (erro, conteudo) => {
    if (erro) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Arquivo nao encontrado.');
      return;
    }

    res.writeHead(200, {
      'Content-Type': obterTipoDeConteudo(caminhoCompleto)
    });
    res.end(conteudo);
  });
}

const servidorHttp = http.createServer(responderArquivo);
const servidorWebSocket = new WebSocket.Server({ server: servidorHttp });

function enviar(ws, objeto) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(objeto));
  }
}

function enviarParaTodos(objeto) {
  const mensagem = JSON.stringify(objeto);

  for (const cliente of servidorWebSocket.clients) {
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
  for (const cliente of servidorWebSocket.clients) {
    enviarEstado(cliente);
  }
}

function encontrarPosicaoLivre() {
  // TODO: percorrer a arena e retornar uma posicao vazia para o novo jogador
  return null;
}

function entrarNoJogo(ws, nomeInformado) {
  // TODO:
  // 1. impedir entrada duplicada
  // 2. escolher posicao livre
  // 3. criar e registrar o jogador
  // 4. avisar os clientes
  // 5. enviar o novo estado para todos
  enviar(ws, {
    type: 'system',
    text: `TODO: implementar entrada de ${nomeInformado || 'jogador'}.`
  });
}

function moverJogador(ws, direcaoInformada) {
  // TODO:
  // 1. localizar o jogador
  // 2. validar a direcao
  // 3. impedir saida da arena
  // 4. impedir colisao com outro jogador
  // 5. atualizar o estado e retransmitir
  enviar(ws, {
    type: 'system',
    text: `TODO: implementar movimento para ${direcaoInformada}.`
  });
}

function atacar(ws) {
  // TODO:
  // 1. encontrar jogadores adjacentes
  // 2. aplicar dano
  // 3. tratar derrota e reposicionamento
  // 4. reenviar event e state
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

servidorWebSocket.on('connection', (ws) => {
  console.log('Nova conexao recebida.');

  ws.on('message', (dados) => {
    tratarMensagem(ws, dados);
  });

  ws.on('close', () => {
    // TODO:
    // 1. remover o jogador do estado
    // 2. avisar os demais clientes
    // 3. enviar o novo snapshot da partida
  });
});

servidorHttp.listen(PORTA, () => {
  console.log(`Servidor HTTP executando em http://localhost:${PORTA}`);
});
