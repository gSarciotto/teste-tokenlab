import { Event } from "../../sharedResources";

export interface ICreateEventDatabase {
    insertOne: (event: Event) => Promise<void>;
    getOtherEventsWithSameOwner: (ownerId: string) => Promise<Event[]>;
}

export class CreateEventDatabase implements ICreateEventDatabase {
    async insertOne(event: Event): Promise<void> {
        return Promise.resolve();
    }
    async getOtherEventsWithSameOwner(ownerId: string): Promise<Event[]> {
        return Promise.resolve([]);
    }
}
