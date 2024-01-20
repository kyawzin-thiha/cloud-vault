import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HelperModule } from '../../helper/helper.module';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [HelperModule, DbModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
