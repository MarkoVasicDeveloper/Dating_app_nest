import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Partners } from "./Partners";

@Entity("gift_category", { schema: "dating_app" })
export class GiftCategory {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "gift_category_id",
    unsigned: true,
  })
  giftCategoryId: number;

  @Column("varchar", { name: "name", length: 120 })
  name: string;

  @OneToMany(() => Partners, (partners) => partners.giftCategory)
  partners: Partners[];
}
