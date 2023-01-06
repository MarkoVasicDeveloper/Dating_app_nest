import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Gentleman } from "./Gentleman";

@Index("FK_photos_gentleman_gentleman", ["gentlemanId"], {})
@Entity("photos_gentleman", { schema: "dating_app" })
export class PhotosGentleman {
  @PrimaryGeneratedColumn({ type: "int", name: "photo_id", unsigned: true })
  photoId: number;

  @Column("int", { name: "gentleman_id", unsigned: true, default: () => "'0'" })
  gentlemanId: number;

  @Column("varchar", { name: "path", length: 255, default: () => "'0'" })
  path: string;

  @ManyToOne(() => Gentleman, (gentleman) => gentleman.photosGentlemen, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "gentleman_id", referencedColumnName: "gentlemanId" }])
  gentleman: Gentleman;
}
