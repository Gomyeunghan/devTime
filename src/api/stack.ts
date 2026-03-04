import { request } from "./client";

export async function getStack<T>(query: string): Promise<T> {
    return await request<T>(`/api/tech-stacks?keyword=${query}`, {
        method: "GET",
    });
}
