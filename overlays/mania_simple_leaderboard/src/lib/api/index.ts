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
        scores: ScoreEntry[],
        limit: number
    } | { scores: undefined }>;
}

export { Null } from "./impl/null";
export { OsuV1 } from "./impl/osu_v1";
export { OsuV2 } from "./impl/osu_v2";
export { AkatsukiV1 } from "./impl/akatsuki_v1";
