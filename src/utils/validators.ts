import { AuthenticationError, Constants } from '@BUtils/index';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import R from 'ramda';
import { Action } from 'routing-controllers';
import logger from './logger';

export const relationExists = (
	value: string,
	checkFunction: (id: any) => Promise<any>,
	body: boolean = true
) => (req: Request, _res: Response, next: NextFunction) => {
	const data = body ? req.body[value] : req.params[value];
	checkFunction(data)
		.then(() => next())
		.catch(next);
};

export const isObject = (property: string, validationOptions?: ValidationOptions) => {
	return (object: object, propertyName: string) => {
		registerDecorator({
			name: 'isObject',
			target: object.constructor,
			propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					return value !== null && typeof value === 'object';
				}
			}
		});
	};
};

export const currentUserChecker = async (action: Action) => {
	// here you can use request/response objects from action
	// you need to provide a user object that will be injected in controller actions
	const token = action.request.headers.authorization.replace('Bearer ', '');
	if (!token) throw AuthenticationError;

	try {
		return {};
	} catch (e) {
		logger.error(e);
		throw AuthenticationError;
	}
};

export const authorizationChecker = async (action: Action, roles: string[]) => {
	try {
		// get currentUser
		return true
	} catch (e) {
		logger.error(e)
		return false;
	}
};
