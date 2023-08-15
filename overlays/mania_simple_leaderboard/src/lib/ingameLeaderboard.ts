import type { ScoreEntry } from "./api";
import type { GameMode, Grade } from "osu-stream-companion-store";

type InGameEntry = {
    Username: string,
    ModsEnum: number,
    Mode: GameMode,
    MaxCombo: number,
    Score: number,
    Hit300: number,
    Hit100: number,
    Hit50: number,
    HitGeki: number,
    HitKatu: number,
    HitMiss: number,
    Date: string,
    UserId: number,
    Accuracy: number,
    Mods: string,
    Grade: Grade
};

export function parseInGameLeaderboard(str: string): ScoreEntry[] {
    const leaderboard = JSON.parse(str) as InGameEntry[];
    return leaderboard
        .map(({ Username, Score, MaxCombo, Accuracy, Date }) => ({
            username: Username,
            score: Score,
            max_combo: MaxCombo,
            accuracy: Accuracy,
            timestamp: Date
        }));
}