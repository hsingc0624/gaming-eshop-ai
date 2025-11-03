export const money = (cents) => (cents ?? 0) / 100;
export const fm = (cents, locale = "en-GB", currency = "USD") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    money(cents)
  );
