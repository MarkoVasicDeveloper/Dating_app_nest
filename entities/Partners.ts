import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GiftCategory } from "./GiftCategory";
import { Produces } from "./Produces";

@Index("name", ["name"], { unique: true })
@Index("FK__gift_category", ["giftCategoryId"], {})
@Entity("partners", { schema: "dating_app" })
export class Partners {
  @PrimaryGeneratedColumn({ type: "int", name: "partner_id", unsigned: true })
  partnerId: number;

  @Column("int", { name: "gift_category_id", unsigned: true })
  giftCategoryId: number;

  @Column("varchar", { name: "name", unique: true, length: 50 })
  name: string;

  @Column("varchar", { name: "description", length: 255 })
  description: string;

  @ManyToOne(() => GiftCategory, (giftCategory) => giftCategory.partners, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "gift_category_id", referencedColumnName: "giftCategoryId" },
  ])
  giftCategory: GiftCategory;

  @OneToMany(() => Produces, (produces) => produces.partner)
  produces: Produces[];
}
