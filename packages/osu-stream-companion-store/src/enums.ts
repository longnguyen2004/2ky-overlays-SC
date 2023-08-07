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