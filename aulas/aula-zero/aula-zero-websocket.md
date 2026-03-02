# Aula Zero: Introdução a WebSocket com chat em modo texto

Esta aula substitui as duas primeiras aulas da disciplina. A proposta é fazer um primeiro contato com comunicação em tempo real usando `WebSocket`, de forma simples, gradual e prática.

Nesta disciplina, vamos usar `WebSocket` como base para vários experimentos e projetos. Ele não é a única tecnologia possível para jogos multiplayer, nem sempre é a mais performática, mas é muito adequado para aprendizagem:

- é simples de observar e depurar;
- permite trocar mensagens em tempo real com pouco boilerplate;
- funciona bem para protótipos;
- pode ser consumido por navegadores, aplicativos e motores de jogo;
- ajuda a focar no modelo de comunicação antes de discutir otimizações mais avançadas.

Ao final desta aula, você deverá ser capaz de:

- entender a ideia básica de uma conexão persistente com `WebSocket`;
- acompanhar um exemplo funcional de cliente e servidor em `Node.js`;
- testar a comunicação entre dois ou mais terminais;
- modificar o código-base para adicionar novos comportamentos.

Tempo estimado: `3 horas`

## 1. Por que estamos falando de rede?

Em um jogo multiusuário, diferentes jogadores precisam compartilhar informações:

- entrou na partida;
- saiu da partida;
- mudou de posição;
- enviou uma ação;
- alterou algum estado do jogo.

Isso significa que o programa de um jogador precisa se comunicar com outro programa, normalmente por meio de um servidor intermediário.

Mesmo quando o jogo não parece um "site", ele ainda pode usar tecnologias muito próximas das tecnologias da internet para fazer essa troca de mensagens.

## 2. O mínimo sobre internet, cliente e servidor

Nesta aula, basta termos uma ideia simples:

- o `cliente` é o programa que inicia a conexão;
- o `servidor` é o programa que fica escutando conexões;
- os dois trocam dados pela rede;
- essa troca precisa seguir algum protocolo.

Um protocolo, aqui, é apenas um conjunto de regras sobre como a comunicação acontece.

## 3. O mínimo sobre HTTP

`HTTP` é um protocolo muito comum na web. Em geral, ele funciona no modelo:

1. o cliente faz uma requisição;
2. o servidor responde;
3. a interação termina.

Esse modelo funciona muito bem para várias coisas:

- carregar páginas;
- buscar dados;
- enviar formulários;
- consumir APIs.

Mas ele não é ideal, por si só, para comunicação contínua em tempo real entre vários participantes.

## 4. Onde entra o WebSocket

`WebSocket` resolve exatamente esse problema: depois que a conexão é estabelecida, cliente e servidor mantêm um canal aberto para trocar mensagens continuamente.

Em termos simples:

- o início da conexão usa uma negociação associada ao ecossistema web;
- depois disso, a comunicação passa a ocorrer em um canal persistente;
- cliente e servidor podem enviar mensagens a qualquer momento.

Para a disciplina, a ideia mais importante é esta: `WebSocket` nos permite pensar em eventos em tempo real.

Exemplos:

- "jogador entrou";
- "jogador saiu";
- "mensagem enviada";
- "posição atualizada";
- "ação executada".

## 5. Primeiro exemplo: um servidor WebSocket mínimo

Vamos usar `Node.js` e a biblioteca `ws`. Nesta pasta, o projeto já está pronto para execução. O objetivo desta parte é observar a ideia mínima antes de examinar o código completo.

Observe um servidor bem pequeno:

```js
const WebSocket = require('ws');

const servidor = new WebSocket.Server({ port: 8080 });

servidor.on('connection', () => {
  console.log('Um cliente se conectou.');
});

console.log('Servidor em ws://localhost:8080');
```

Esse trecho mostra o essencial:

- o servidor fica escutando na porta `8080`;
- quando alguém conecta, o evento `connection` acontece;
- a partir daí, temos um canal aberto com esse cliente.

## 6. Primeiro exemplo: um cliente mínimo

Agora um cliente bem pequeno:

```js
const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:8080');

socket.on('open', () => {
  console.log('Conectado ao servidor.');
});
```

Aqui:

- o cliente tenta se conectar ao servidor;
- quando a conexão abre, o evento `open` acontece.

## 7. Enviando uma mensagem

Depois de conectado, o cliente pode enviar dados:

```js
socket.on('open', () => {
  socket.send('Olá, servidor.');
});
```

Do lado do servidor, podemos receber:

```js
servidor.on('connection', (ws) => {
  ws.on('message', (dados) => {
    console.log('Recebi:', dados.toString());
  });
});
```

Essa já é a ideia central de boa parte dos sistemas multiplayer:

- um lado envia;
- o outro recebe;
- algo acontece em resposta a isso.

## 8. Melhorando: mensagens estruturadas com JSON

