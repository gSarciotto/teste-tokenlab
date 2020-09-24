import { sql } from "slonik";
import { UserCredentials } from "../../sharedResources";
import { IDatabase } from "../../utils";

export interface ICreateUserDatabase {
    insertOne: (user: UserCredentials) => Promise<void>;
}

export class CreateUserDatabase implements ICreateUserDatabase {
    constructor(private database: IDatabase) {}
    async insertOne(user: UserCredentials): Promise<void> {
        return Promise.resolve();
    }
}
