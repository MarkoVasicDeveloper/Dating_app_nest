import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Partners } from "./Partners";
import { PartnersPhoto } from "./PartnersPhoto";

@Index("FK_produces_partners", ["partnerId"], {})
@Entity("produces", { schema: "dating_app" })
export class Produces {
  @PrimaryGeneratedColumn({ type: "int", name: "produce_id", unsigned: true })
  produceId: number;

  @Column("int", { name: "partner_id", unsigned: true, default: () => "'0'" })
  partnerId: number;

  @Column("varchar", { name: "title", length: 50, default: () => "'0'" })
  title: string;

  @Column("int", { name: "price", default: () => "'0'" })
  price: number;

  @ManyToOne(() => Partners, (partners) => partners.produces, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "partner_id", referencedColumnName: "partnerId" }])
  partner: Partners;

  @OneToMany(() => PartnersPhoto, (partnersPhoto) => partnersPhoto.produce)
  partnersPhotos: PartnersPhoto[];
}
