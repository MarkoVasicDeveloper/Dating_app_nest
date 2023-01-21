import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Produces } from "./Produces";

@Index("FK_partners_photo_partners", ["produceId"], {})
@Entity("partners_photo", { schema: "dating_app" })
export class PartnersPhoto {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "partners_photo_id",
    unsigned: true,
  })
  partnersPhotoId: number;

  @Column("int", { name: "produce_id", unsigned: true, default: () => "'0'" })
  produceId: number;

  @Column("varchar", { name: "path", length: 255 })
  path: string;

  @ManyToOne(() => Produces, (produces) => produces.partnersPhotos, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "produce_id", referencedColumnName: "produceId" }])
  produce: Produces;
}
