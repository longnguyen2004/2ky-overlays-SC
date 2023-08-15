import { GameMode } from "osu-stream-companion-store";
import type { ApiClient } from "..";

type AuthResponse = {
    access_token: string,
    expires_in: number,
    token_type: "Bearer";
};

const gameModeEnumToString: Record<GameMode, string> = {
    [GameMode.Standard]: "osu",
    [GameMode.Taiko]: "taiko",
    [GameMode.Mania]: "mania",
    [GameMode.CatchTheBeat]: "fruits"
};

type ScoreEntry = {
    accuracy: number,
    score: number,
    max_combo: number,
    user: {
        username: string;
    },
    created_at: string;
};

export class OsuV2 implements ApiClient {
    private _endpoint: string;
    private _authEndpoint: string;
    private _clientId: string;
    private _clientSecret: string;

    private _auth: {
        token: string,
        age: number,
        authTime: number,
    } | undefined;

    constructor(endpoint: string, authEndpoint: string, clientId: string, clientSecret: string) {
        this._endpoint = endpoint;
        this._authEndpoint = authEndpoint;
        this._clientId = clientId;
        this._clientSecret = clientSecret;
    }

    async _authenticate() {
        const now = Date.now();
        // No token, or token has expired
        if (!this._auth || this._auth.authTime + this._auth.age > now) {
            this._auth = undefined;
            const res = await fetch(this._authEndpoint, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams([
                    ["client_id", this._clientId],
                    ["client_secret", this._clientSecret],
                    ["grant_type", "client_credentials"],
                    ["scope", "public"]
                ])
            });
            if (!res.ok) return undefined;
            const data = await res.json() as AuthResponse;
            this._auth = {
                token: data.access_token,
                authTime: now,
                age: data.expires_in
            };
        }
        return this._auth.token;
    }

    async getMapLeaderboard(id: number, mode: GameMode, limit: number = Infinity) {
        limit = Math.min(limit, 100);
        const token = await this._authenticate();
        if (!token) return { scores: undefined, limit };

        const url = new URL(`${this._endpoint}/beatmaps/${id}/scores`);
        url.searchParams.set("mode", gameModeEnumToString[mode]);
        const res = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) return { scores: undefined, limit };
        const data = await res.json() as { scores: ScoreEntry[]; };
        return {
            scores: data.scores.map(({ accuracy, score, max_combo, user, created_at }) => ({
                accuracy: accuracy * 100,
                score,
                max_combo,
                username: user.username,
                timestamp: created_at
            })),
            limit
        };
    }
}
