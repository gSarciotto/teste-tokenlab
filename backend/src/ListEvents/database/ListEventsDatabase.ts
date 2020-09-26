import { IDatabase, convertEventModelToEvent } from "../../utils";
import { EventModel } from "../../sharedResources";
import { EventWithUsername } from "../EventWithUsername";
import { EventWithUsernameModel } from "./EventWithUsernameModel";

export interface IListEventsDatabase {
    getEvents: (ownerId: string) => Promise<EventWithUsername[]>;
}

export class ListEventsDatabase implements IListEventsDatabase {
    constructor(private database: IDatabase) {}
    getEvents(ownerId: string): Promise<EventWithUsername[]> {}
}
