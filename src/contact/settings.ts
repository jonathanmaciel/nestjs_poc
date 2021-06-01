import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name: 'tb_settings'})
export class Settings {

  @PrimaryGeneratedColumn({name: 'settings_id'})
  id: number;

  @Column({name: 'settings_value'})
  value: string;
}
