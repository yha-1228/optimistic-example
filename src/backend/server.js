// https://github.com/typicode/json-server/tree/v0?tab=readme-ov-file#custom-routes-example

const jsonServer = require("json-server");

const db = {
  comments: [
    {
      id: "1",
      createdAt: "2024-06-07T14:55:18.251Z",
      comment: "はじめまして。",
    },
  ],
};

const PORT = 8000;

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = new Date().toISOString();
  }
  // Continue to JSON Server router
  next();
});

server.use(router);
server.listen(PORT, () => {
  console.log(`JSON Server is running (Port: ${PORT})`);
});
