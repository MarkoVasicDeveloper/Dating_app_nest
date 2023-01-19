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

  @Column("varchar", { name: "about_the_person", length: 255 })
  aboutThePerson: string;

  @Column("int", { name: "height" })
  height: number;

  @Column("int", { name: "weight" })
  weight: number;

  @Column("enum", {
    name: "educations",
    enum: ["primary school", "high school", "college"],
  })
  educations: "primary school" | "high school" | "college";

  @Column("varchar", { name: "profession", length: 50 })
  profession: string;

  @Column("enum", {
    name: "marital_status",
    enum: ["married", "free", "complicated", "married", "but"],
  })
  maritalStatus: "married" | "free" | "complicated" | "married,but";

  @Column("int", { name: "children" })
  children: number;

  @Column("varchar", { name: "language", length: 50 })
  language: string;

  @Column("enum", { name: "true_information", enum: ["0", "1"] })
  trueInformation: "0" | "1";

  @ManyToOne(() => Lady, (lady) => lady.ladyAbouts, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "lady_id", referencedColumnName: "ladyId" }])
  lady: Lady;
}
