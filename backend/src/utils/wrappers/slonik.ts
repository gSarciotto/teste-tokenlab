import { createPool, DatabasePoolType } from "slonik";

export interface IDatabase {
    readonly pool: DatabasePoolType;
}

export class Database implements IDatabase {
    readonly pool: DatabasePoolType;

    constructor(connectionUrl: string | undefined) {
        if (connectionUrl) {
            this.pool = createPool(connectionUrl);
        }
        throw new Error("No database connection Url defined");
    }
}
