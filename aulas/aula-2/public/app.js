const joinPanel = document.querySelector('#join-panel');
const gamePanel = document.querySelector('#game-panel');
const nameInput = document.querySelector('#name-input');
const connectButton = document.querySelector('#connect-button');
const refreshButton = document.querySelector('#refresh-button');
const attackButton = document.querySelector('#attack-button');
const mapElement = document.querySelector('#map');
const statusText = document.querySelector('#status-text');
const playersList = document.querySelector('#players-list');
const logList = document.querySelector('#log-list');
const directionButtons = Array.from(document.querySelectorAll('[data-direction]'));

let socket = null;
let ultimoEstado = null;
let meuId = null;

function adicionarAoLog(texto) {
  const item = document.createElement('li');
  item.textContent = texto;
  logList.prepend(item);
}

function enviarMensagem(objeto) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    adicionarAoLog('A conexao ainda nao esta pronta.');
    return;
  }

  socket.send(JSON.stringify(objeto));
}

function renderizarJogadores(estado) {
  playersList.innerHTML = '';

  for (const jogador of estado.players) {
    const item = document.createElement('li');
    const marcador = jogador.id === meuId ? ' (voce)' : '';
    item.textContent = `${jogador.name}${marcador} -> posicao (${jogador.x}, ${jogador.y}) | hp: ${jogador.hp}`;
    playersList.appendChild(item);
  }
}

function renderizarMapa(estado) {
  mapElement.innerHTML = '';
  mapElement.style.gridTemplateColumns = `repeat(${estado.width}, minmax(0, 1fr))`;

  for (let y = 0; y < estado.height; y += 1) {
    for (let x = 0; x < estado.width; x += 1) {
      const celula = document.createElement('div');
      celula.className = 'cell';

      // TODO:
      // 1. localizar o jogador presente nesta celula
      // 2. escrever informacoes do jogador na interface
      // 3. destacar a celula do jogador local
      celula.textContent = '.';

      mapElement.appendChild(celula);
    }
  }
}

function renderizarStatus(estado) {
  // TODO:
  // 1. localizar o jogador local usando estado.youId
  // 2. mostrar nome, posicao, vida e quantidade de jogadores
  statusText.textContent = `TODO: mostrar resumo do jogador ${estado.youId}.`;
}

function renderizarEstado(estado) {
  ultimoEstado = estado;
  meuId = estado.youId;
  renderizarStatus(estado);
  renderizarMapa(estado);
  renderizarJogadores(estado);
}

function conectar() {
  const nome = nameInput.value.trim() || 'Anonimo';

  socket = new WebSocket(`ws://${window.location.host}`);

  socket.addEventListener('open', () => {
    joinPanel.classList.add('hidden');
    gamePanel.classList.remove('hidden');
    adicionarAoLog('Conectado ao servidor.');

    enviarMensagem({
      type: 'join_game',
      name: nome
    });
  });

  socket.addEventListener('message', (event) => {
    let mensagem;

    try {
      mensagem = JSON.parse(event.data);
    } catch (erro) {
      adicionarAoLog('Mensagem recebida em formato invalido.');
      return;
    }

    if (mensagem.type === 'system') {
      adicionarAoLog(`[sistema] ${mensagem.text}`);
      return;
    }

    if (mensagem.type === 'event') {
      adicionarAoLog(`[evento] ${mensagem.text}`);
      return;
    }

    if (mensagem.type === 'error') {
      adicionarAoLog(`[erro] ${mensagem.text}`);
      return;
    }

    if (mensagem.type === 'state') {
      renderizarEstado(mensagem);
    }
  });

  socket.addEventListener('close', () => {
    adicionarAoLog('Conexao encerrada.');
  });

  socket.addEventListener('error', () => {
    adicionarAoLog('Erro de conexao.');
  });
}

connectButton.addEventListener('click', conectar);

refreshButton.addEventListener('click', () => {
  enviarMensagem({ type: 'state' });
});

attackButton.addEventListener('click', () => {
  enviarMensagem({ type: 'attack' });
});

for (const button of directionButtons) {
  button.addEventListener('click', () => {
    enviarMensagem({
      type: 'move',
      direction: button.dataset.direction
    });
  });
}

if (ultimoEstado) {
  renderizarEstado(ultimoEstado);
}
