# Aula 2: Trocando o cliente de terminal por um cliente web

Na aula 1, a base do jogo em modo texto ficou organizada:

- o servidor concentrava o estado da arena;
- o cliente enviava comandos;
- o protocolo do jogo já estava desenhado;
- parte da implementação ficou como exercício.

Nesta aula, a ideia principal não muda. O que muda é a forma de entrada e saída do cliente.

Em vez de controlar o jogo por comandos no terminal, vamos montar um cliente web pequeno, acessado pelo navegador.

O objetivo desta aula é mostrar que o protocolo e o servidor podem continuar praticamente os mesmos, enquanto o cliente passa a ter outra forma de interação e outra forma de exibir o estado.

Ao final desta aula, você deverá ser capaz de:

- servir um cliente web simples com `Node.js`;
- conectar esse cliente ao servidor usando `WebSocket`;
- reutilizar a mesma ideia de protocolo da aula 1;
- exibir o estado do jogo em uma interface web;
- separar melhor a lógica do jogo da interface do cliente.

Tempo estimado: `3 horas`

## 1. O que continua igual

Mesmo com a troca do cliente, várias coisas permanecem:

- o servidor continua sendo o dono do estado;
- o jogador continua enviando ações;
- o servidor continua validando as regras;
- o estado continua sendo retransmitido por `WebSocket`.

Isso é importante porque mostra que o cliente não precisa concentrar a lógica principal do jogo.

## 2. O que muda nesta aula

Na aula 1, o cliente:

- lia comandos com `readline`;
- imprimia mensagens no terminal;
- desenhava um mapa textual simples.

Agora, o cliente vai:

- abrir uma conexão `WebSocket` no navegador;
- enviar ações ao clicar em botões;
- mostrar o mapa em uma grade HTML;
- exibir eventos em uma área de log.

## 3. O que entra no projeto

Nesta aula, teremos:

- um servidor HTTP para entregar os arquivos do cliente;
- um servidor `WebSocket` para a comunicação em tempo real;
- uma página HTML;
- um arquivo JavaScript no navegador;
- um arquivo CSS para organizar a interface.

Ou seja, o projeto passa a ter duas partes bem claras:

- servidor;
- cliente web.

## 4. Entregando arquivos para o navegador

Precisamos de um servidor HTTP porque o navegador vai precisar carregar:

- `index.html`
- `app.js`
- `styles.css`

Com `Node.js`, isso pode ser feito com o módulo `http`:

```js
const http = require('http');

const servidorHttp = http.createServer((req, res) => {
  // localizar o arquivo pedido e devolver a resposta
});
```

Nesta aula, basta um servidor estático simples.

## 5. O servidor WebSocket

Em vez de abrir o `WebSocket` em uma porta separada, podemos acoplar o servidor `WebSocket` ao servidor HTTP:

```js
const WebSocket = require('ws');

const servidorWebSocket = new WebSocket.Server({
  server: servidorHttp
});
```

Assim, a aplicação web e a comunicação em tempo real ficam no mesmo endereço.

## 6. O protocolo pode continuar quase o mesmo

A troca do cliente não exige um protocolo totalmente novo.

Podemos continuar usando mensagens como:

Cliente para servidor:

```json
{ "type": "join_game", "name": "Ana" }
{ "type": "move", "direction": "north" }
{ "type": "attack" }
{ "type": "state" }
```

Servidor para clientes:

```json
{ "type": "system", "text": "Ana entrou na arena." }
{ "type": "event", "text": "Ana atacou Bruno." }
{
  "type": "state",
  "width": 5,
  "height": 5,
  "youId": 1,
  "players": [
    { "id": 1, "name": "Ana", "x": 2, "y": 1, "hp": 3 }
  ]
}
```

Isso é uma das ideias centrais desta aula: mudar a interface não exige jogar fora o modelo de mensagens.

## 7. Uma interface HTML mínima

Não vamos construir uma interface web complexa nesta aula.

Uma estrutura simples já resolve:

```html
<main>
  <section id="entrada">
    <input id="name-input" />
    <button id="connect-button">Entrar</button>
  </section>

  <section id="jogo">
    <div id="status"></div>
    <div id="map"></div>
    <button data-direction="north">Norte</button>
    <button id="attack-button">Atacar</button>
    <div id="log"></div>
  </section>
</main>
```

Com isso, já conseguimos:

- nome do jogador;
- botão para entrar;
- mapa;
- controles;
- área de eventos.

## 8. Abrindo o WebSocket no navegador

No navegador, o `WebSocket` já existe como API nativa:

```js
const socket = new WebSocket(`ws://${window.location.host}`);
```

Depois disso, o cliente pode reagir aos eventos:

```js
socket.addEventListener('open', () => {
  console.log('Conectado');
});

