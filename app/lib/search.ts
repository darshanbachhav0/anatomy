export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function matchesSearch(query: string, ...values: string[]) {
  return normalizeSearch(values.join(" ")).includes(normalizeSearch(query));
}
