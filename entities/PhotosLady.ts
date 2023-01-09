import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lady } from "./Lady";

@Index("FK_photos_lady_lady", ["ladyId"], {})
@Entity("photos_lady", { schema: "dating_app" })
export class PhotosLady {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "photos_lady_id",
    unsigned: true,
  })
  photosLadyId: number;

  @Column("int", { name: "lady_id", unsigned: true })
  ladyId: number;

  @Column("varchar", { name: "path", length: 255 })
  path: string;

  @ManyToOne(() => Lady, (lady) => lady.photosLadies, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "lady_id", referencedColumnName: "ladyId" }])
  lady: Lady;
}
