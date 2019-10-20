import { NextFunction, Request, Response } from 'express';
import pino from 'pino';
import {Constants} from './constants';

const logger = pino({
	name: Constants.APP_ID,
	level: Constants.LOG_LEVEL,
	 prettyPrint: { colorize: true }
});

/**
 * logging middleware to requests
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 */
export const logHandler = (req: Request, res: Response, next: NextFunction) => {
	const end = res.end;
	res.end = (...args: any) => {
		logger.info(`${req.method.toUpperCase()} ${req.originalUrl} ${res.statusCode}`);
		end.apply(res, args);
	};
	next();
};

export default logger;
