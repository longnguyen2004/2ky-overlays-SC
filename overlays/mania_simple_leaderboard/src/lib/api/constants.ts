import { GameMode } from "osu-stream-companion-store"

export const gameModeToNumber: Record<GameMode, number> = {
    [GameMode.Standard]: 0,
    [GameMode.Taiko]: 1,
    [GameMode.CatchTheBeat]: 2,
    [GameMode.Mania]: 3
}
