import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LadiesWishes } from 'entities/LadiesWishes';
import { EditLadiesWishisDto } from 'src/dto/ladies_wishes/edit.ladies.wisshes.dto';
import { ApiResponse } from 'src/misc/api.response';
import { fillObject } from 'src/misc/fill.object';
import { Repository } from 'typeorm';

@Injectable()
export class LadiesWishesService {
    constructor(@InjectRepository(LadiesWishes) private readonly ladiesWishesService: Repository<LadiesWishes>) {}

    async addLadiesWishes(ladyId: number):Promise<LadiesWishes | ApiResponse> {
        const ladiseWishes = new LadiesWishes();
        ladiseWishes.ladyId = ladyId;

        const savedLadyWishes = await this.ladiesWishesService.save(ladiseWishes);
        if(!savedLadyWishes) return new ApiResponse('error', 'The wishes is not saved!', -70001);
        return savedLadyWishes;
    }

    async editLadiesWishes(data: EditLadiesWishisDto):Promise<LadiesWishes | ApiResponse> {
        const ladyWishes = await this.ladiesWishesService.findOne({where:{ladyId: data.ladyId}});
        if(!ladyWishes) return new ApiResponse('error', 'The wishes is not found', -70002);

        ladyWishes.wishes = fillObject(ladyWishes.wishes, {
            question: data.question,
            answer: data.answer
        });

        const savedLadyWishes = await this.ladiesWishesService.save(ladyWishes);
        if(!savedLadyWishes) return new ApiResponse('error', 'The wishes is not saved!', -70001);
        return savedLadyWishes;
    }

    async getWishesByLadyId(ladyId: number):Promise<LadiesWishes | ApiResponse> {
        const wishes = await this.ladiesWishesService.findOne({where:{ladyId}});
        if(!wishes) return new ApiResponse('error', 'The wishes is not found', -70002);
        return wishes;
    }
}