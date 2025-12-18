'use client';

import { useEffect } from "react";

export const useBeforeUnload  = (enabled: boolean) => {
    useEffect(() => {
        if (!enabled) return;

        const handleUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        }
    })
}
 
