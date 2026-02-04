// Portal.tsx
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
    children: ReactNode;
    containerId?: string;
}

export function Portal({ children, containerId = "portal-root" }: PortalProps) {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // 컨테이너 찾기 또는 생성
        let portalContainer = document.getElementById(containerId);

        if (!portalContainer) {
            portalContainer = document.createElement("div");
            portalContainer.id = containerId;
            document.body.appendChild(portalContainer);
        }

        setContainer(portalContainer);
    }, [containerId]);
    if (!container) return null;

    return createPortal(children, container);
}
