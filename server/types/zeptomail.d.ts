declare module "zeptomail" {
  export interface ZeptoMailConfig {
    apiKey: string;
    apiUrl?: string;
  }

  export interface EmailAddress {
    address: string;
    name?: string;
  }

  export interface EmailRecipient {
    email_address: EmailAddress;
  }

  export interface SendMailOptions {
    from: EmailAddress;
    to: EmailRecipient[];
    subject: string;
    htmlbody?: string;
    textbody?: string;
  }

  export interface SendMailResponse {
    messageId: string;
    status: string;
  }

  export class SendMailClient {
    constructor(config: ZeptoMailConfig);
    sendMail(options: SendMailOptions): Promise<SendMailResponse>;
  }
}
