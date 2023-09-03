import { GameStates } from "./enums.js";

export function isPlaying(status: GameStates)
{
    return [GameStates.Playing, GameStates.Watching].includes(status);
}
