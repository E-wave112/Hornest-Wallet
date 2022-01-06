import { Column, Entity,PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({default:""})
    card?: string;

    @Column({default:""})
    cardExpiration?: string;

    @Column({default: "",})
    cardCvv?: string;
    

    @Column()
    createdAt: Date;

}