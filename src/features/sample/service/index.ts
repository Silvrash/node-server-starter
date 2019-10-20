import { NotFoundError } from 'routing-controllers';
import * as mutations from './mutations';
import * as queries from './queries';

export const SampleNotFound = new NotFoundError('Sample not found');

export default {
	...mutations,
	...queries
};
