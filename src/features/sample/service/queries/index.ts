import { sampleRepository } from '@features/sample';
import { SampleNotFound } from '..';

export const getSampleById = async (id: string, throwable = true) => {
	const sample = await sampleRepository().findOne(id, {where: {isDeleted: false}});
	if (throwable && !sample) throw SampleNotFound;
	return sample;
};

export const getAllSamples = async () => {
	return sampleRepository().find({ order: { createdAt: 'DESC' }, where: {isDeleted: false} });
};
