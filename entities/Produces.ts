import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("produces", { schema: "dating_app" })
export class Produces {
  @PrimaryGeneratedColumn({ type: "int", name: "produces_id", unsigned: true })
  producesId: number;

  @Column("varchar", { name: "title", length: 50, default: () => "'0'" })
  title: string;

  @Column("varchar", { name: "photo_path", length: 50, default: () => "'0'" })
  photoPath: string;

  @Column("int", { name: "price", default: () => "'0'" })
  price: number;
}
