import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Lady } from "./Lady";

@Index("FK_lady_about_lady", ["ladyId"], {})
@Entity("lady_about", { schema: "dating_app" })
export class LadyAbout {
  @Column("int", { primary: true, name: "lady_about_id", unsigned: true })
  ladyAboutId: number;

  @Column("int", { name: "lady_id", unsigned: true })
  ladyId: number;

  @Column("varchar", { name: "about", length: 255 })
  about: string;

  @ManyToOne(() => Lady, (lady) => lady.ladyAbouts, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "lady_id", referencedColumnName: "ladyId" }])
  lady: Lady;
}
