import { nestReqInData, nestInData } from '@BUtils/index';
import {
	Controller,
	UseBefore,
	UseInterceptor,
	HttpCode,
	Post,
	Get,
	Put,
	Delete,
	Body,
	Param
} from 'routing-controllers';
import { AddSampleSchema, UpdateSampleSchema, SampleService } from '@features/sample';

@Controller('/sample')
@UseBefore(nestReqInData)
export class SampleController {
	@HttpCode(201)
	@Post('/register')
	@UseInterceptor(nestInData('sample'))
	add(@Body() data: AddSampleSchema) {
		return {};
	}

	@Put('/:sampleId')
	@UseInterceptor(nestInData('sample'))
	update(@Param('sampleId') pollId: string, @Body() data: UpdateSampleSchema) {
		return {};
	}

	@Delete('/:sampleId')
	@UseInterceptor(nestInData())
	delete(@Param('sampleId') pollId: string) {
		return {};
	}

	@Get('/:id')
	@UseInterceptor(nestInData('sample'))
	getById(@Param('id') pollId: string) {
		return {};
	}

	@Get('/')
	@UseInterceptor(nestInData('sample'))
	getAll() {
		return {};
	}
}
