export interface Account {
  username: string;
  password: string;
  isAdmin: boolean;
}

/**
 * Hardcoded logins for the ADS Quiz Game.
 *
 * NOTE: this list ships in the client bundle, so it is NOT truly secure — it's a
 * simple gate for a friendly internal event. Edit freely: add players, change
 * passwords, or set `isAdmin: true` for anyone who should be able to host a game.
 */
export const ACCOUNTS: Account[] = [
  { username: "Zarin", password: "Zarin", isAdmin: true },
  { username: "Irene", password: "Irene123!", isAdmin: true },
];
