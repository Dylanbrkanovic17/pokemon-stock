export function isCardmarketConfigured(): boolean {
  return Boolean(
    process.env.CARDMARKET_APP_TOKEN &&
      process.env.CARDMARKET_APP_SECRET &&
      process.env.CARDMARKET_ACCESS_TOKEN &&
      process.env.CARDMARKET_ACCESS_TOKEN_SECRET
  );
}
