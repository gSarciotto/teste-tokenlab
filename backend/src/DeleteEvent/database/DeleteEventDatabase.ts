import { IDatabase } from "../../utils";

export interface IDeleteEventDatabase {
    deleteOne: (eventId: string, creatorId: string) => Promise<void>;
}

export class DeleteEventDatabase implements IDeleteEventDatabase {
    constructor(private database: IDatabase) {}
    async deleteOne(eventId: string, creatorId: string): Promise<void> {}
}
