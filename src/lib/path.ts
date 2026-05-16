const BASE_PATH = "/hexuanying-blog";

export function asset(path: string): string {
  if (path.startsWith("http")) return path;
  return `${BASE_PATH}${path}`;
}
