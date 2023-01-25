import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("email", ["email"], { unique: true })
@Index("username", ["username"], { unique: true })
@Entity("administrator", { schema: "dating_app" })
export class Administrator {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "administrator_id",
    unsigned: true,
  })
  administratorId: number;

  @Column("varchar", { name: "username", unique: true, length: 50 })
  username: string;

  @Column("varchar", { name: "email", unique: true, length: 50 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;
}
