import { Body, Controller, Get, Post, Query, Request, Response } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { Public } from '../../decorators/type.decorator';

@Controller('user')
export class UserController {
	constructor(private readonly user: UserService, private readonly configService: ConfigService) {}

	@Get("authenticate")
	reAuth() {
		return true;
	}

	@Public()
	@Get("login")
	async login(@Query('token') token: string, @Response() res: any) {
		const jwtToken = await this.user.login(token);

		res.cookie("token", jwtToken, {
			httpOnly: this.configService.get("NODE_ENV") === "production",
			sameSite: 'none',
			secure: this.configService.get("NODE_ENV") === "production",
			maxAge: 1000 * 60 * 60 * 24,
		});

		res.redirect(this.configService.get("CLIENT_URL"));
	}

	@Public()
	@Post('login')
	async requestLogin(@Body() data: {email: string}) {
		return await this.user.requestLogin(data.email);
	}

	@Public()
	@Post("register")
	async register(@Body() data: {name: string, email: string}) {
		return await this.user.register(data.name, data.email);
	}

	@Get("logout")
	async logout(@Response({passthrough: true}) res: any) {
		res.clearCookie("token",  {
			httpOnly: this.configService.get("NODE_ENV") === "production",
			sameSite: 'none',
			secure: this.configService.get("NODE_ENV") === "production",
			maxAge: 1000 * 60 * 60 * 24,
		});
		return true;
	}

	@Get("")
	async getUser(@Request() req: any) {
		const {id} = req.user;
		return await this.user.getUser(id);
	}

}
