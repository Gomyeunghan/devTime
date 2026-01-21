const BASE_URL = import.meta.env.VITE_BASE_URL;

interface RequestOptions {
    method: "GET" | "POST";
    body?: unknown;
}

export async function request<T>(
    url: string,
    options: RequestOptions,
): Promise<T> {
    const response = await fetch(`${BASE_URL}${url}`, {
        method: options.method,
        headers: {
            "Content-Type": "application/json",
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) {
        let errorMessage = "처리중 에러발생";
        try {
            const errorData = await response.json();
            errorMessage = errorData?.error?.message || errorMessage;
        } catch {
            throw new Error(errorMessage);
        }
    }

    return response.json();
}
