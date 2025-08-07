export interface Game {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeLeft: number;
  status: "scheduled" | "live" | "finished";
}

export 
