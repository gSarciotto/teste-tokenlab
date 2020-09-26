import { sql } from "slonik";
import { config } from "dotenv";
import { CreateEventDatabase } from "./CreateEventDatabase";
import {
    Database,
    IDatabase,
    Uuid,
    convertEventModelToEvent
} from "../../utils";
import { Event } from "../../sharedResources";
import { EventModel } from "../../sharedResources/models/EventModel";

config();

async function clearTables(database: IDatabase): Promise<void> {
    await database.pool.query(sql`DELETE FROM events`);
    await database.pool.query(sql`DELETE FROM users`);
}

describe("CreateEventDatabase.insertOne should", () => {
    const database = new Database(process.env.DB_CONNECTION);
    const uuid = new Uuid();
    const createEventDatabase = new CreateEventDatabase(database, uuid);
    const existingUserId = uuid.generateV4();
    const newEvent: Event = {
        creatorId: existingUserId,
        begin: new Date(),
        end: new Date(Date.now() + 1000)
    };
    beforeAll(async () => {
        await clearTables(database);
    });
    beforeEach(async () => {
        const username = "eventOwner";
        const password = "password";
        await clearTables(database);
        await database.pool.query(
            sql`INSERT INTO users (id, username, password) VALUES (${existingUserId}, ${username}, ${password})`
        );
    });
    afterAll(async () => {
        await database.pool.end();
    });
    test("create an event", async () => {
        await createEventDatabase.insertOne(newEvent);
        const results = await database.pool.one<EventModel>(
            sql`SELECT creator_id, begin_time, end_time FROM events WHERE creator_id=${existingUserId}`
        );
        const convertedResults = convertEventModelToEvent(results);
        expect(convertedResults.creatorId).toBe(existingUserId);
        expect(convertedResults.begin.getTime()).toBe(newEvent.begin.getTime());
        expect(convertedResults.end.getTime()).toBe(newEvent.end.getTime());
    });
    test("create multiple events associated with the same user", async () => {
        await createEventDatabase.insertOne(newEvent);
        await createEventDatabase.insertOne(newEvent);
        const results = await database.pool.many<EventModel>(
            sql`SELECT creator_id, begin_time, end_time FROM events WHERE creator_id=${existingUserId}`
        );
        const convertedResults = results.map((row) =>
            convertEventModelToEvent(row)
        );
        expect(convertedResults.length).toBe(2);
        expect(convertedResults[0].creatorId).toBe(existingUserId);
        expect(convertedResults[1].creatorId).toBe(existingUserId);
        expect(convertedResults[0].begin.getTime()).toBe(
            newEvent.begin.getTime()
        );
        expect(convertedResults[1].begin.getTime()).toBe(
            newEvent.begin.getTime()
        );
        expect(convertedResults[0].end.getTime()).toBe(newEvent.end.getTime());
        expect(convertedResults[1].end.getTime()).toBe(newEvent.end.getTime());
    });
});

describe("CreateEventDatabase.getOtherEventsWithSameOwner", () => {
    const database = new Database(process.env.DB_CONNECTION);
    const uuid = new Uuid();
    const createEventDatabase = new CreateEventDatabase(database, uuid);
    const existingUserId = uuid.generateV4();
    const event1: Event = {
        creatorId: existingUserId,
        begin: new Date(),
        end: new Date(Date.now() + 1000)
    };
    beforeAll(async () => {
        await clearTables(database);
    });
    beforeEach(async () => {
        const username = "eventOwner1";
        const password = "password";
        await clearTables(database);
        await database.pool.query(
            sql`INSERT INTO users (id, username, password) VALUES (${existingUserId}, ${username}, ${password})`
        );
    });
    afterAll(async () => {
        await database.pool.end();
    });
    test("return empty array if there is no event associated with user", async () => {
        const result = await createEventDatabase.getOtherEventsWithSameOwner(
            existingUserId
        );
        expect(result.length).toBe(0);
    });
    test("return array with one element when there is one event associated with user", async () => {
        const anotherUserId = uuid.generateV4();
        const anotherUserUsername = "anotherEventOwner";
        const anotherPassword = "password";
        const event2: Event = {
            creatorId: anotherUserId,
            begin: new Date(Date.now() + 10000),
            end: new Date(Date.now() + 200000)
        };
        await database.pool.any(
            sql`INSERT INTO users (id, username, password) VALUES (${anotherUserId}, ${anotherUserUsername}, ${anotherPassword})`
        );
        await createEventDatabase.insertOne(event1);
        await createEventDatabase.insertOne(event2);
        const result = await createEventDatabase.getOtherEventsWithSameOwner(
            existingUserId
        );
        expect(result.length).toBe(1);
        expect(result[0].creatorId).toBe(event1.creatorId);
        expect(result[0].begin.getTime()).toBe(event1.begin.getTime());
        expect(result[0].end.getTime()).toBe(event1.end.getTime());
    });
    test("return array with many elements when there is more than one event associated with user", async () => {
        const anotherUserId = uuid.generateV4();
        const anotherUserUsername = "anotherEventOwner";
        const anotherPassword = "password";
        const event2: Event = {
            creatorId: anotherUserId,
            begin: new Date(Date.now() + 10000),
            end: new Date(Date.now() + 200000)
        };
        const anotherEvent1: Event = {
            creatorId: existingUserId,
            begin: new Date(Date.now() + 10000),
            end: new Date(Date.now() + 300000)
        };
        await database.pool.any(
            sql`INSERT INTO users (id, username, password) VALUES (${anotherUserId}, ${anotherUserUsername}, ${anotherPassword})`
        );
        await createEventDatabase.insertOne(event1);
        await createEventDatabase.insertOne(event2);
        await createEventDatabase.insertOne(anotherEvent1);
        const result = await createEventDatabase.getOtherEventsWithSameOwner(
            existingUserId
        );
        expect(result.length).toBe(2);
        expect(result[0].creatorId).toBe(existingUserId);
        expect(result[0].begin.getTime()).toBe(event1.begin.getTime());
        expect(result[0].end.getTime()).toBe(event1.end.getTime());
        expect(result[1].creatorId).toBe(existingUserId);
        expect(result[1].begin.getTime()).toBe(anotherEvent1.begin.getTime());
        expect(result[1].end.getTime()).toBe(anotherEvent1.end.getTime());
    });
});
