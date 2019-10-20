import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { Action } from 'routing-controllers';
import { formatError } from './error.handler';
import { isObject } from './validators';

/**
 * validated if request body is nested in data
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 */
export const nestReqInData = (req: Request, res: Response, next: NextFunction) => {
	class InData {
		@isObject('data', { message: 'Request must be nested in data' })
		data: object;
	}
	const inData = new InData();
	inData.data = req.body.data;

	if (req.method !== 'GET' && req.method !== 'DELETE') {
		validate(inData)
			.then(errors => {
				if (Boolean(errors.length)) {
					res.status(400).json({
						message: 'BadRequestError',
						data: formatError(errors)
					});
				} else {
					req.body = req.body.data;
					next();
				}
			})
			.catch(err => next(err));
	} else {
		next();
	}
};

/**
 * nest response in key in data
 * @param  {string} itemKey? key to nest in
 * @param  {string=`${itemKey}s`} multiKey plural word for multi-responses. eg itemKey = 'user' multiKey = 'users'
 * @param  {boolean=false} disableMultiKey whether to disable multiKey
 */
export const nestInData = (
	itemKey?: string,
	multiKey: string = `${itemKey}s`,
	disableMultiKey: boolean = false
) => <T>(_action: Action, content: T) => {
	if (itemKey) {
		if (Array.isArray(content) && !disableMultiKey) {
			return { data: { [multiKey]: content } };
		}
		return { data: { [itemKey]: content } };
	}
	return { data: content };
};