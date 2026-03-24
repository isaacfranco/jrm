# Aula 2

Esta pasta contém a Aula 2 da disciplina.

Antes de executar os arquivos desta pasta, leia o conteúdo da aula:

- [aula-2-cliente-web.md](./aula-2-cliente-web.md)

Aqui você vai encontrar:

- a aula em markdown: [aula-2-cliente-web.md](./aula-2-cliente-web.md);
- a base do servidor HTTP + WebSocket: `server.js`;
- a base do cliente web em `public/index.html`;
- a lógica do cliente web em `public/app.js`;
- os estilos da interface em `public/styles.css`;
- a configuração do projeto em `package.json`.

Depois da leitura, use os arquivos desta pasta para implementar o cliente web da aula.

## Sobre o uso de JavaScript nesta aula

Nesta aula, usamos `JavaScript` com `Node.js` no servidor e `JavaScript` no navegador porque isso permite trocar a interface do cliente sem mudar a ideia central do protocolo. O objetivo aqui não é estudar frameworks front-end, e sim mostrar que a lógica principal do jogo pode continuar no servidor enquanto a camada de apresentação muda.

Nos projetos da disciplina, os jogos podem ser feitos com o motor ou com as tecnologias escolhidas por cada grupo. O padrão de comunicação adotado na disciplina continuará sendo `WebSocket`.

## Como executar

Na pasta `aulas/aula-2`:

```bash
npm install
npm start
```

Depois, abra o navegador em:

```txt
http://localhost:8080
```

Se quiser testar com mais de um jogador, abra outras abas ou outros navegadores na mesma URL.

## Se precisar revisar JavaScript

- [javascript.info](https://javascript.info/)
- [Node.js](https://nodejs.org/)
- [MDN Web Docs: WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
