export enum FetchErrorCode {
  InvalidCredentials = 'invalid_credentials',
  UnexpectedResponse = 'unexpected_response',
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

export enum LoginOutcome {
  Accepted = 'accepted',
  Rejected = 'rejected',
  Unrecognized = 'unrecognized',
}
