import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from './helper/helper.module';
import { DbModule } from './db/db.module';
import { UserModule } from './routes/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guatd';
import { StorageModule } from './routes/storage/storage.module';

@Module({
	imports: [ConfigModule.forRoot({
		isGlobal: true,
	}), HelperModule, DbModule, UserModule, StorageModule],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		}
	]
})
export class AppModule {}
