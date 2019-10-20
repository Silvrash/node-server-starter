import { IsString, IsOptional, IsNumber } from 'class-validator';

export class AddSampleSchema {
	@IsString()
	name: string;

}

export class UpdateSampleSchema {
	@IsString()
	@IsOptional()
	name: string;
}
