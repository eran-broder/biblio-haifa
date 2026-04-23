export interface LoggedIn {
  readonly userId: string;
}

export interface LibraryClient {
  login(username: string, password: string): Promise<LoggedIn>;
  fetchPersonalArea(session: LoggedIn, familyItemId: string | null): Promise<string>;
}
