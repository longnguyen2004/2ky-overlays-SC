import { GameMode } from "osu-stream-companion-store";
import { gameModeToNumber } from "../constants";
import type { ApiClient } from "..";

type ScoreEntry = {
    player_name: string,
    score: number,
    pp: number,
    acc: number,
    max_combo: number,
    play_time: string;
};

export class AkatsukiV1 implements ApiClient {
    private _endpoint: string;
    constructor(endpoint: string) {
        this._endpoint = endpoint;
    }
    async getMapLeaderboard(id: number, mode: GameMode, limit: number = Infinity) {
        limit = Math.min(limit, 100);
        const url = new URL(`${this._endpoint}/get_map_scores`);
        url.searchParams.set("scope", "best");
        url.searchParams.set("id", id.toString());
        url.searchParams.set("mode", gameModeToNumber[mode].toString());
        url.searchParams.set("limit", limit.toString());

        let res;
        try
        {
            res = await fetch(url);
        }
        catch
        {
            return { scores: undefined, limit };
        }
        if (!res.ok) return { scores: undefined, limit };
        const data = await res.json() as {
            status: "success",
            scores: ScoreEntry[];
        };
        return {
            scores: data.scores.map(({ player_name, score, acc, max_combo, play_time }) => ({
                username: player_name,
                score,
                accuracy: acc,
                max_combo,
                timestamp: play_time
            })),
            limit
        };
    }
}
