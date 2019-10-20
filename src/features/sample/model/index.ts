import { BaseModel } from '@BUtils/index';
import { Column, Entity, getRepository, OneToMany } from 'typeorm';

@Entity()
export class Sample extends BaseModel<Sample> {

	@Column()
	name: string;

}

export const sampleRepository = () => getRepository(Sample);
