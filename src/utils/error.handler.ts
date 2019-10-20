import { ValidationError } from 'class-validator';
import { IError } from 'errors';
import { NextFunction, Request, Response } from 'express';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';
import logger from './logger';

/**
 * format error
 * @param  {ValidationError[]} err
 */
export const formatError = (err: ValidationError[] | object) => {
	if (!Array.isArray(err)) {
		const operator = (acc: any, curr: any) => {
			// @ts-ignore
			acc[curr] = [error[curr].message];
			return acc;
		};
		return Object.keys(err).reduce(operator, {});
	} else {
		const operator = (acc: any, curr: any) => {
			acc[curr.property] = Object.values(curr.constraints);
			return acc;
		};
		const error = err;
		return error.reduce(operator, {}) as ValidationError[];
	}
};

/**
 * Base Error Handler for routing controllers
 */
@Middleware({ type: 'after' })
export class BaseErrorHandler implements ExpressErrorMiddlewareInterface {
	error(err: IError, _req: Request, res: Response, _next: NextFunction) {
		logger.error(err);
		const errors: any = {
			name: err.name,
			message: err.message,
			data: err.data || (err.errors && formatError(err.errors))
		};

		if (err.response) errors.data = err.response.data;

		res.status((err.response && err.response.status) || err.httpCode || 500).json({ errors });
	}
}

export class BaseError extends Error {
	private httpCode: number;
	private data: any;

	constructor(message: string, data?: any, status = 400) {
		super();

		Error.captureStackTrace(this, this.constructor);

		this.name = this.constructor.name;

		this.message = message;

		this.data = data;

		this.httpCode = status;
	}
}

export const ServiceUnAvailable = new HttpError(503, 'Service Unavailable');
export const AuthenticationError = new BaseError('Authentication Failed', null, 401);
export const PermissionDenied = new BaseError('Permission Denied', null, 401);
