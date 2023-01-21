import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produces } from 'entities/Produces';
import { AddProducesDto } from 'src/dto/produces/add.produces.dto';
import { EditProducesDto } from 'src/dto/produces/edit.produce.dto';
import { ApiResponse } from 'src/misc/api.response';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ProducesService{
    constructor(@InjectRepository(Produces) private readonly producesService: Repository<Produces>){}

    async addProduce(data: AddProducesDto):Promise<Produces | ApiResponse> {
        const produce = new Produces();
        produce.partnerId = data.partnerId;
        produce.price = data.price;
        produce.title = data.title;

        const savedProduce = await this.producesService.save(produce);
        if(!savedProduce) return new ApiResponse('error', 'The produce is not saved!', -50001);
        return savedProduce;
    }

    async editProduce(data: EditProducesDto):Promise<ApiResponse | Produces> {
        const produce = await this.producesService.findOne({where:{produceId: data.produceId}});
        if(!produce) return new ApiResponse('error', "The produce is not found!", -50001);
        if(data.price) produce.price = data.price;
        if(data.title) produce.title = data.title;

        const savedProduce = await this.producesService.save(produce);
        if(!savedProduce) return new ApiResponse('error', 'The produce is not saved!', -50001);
        return savedProduce;
    }

    async deleteProduce(produceId:number, partnerId: number):Promise<ApiResponse | DeleteResult> {
        const produce = await this.producesService.findOne({
            where:{
                produceId,
                partnerId
            }
        })
        if(!produce) return new ApiResponse('error', "The produce is not found!", -50001);
        return await this.producesService.delete(produce);
    }
}