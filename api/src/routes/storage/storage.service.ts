import { HttpException, Injectable } from '@nestjs/common';
import { StorageRepository } from '../../db/storage.repository';
import { AWSService } from '../../helper/aws.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
	constructor(private readonly storage: StorageRepository, private readonly aws: AWSService) {}

	async getAllStorages(user: string) {
		const [storages, dbError] = await this.storage.getAll(user);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.status);
		}

		return storages;
	}

	async getChildrenStorages(user: string, parent: string) {
		const [storages, dbError] = await this.storage.getAllChildren(user, parent);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.status);
		}

		return storages;
	}

	async getStorage(user: string, id: string) {
		const [storage, dbError] = await this.storage.get(user, id);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.status);
		}

		return storage;
	}

	async createFolder(user: string, name: string, folder: string) {
		const [storage, dbError] = await this.storage.create(name, folder, "", "FOLDER", user);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.status);
		}

		return storage;
	}

	async createFile(user: string, folder: string, fileBuffer: Express.Multer.File) {
		const fileName = `${user}/${uuidv4()}-${fileBuffer.originalname.replace(/\s+/g, '_')}`;
		const [url, awsError] = await this.aws.uploadFile(fileName, fileBuffer);

		if (awsError) {
			throw new HttpException(awsError.message, awsError.status);
		}

		const [storage, dbError] = await this.storage.create(fileBuffer.originalname, folder, url, "FILE", user);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.status);
		}

		return storage;
	}

	async deleteStorage(user: string, id: string) {
		const dbError = await this.storage.delete(user, id);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.status);
		}

		return true;
	}
}
