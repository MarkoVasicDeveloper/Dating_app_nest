import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GentlemanAbout } from "./GentlemanAbout";
import { PhotosGentleman } from "./PhotosGentleman";

@Index("username", ["username"], { unique: true })
@Index("email", ["email"], { unique: true })
@Entity("gentleman", { schema: "dating_app" })
export class Gentleman {
  @PrimaryGeneratedColumn({ type: "int", name: "gentleman_id", unsigned: true })
  gentlemanId: number;

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

  @Column("json", { name: "conversations", nullable: true })
  conversations: object | null;

  @Column("json", { name: "blocked", nullable: true })
  blocked: object | null;

  @Column("json", { name: "conversation_request", nullable: true })
  conversationRequest: object | null;

  @Column("enum", {
    name: "privileges",
    enum: ["gentleman", "gentlemanPremium", "gentlemanVip"],
    default: () => "'gentleman'",
  })
  privileges: "gentleman" | "gentlemanPremium" | "gentlemanVip";

  @Column("enum", { name: "rules", enum: ["0", "1"], default: () => "'0'" })
  rules: "0" | "1";

  @Column("enum", {
    name: "notifications",
    enum: ["0", "1"],
    default: () => "'0'",
  })
  notifications: "0" | "1";

  @Column("varchar", { name: "date_of_birth", length: 50 })
  dateOfBirth: string;

  @Column("varchar", { name: "state", length: 50 })
  state: string;

  @Column("varchar", { name: "city", length: 50 })
  city: string;

  @Column("enum", { name: "verified", enum: ["0", "1"], default: () => "'0'" })
  verified: "0" | "1";

  @OneToMany(() => GentlemanAbout, (gentlemanAbout) => gentlemanAbout.gentleman)
  gentlemanAbouts: GentlemanAbout[];

  @OneToMany(
    () => PhotosGentleman,
    (photosGentleman) => photosGentleman.gentleman
  )
  photosGentlemen: PhotosGentleman[];
}
