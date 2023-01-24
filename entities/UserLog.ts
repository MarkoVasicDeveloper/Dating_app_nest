import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_log", { schema: "dating_app" })
export class UserLog {
  @PrimaryGeneratedColumn({ type: "int", name: "user_log_id", unsigned: true })
  userLogId: number;

  @Column("varchar", { name: "username", length: 50 })
  username: string;

  @Column("varchar", { name: "email", length: 50 })
  email: string;

  @Column("json", { name: "ip_addresses", nullable: true })
  ipAddresses: object | null;

  @Column("json", { name: "user_agent", nullable: true })
  userAgent: object | null;
}
