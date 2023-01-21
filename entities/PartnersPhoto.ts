import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Partners } from "./Partners";

@Index("FK_partners_photo_partners", ["partnerId"], {})
@Entity("partners_photo", { schema: "dating_app" })
export class PartnersPhoto {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "partners_photo",
    unsigned: true,
  })
  partnersPhoto: number;

  @Column("int", { name: "partner_id", unsigned: true, default: () => "'0'" })
  partnerId: number;

  @Column("varchar", { name: "path", length: 50 })
  path: string;

  @ManyToOne(() => Partners, (partners) => partners.partnersPhotos, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "partner_id", referencedColumnName: "partnerId" }])
  partner: Partners;
}
