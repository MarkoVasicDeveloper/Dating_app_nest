import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GiftCategory } from "entities/GiftCategory";
import { AddGiftDto } from "src/dto/gift/add.gift.dto";
import { ApiResponse } from "src/misc/api.response";
import { Any, DeleteResult, Repository } from "typeorm";

@Injectable()
export class GiftService{
    constructor(@InjectRepository(GiftCategory) private readonly giftService: Repository<GiftCategory>) {}

    async addGiftCategory(data: AddGiftDto):Promise<GiftCategory | ApiResponse> {
        try {
            const gift = new GiftCategory();
            gift.name = data.name;
            
            const savedCategory = await this.giftService.save(gift);
            if(!savedCategory) return new ApiResponse('error','The gift canegory is not saved!', -25001);
            return savedCategory
            
        } catch (error) {
            return new ApiResponse('error', 'The category already exists!', -25002);
        }
    }

    async editCategory(id: number, name: string):Promise<GiftCategory | ApiResponse> {
        const category = await this.giftService.findOne({where:{giftCategoryId: id}});
        if(!category) return new ApiResponse('error','The category is not found!', -25003);

        category.name = name;
        const savedCategory = await this.giftService.save(category);
        if(!savedCategory) return new ApiResponse('error','The gift canegory is not saved!', -25001);
        return savedCategory;
    }

    async getByIdOrName(id: string | null = null, name: string | null = null):Promise<ApiResponse | GiftCategory> {
        const notFound = new ApiResponse('error', 'The category is not found!', -25003)
        if(id !== 'null') {
            const category = await this.giftService.findOne({where: {giftCategoryId: Number(id)}});
            if(!category) return notFound;
            return category;
        }
        const category = await this.giftService.findOne({where: {name}});
        if(!category) return notFound;
        return category;
        
    }

    async getAllCategory():Promise<GiftCategory[]> {
        return await this.giftService.find({
            relations: ["partners"]
        });
    }

    async deleteCategory(categoryId: number):Promise<DeleteResult | ApiResponse>{
        const category = await this.giftService.findOne({where:{giftCategoryId: categoryId}});
        if(!category) return new ApiResponse('error', 'The category is not found!', -25003);
        return await this.giftService.delete(category);
    }
}