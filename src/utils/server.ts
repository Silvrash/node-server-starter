import bodyParser from 'body-parser';
import boxen from 'boxen';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import http from 'http';
import os from 'os';
import path from 'path';
import { RoutingControllersOptions, useExpressServer } from 'routing-controllers';
import { createConnection } from 'typeorm';
import { Constants, ORM_CONFIG } from './constants';
import logger, { logHandler } from './logger';

const Server = (app: Application) => {
    const root = path.normalize(__dirname + '/..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json({ limit: Constants.REQUEST_LIMIT || '100kb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: Constants.REQUEST_LIMIT || '100kb' }));
    app.use(cookieParser(Constants.JWT_SECRET_KEY));
    if(Constants.IS_DEV) app.use(logHandler);

    /**
     * connect to database
     * @param  {string} uri
     * @param  {MongoClientOptions} config
     */
    const connect_db = async () => {
        return createConnection(ORM_CONFIG)
            .then(() => {
                logger.info(`Connected to database ${Constants.DB_NAME}`);
            })
            .catch(err => logger.error(err));
    };

    /**
     * start https server
     * @param  {string|number=ConstantsPORT} port
     * @returns Application
     */
    const listen = (port: string | number = Constants.PORT) => {
        const welcome = (port: string | number) => () => {
            if (Constants.IS_DEV) {
                const networks = os.networkInterfaces();
                Object.keys(networks).forEach(netName => {
                    networks[netName].forEach(net => {
                        if (net.family !== 'IPv4' || net.internal !== false) return;

                        console.log(
                            boxen(
                                `up and running in ${process.env.NODE_ENV ||
                                    'development'}\n http://${net.address}:${port}`,
                                {
                                    padding: 1,
                                    float: 'center',
                                    borderColor: 'greenBright',
                                    borderStyle: boxen.BorderStyle.Double
                                }
                            )
                        );
                    });
                });
            } else {
                logger.info('server started');
            }
        };
        http.createServer(app).listen(port, welcome(port));
    };

    /**
     * setup router
     */
    const router = (config: RoutingControllersOptions) => {
        useExpressServer(app, config);
    };

    return { connect_db, listen, router };
};

export default Server;
