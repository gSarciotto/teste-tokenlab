import { EventModel } from "../../sharedResources";

export type EventWithUsernameModel = Pick<
    EventModel,
    "id" | "begin_time" | "end_time"
> & { creator_username: string };
