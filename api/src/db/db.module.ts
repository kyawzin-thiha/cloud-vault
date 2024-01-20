import { Module } from '@nestjs/common';
import { HelperModule } from '../helper/helper.module';
import { UserRepository } from './user.repository';
import { StorageRepository } from './storage.repository';
import { TokenRepository } from './token.repository';

@Module({
	imports: [HelperModule],
	providers: [UserRepository, StorageRepository, TokenRepository],
	exports: [UserRepository, StorageRepository, TokenRepository],
})
export class DbModule {}
