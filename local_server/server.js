//* IMPORTS
  const http = require('http');
  const app = require('./api');

  const func = require('./middleware/functions');
  

//* INIT APP
  const port = 6699;
  const host = 'localhost';

  app.set('port', port);


//* LAUNCH SERVER
  const server = http.createServer(app);
  server.on('error', func.gest_error); //? manage the error with a function

  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
