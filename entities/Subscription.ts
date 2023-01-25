import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("subscription", { schema: "dating_app" })
export class Subscription {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "subscription_id",
    unsigned: true,
  })
  subscriptionId: number;

  @Column("varchar", { name: "title", length: 50 })
  title: string;

  @Column("varchar", { name: "description", length: 255 })
  description: string;

  @Column("int", { name: "price" })
  price: number;

  @Column("int", { name: "discont", nullable: true })
  discont: number | null;
}
