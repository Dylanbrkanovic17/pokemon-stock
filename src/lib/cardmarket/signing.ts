import { randomBytes, createHmac } from "node:crypto";

export type CardmarketCredentials = {
  appToken: string;
  appSecret: string;
  accessToken: string;
  accessTokenSecret: string;
};

/** RFC 3986 percent-encoding, as required by OAuth 1.0a (stricter than encodeURIComponent). */
function oauthEncode(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

function buildParamString(params: Record<string, string>): string {
  return Object.keys(params)
    .sort()
    .map((key) => `${oauthEncode(key)}=${oauthEncode(params[key])}`)
    .join("&");
}

export function buildAuthorizationHeader(
  method: string,
  baseUrl: string,
  queryParams: Record<string, string>,
  credentials: CardmarketCredentials
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: credentials.appToken,
    oauth_token: credentials.accessToken,
    oauth_nonce: randomBytes(16).toString("hex"),
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_signature_method: "HMAC-SHA1",
    oauth_version: "1.0",
  };

  const allParams = { ...queryParams, ...oauthParams };
  const paramString = buildParamString(allParams);

  const baseString = [method.toUpperCase(), oauthEncode(baseUrl), oauthEncode(paramString)].join("&");

  const signingKey = `${oauthEncode(credentials.appSecret)}&${oauthEncode(credentials.accessTokenSecret)}`;
  const signature = createHmac("sha1", signingKey).update(baseString).digest("base64");

  const headerParams: Record<string, string> = { ...oauthParams, oauth_signature: signature };
  const headerString = Object.keys(headerParams)
    .sort()
    .map((key) => `${oauthEncode(key)}="${oauthEncode(headerParams[key])}"`)
    .join(", ");

  return `OAuth ${headerString}`;
}
