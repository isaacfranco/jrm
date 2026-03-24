const WebSocket = require('ws');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let ultimoEstado = null;
let meuId = null;
let socket = null;

function mostrarAjuda() {
  console.log('Comandos disponiveis:');
  console.log('/mover norte');
  console.log('/mover sul');
  console.log('/mover leste');
  console.log('/mover oeste');
  console.log('/atacar');
  console.log('/estado');
  console.log('/mapa');
  console.log('/ajuda');
  console.log('/sair');
}

function renderizarMapa(estado) {
  const grade = Array.from({ length: estado.height }, () => Array.from({ length: estado.width }, () => '.'));

  for (const jogador of estado.players) {
    const simbolo = jogador.name.charAt(0).toUpperCase() || '?';
    grade[jogador.y][jogador.x] = simbolo;
  }

  console.log(`Mapa ${estado.width}x${estado.height}`);

  for (const linha of grade) {
    console.log(linha.join(' '));
  }
}

function enviarMensagem(objeto) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.log('[erro] O cliente ainda nao esta conectado.');
    return;
  }

  socket.send(JSON.stringify(objeto));
}

function tratarComando(linha) {
  const texto = linha.trim();

  if (!texto) {
    return;
  }

  if (texto === '/ajuda') {
    mostrarAjuda();
    return;
  }

  if (texto === '/sair') {
    socket.close();
    return;
  }

  if (texto === '/mapa') {
    if (!ultimoEstado) {
      console.log('[erro] Nenhum estado foi recebido ainda.');
      return;
    }

    renderizarMapa(ultimoEstado);
    return;
  }

  if (texto === '/estado') {
    // TODO: opcionalmente mostrar o ultimo estado local e pedir um novo snapshot ao servidor
    enviarMensagem({ type: 'state' });
    return;
  }

  if (texto === '/atacar') {
    enviarMensagem({ type: 'attack' });
    return;
  }

  if (texto.startsWith('/mover ')) {
    const partes = texto.split(/\s+/);
    const direcaoEmPortugues = partes[1];

    const direcoes = {
      norte: 'north',
      sul: 'south',
      oeste: 'west',
      leste: 'east'
    };

    const direcao = direcoes[direcaoEmPortugues];

    if (!direcao) {
      console.log('[erro] Direcao invalida. Use norte, sul, leste ou oeste.');
      return;
    }

    enviarMensagem({
      type: 'move',
      direction: direcao
    });
    return;
  }

  console.log('[erro] Comando desconhecido. Use /ajuda para listar os comandos.');
}

function iniciarCliente(nome) {
  socket = new WebSocket('ws://localhost:8080');

  socket.on('open', () => {
    console.log('Conectado ao servidor.');
    mostrarAjuda();

    enviarMensagem({
      type: 'join_game',
      name: nome
    });
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

    if (mensagem.type === 'event') {
      console.log(`[evento] ${mensagem.text}`);
      return;
    }

    if (mensagem.type === 'error') {
      console.log(`[erro] ${mensagem.text}`);
      return;
    }

    if (mensagem.type === 'state') {
      // TODO:
      // 1. salvar o ultimo estado recebido
      // 2. guardar o identificador do jogador local
      // 3. exibir um resumo do estado atual
      ultimoEstado = mensagem;
      meuId = mensagem.youId;
      console.log(`[estado] TODO: mostrar resumo do jogador ${meuId}.`);
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

  rl.on('line', tratarComando);
}

rl.question('Digite seu nome: ', (nome) => {
  const nomeFinal = nome.trim() || 'Anonimo';
  iniciarCliente(nomeFinal);
});
