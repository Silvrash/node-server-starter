import 'reflect-metadata';
import {
	// authorizationChecker,
	BaseErrorHandler,
	// currentUserChecker,
	logger,
	Server,
	Constants
} from '@BUtils/index';
import express from 'express';

const app = express();

const server = Server(app);
server.connect_db().catch(err => logger.error(err));

server.router({
	routePrefix: '/api/v1',
	cors: true,
	controllers: [__dirname + '/features/**/*'],
	middlewares: [BaseErrorHandler],
	defaultErrorHandler: false,
	defaults: {
		nullResultCode: 404,
		undefinedResultCode: 404,
		paramOptions: {
			required: true
		}
	}
	// currentUserChecker,
	// authorizationChecker
});

server.listen();
