import path from 'path';
import { ConnectionOptions } from 'typeorm';
import './env';

export const Constants = {
	IS_DEV: process.env.NODE_ENV !== 'production',
	PORT: parseInt(process.env.PORT),
	REQUEST_LIMIT: process.env.REQUEST_LIMIT,
	APP_ID: process.env.APP_ID,
	LOG_LEVEL: process.env.LOG_LEVEL,

	// authentication-related constants
	JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

	// database-related constants.
	DB_NAME: process.env.DB_NAME,
	DB_TYPE: process.env.DB_TYPE,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_HOST: process.env.DB_HOST,
	DB_PORT: parseInt(process.env.DB_PORT),
	DB_SOCKET_PATH: process.env.DB_SOCKET_PATH,


	// firebase settings
	FIREBASE_SERVICE_ACCOUNT: '{}',
	STORAGE_BUCKET: '',
};

export const ORM_CONFIG: ConnectionOptions = {
	type: Constants.DB_TYPE as 'mysql' | 'postgres',
	database: Constants.DB_NAME,
	username: Constants.DB_USER,
	password: Constants.DB_PASSWORD,
	host: Constants.DB_HOST,
	port: Constants.DB_PORT,
	synchronize: false,
	logger: 'debug',
	extra: {
		socketPath: Constants.DB_SOCKET_PATH
	},
	entities: [path.join(__dirname, '/../features/**')]
};
