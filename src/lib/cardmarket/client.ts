import { buildAuthorizationHeader, type CardmarketCredentials } from "./signing";

const BASE_URL = "https://api.cardmarket.com/ws/v2.0/output.json";

function getCredentials(): CardmarketCredentials | null {
  const appToken = process.env.CARDMARKET_APP_TOKEN;
  const appSecret = process.env.CARDMARKET_APP_SECRET;
  const accessToken = process.env.CARDMARKET_ACCESS_TOKEN;
  const accessTokenSecret = process.env.CARDMARKET_ACCESS_TOKEN_SECRET;

  if (!appToken || !appSecret || !accessToken || !accessTokenSecret) return null;
  return { appToken, appSecret, accessToken, accessTokenSecret };
}

export class CardmarketError extends Error {}

export async function cardmarketGet(path: string): Promise<unknown> {
  const credentials = getCredentials();
  if (!credentials) throw new CardmarketError("Cardmarket no está configurado");

  const url = `${BASE_URL}${path}`;
  const authHeader = buildAuthorizationHeader("GET", url, {}, credentials);

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    throw new CardmarketError(`Cardmarket respondió ${res.status}`);
  }

  return res.json();
}
