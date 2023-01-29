import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Administrator } from "entities/Administrator";
import { AddAdministratorDto } from "src/dto/administrator/add.administrator.dto";
import { ApiResponse } from "src/misc/api.response";
import { DeleteResult, Repository } from "typeorm";
import * as crypto from 'crypto';
import { EditAdministratorDto } from "src/dto/administrator/edit.administrator.dto";
import { passwordHash } from "src/misc/password.hash";
import { DeleteAdminDto } from "src/dto/administrator/delete.administrator.dto";
import { JwtService } from "../jwt/jwt.service";

@Injectable()
export class AdministratorService{
    constructor(@InjectRepository(Administrator) private readonly adminService: Repository<Administrator>,
                private readonly jwtService: JwtService) {}

    async createAdmin(data: AddAdministratorDto):Promise<Administrator | ApiResponse> {
        try {
            const admin = new Administrator();
            admin.username = data.username;
            admin.email = data.email;
            admin.password = passwordHash(data.password);

            const savedAdmin = await this.adminService.save(admin);

            return savedAdmin;
        } catch (error) {
            return new ApiResponse('error', 'Username or email is alredy used!', -15001);
        }
    }

    async getByUsername(username: string):Promise<Administrator | ApiResponse> {
        const admin = await this.adminService.findOne({
            where: {
                username
            }
        })
        
        if(!admin) return new ApiResponse('error', 'Admin is not found!', -15002);
        return admin;
    }

    async getById(id: number):Promise<Administrator | ApiResponse> {
        const admin = await this.adminService.findOne({
            where: {
                administratorId: id
            }
        })
        if(!admin) return new ApiResponse('error', 'Admin is not found!', -15002);
        return admin;
    }

    async getByEmail(email: string):Promise<Administrator | ApiResponse> {
        const admin = await this.adminService.findOne({
            where: {
                email
            }
        })
        if(!admin) return new ApiResponse('error', 'Admin is not found!', -15002);
        return admin;
    }

    async editAdministrator(data: EditAdministratorDto):Promise<Administrator | ApiResponse> {
        const admin = await this.adminService.findOne({
            where: {
                username: data.username,
                password: passwordHash(data.password)
            }
        })
        if(!admin) return new ApiResponse('error', 'Admin is not found!', -15002);

        if(data.editPassword) admin.password = passwordHash(data.editPassword);

        if(data.editUsername) admin.username = data.editUsername;
        if(data.editEmail) admin.email = data.editEmail;

        return await this.adminService.save(admin);
    }

    async getAllAdministrator():Promise<Administrator[]> {
        return await this.adminService.find()
    }

    async deleteAdmin(data: DeleteAdminDto):Promise<ApiResponse | DeleteResult> {
        const checkAdmin = await this.adminService.findOne({
            where: {
                administratorId: data.id,
                username: data.username,
                password: passwordHash(data.password)
            }
        })
        if(!checkAdmin) return new ApiResponse('error', 'Your data is not correct!', -15005);

        const deleteAdmin = await this.adminService.findOne({
            where: {
                administratorId: data.deleteId,
                username: data.deleteUsername,
                email: data.deleteEmail
            }
        })

        if(!deleteAdmin) return new ApiResponse('error', 'Admin is not found!', -15002);

        const refreshToken = await this.jwtService.getTokenByUsername(deleteAdmin.username);
        await this.jwtService.deleteRefreshToken(refreshToken.refreshToken);

        return await this.adminService.delete(deleteAdmin)
    }
}