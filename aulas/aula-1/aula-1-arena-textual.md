# Aula 1: Primeiro mini jogo multiplayer em modo texto

Na aula zero, o foco foi construir e entender um chat simples em modo texto com `WebSocket`.

Agora vamos dar um passo adiante: em vez de trocar mensagens de chat, vamos trocar ações de jogo.

O objetivo desta aula é montar um protótipo pequeno, ainda no terminal, mas já com estrutura de jogo multiplayer. Cada jogador vai entrar em uma arena pequena, mover seu personagem, atacar jogadores adjacentes e consultar o estado atual da partida.

Nesta aula, continuamos evitando interface gráfica. Isso é intencional. O foco agora não é desenhar tela, e sim entender:

- como representar ações de jogo em mensagens;
- como manter um estado compartilhado no servidor;
- como validar regras no lado do servidor;
- como retransmitir atualizações para todos os clientes conectados.

Ao final desta aula, você deverá ser capaz de:

- modelar ações de jogo com mensagens `JSON`;
- manter um pequeno estado global no servidor;
- implementar um servidor simples que concentra o estado do jogo;
- montar um cliente de terminal que envia comandos e exibe o estado do jogo;
- entender por que a lógica principal do jogo deve ficar no servidor.

Tempo estimado: `3 horas`

## 1. Do chat para o jogo

Na aula zero, uma mensagem de entrada tinha significado social:

- alguém entrou;
- alguém falou;
- alguém saiu.

Agora, as mensagens passam a representar ações de jogo:

- um jogador entrou na arena;
- um jogador se moveu;
- um jogador atacou;
- o estado foi atualizado.

Em outras palavras, a infraestrutura de rede é muito parecida, mas o significado das mensagens muda.

## 2. O mini projeto desta aula

O projeto desta aula é uma arena textual pequena.

Cada jogador:

- escolhe um nome;
- entra na partida;
- nasce em uma posição do mapa;
- pode se mover em quatro direções;
- pode atacar um jogador adjacente;
- pode consultar o estado atual da arena.

Vamos trabalhar com um mapa pequeno, por exemplo `5x5`, porque isso já é suficiente para praticar comunicação em tempo real sem aumentar demais a complexidade.

## 3. O servidor agora guarda o estado do jogo

Nesta aula, o servidor não será apenas um retransmissor de mensagens.

Ele também será responsável por:

- registrar os jogadores conectados;
- guardar posição e vida de cada jogador;
- validar se um movimento é permitido;
- verificar se existe alvo para um ataque;
- enviar o estado atualizado da partida.

Isso é importante porque, em jogos multiplayer, o cliente não deve decidir sozinho qual é o estado verdadeiro do jogo.

## 4. Um estado pequeno já é suficiente

Não precisamos de um estado grande para montar um primeiro jogo.

Uma estrutura como esta já resolve bem:

```js
const jogador = {
  id: 1,
  name: 'Ana',
  x: 2,
  y: 1,
  hp: 3
};
```

E no servidor podemos manter vários jogadores em um `Map`:

```js
const jogadores = new Map();
```

Cada conexão pode apontar para o estado daquele jogador.

## 5. Mensagens do protocolo

Na aula zero, usamos mensagens como `join` e `chat`.

Agora podemos usar mensagens com significado mais próximo de jogo.

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
{ "type": "event", "text": "Ana se moveu para (2, 1)." }
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

Observe que continuamos usando `JSON`, mas agora as mensagens carregam ações e estado de jogo.

## 6. Comandos do cliente em terminal

O cliente continuará rodando no terminal.

Em vez de digitar texto livre para chat, o usuário vai digitar comandos como:

```txt
/mover norte
/mover sul
/mover leste
/mover oeste
/atacar
/estado
/mapa
```

Esses comandos serão transformados em mensagens para o servidor.

## 7. Um mapa simples em texto

Não vamos construir uma interface avançada de terminal nesta aula.

Quando for necessário mostrar o mapa, basta gerar um quadro textual simples:

```txt
. . . . .
. A . . .
. . . B .
. . . . .
. . . . .
```

Isso já é suficiente para visualizar:

- onde cada jogador está;
- se há jogadores adjacentes;
- se o estado compartilhado está coerente.

Aqui, o mapa é apenas uma forma legível de mostrar o estado. O foco principal continua no protocolo e na lógica do servidor.

## 8. Estrutura do servidor

O servidor desta aula pode ser organizado assim:

```js
const WebSocket = require('ws');

const servidor = new WebSocket.Server({ port: 8080 });
const jogadores = new Map();

function enviarParaTodos(objeto) {
  // transforma o objeto em JSON e envia para os clientes conectados
}

function gerarEstado() {
  // monta um snapshot do jogo
}

servidor.on('connection', (ws) => {
  ws.on('message', (dados) => {
    // interpreta join_game, move, attack e state
  });
});
```

O ponto importante é que o servidor:

- recebe uma ação pedida pelo cliente;
- decide se aquela intenção é válida;
- altera o estado;
- informa o resultado aos clientes.

## 9. Entrada no jogo

Quando o cliente se conecta, ele deve enviar:

