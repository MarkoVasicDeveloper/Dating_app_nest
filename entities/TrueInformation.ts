import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("true_information", { schema: "dating_app" })
export class TrueInformation {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "true_information_id",
    unsigned: true,
  })
  trueInformationId: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("enum", { name: "lady", enum: ["0", "1"] })
  lady: "0" | "1";

  @Column("varchar", { name: "name", length: 50 })
  name: string;

  @Column("varchar", { name: "surname", length: 50 })
  surname: string;

  @Column("varchar", { name: "address", length: 50 })
  address: string;

  @Column("varchar", { name: "city", length: 50 })
  city: string;

  @Column("varchar", { name: "phone", length: 50 })
  phone: string;
}
