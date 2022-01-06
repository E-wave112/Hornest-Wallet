import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "./users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UsersService) {
        super();
    }

    public verify =async (email:string,password:string) => {
        const verifyUser = await this.userService.findUser(email,password);
        if (!verifyUser) {
            throw new UnauthorizedException();
        }
        return verifyUser;
    }
}