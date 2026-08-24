import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./styled/index.css";
import "./styled/reset.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

async function enableMocking() {
    if (import.meta.env.VITE_DISABLE_MSW === "true") return;
    const { worker } = await import("./mocks/browser");
    return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
    createRoot(document.getElementById("root")!).render(
        <QueryClientProvider client={queryClient}>
            <StrictMode>
                <RouterProvider router={router} />
            </StrictMode>
        </QueryClientProvider>,
    );
});
