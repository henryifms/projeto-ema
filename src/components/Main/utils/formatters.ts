export function formatDate(value?: string) {
  if (!value) return "--";
  return new Date(value).toLocaleString("pt-BR");
}

export function formatNumber(value?: number, digits = 1) {
  if (value === undefined || value === null || Number.isNaN(value)) return "--";
  return value.toFixed(digits);
}
