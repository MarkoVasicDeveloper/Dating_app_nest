import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("request_to_administrator", { schema: "dating_app" })
export class RequestToAdministrator {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "request_to_administrator_id",
    unsigned: true,
  })
  requestToAdministratorId: number;

  @Column("varchar", { name: "username", length: 50 })
  username: string;

  @Column("varchar", { name: "email", length: 50 })
  email: string;

  @Column("json", { name: "request" })
  request: object;
}
