export const players = {
    EILEEN: "Eileen",
    EMMA: "Emma",
    CHRIS_R: "Chris",
    ERIKA: "Erika",
    STEPHEN: "Stephen",
    CHRIS_V: "Chris V",
    PHYLLIS: "Phyllis",
    SCOTT: "Scott",
    PETE: "Pete",
    STACY: "Stacy",
    SEAN: "Sean",
    BEN: "Ben",
    TIM: "Tim",
    JANET: "Janet",
    MARK: "Mark",
}

export const teams = {
    BILLS: "Bills",
    RAVENS: "Ravens",
    EAGLES: "Eagles",
    CHIEFS: "Chiefs",
    LIONS: "Lions",
    COMMANDERS: "Commanders",
    FORTY_NINERS: "49ers",
    PACKERS: "Packers",
    BENGALS: "Bengals",
    RAMS: "Rams",
    VIKINGS: "Vikings",
    BEARS: "Bears",
    BRONCOS: "Broncos",
    CHARGERS: "Chargers",
    BUCCANEERS: "Buccaneers",
    TEXANS: "Texans",
    STEELERS: "Steelers",
    COWBOYS: "Cowboys",
    CARDINALS: "Cardinals",
    PATRIOTS: "Patriots",
    SEAHAWKS: "Seahawks",
    FALCONS: "Falcons",
    JAGUARS: "Jaguars",
    DOLPHINS: "Dolphins",
    RAIDERS: "Raiders",
    COLTS: "Colts",
    GIANTS: "Giants",
    PANTHERS: "Panthers",
    TITANS: "Titans",
    JETS: "Jets",
    BROWNS: "Browns",
    SAINTS: "Saints",
}

export const pool = [
  {
    player: players.CHRIS_R,
    inSnapCount: true,
    teamList: [
        teams.RAVENS,
        teams.COMMANDERS,
        teams.CHARGERS,
        teams.PANTHERS
    ]
  },
  {
    player: players.EILEEN,
    inSnapCount: true,
    teamList: [
        teams.BILLS,
        teams.EAGLES,
        teams.BENGALS,
        teams.GIANTS
    ]
    },
  {
    player: players.EMMA,
    inSnapCount: true,
    teamList: [
        teams.RAVENS,
        teams.EAGLES,
        teams.PACKERS,
        teams.TITANS
    ]
    },
  {
    player: players.ERIKA,
    inSnapCount: true,
    teamList: [
        teams.BILLS,
        teams.RAVENS,
        teams.LIONS,
        teams.SAINTS
    ]
    },
  {
    player: players.STEPHEN,
    inSnapCount: false,
    teamList: [
        teams.BENGALS,
        teams.COMMANDERS,
        teams.BRONCOS,
        teams.BUCCANEERS
    ]
    },
  {
    player: players.CHRIS_V,
    inSnapCount: false,
    teamList: [
        teams.EAGLES,
        teams.BUCCANEERS,
        teams.TEXANS,
        teams.BRONCOS,
    ]
    },
  {
    player: players.PHYLLIS,
    inSnapCount: false,
    teamList: [
        teams.CHIEFS,
        teams.LIONS,
        teams.COMMANDERS,
        teams.GIANTS,
    ]
    },
  {
    player: players.SCOTT,
    inSnapCount: false,
    teamList: [
        teams.EAGLES,
        teams.COMMANDERS,
        teams.PACKERS,
        teams.COLTS,
    ]
    },
  {
    player: players.PETE,
    inSnapCount: false,
    teamList: [
        teams.LIONS,
        teams.BENGALS,
        teams.TEXANS,
        teams.CARDINALS,
    ]
    },
  {
    player: players.STACY,
    inSnapCount: false,
    teamList: [
        teams.EAGLES,
        teams.PACKERS,
        teams.CHARGERS,
        teams.STEELERS,
    ]
    },
  {
    player: players.SEAN,
    inSnapCount: false,
    teamList: [
        teams.BILLS,
        teams.RAVENS,
        teams.CHIEFS,
        teams.BROWNS,
    ]
    },
  {
    player: players.BEN,
    inSnapCount: false,
    teamList: [
        teams.BILLS,
        teams.EAGLES,
        teams.VIKINGS,
        teams.GIANTS,
    ]
    },
  {
    player: players.TIM,
    inSnapCount: false,
    teamList: [
        teams.BILLS,
        teams.RAVENS,
        teams.EAGLES,
        teams.SAINTS,
    ]
    },
  {
    player: players.JANET,
    inSnapCount: false,
    teamList: [
        teams.BILLS,
        teams.CHIEFS,
        teams.VIKINGS,
        teams.PANTHERS,
    ]
    },
  {
    player: players.MARK,
    inSnapCount: false,
    teamList: [
        teams.BILLS,
        teams.CHIEFS,
        teams.PACKERS,
        teams.PANTHERS,
    ]
    },
];

export const pointsBySeason = {
    "Regular Season": 1
}

export const teamCosts = [
    {name: teams.BILLS, cost: 75},
    {name: teams.RAVENS, cost: 75},
    {name: teams.EAGLES, cost: 70},
    {name: teams.CHIEFS, cost: 70},
    {name: teams.LIONS, cost: 70},
    {name: teams.COMMANDERS, cost: 65},
    {name: teams.FORTY_NINERS, cost: 65},
    {name: teams.PACKERS, cost: 65},
    {name: teams.BENGALS, cost: 65},
    {name: teams.RAMS, cost: 65},
    {name: teams.VIKINGS, cost: 65},
    {name: teams.BEARS, cost: 60},
    {name: teams.BRONCOS, cost: 60},
    {name: teams.CHARGERS, cost: 60},
    {name: teams.BUCCANEERS, cost: 60},
    {name: teams.TEXANS, cost: 60},
    {name: teams.STEELERS, cost: 55},
    {name: teams.COWBOYS, cost: 55},
    {name: teams.CARDINALS, cost: 55},
    {name: teams.PATRIOTS, cost: 50},
    {name: teams.SEAHAWKS, cost: 50},
    {name: teams.FALCONS, cost: 50},
    {name: teams.JAGUARS, cost: 50},
    {name: teams.DOLPHINS, cost: 50},
    {name: teams.RAIDERS, cost: 45},
    {name: teams.COLTS, cost: 45},
    {name: teams.GIANTS, cost: 40},
    {name: teams.PANTHERS, cost: 40},
    {name: teams.TITANS, cost: 35},
    {name: teams.JETS, cost: 35},
    {name: teams.BROWNS, cost: 30},
    {name: teams.SAINTS, cost: 30},
]

// Constants
export const NFL_LOGO = "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png"
export const POST = "post"
export const DASH = "-"
export const PLUS = "+"