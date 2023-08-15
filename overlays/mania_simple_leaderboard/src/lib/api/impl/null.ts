import type { ApiClient } from "..";

export class Null implements ApiClient {
    constructor() {};
    // @ts-expect-error The then clause will never execute, so the error is just extra
    async getMapLeaderboard() {
        throw new Error("Leaderboard doesn't exist");
    }
}