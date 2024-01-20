import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorDto } from '../types/error.dto';

@Injectable()
export class JwtTokenService {
	constructor(private readonly jwt: JwtService) {}

	sign(payload: any) : [string | null, ErrorDto] {
		try {
			const token =  this.jwt.sign(payload);
			return [token, null];
		} catch(error) {
			return [null, {message: "Internal Server Error", status: 500}]
		}
	}

	verify(token: string): [any, ErrorDto] {
		try {
			const payload = this.jwt.verify(token);
			return [payload, null];
		} catch(error) {
			return [null, {message: "Invalid Token", status: 401}]
		}
	}
}