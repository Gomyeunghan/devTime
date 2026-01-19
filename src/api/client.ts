const BASE_URL = import.meta.env.VITE_BASE_URL;

interface RequsetOptions {
    method: "GET" | "POST";
    body?: unknown;
}

export async function request<T>(
    url: string,
    options: RequsetOptions,
): Promise<T> {
    const response = await fetch(`${BASE_URL}${url}`, {
        method: options.method,
        headers: {
            "Content-Type": "application/json",
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData?.error.message || "처리중 에러발생");
    }

    return response.json();
}
