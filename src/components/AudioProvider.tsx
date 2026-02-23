"use client";

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';

interface AudioContextType {
    playSFX: (type: 'success' | 'error' | 'click' | 'popup' | 'finish') => void;
    settings: {
        muted: boolean;
        volume: number;
    };
    toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const SFX_URLS = {
    success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    error: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    popup: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
    finish: 'https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3',
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [muted, setMuted] = useState(true); // Muted by default per browser policy
    const [volume, setVolume] = useState(0.4);
    const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});

    useEffect(() => {
        // Pre-load audio elements
        const elements: Record<string, HTMLAudioElement> = {};
        Object.entries(SFX_URLS).forEach(([key, url]) => {
            const audio = new Audio(url);
            audio.load();
            elements[key] = audio;
        });
        setAudioElements(elements);
    }, []);

    const playSFX = useCallback((type: keyof typeof SFX_URLS) => {
        if (muted) return;

        const audio = audioElements[type];
        if (audio) {
            audio.currentTime = 0;
            audio.volume = volume;
            audio.play().catch(e => console.warn('Audio play failed:', e));
        }
    }, [audioElements, muted, volume]);

    const toggleMute = () => setMuted(prev => !prev);

    return (
        <AudioContext.Provider value={{ playSFX, settings: { muted, volume }, toggleMute }}>
            {children}
            {/* Mute/Unmute UI overlay is handled by Navbar or specific toggle */}
        </AudioContext.Provider>
    );
}

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error('useAudio must be used within AudioProvider');
    return context;
};
