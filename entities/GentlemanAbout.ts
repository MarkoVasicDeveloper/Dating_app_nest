import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Gentleman } from "./Gentleman";

@Index("FK_gentleman_about_gentleman", ["gentlemanId"], {})
@Entity("gentleman_about", { schema: "dating_app" })
export class GentlemanAbout {
  @Column("int", { primary: true, name: "gentleman_about_id", unsigned: true })
  gentlemanAboutId: number;

  @Column("int", { name: "gentleman_id", unsigned: true })
  gentlemanId: number;

  @Column("varchar", { name: "about", length: 255 })
  about: string;

  @ManyToOne(() => Gentleman, (gentleman) => gentleman.gentlemanAbouts, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "gentleman_id", referencedColumnName: "gentlemanId" }])
  gentleman: Gentleman;
}
