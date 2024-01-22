import { Injectable } from '@nestjs/common';
import { PrismaService } from '../helper/prisma.service';
import { TokenDto } from '../types/data.dto';
import { ErrorDto } from '../types/error.dto';

@Injectable()
export class TokenRepository {
	constructor(private readonly prisma: PrismaService) {}

	async get(id: string) : Promise<[TokenDto, ErrorDto]> {
		try {
			const token = await this.prisma.token.findUnique({
				where: {id},
				include: {user: true}
			});
			if(!token) {
				return [null, { message: "Token not found", status: 404 }];
			}
			return [token, null];
		} catch(error) {
			return [null, { message: "Internal Server Error", status: 500 }];
		}
	}

	async search(key: string) : Promise<[TokenDto, ErrorDto]> {
		try {
			const token = await this.prisma.token.findUnique({
				where: {token: key},
				include: {user: true}
			});
			if(!token) {
				return [null, { message: "Token not found", status: 404 }];
			}
			return [token, null];
		} catch(error) {
			return [null, { message: "Internal Server Error", status: 500 }];
		}
	}

	async create(token: string, user: string) : Promise<[TokenDto, ErrorDto]> {
		try {
			const newToken = await this.prisma.token.create({
				data: {
					token,
					user: {connect: {id: user}}
				},
				include: {
					user: true,
				}
			})
			return [newToken, null];
		} catch(error) {
			return [null, { message: "Internal Server Error", status: 500 }];
		}
	}

	async delete(id: string) : Promise<ErrorDto> {
		try {
			await this.prisma.token.delete({
				where: {id}
			})
			return null;
		} catch(error) {
			return { message: "Internal Server Error", status: 500 };
		}
	}
}