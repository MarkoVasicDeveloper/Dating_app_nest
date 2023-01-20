import { InjectRepository } from "@nestjs/typeorm";
import { LadyAbout } from "entities/LadyAbout";
import { AddLadyAboutDto } from "src/dto/lady_about/add.lady.about.dto";
import { EditLadyAboutDto } from "src/dto/lady_about/edit.lady.about.dto";
import { AboutReportDto } from "src/dto/report/about.report";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";

export class LadyAboutService{
    constructor(@InjectRepository(LadyAbout) private readonly ladyAboutService: Repository<LadyAbout>) {}

    async addLadyAbout(data: AddLadyAboutDto):Promise<LadyAbout | ApiResponse> {
        const existsAbout = await this.ladyAboutService.findOne({
            where: {
                ladyId: data.ladyId
            }
        });
        if(existsAbout) return new ApiResponse('error', 'The data for this user already exists!', -17001);

        const about = new LadyAbout();
        about.ladyId = data.ladyId;
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

        const savedAbout = await this.ladyAboutService.save(about);
        if(!savedAbout) return new ApiResponse('error', 'The about data is not saved!', -17002);
        return savedAbout;
    }

    async editLadyAbout(data: EditLadyAboutDto):Promise<LadyAbout | ApiResponse> {
        const existsAbout = await this.ladyAboutService.findOne({
            where: {
                ladyId: data.ladyId
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

        const savedAbout = await this.ladyAboutService.save(existsAbout);
        if(!savedAbout) return new ApiResponse('error', 'The about data is not saved!', -17002);
        return savedAbout;
    }

    async ladyAboutBasicReport():Promise<AboutReportDto> {
        const educationArray = ['primary school', 'high school', 'college'];
        const educationReport = {} as any;

        educationArray.forEach(async(education:'primary school' | 'high school' | 'college') => {
            const all = await this.ladyAboutService.count({
                where: {educations: education}
            });
            educationReport[education] = all
        })

        const maritalStatusArray = ['married', 'free', 'complicated', 'married,but'];
        const maritalStatusReport = {} as any;

        maritalStatusArray.forEach(async(status: 'married' | 'free' | 'complicated' | 'married,but') => {
            const all = await this.ladyAboutService.count({
                where: {maritalStatus: status}
            });
            maritalStatusReport[status] = all
        })
        const trueInformation = await this.ladyAboutService.count({
            where: {trueInformation: '1'}
        });

        const report = new AboutReportDto();
        report.educations = educationReport;
        report.maritalStatus = maritalStatusReport;
        report.trueInformation = trueInformation;

        return report;
    }
}