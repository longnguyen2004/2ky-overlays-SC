export enum GameStates {
    NotRunning = -1,
    MainMenu = 0,
    EditingMap = 1,
    Playing = 2,
    GameShutdownAnimation = 3,
    SongSelectEdit = 4,
    SongSelect = 5,
    WIP_NoIdeaWhatThisIs = 6,
    Watching = 8,
    GameStartupAnimation = 10,
    MultiplayerRooms = 11,
    MultiplayerRoom = 12,
    MultiplayerSongSelect = 13,
    MultiplayerResultsscreen = 14,
    OsuDirect = 15,
    RankingTagCoop = 17,
    RankingTeam = 18,
    ProcessingBeatmaps = 19,
    Tourney = 22,
    ResultsScreen = 32,
    /// <summary>
    /// Indicates that status read in osu memory is not defined in <see cref="OsuMemoryStatus"/>
    /// </summary>
    Unknown = -2
};

export enum GameMode {
    Standard = "Osu",
    Taiko = "Taiko",
    CatchTheBeat = "CatchTheBeat",
    Mania = "OsuMania"
};

export enum RankStatus {
    Unknown,
    Unsubmitted,
    Unranked,
    Ranked = 4,
    Approved,
    Qualified
}

export enum Grade {
    SSH,
    SH,
    SS,
    S,
    A,
    B,
    C,
    D,
    F
}

export enum Mods {
    NoFail = 1 << 0,
    Easy = 1 << 1,
    TouchDevice = 1 << 2,
    Hidden = 1 << 3,
    HardRock = 1 << 4,
    SuddenDeath = 1 << 5,
    DoubleTime = 1 << 6,
    Relax = 1 << 7,
    HalfTime = 1 << 8,
    Nightcore = 1 << 9,
    Flashlight = 1 << 10,
    Autoplay = 1 << 11,
    SpunOut = 1 << 12,
    Autopilot = 1 << 13,
    Perfect = 1 << 14,
    Key4 = 1 << 15,
    Key5 = 1 << 16,
    Key6 = 1 << 17,
    Key7 = 1 << 18,
    Key8 = 1 << 19,
    FadeIn = 1 << 20,
    Random = 1 << 21,
    Cinema = 1 << 22,
    Target = 1 << 23,
    Key9 = 1 << 24,
    KeyCoop = 1 << 25,
    Key1 = 1 << 26,
    Key3 = 1 << 27,
    Key2 = 1 << 28,
    ScoreV2 = 1 << 29,
    Mirror = 1 << 30
}