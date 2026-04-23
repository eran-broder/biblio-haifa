export const SCRAPE_PORT_NAME = 'biblio.scrape';

export enum MessageKind {
  StartScrape = 'start-scrape',
  Progress = 'progress',
  Result = 'result',
  Error = 'error',
}
