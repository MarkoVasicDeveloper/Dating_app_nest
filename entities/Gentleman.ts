import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PhotosGentleman } from "./PhotosGentleman";
import { GentlemanAbout } from "./GentlemanAbout";

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

  @Column("int", { name: "years", default: () => "'0'" })
  years: number;

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

  @OneToMany(
    () => PhotosGentleman,
    (photosGentleman) => photosGentleman.gentleman
  )
  photosGentlemen: PhotosGentleman[];

  @OneToMany(() => GentlemanAbout, (gentlemanAbout) => gentlemanAbout.gentleman)
  gentlemanAbouts: GentlemanAbout[];
}
