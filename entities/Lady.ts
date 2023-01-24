import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LadiesWishes } from "./LadiesWishes";
import { LadyAbout } from "./LadyAbout";
import { PhotosLady } from "./PhotosLady";

@Index("username", ["username"], { unique: true })
@Index("email", ["email"], { unique: true })
@Entity("lady", { schema: "dating_app" })
export class Lady {
  @PrimaryGeneratedColumn({ type: "int", name: "lady_id", unsigned: true })
  ladyId: number;

  @Column("varchar", { name: "username", unique: true, length: 50 })
  username: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("varchar", { name: "email", unique: true, length: 50 })
  email: string;

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

  @Column("varchar", { name: "data_of_birth", length: 50 })
  dataOfBirth: string;

  @Column("varchar", { name: "state", length: 50 })
  state: string;

  @Column("varchar", { name: "city", length: 50 })
  city: string;

  @Column("enum", { name: "verified", enum: ["0", "1"], default: () => "'0'" })
  verified: "0" | "1";

  @Column("timestamp", { name: "created", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @OneToMany(() => LadiesWishes, (ladiesWishes) => ladiesWishes.lady)
  ladiesWishes: LadiesWishes[];

  @OneToMany(() => LadyAbout, (ladyAbout) => ladyAbout.lady)
  ladyAbouts: LadyAbout[];

  @OneToMany(() => PhotosLady, (photosLady) => photosLady.lady)
  photosLadies: PhotosLady[];
}