```js
socket.send(
  JSON.stringify({
    type: 'join_game',
    name: nome
  })
);
```

Do lado do servidor, isso significa:

1. registrar o jogador;
2. escolher uma posição inicial livre;
3. definir a vida inicial;
4. avisar aos demais que alguém entrou;
5. enviar o estado atualizado.

Nos arquivos-base desta aula, parte desse fluxo ainda aparece como `TODO`. Isso é esperado: a proposta do exercício é completar essa implementação.

## 10. Movimento

Um movimento pode ser representado assim:

```js
socket.send(
  JSON.stringify({
    type: 'move',
    direction: 'north'
  })
);
```

Mas o cliente apenas pede a ação.

Quem realmente decide se o movimento é válido é o servidor, verificando:

- se o jogador entrou no jogo;
- se a direção existe;
- se a nova posição está dentro do mapa;
- se a célula de destino está livre.

## 11. Ataque

O comando de ataque pode ser simples:

```js
socket.send(
  JSON.stringify({
    type: 'attack'
  })
);
```

Nesta aula, basta adotar uma regra pequena:

- um ataque só acerta jogadores adjacentes;
- se não houver ninguém adjacente, nada acontece além de uma mensagem de retorno;
- quando a vida chega a zero, o jogador pode reaparecer em outra posição com vida reiniciada.

Esse conjunto já introduz:

- conflito entre jogadores;
- atualização de estado compartilhado;
- regra de validação no servidor.

## 12. Envio de estado

Sempre que algo importante acontecer, o servidor pode reenviar o estado atual:

```js
function enviarEstadoParaTodos() {
  for (const cliente of servidor.clients) {
    if (cliente.readyState === WebSocket.OPEN) {
      enviarEstado(cliente);
    }
  }
}
```

Esse estado funciona como um retrato da arena naquele momento.

## 13. Estrutura do cliente

O cliente desta aula ainda usa `readline`, mas agora ele precisa:

- ler comandos do terminal;
- transformar cada comando em uma mensagem;
- guardar o último estado recebido;
- imprimir eventos do servidor;
- mostrar o mapa quando solicitado.

Um esqueleto possível:

```js
const WebSocket = require('ws');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let ultimoEstado = null;

rl.on('line', (linha) => {
  // interpretar comandos
});

socket.on('message', (dados) => {
  // tratar system, event e state
});
```

## 14. Como tudo se junta

O fluxo geral desta aula é este:

1. o servidor inicia;
2. o cliente se conecta;
3. o cliente envia `join_game`;
4. o servidor registra o jogador e envia o estado;
5. o usuário digita um comando como `/mover norte`;
6. o cliente envia a ação;
7. o servidor valida e atualiza o estado;
8. os clientes recebem os eventos e o novo estado.

Em sequência: o cliente conecta ao servidor WebSocket, envia `join_game`, recebe `state` e, depois disso, pode enviar `move` ou `attack`. O servidor valida a ação e retransmite `event` e `state` para os clientes.

Esse é o fluxo esperado depois que os `TODO`s de `server.js` e `client.js` forem implementados.

## 15. Arquivos desta aula

Os arquivos desta pasta são:

- `server.js`
- `client.js`
- `package.json`

Eles formam a base do mini projeto desta aula. Os arquivos `server.js` e `client.js` já trazem a estrutura principal, mas ainda incluem trechos marcados como `TODO` para serem completados durante a atividade.

## 16. Como executar

Na pasta `aulas/aula-1`:

1. instale as dependências:

```bash
npm install
```

2. execute o servidor:

```bash
npm run server
```

3. em outro terminal, execute um cliente:

```bash
npm run client
```

4. se quiser testar mais de um jogador, abra outros terminais e execute novamente:

```bash
npm run client
```

## 17. Exercício

Nesta aula, a base do projeto já está organizada. O objetivo agora é completar a implementação do mini jogo.

A partir da estrutura fornecida, implemente os recursos abaixo:

1. registre jogadores com `join_game`;
2. escolha uma posição inicial livre para cada jogador;
3. implemente `/mover norte|sul|leste|oeste`;
4. implemente `/atacar` com alcance adjacente;
5. implemente o envio de `state` para todos após mudanças importantes;
6. implemente `/mapa` e `/estado` no cliente.

Ao implementar, observe:

- que informações pertencem ao servidor;
- que mensagens precisam ser retransmitidas para todos;
- que partes são apenas apresentação no cliente;
- que o cliente pede ações, mas quem decide o estado é o servidor.

## 18. O que observar nesta aula

Ao concluir a implementação, observe que você já tem:

- múltiplos jogadores conectados;
- ações de jogo em tempo real;
- estado compartilhado pequeno;
- servidor validando regras;
- cliente separado da lógica central.

Isso é importante porque a próxima etapa não precisa mudar o protocolo do jogo. Ela pode trocar apenas a forma de controlar e exibir o cliente.

## 19. Encerramento

O objetivo desta aula não é construir um jogo completo. A meta é sair do chat da aula zero e chegar a um primeiro protótipo multiplayer com regras, estado compartilhado e ações de jogo.

Essa mesma base poderá ser reaproveitada nas próximas aulas com outra camada de apresentação.
