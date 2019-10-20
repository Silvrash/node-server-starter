import { ValidationError } from 'class-validator';
import { HttpError } from 'routing-controllers';

export interface IError extends HttpError {
	message: string;
	data?: object;
	status?: number;
	errors?: ValidationError[];
	response?: any;
}
