import { HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../db/user.repository';
import { AvatarService } from '../../helper/avatar.service';
import { AWSService } from '../../helper/aws.service';
import { MailService } from '../../helper/mail.service';
import { TokenRepository } from '../../db/token.repository';
import { JwtTokenService } from '../../helper/jwt.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
	constructor(private readonly configService: ConfigService, private readonly user: UserRepository, private readonly token: TokenRepository, private readonly avatar: AvatarService, private readonly aws: AWSService, private readonly mail: MailService, private readonly jwt: JwtTokenService) {}

	async register(name: string, email: string) {
		const avatar = this.avatar.generateAvatar(email);

		const [avatarUrl, awsError] = await this.aws.uploadString(`avatars/${email}-avatar.svg`, avatar, 'image/svg+xml');

		if (awsError) {
			throw new HttpException(awsError, awsError.status);
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [_, dbError] = await this.user.create(name, email, avatarUrl);

		if (dbError) {
			throw new HttpException(dbError, dbError.status);
		}

		return true;
	}

	async requestLogin(email: string) {
		const [user, dbError] = await this.user.search(email);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.status);
		}

		if (!user) {
			throw new HttpException({ message: 'User not found', status: 404 }, 404);
		}

		const [token, tokenError] = await this.token.create(uuidv4(), user.id);

		if (tokenError) {
			throw new HttpException(tokenError.message, tokenError.status);
		}

		const loginUrl = `${this.configService.get("API_URL")}/user/login?token=${token.token}`;

		const mailError = await this.mail.sendEmail(email, { loginUrl });

		if (mailError) {
			throw new HttpException(mailError.message, mailError.status);
		}

		return true;
	}

	async login(loginToken: string) {
		const [token, dbError] = await this.token.search(loginToken);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.status);
		}

		const payload = {
			id: token.user.id,
			email: token.user.email,
		}

		const [jwtToken, jwtError] = this.jwt.sign(payload);

		if (jwtError) {
			throw new HttpException(jwtError.message, jwtError.status);
		}

		return jwtToken;

	}

	async getUser(id: string) {
		const [user, dbError] = await this.user.get(id);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.status);
		}

		return user;
	}
}
