const http = require('http');
const app = require('./api');

const port = 6699;
const host = 'localhost';
app.set('port', port);

const server = http.createServer(app);

const gest_error = error => {   //? manage the error
    if (error.syscall !== 'listen') {
      throw error;
    }
    switch (error.code) {
      case 'EACCES':
        console.error('The port ' + port + ' need more permission.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error('The port ' + port + ' has already use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
};
server.on('error', gest_error);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
}); 