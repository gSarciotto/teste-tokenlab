import { IDatabase, IJwt } from "../../utils";
import { UserModel } from "../../sharedResources";

type UserIdAndPassword = Pick<UserModel, "id" | "password">;

export interface ILoginDatabase {
    getUserPasswordAndId: (username: string) => Promise<UserIdAndPassword>;
}

export class LoginDatabase implements ILoginDatabase {
    constructor(private database: IDatabase) {}
    getUserPasswordAndId(username: string): Promise<UserIdAndPassword> {
        return Promise.resolve({
            id: "id",
            password: "password"
        });
    }
}
