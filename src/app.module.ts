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
import {MailerService} from './services/mailer/mailer.service';
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
import { PasswordResetController } from './controllers/password_reset/password.reset.controller';
import { PasswordResetService } from './services/password_reset/password.reset.service';
import { GiftController } from './controllers/gift/gift.controller';
import { GiftCategory } from 'entities/GiftCategory';
import { GiftService } from './services/gift/gift.service';
import { Partners } from 'entities/Partners';
import { PartnersPhoto } from 'entities/PartnersPhoto';
import { Produces } from 'entities/Produces';
import { PartnersController } from './controllers/partners/partners.controller';
import { PartnersService } from './services/partners/partners.service';
import { ProducePhotoService } from './services/produce_photo/produce.photo.service';
import { ProducePhotoController } from './controllers/produce_photo/produce.photo.controller';
import { ProducesService } from './services/produces/produces.service';
import { ProducesController } from './controllers/produces/produces.controller';
import { OrderService } from './services/order/order.service';
import { OrderController } from './controllers/order/order.controller';
import { Order } from 'entities/Order';
import { LadiesWishes } from 'entities/LadiesWishes';
import { LadiesWishesController } from './controllers/ladies_wishes/ladies.wishes.controller';
import { LadiesWishesService } from './services/ladies_wishies/ladies.wishes.service';
import { RequestToAdminService } from './services/request_to_admin/request.to.admin';
import { RequestToAdministratorController } from './controllers/request_to_admin/request.to.admin.controller';
import { RequestToAdministrator } from 'entities/RequestToAdministrator';
import { UserLog } from 'entities/UserLog';
import { UserLogService } from './services/user_log/user.log.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobsService } from './services/cron_jobs/cron.jobs.service';
import { Subscription } from 'entities/Subscription';
import { SubscriptionController } from './controllers/subscription/subscription.controller';
import { SubscriptionService } from './services/subscription/subscription.service';
import { EmailTemplateController } from './controllers/files/email.template.controller';
import { EmailTemplateService } from './services/email_template/email.template.service';
import { TrueInformation } from 'entities/TrueInformation';
import { TrueInformationController } from './controllers/true_information/true.information.controller';
import { TrueInformationService } from './services/true_information/true.information.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'dating_app',
      entities: [Gentleman, GentlemanAbout, Lady, LadyAbout, PhotosGentleman, PhotosLady, RefreshToken, Message, Administrator, GiftCategory, Partners, PartnersPhoto, Produces, Order, LadiesWishes, RequestToAdministrator, UserLog, Subscription, TrueInformation]
    }),
    TypeOrmModule.forFeature([Gentleman, GentlemanAbout, Lady, LadyAbout, PhotosGentleman, PhotosLady, RefreshToken, Message, Administrator, GiftCategory, Partners, PartnersPhoto, Produces, Order, LadiesWishes, RequestToAdministrator, UserLog, Subscription, TrueInformation]),
    ScheduleModule.forRoot()
  ],
  controllers: [GentlemanController, LadyContoller, AuthController, PhotoController, ConversationController, MessagesController, AdministratorController, GentlemanController, LadyAboutController, VerificationAndPrivilegesController, GentlemanAboutController, ReportController, PasswordResetController, GiftController, PartnersController, ProducePhotoController, ProducesController, OrderController, LadiesWishesController, RequestToAdministratorController, SubscriptionController, EmailTemplateController, TrueInformationController],
  providers: [GentlemanService, LadyService, JwtService, PhotoService, MailerService, Gateway, SocketService, ConversationService, MessagesService, AdministratorService, GentlemanService, LadyAboutService, VerificationAndPrivileguesService, GentlemanAboutService, PasswordResetService, GiftService, PartnersService, ProducePhotoService, ProducesService, OrderService, LadiesWishesService, RequestToAdminService, UserLogService, CronJobsService, SubscriptionService, EmailTemplateService, TrueInformationService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('auth/*', 'api/add/gentleman', 'api/add/lady').forRoutes('api/*')
  }
}
