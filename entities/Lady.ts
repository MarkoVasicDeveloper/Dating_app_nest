import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LadyAbout } from "./LadyAbout";
import { PhotosLady } from "./PhotosLady";

@Index("email", ["email"], { unique: true })
@Index("username", ["username"], { unique: true })
@Entity("lady", { schema: "dating_app" })
export class Lady {
  @PrimaryGeneratedColumn({ type: "int", name: "lady_id", unsigned: true })
  ladyId: number;

  @Column("varchar", {
    name: "username",
    unique: true,
    length: 50,
    default: () => "'0'",
  })
  username: string;

  @Column("varchar", { name: "password", length: 255, default: () => "'0'" })
  password: string;

  @Column("varchar", {
    name: "email",
    unique: true,
    length: 50,
    default: () => "'0'",
  })
  email: string;

  @Column("int", { name: "years", nullable: true })
  years: number | null;

  @Column("json", { name: "conversations", nullable: true })
  conversations: object | null;

  @Column("json", { name: "blocked", nullable: true })
  blocked: object | null;

  @Column("json", { name: "conversation_request", nullable: true })
  conversationRequest: object | null;

  @Column("enum", { name: "rules", enum: ["0", "1"], default: () => "'0'" })
  rules: "0" | "1";

  @Column("enum", {
    name: "notification",
    enum: ["0", "1"],
    default: () => "'0'",
  })
  notification: "0" | "1";

  @Column("date", { name: "data_of_birth" })
  dataOfBirth: string;

  @Column("varchar", { name: "state", length: 50 })
  state: string;

  @Column("varchar", { name: "city", length: 50 })
  city: string;

  @OneToMany(() => LadyAbout, (ladyAbout) => ladyAbout.lady)
  ladyAbouts: LadyAbout[];

  @OneToMany(() => PhotosLady, (photosLady) => photosLady.lady)
  photosLadies: PhotosLady[];
}
