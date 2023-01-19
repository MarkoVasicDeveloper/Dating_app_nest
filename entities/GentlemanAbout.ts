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

  @ManyToOne(() => Gentleman, (gentleman) => gentleman.gentlemanAbouts, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "gentleman_id", referencedColumnName: "gentlemanId" }])
  gentleman: Gentleman;
}
