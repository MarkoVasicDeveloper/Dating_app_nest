import { InjectRepository } from "@nestjs/typeorm";
import { GentlemanAbout } from "entities/GentlemanAbout";
import { AddGentlemanAboutDto } from "src/dto/gentleman_about/add.gentleman.about.dto";
import { EditGentlemanAboutDto } from "src/dto/gentleman_about/edit.gentleman.about.dto";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { AboutReportDto } from "src/dto/report/about.report";

@Injectable()
export class GentlemanAboutService{
    constructor(@InjectRepository(GentlemanAbout) private readonly gentlemanAboutService: Repository<GentlemanAbout>) {}

    async addGentlemanAbout(data: AddGentlemanAboutDto):Promise<GentlemanAbout | ApiResponse> {
        const existsAbout = await this.gentlemanAboutService.findOne({
            where: {
                gentlemanId: data.gentlemanId
            }
        });
        if(existsAbout) return new ApiResponse('error', 'The data for this user already exists!', -17001);

        const about = new GentlemanAbout();
        about.gentlemanId = data.gentlemanId;
        about.about = data.about;
        about.aboutThePerson = data.aboutThePerson;
        about.children = data.children;
        about.educations = data.education;
        about.height = data.height;
        about.language = data.language;
        about.maritalStatus = data.maritalStatus;
        about.profession = data.profession;
        about.weight = data.weight;
        about.trueInformation = data.true_information;

        const savedAbout = await this.gentlemanAboutService.save(about);
        if(!savedAbout) return new ApiResponse('error', 'The about data is not saved!', -17002);
        return savedAbout;
    }

    async editGentlemanAbout(data: EditGentlemanAboutDto):Promise<GentlemanAbout | ApiResponse> {
        const existsAbout = await this.gentlemanAboutService.findOne({
            where: {
                gentlemanId: data.gentlemanId
            }
        });
        if(!existsAbout) return new ApiResponse('error', 'The data for this user is not found!', -17003);

        if(data.about) existsAbout.about = data.about;
        if(data.aboutThePerson) existsAbout.aboutThePerson = data.aboutThePerson;
        if(data.children) existsAbout.children = data.children;
        if(data.education) existsAbout.educations = data.education;
        if(data.height) existsAbout.height = data.height;
        if(data.language) existsAbout.language = data.language;
        if(data.maritalStatus) existsAbout.maritalStatus = data.maritalStatus;
        if(data.profession) existsAbout.profession = data.profession;
        if(data.weight) existsAbout.weight = data.weight;

        const savedAbout = await this.gentlemanAboutService.save(existsAbout);
        if(!savedAbout) return new ApiResponse('error', 'The about data is not saved!', -17002);
        return savedAbout;
    }

    async gentlemanAboutBasicReport():Promise<AboutReportDto> {
        const educationArray = ['primary school', 'high school', 'college'];
        const educationReport = {} as any;

        educationArray.forEach(async(education:'primary school' | 'high school' | 'college') => {
            const all = await this.gentlemanAboutService.count({
                where: {educations: education}
            });
            educationReport[education] = all
        })

        const maritalStatusArray = ['married', 'free', 'complicated', 'married,but'];
        const maritalStatusReport = {} as any;

        maritalStatusArray.forEach(async(status: 'married' | 'free' | 'complicated' | 'married,but') => {
            const all = await this.gentlemanAboutService.count({
                where: {maritalStatus: status}
            });
            maritalStatusReport[status] = all
        })
        const trueInformation = await this.gentlemanAboutService.count({
            where: {trueInformation: '1'}
        });

        const report = new AboutReportDto();
        report.educations = educationReport;
        report.maritalStatus = maritalStatusReport;
        report.trueInformation = trueInformation;

        return report;
    }
}