import { GameMode } from "osu-stream-companion-store";
import { gameModeToNumber } from "../constants";
import type { ApiClient } from "..";

type ScoreEntry = {
    score: string;
    username: string;
    maxcombo: string;
    date: string;
    count50: string;
    count100: string;
    count300: string;
    countmiss: string;
    countkatu: string;
    countgeki: string;
};

type Judgment = Record<"c300" | "c100" | "c50" | "geki" | "katu" | "miss", number>;

function _calculateAcc({ c300, c100, c50, geki, katu, miss }: Judgment, mode: GameMode) {
    switch (mode) {
        case GameMode.Standard:
            return (300 * c300 + 100 * c100 + 50 * c50) / (300 * (c300 + c100 + c50 + miss));

        case GameMode.Taiko:
            const great = c300 + geki;
            const good = c100 + katu;
            return (great + 0.5 * good) / (great + good + miss);

        case GameMode.CatchTheBeat:
            const caughtFruits = c300;
            const caughtDrops = c100;
            const caughtDroplets = c50;
            const total = c300 + c100 + c50 + miss + katu;
            return (caughtFruits + caughtDrops + caughtDroplets) / total;

        case GameMode.Mania:
            return (300 * (geki + c300) + 200 * katu + 100 * c100 + 50 * c50) / (300 * (c300 + geki + katu + c100 + c50 + miss));
    }
}

export class OsuV1 implements ApiClient {
    private _endpoint: string;
    private _apiKey: string;
    constructor(endpoint: string, apiKey: string) {
        this._endpoint = endpoint;
        this._apiKey = apiKey;
    }

    async getMapLeaderboard(id: number, mode: GameMode, limit: number = Infinity) {
        limit = Math.min(limit, 100);
        const url = new URL(`${this._endpoint}/get_scores`);
        url.searchParams.set("k", this._apiKey);
        url.searchParams.set("b", id.toString());
        url.searchParams.set("m", gameModeToNumber[mode].toString());
        url.searchParams.set("limit", limit.toString());
        const res = await fetch(url);
        if (!res.ok) return { scores: undefined, limit };
        const data = await res.json() as ScoreEntry[];
        return {
            scores: data.map(({
                score, username, maxcombo, date, count50, count100, count300, countgeki, countkatu, countmiss
            }) => ({
                username,
                score: +score,
                accuracy: _calculateAcc({
                    c300: +count300,
                    c100: +count100,
                    c50: +count50,
                    geki: +countgeki,
                    katu: +countkatu,
                    miss: +countmiss
                }, mode) * 100,
                max_combo: +maxcombo,
                timestamp: date
            })),
            limit
        };
    }
}
