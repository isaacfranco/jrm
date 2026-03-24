# Aula 1

Esta pasta contém a Aula 1 da disciplina.

Antes de executar os arquivos desta pasta, leia o conteúdo da aula:

- [aula-1-arena-textual.md](./aula-1-arena-textual.md)

Aqui você vai encontrar:

- a aula em markdown: [aula-1-arena-textual.md](./aula-1-arena-textual.md);
- a base do servidor: `server.js`;
- a base do cliente em terminal: `client.js`;
- a configuração do projeto em `package.json`.

Depois da leitura, use os arquivos desta pasta para implementar o mini projeto da aula.

## Sobre o uso de JavaScript nesta aula

Nesta aula, usamos `JavaScript` com `Node.js` porque isso permite montar um protótipo pequeno, fácil de executar e simples de depurar. O objetivo aqui não é estudar interface de terminal, e sim usar uma base prática para entender troca de mensagens, estado compartilhado e regras de jogo sobre `WebSocket`.

Nos projetos da disciplina, os jogos podem ser feitos com o motor ou com as tecnologias escolhidas por cada grupo. O padrão de comunicação adotado na disciplina continuará sendo `WebSocket`.

## Como executar

Na pasta `aulas/aula-1`:

```bash
npm install
npm run server
```

Em outro terminal:

```bash
npm run client
```

Se quiser testar com mais de um jogador, abra outros terminais e execute novamente:

```bash
npm run client
```

## Se precisar revisar JavaScript

- [javascript.info](https://javascript.info/)
- [Node.js](https://nodejs.org/)
- [MDN Web Docs: WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
