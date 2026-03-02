# Aula Zero

Esta pasta contém a Aula Zero da disciplina.

Antes de executar os arquivos desta pasta, leia o conteúdo da aula:

- [aula-zero-websocket.md](./aula-zero-websocket.md)

Aqui você vai encontrar:

- a aula em markdown: [aula-zero-websocket.md](./aula-zero-websocket.md);
- o servidor de exemplo: `server.js`;
- o cliente de exemplo: `client.js`;
- a configuração do projeto em `package.json`.

Depois da leitura, use os arquivos desta pasta para executar e explorar o exemplo.

## Sobre o uso de JavaScript nesta aula

Nesta aula, usamos `JavaScript` com `Node.js` porque isso permite montar um exemplo pequeno, fácil de executar e simples de depurar. O objetivo aqui não é transformar a disciplina em uma disciplina de `JavaScript`, e sim usar uma base prática para estudar comunicação em rede.

Nos projetos da disciplina, os jogos podem ser feitos com o motor ou com as tecnologias escolhidas por cada grupo. O padrão de comunicação adotado na disciplina será `WebSocket`.

## Como executar

Na pasta `aulas/aula-zero`:

```bash
npm install
npm run server
```

Em outro terminal:

```bash
npm run client
```

Se quiser testar com mais de um usuário, abra outros terminais e execute novamente:

```bash
npm run client
```

## Se precisar revisar JavaScript

- [javascript.info](https://javascript.info/)
- [Node.js](https://nodejs.org/)
- [MDN Web Docs: WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
