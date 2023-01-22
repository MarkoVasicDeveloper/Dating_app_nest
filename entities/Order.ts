import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("order", { schema: "dating_app" })
export class Order {
  @PrimaryGeneratedColumn({ type: "int", name: "order_id", unsigned: true })
  orderId: number;

  @Column("int", { name: "customer_id", unsigned: true, default: () => "'0'" })
  customerId: number;

  @Column("varchar", {
    name: "customer_username",
    length: 50,
    default: () => "'0'",
  })
  customerUsername: string;

  @Column("varchar", {
    name: "customer_email",
    length: 50,
    default: () => "'0'",
  })
  customerEmail: string;

  @Column("int", { name: "produce_id", unsigned: true, default: () => "'0'" })
  produceId: number;

  @Column("int", { name: "recipient_id", unsigned: true, default: () => "'0'" })
  recipientId: number;

  @Column("int", { name: "quantity", unsigned: true, default: () => "'0'" })
  quantity: number;

  @Column("int", { name: "price", unsigned: true, default: () => "'0'" })
  price: number;

  @Column("enum", {
    name: "status",
    enum: ["on_hold", "approved", "realized"],
    default: () => "'on_hold'",
  })
  status: "on_hold" | "approved" | "realized";
}
