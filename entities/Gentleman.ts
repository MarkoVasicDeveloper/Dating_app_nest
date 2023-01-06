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

  @Column("varchar", { name: "password", length: 50, default: () => "'0'" })
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

  @OneToMany(() => GentlemanAbout, (gentlemanAbout) => gentlemanAbout.gentleman)
  gentlemanAbouts: GentlemanAbout[];

  @OneToMany(
    () => PhotosGentleman,
    (photosGentleman) => photosGentleman.gentleman
  )
  photosGentlemen: PhotosGentleman[];
}
