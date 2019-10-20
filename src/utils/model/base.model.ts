import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseModel<T> {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	/**
	 * date of project creation with respect to the database
	 */
	@CreateDateColumn({ type: 'datetime' })
	createdAt?: Date;

	@UpdateDateColumn({ type: 'datetime' })
	updatedAt?: Date;

	@Column({ default: false })
	@Exclude()
	isDeleted: boolean;

	init(data: Partial<T>) {
		Object.assign(this, data);
		return this;
	}

	constructor(data: Partial<T>) {
		this.init(data);
	}
}
