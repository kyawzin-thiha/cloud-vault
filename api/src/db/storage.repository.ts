import { Prisma, Type } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../helper/prisma.service';
import { StorageDto, StoragesDto } from '../types/data.dto';
import { ErrorDto } from '../types/error.dto';

@Injectable()
export class StorageRepository {
	constructor(private readonly prisma: PrismaService) {}

	async get(owner: string, id: string) : Promise<[StorageDto, ErrorDto]> {
		try {
			const storage = await this.prisma.storage.findUnique({
				where: {id, owner: {id: owner}}
			})

			if(!storage) {
				return [null, { message: "Storage not found", status: 404 }];
			}

			return [storage, null];
		}catch(error) {
			return [null, { message: "Internal Server Error", status: 500 }];
		}
	}

	async getAll(owner: string) : Promise<[StoragesDto, ErrorDto]> {
		try {
			const storages = await this.prisma.storage.findMany({
				where: {owner : {id: owner}}
			})

			return [storages, null];
		}catch(error) {
			return [null, { message: "Internal Server Error", status: 500 }];
		}
	}

	async getFolders(folders: string[]) : Promise<[{id: string, name: string}[] | null, ErrorDto]> {
		try {
			const folderData = await this.prisma.storage.findMany({
				where: {id: {in: folders}},
				select: {id: true, name: true}
			})
			return [folderData, null];
		} catch{
			return [null, { message: "Internal Server Error", status: 500 }];
		}
	}
	async getAllChildren(owner: string, parent: string) : Promise<[StoragesDto, ErrorDto]> {
		try {
			const storages = await this.prisma.storage.findMany({
				where: {parent : {id: parent}, owner: {id: owner}}
			})

			return [storages, null];
		}catch(error) {
			return [null, { message: "Internal Server Error", status: 500 }];
		}
	}

	async create(name: string, folder: string, path: string, type: Type, owner: string) : Promise<[StorageDto, ErrorDto]> {
		try {
			const storageData: Prisma.StorageCreateInput = {
				name,
				path,
				type,
				owner: { connect: { id: owner } },
			};

			if(folder && folder !== "") {
				storageData.parent = { connect: { id: folder } };
			}

			const storage = await this.prisma.storage.create({
				data: storageData
			})

			return [storage, null];
		} catch(error) {
			return [null, { message: "Internal Server Error", status: 500 }];
		}
	}

	async delete(owner: string, id: string) : Promise<ErrorDto> {
		try {
			await this.prisma.storage.delete({
				where: {id, owner: {id: owner}}
			})
			return null;
		} catch(error) {
			return { message: "Internal Server Error", status: 500 };
		}
	}
}