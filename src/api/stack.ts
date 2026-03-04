import { request } from "./client";

export async function getStack(query: string): Promise<string[]> {
    return await request(`/api/tech-stacks?keyword=${query}`, {
        method: "GET",
    });
}
