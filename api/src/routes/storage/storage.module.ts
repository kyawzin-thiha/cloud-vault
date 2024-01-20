import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { HelperModule } from '../../helper/helper.module';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [HelperModule, DbModule],
  controllers: [StorageController],
  providers: [StorageService]
})
export class StorageModule {}
