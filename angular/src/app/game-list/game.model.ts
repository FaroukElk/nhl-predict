export interface Game {
  gameId: number;
  gameDate: Date;
  status: string;
  homeTeam: {
    id: number,
    name: string,
    record: {
      wins: number,
      losses: number,
      ot: number
    },
    score: number
  };
  awayTeam: {
    id: number,
    name: string,
    record: {
      wins: number,
      losses: number,
      ot: number
    },
    score: number
  };
}
