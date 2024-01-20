import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AvatarService } from './avatar.service';
import { AWSService } from './aws.service';
import { MailService } from './mail.service';
import { JwtTokenService } from './jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [JwtModule.registerAsync({
		imports: [ConfigModule],
		useFactory: async (configService: ConfigService) => ({
			global: true,
			secret: configService.get("JWT_SECRET"),
			signOptions: { expiresIn: '1d' },
		}),
		inject: [ConfigService],
	})],
	providers: [PrismaService, AvatarService, AWSService, MailService, JwtTokenService],
	exports: [PrismaService, AvatarService, AWSService, MailService, JwtTokenService],
})
export class HelperModule {}