Em vez de mandar texto solto, é melhor mandar mensagens estruturadas.

Exemplo no cliente:

```js
socket.send(
  JSON.stringify({
    type: 'join',
    name: 'Maria'
  })
);
```

No servidor:

```js
ws.on('message', (dados) => {
  const mensagem = JSON.parse(dados.toString());
  console.log(mensagem.type, mensagem.name);
});
```

Por que isso é importante?

Porque em jogos e sistemas multiusuário não basta "mandar texto". Precisamos mandar eventos com significado.

Por exemplo:

- `join`
- `chat`
- `move`
- `attack`
- `ready`

## 9. Retransmitindo para vários clientes

Se quisermos que todos os conectados vejam uma mensagem, o servidor pode retransmiti-la:

```js
for (const cliente of servidor.clients) {
  if (cliente.readyState === WebSocket.OPEN) {
    cliente.send(JSON.stringify({ type: 'system', text: 'Olá para todos.' }));
  }
}
```

Essa ideia de receber de um cliente e distribuir para vários outros também aparece o tempo todo em jogos multiplayer.

## 10. Lendo entrada do teclado no terminal

Como nesta aula queremos evitar HTML e interface gráfica, o cliente vai funcionar no terminal.

Para isso, podemos usar `readline`:

```js
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (linha) => {
  console.log('Você digitou:', linha);
});
```

Assim, cada linha digitada pode virar uma mensagem enviada ao servidor.

## 11. Como tudo se junta

O fluxo do programa é este:

1. o usuário executa o cliente;
2. informa seu nome;
3. o cliente conecta ao servidor;
4. o cliente envia uma mensagem `join`;
5. cada linha digitada depois disso vira uma mensagem `chat`;
6. o servidor retransmite as mensagens para todos;
7. todos os clientes exibem o resultado no terminal.

## 12. Exemplo completo desta aula

O exemplo completo desta aula está nos arquivos desta pasta:

- `server.js`
- `client.js`
- `package.json`

Esses arquivos implementam um chat textual simples:

- o usuário informa o nome;
- entra no chat;
- digita mensagens no terminal;
- todos os participantes recebem essas mensagens;
- o servidor avisa quando alguém entra ou sai.

## 13. Como executar o exemplo completo

Na pasta `aulas/aula-zero`:

1. execute o servidor:

```bash
npm install
npm run server
```

2. abra outro terminal e execute um cliente:

```bash
npm run client
```

3. abra mais um terminal e execute outro cliente:

```bash
npm run client
```

4. informe nomes diferentes e teste a troca de mensagens.

## 14. Estrutura das mensagens usadas

Cliente para servidor:

```json
{ "type": "join", "name": "Ana" }
{ "type": "chat", "text": "Olá, pessoal." }
```

Servidor para clientes:

```json
{ "type": "system", "text": "Ana entrou no chat." }
{ "type": "chat", "name": "Ana", "text": "Olá, pessoal." }
```

## 15. O que observar neste exemplo

Observe como o modelo é orientado a eventos:

- `connection`
- `open`
- `message`
- `close`

Isso vai reaparecer ao longo da disciplina. Em um jogo, em vez de mensagens de chat, poderíamos ter eventos como:

- `player_joined`
- `player_moved`
- `shot_fired`
- `state_updated`

O mecanismo de base continua muito parecido.

## 16. Exercício

Nesta aula, o código-base já está pronto. O foco agora é ler o código, executar o exemplo e modificar o sistema.

Depois de reproduzir o exemplo completo, implemente os dois recursos abaixo:

1. execute o servidor;
2. conecte pelo menos dois clientes;
3. troque mensagens entre eles;
4. implemente o comando `/usuarios`, que deve listar os usuários conectados;
5. implemente o comando `/nome NovoNome`, que deve permitir trocar o nome durante a execução.

Ao implementar esses recursos, pense em:

- que mensagem o cliente deve enviar ao servidor;
- que informação o servidor precisa manter;
- que resposta o servidor deve devolver ao cliente que fez o comando;
- o que deve ser retransmitido para os demais clientes quando o nome mudar.

## 17. O que observar ao fazer os comandos

No comando `/usuarios`, observe que o servidor precisa conhecer o estado global das conexões.

No comando `/nome NovoNome`, observe que mudar um atributo local do cliente não basta. A mudança precisa passar pelo servidor, porque os outros clientes também precisam conhecer o novo nome.

Esses dois recursos já introduzem duas ideias importantes para jogos multiplayer:

- consulta de estado compartilhado;
- atualização de estado com propagação para os demais participantes.

## 18. Encerramento

O objetivo desta aula não é construir um jogo completo. O objetivo é montar e entender uma base funcional mínima para comunicação em tempo real entre múltiplos usuários.

Nas próximas aulas, essa mesma lógica será reutilizada em contextos mais próximos de jogos multiplayer.
