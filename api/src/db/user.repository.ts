import { Injectable } from '@nestjs/common';
import { PrismaService } from '../helper/prisma.service';
import { UserDto } from '../types/data.dto';
import { ErrorDto } from '../types/error.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async get(id: string) : Promise<[UserDto, ErrorDto]> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {id}
			})
			if(!user) {
				return [null, { message: "User not found", status: 404 }];
			}
			return [user, null];
		} catch(error) {
			return [null, { message: "Internal Server Error", status: 500 }];
		}
	}

	async search(email: string) : Promise<[UserDto, ErrorDto]> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {email}
			})
			if(!user) {
				return [null, { message: "User not found. You might not have an account with us yet.", status: 404 }];
			}
			return [user, null];
		} catch(error) {
			return [null, { message: "Internal Server Error", status: 500 }];
		}
	}

	async create(name: string, email: string, profile: string) : Promise<[UserDto, ErrorDto]> {
		try {
			const user = await this.prisma.user.create({
				data: {name, email, profile}
			})

			return [user, null];
		} catch(error) {
			if(error instanceof  Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
				return [null, { message: "Email already exist", status: 400 }];
			}
			return [null, { message: "Internal Server Error", status: 500 }];
		}
	}

	async delete(id: string) : Promise<ErrorDto> {
		try {
			await this.prisma.user.delete({
				where: {id}
			})
			return null;
		} catch(error) {
			return { message: "Internal Server Error", status: 500 };
		}
	}
}