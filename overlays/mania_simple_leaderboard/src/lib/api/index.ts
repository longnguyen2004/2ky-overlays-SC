import { GameMode } from "osu-stream-companion-store";

export type ScoreEntry = {
    username: string,
    score: number,
    accuracy?: number,
    max_combo: number,
    timestamp: string | number
};

export interface ApiClient
{
    getMapLeaderboard(id: number, mode: GameMode, limit?: number): Promise<{
        scores: ScoreEntry[] | undefined,
        limit: number
    } | void>;
}

export { OsuV1 } from "./impl/osu_v1";
export { OsuV2 } from "./impl/osu_v2";
export { AkatsukiV1 } from "./impl/akatsuki_v1";
