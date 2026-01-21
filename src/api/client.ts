const BASE_URL = import.meta.env.VITE_BASE_URL;

interface RequsetOptions {
    method: "GET" | "POST";
    body?: unknown;
}

/**
 * Send an HTTP request to the configured API base URL and return the parsed JSON response.
 *
 * @param url - Path appended to the module's BASE_URL (e.g., "/users")
 * @param options - Request options specifying the HTTP method and optional body
 * @returns The parsed JSON response typed as `T`
 * @throws Error - When the response has a non-OK status; message is taken from `errorData?.error.message` or defaults to `"처리중 에러발생"`
 */
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