export function joinPaths(...paths: string[]) {
    return paths.map(p => p.replace(/^\/+|\/+$/g, "")).join("/");
}