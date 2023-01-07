import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("refresh_token", { schema: "dating_app" })
export class RefreshToken {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "refresh_token_id",
    unsigned: true,
  })
  refreshTokenId: number;

  @Column("varchar", { name: "username", length: 50, default: () => "'0'" })
  username: string;

  @Column("varchar", {
    name: "refresh_token",
    length: 255,
    default: () => "'0'",
  })
  refreshToken: string;

  @Column("varchar", { name: "expire", length: 30, default: () => "'0'" })
  expire: string;
}
