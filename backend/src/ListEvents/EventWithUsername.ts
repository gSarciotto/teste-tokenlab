import { Event } from "../sharedResources";

export type EventWithUsername = Pick<Event, "begin" | "end"> & {
    id: string;
    creatorUsername: string;
};
