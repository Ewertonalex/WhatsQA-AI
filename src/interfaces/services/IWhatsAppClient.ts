export interface IWhatsAppClient {
  start(): Promise<void>;
  stop(): Promise<void>;
}
