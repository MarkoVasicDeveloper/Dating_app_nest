import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_log", { schema: "dating_app" })
export class UserLog {
  @PrimaryGeneratedColumn({ type: "int", name: "user_log_id", unsigned: true })
  userLogId: number;

  @Column("varchar", { name: "username", length: 50 })
  username: string;

  @Column("varchar", { name: "email", length: 50 })
  email: string;

  @Column("json", { name: "ip_addresses" })
  ipAddresses: object;

  @Column("json", { name: "user_agent" })
  userAgent: object;
}
