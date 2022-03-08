const server = require('./server');
const conf = require('./conf/config');
const logger = require('./utils/logging').logger;
const connectDB = require('./utils/db').connect;

const httpPort = process.env.PORT || conf.server.port || 3000;

connectDB(() => {
    server.listen(httpPort, () => {
        logger.info('ws-server listening with HTTP on port ' + httpPort + '...');
    });
});
