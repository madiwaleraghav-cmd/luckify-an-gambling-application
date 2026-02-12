import { NextResponse } from 'next/server';

const TEAMS = [
    { name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/150px-Real_Madrid_CF.svg.png" },
    { name: "Barcelona", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/150px-FC_Barcelona_%28crest%29.svg.png" },
    { name: "Man Utd", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/150px-Manchester_United_FC_crest.svg.png" },
    { name: "Liverpool", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/150px-Liverpool_FC.svg.png" },
    { name: "CSK", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/150px-Chennai_Super_Kings_Logo.svg.png" },
    { name: "MI", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/150px-Mumbai_Indians_Logo.svg.png" },
    { name: "Lakers", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/150px-Los_Angeles_Lakers_logo.svg.png" },
    { name: "Warriors", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Golden_State_Warriors_logo.svg/150px-Golden_State_Warriors_logo.svg.png" },
];

const LEAGUES = ["Champions League", "Premier League", "IPL", "NBA", "La Liga"];

export async function GET() {
    const now = Date.now();
    const interval = 1000 * 60 * 60; // 1 hour slots
    const currentSlot = Math.floor(now / interval);

    // Deterministic random based on slot
    const rng = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    const matches = [];

    // Generate 6 matches
    for (let i = 0; i < 6; i++) {
        const seed = currentSlot + i;
        const leagueIdx = Math.floor(rng(seed) * LEAGUES.length);
        const teamAIdx = Math.floor(rng(seed + 1) * TEAMS.length);
        const teamBIdx = (teamAIdx + 1 + Math.floor(rng(seed + 2) * (TEAMS.length - 1))) % TEAMS.length;

        const isLive = i < 2; // First 2 always live
        const timeOffset = isLive ? 0 : (i * 30); // Future matches offset by 30 mins

        const matchTime = new Date(now + timeOffset * 60000);
        const timeString = isLive ? "LIVE" : matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        matches.push({
            id: currentSlot + i,
            league: LEAGUES[leagueIdx] + (isLive ? " • Live" : " • Upcoming"),
            teamA: TEAMS[teamAIdx].name,
            teamALogo: TEAMS[teamAIdx].logo,
            teamB: TEAMS[teamBIdx].name,
            teamBLogo: TEAMS[teamBIdx].logo,
            time: timeString,
            isLive: isLive,
            odds: {
                home: 1.5 + rng(seed + 3),
                draw: 3.0 + rng(seed + 4),
                away: 1.5 + rng(seed + 5)
            },
            headToHead: [
                `${TEAMS[teamAIdx].name} ${Math.floor(rng(seed) * 3)} - ${Math.floor(rng(seed + 1) * 3)} ${TEAMS[teamBIdx].name}`,
                `${TEAMS[teamBIdx].name} ${Math.floor(rng(seed + 2) * 3)} - ${Math.floor(rng(seed + 3) * 3)} ${TEAMS[teamAIdx].name}`
            ]
        });
    }

    return NextResponse.json({ matches });
}