socket.addEventListener('message', (event) => {
  const mensagem = JSON.parse(event.data);
  console.log(mensagem);
});
```

## 9. Enviando ações a partir da interface

Na aula 1, a ação vinha de um comando digitado. Agora ela pode vir de um clique:

```js
botaoNorte.addEventListener('click', () => {
  socket.send(
    JSON.stringify({
      type: 'move',
      direction: 'north'
    })
  );
});
```

O mesmo vale para:

- `south`
- `west`
- `east`
- `attack`
- `state`

## 10. Exibindo o mapa na web

Em vez de imprimir um quadro ASCII, agora podemos desenhar uma grade HTML simples.

Uma possibilidade é recriar o mapa a cada novo estado:

```js
function renderizarMapa(estado) {
  mapElement.innerHTML = '';

  for (let y = 0; y < estado.height; y += 1) {
    for (let x = 0; x < estado.width; x += 1) {
      const celula = document.createElement('div');
      celula.className = 'cell';
      mapElement.appendChild(celula);
    }
  }
}
```

Isso já é suficiente para desenhar a grade e, depois, posicionar os jogadores com base no estado recebido.

## 11. Exibindo o estado do jogador local

Além do mapa, o cliente pode mostrar um pequeno resumo:

- nome do jogador;
- posição atual;
- pontos de vida;
- quantidade de jogadores conectados.

Por exemplo:

```js
const eu = estado.players.find((jogador) => jogador.id === estado.youId);

statusElement.textContent = `Voce esta em (${eu.x}, ${eu.y}) com ${eu.hp} de vida.`;
```

## 12. Log de eventos

Também é útil manter uma pequena área de eventos:

- entrada de jogadores;
- saídas;
- movimentos;
- ataques;
- erros.

Exemplo:

```js
function adicionarAoLog(texto) {
  const item = document.createElement('li');
  item.textContent = texto;
  logElement.prepend(item);
}
```

## 13. Como tudo se junta

O fluxo geral desta aula é este:

1. o servidor HTTP entrega a página;
2. o navegador carrega `index.html`, `app.js` e `styles.css`;
3. o cliente web abre o `WebSocket`;
4. o jogador informa o nome e entra na arena;
5. o servidor registra o jogador e envia o estado;
6. os botões da interface disparam ações;
7. o servidor valida as regras e envia eventos e o novo estado.

Em sequência: o navegador carrega os arquivos da interface, o cliente web abre o `WebSocket`, o jogador entra na arena e o servidor responde com `state`. Depois disso, os botões da interface disparam ações como `move` e `attack`, e o servidor valida tudo antes de retransmitir `event` e `state`.

Esse é o fluxo esperado depois que os `TODO`s de `server.js` e `public/app.js` forem implementados.

## 14. Arquivos desta aula

Os arquivos desta pasta são:

- `server.js`
- `public/index.html`
- `public/app.js`
- `public/styles.css`
- `package.json`

Eles formam a base do cliente web desta aula. Os arquivos `server.js` e `public/app.js` já trazem a estrutura principal, mas ainda incluem trechos marcados como `TODO` para serem completados durante a atividade.

## 15. Como executar

Na pasta `aulas/aula-2`:

1. instale as dependências:

```bash
npm install
```

2. inicie o servidor:

```bash
npm start
```

3. abra o navegador em:

```txt
http://localhost:8080
```

4. se quiser testar com mais de um jogador, abra outras abas ou outros navegadores na mesma URL.

## 16. Exercício

Nesta aula, a base do projeto já está organizada. O objetivo agora é completar o cliente web e adaptar a base do servidor para esse novo formato.

A partir da estrutura fornecida, implemente os recursos abaixo:

1. sirva os arquivos estáticos do cliente com `Node.js`;
2. conecte o `WebSocket` ao mesmo servidor HTTP;
3. implemente a entrada do jogador pela interface web;
4. implemente os controles de movimento e ataque;
5. renderize o mapa a partir da mensagem `state`;
6. exiba um resumo do jogador local e um log de eventos.

Ao implementar, observe:

- que a lógica principal continua no servidor;
- que o protocolo pode continuar muito parecido com o da aula 1;
- que a interface web é apenas outra forma de consumir o mesmo estado;
- que o cliente pode mudar sem reescrever toda a parte de rede.

## 17. O que observar nesta aula

Ao concluir a implementação, observe que agora você tem:

- o mesmo tipo de jogo da aula 1;
- outra interface para o mesmo jogo;
- separação mais clara entre servidor e cliente;
- uma base mais próxima do que será usado em clientes gráficos no futuro.

## 18. Encerramento

O objetivo desta aula não é construir um front-end complexo. A meta é mostrar que o mesmo jogo pode continuar funcionando quando o cliente muda, desde que o protocolo e o servidor estejam organizados corretamente.

Isso é um passo importante para reaproveitar a base de comunicação em contextos mais próximos de um jogo completo.
