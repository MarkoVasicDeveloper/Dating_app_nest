import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("FK__gentleman", ["gentlemanId"], {})
@Index("FK__lady", ["ladyId"], {})
@Entity("message", { schema: "dating_app" })
export class Message {
  @PrimaryGeneratedColumn({ type: "int", name: "message_id", unsigned: true })
  messageId: number;

  @Column("int", { name: "gentleman_id", unsigned: true, default: () => "'0'" })
  gentlemanId: number;

  @Column("int", { name: "lady_id", unsigned: true, default: () => "'0'" })
  ladyId: number;

  @Column("json", { name: "message", nullable: true })
  message: object | null;

  @Column("json", { name: "unread_message", nullable: true })
  unreadMessage: object | null;
}
