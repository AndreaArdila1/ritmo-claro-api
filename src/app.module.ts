import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HabitosModule } from './habitos/habitos.module';

@Module({
  imports: [PrismaModule, AuthModule, HabitosModule],
})
export class AppModule {}