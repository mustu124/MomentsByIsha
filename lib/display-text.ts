export function toTitleCase(value: string) {
  return value
    .split(/(\s+|\/|&|-)/)
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed || part === "/" || part === "&" || part === "-") return part;
      const lower = trimmed.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}
