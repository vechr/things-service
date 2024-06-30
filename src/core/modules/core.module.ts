import { Module } from '@nestjs/common';
import AuditModule from './audits/audit.module';

@Module({
  imports: [AuditModule],
})
export class CoreModule {}
