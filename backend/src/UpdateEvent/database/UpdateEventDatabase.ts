import { IDatabase } from "../../utils";
import { UpdateEventBody } from "../route";

export interface IUpdateEventDatabase {
    updateEvent: (
        eventInformation: UpdateEventBody,
        creatorId: string
    ) => Promise<void>;
}

export class UpdateEventDatabase implements IUpdateEventDatabase {
    constructor(private database: IDatabase) {}
    async updateEvent(
        eventInformation: UpdateEventBody,
        creatorId: string
    ): Promise<void> {}
}
