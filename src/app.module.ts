import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gentleman } from 'entities/Gentleman';
import { GentlemanAbout } from 'entities/GentlemanAbout';
import { Lady } from 'entities/Lady';
import { LadyAbout } from 'entities/LadyAbout';
import { PhotosGentleman } from 'entities/PhotosGentleman';
import { PhotosLady } from 'entities/PhotosLady';
import { RefreshToken } from 'entities/RefreshToken';
import { AuthController } from './controllers/auth/auth.controller';
import { GentlemanController } from './controllers/gentleman/gentleman.controller.ts';
import { LadyContoller } from './controllers/lady/lady.controller';
import { GentlemanService } from './services/gentleman/gentleman.service';
import { JwtService } from './services/jwt/jwt.service';
import { LadyService } from './services/lady/lady.service';
import { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { AuthMiddleware } from './middleware/authMiddleware';
import { PhotoController } from './controllers/photo/photo.controller';
import { PhotoService } from './services/photo/photo.service';
import MailerService from './services/mailer/mailer.service';
import { Gateway } from './socket/gateway';
import { SocketService } from './services/socket/socket.service';
import { ConversationController } from './controllers/conversation/conversation.contoller';
import { ConversationService } from './services/conversations/conversations.service';
import { Message } from 'entities/Message';
import { MessagesService } from './services/message/message.service';
import { MessagesController } from './controllers/messages/messages.controller';
import { AdministratorService } from './services/administrator/administrator.service';
import { AdministratorController } from './controllers/administrator/administrator.controller';
import { Administrator } from 'entities/Administrator';
import { LadyAboutService } from './services/lady_about/lady.about.service';
import { LadyAboutController } from './controllers/lady_about/lady.about.controller';
import { VerificationAndPrivileguesService } from './services/verification_and_privileges/verification.privileges.service';
import { VerificationAndPrivilegesController } from './controllers/verification_and_privileges/verification.privileges.controller';
import { GentlemanAboutService } from './services/gentleman_about/gentleman.about.service';
import { GentlemanAboutController } from './controllers/gentleman_about/gentleman.about.controller';
import { ReportController } from './controllers/report/report.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'dating_app',
      entities: [Gentleman, GentlemanAbout, Lady, LadyAbout, PhotosGentleman, PhotosLady, RefreshToken, Message, Administrator]
    }),
    TypeOrmModule.forFeature([Gentleman, GentlemanAbout, Lady, LadyAbout, PhotosGentleman, PhotosLady, RefreshToken, Message, Administrator])
  ],
  controllers: [GentlemanController, LadyContoller, AuthController, PhotoController, ConversationController, MessagesController, AdministratorController, GentlemanController, LadyAboutController, VerificationAndPrivilegesController, GentlemanAboutController, ReportController],
  providers: [GentlemanService, LadyService, JwtService, PhotoService, MailerService, Gateway, SocketService, ConversationService, MessagesService, AdministratorService, GentlemanService, LadyAboutService, VerificationAndPrivileguesService, GentlemanAboutService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('auth/*', 'api/add/gentleman', 'api/add/lady').forRoutes('api/*')
  }
}
