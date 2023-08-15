import type { ApiClient } from "..";

export class Null implements ApiClient {
    constructor() {};
    async getMapLeaderboard() {
        return { scores: undefined };
    }
}