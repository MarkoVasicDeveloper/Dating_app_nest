import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Gentleman } from "entities/Gentleman";
import { Lady } from "entities/Lady";
import { RequestToAdministrator } from "entities/RequestToAdministrator";
import { AddRequestToAdminDto } from "src/dto/request_to_admin/requset.to.admin.dto";
import { ApiResponse } from "src/misc/api.response";
import { DeleteResult, Repository } from "typeorm";
import { AdministratorService } from "../administrator/administrator.service";
import { GentlemanService } from "../gentleman/gentleman.service";
import { LadyService } from "../lady/lady.service";
import {MailerService} from "../mailer/mailer.service";

@Injectable()
export class RequestToAdminService{
    constructor(@InjectRepository(RequestToAdministrator) private readonly requestService: Repository<RequestToAdministrator>,
                private readonly ladyService: LadyService,
                private readonly gentlemanService: GentlemanService,
                private readonly mailerService: MailerService) {}

    async addRequest(data: AddRequestToAdminDto):Promise<ApiResponse> {
        const senderUserService = data.lady ? this.ladyService : this.gentlemanService;
        const userService = data.lady ? this.gentlemanService : this.ladyService;

        const senderUser = await senderUserService.getByIdAndUsename(data.userId, data.username);
        if(senderUser instanceof ApiResponse) return senderUser;

        const user = await userService.getByEmail(data.request.email);
        if(user instanceof ApiResponse) return user;

        if(senderUser instanceof Gentleman && data.request.type !== 'violence' && senderUser.privileges !== 'gentlemanVip') return new ApiResponse('error','Your role is gentleman or gentlemanPremium. Gentleman and gentlemanPremium role doestn`t have permission for this activity!', -80001);
        
        const request = new RequestToAdministrator();
        request.email = senderUser.email;
        request.username = senderUser.username;
        const requestObject = {
            type: data.request.type,
            username: user.username,
            email: user.email,
            message: data.request.message
        }
        request.request = requestObject;

        const savedRequest = await this.requestService.save(request);
        if(!savedRequest) return new ApiResponse('error', 'The request is not saved!', -80002);
        this.mailerService.sendMailToAllAdmin('');
        return new ApiResponse('ok', 'Your request has been forwarded to an administrator. He will answer you as soon as possible.', 1000);
    }

    async deleteRequest(username: string, email: string):Promise<DeleteResult | ApiResponse> {
        const request = await this.requestService.findOne({where:{username, email}});
        if(!request) return new ApiResponse('error', 'The request is not found!',-80001);
        return await this.requestService.delete(request);
    }
}