import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtTokenService } from '../helper/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly jwt: JwtTokenService
	) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const type = this.reflector.get<string>('type', context.getHandler());

		if(type === "PUBLIC") {
			return true;
		}
		
		const request = context.switchToHttp().getRequest();
		const token  = request.cookies?.['token'] || request.signedCookies?.['token'];

		if(!token) {
			return false;
		}

		const [user, jwtError] = this.jwt.verify(token);

		if(jwtError) {
			return false;
		}

		request.user = user;

		return true;
	}
}