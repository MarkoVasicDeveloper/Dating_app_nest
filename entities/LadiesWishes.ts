import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lady } from "./Lady";

@Index("FK__lady", ["ladyId"], {})
@Entity("ladies_wishes", { schema: "dating_app" })
export class LadiesWishes {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "ladies_wishes_id",
    unsigned: true,
  })
  ladiesWishesId: number;

  @Column("int", { name: "lady_id", unsigned: true })
  ladyId: number;

  @Column("json", { name: "wishes", nullable: true })
  wishes: object | null;

  @ManyToOne(() => Lady, (lady) => lady.ladiesWishes, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "lady_id", referencedColumnName: "ladyId" }])
  lady: Lady;
}
