import {
	Body,
	Controller,
	Delete,
	Get,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Post,
	Request,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController {
	constructor(private readonly storage: StorageService) {}

	@Get('get-all')
	async getAllStorages(@Request() req: any) {
		const { id } = req.user;
		return await this.storage.getAllStorages(id);
	}

	@Get('/:id')
	async getStorage(@Param('id') id: string, @Request() req: any) {
		const { id: user } = req.user;
		return await this.storage.getStorage(user, id);
	}

	@Get('/:id/children')
	async getChildrenStorages(@Param('id') id: string, @Request() req: any) {
		const { id: user } = req.user;
		return await this.storage.getChildrenStorages(user, id);
	}


	@Post('create-folder')
	async createFolder(@Body() data: { name: string, folder: string }, @Request() req: any) {
		const { id: user } = req.user;
		return await this.storage.createFolder(user, data.name, data.folder);
	}

	@UseInterceptors(FileInterceptor('file'))
	@Post('create-file')
	async createFile(@Body() data: {folder: string},         @UploadedFile(
		new ParseFilePipe({
			validators: [new MaxFileSizeValidator({ maxSize: 1e7 })],
		}),
	)
		file: Express.Multer.File,@Request() req: any) {

		const {id} = req.user;
		return await this.storage.createFile(id, data.folder, file);

	}

	@Delete("/:id")
	async deleteStorage(@Param("id") id: string, @Request() req: any) {
		const { id: user } = req.user;
		return await this.storage.deleteStorage(user, id);
	}
}
