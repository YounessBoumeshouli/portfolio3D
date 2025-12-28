"use client"

import { useEffect } from "react"

interface KeyboardControlsProps {
    onEsc: () => void
}

export default function KeyboardControls({ onEsc }: KeyboardControlsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onEsc()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onEsc])

    return null
}
