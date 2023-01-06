import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gentleman } from 'entities/Gentleman';
import { GentlemanAbout } from 'entities/GentlemanAbout';
import { Lady } from 'entities/Lady';
import { LadyAbout } from 'entities/LadyAbout';
import { PhotosGentleman } from 'entities/PhotosGentleman';
import { PhotosLady } from 'entities/PhotosLady';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'dating_app',
      entities: [Gentleman, GentlemanAbout, Lady, LadyAbout, PhotosGentleman, PhotosLady]
    }),
    TypeOrmModule.forFeature([Gentleman, GentlemanAbout, Lady, LadyAbout, PhotosGentleman, PhotosLady])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
