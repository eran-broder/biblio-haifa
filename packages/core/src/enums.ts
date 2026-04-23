export enum FetchErrorCode {
  InvalidCredentials = 'invalid_credentials',
  Network = 'network',
  Unknown = 'unknown',
}

export enum ProgressKind {
  Login = 'login',
  LoggedIn = 'logged-in',
  FetchingMain = 'fetching-main',
  DiscoveredFamily = 'discovered-family',
  FetchingMember = 'fetching-member',
  Done = 'done',
}

export enum StampTone {
  Overdue = 'overdue',
  Urgent = 'urgent',
  Soon = 'soon',
  Safe = 'safe',
}
