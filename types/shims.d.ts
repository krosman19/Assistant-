// Lightweight local shims let `npm run typecheck` validate project code in
// restricted environments before npm dependencies are installed. Real Next,
// React, and Node types take precedence once dependencies are available.
declare namespace React {
  type ReactNode = unknown;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'next/server' {
  export class NextRequest extends Request {}
  export class NextResponse extends Response {
    static json(body: unknown, init?: ResponseInit): NextResponse;
  }
}

declare module '*.css';

declare module 'crypto' {
  const crypto: any;
  export default crypto;
}

declare const process: { env: Record<string, string | undefined> };
declare const Buffer: any;
