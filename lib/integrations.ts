export type Provider='gmail'|'microsoft'|'imap'|'caldav'|'icloud'|'manual';
export interface IntegrationAdapter{provider:Provider; connectUrl?():string; sync(userId:string,accountId:string):Promise<{emails:number;events:number}>}
export const adapters:Record<Provider,IntegrationAdapter>={
 gmail:{provider:'gmail',connectUrl:()=>'/api/integrations/gmail/oauth',sync:async()=>({emails:0,events:0})},
 microsoft:{provider:'microsoft',connectUrl:()=>'/api/integrations/microsoft/oauth',sync:async()=>({emails:0,events:0})},
 imap:{provider:'imap',sync:async()=>({emails:0,events:0})},
 caldav:{provider:'caldav',sync:async()=>({emails:0,events:0})},
 icloud:{provider:'icloud',sync:async()=>({emails:0,events:0})},
 manual:{provider:'manual',sync:async()=>({emails:0,events:0})}
};
export const iCloudGuide={calendarServer:'https://caldav.icloud.com',imapServer:'imap.mail.me.com',security:'Use an Apple app-specific password. SMTP is not required for read-only MVP.',appleMailNote:'Apple Mail does not expose a general cloud API for web apps; connect the underlying Gmail, Microsoft, IMAP, iCloud Mail, or CalDAV accounts for equivalent read access.'};
