// src/hooks/useIntroState.ts
import { useState, useCallback } from 'react';

type IntroState = 'playing' | 'completed';

interface UseIntroStateReturn {
    state: IntroState;
    complete: () => void;
}

const VALID_ROUTES = ['/', '/blog', '/newsletter'] as const;

function isValidRoute(pathname: string): boolean {
    return VALID_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Intro plays once per session on full page load to valid routes.
 * Skips for 404s and all client-side navigation.
 */
export function useIntroState(pathname: string): UseIntroStateReturn {
    const [hasPlayed, setHasPlayed] = useState(() => {
        // Check if this is a full page load (not a React Router navigation)
        const isFullPageLoad = !window.history.state?.idx;
        const alreadyPlayed = sessionStorage.getItem('introPlayed') === 'true';

        return !(isFullPageLoad && isValidRoute(pathname) && !alreadyPlayed);
    });

    const complete = useCallback(() => {
        sessionStorage.setItem('introPlayed', 'true');
        setHasPlayed(true);
    }, []);

    return {
        state: hasPlayed ? 'completed' : 'playing',
        complete,
    };
}