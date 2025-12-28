"use client"

import { useRef } from "react"
import { ChevronDown } from "lucide-react"

interface PortfolioControlsProps {
    projectCount: number
}

export default function PortfolioControls({ projectCount }: PortfolioControlsProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    return (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-slate-950/90 to-transparent backdrop-blur-sm border-t border-slate-800/50 pointer-events-none">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-center gap-3 pointer-events-auto">
                    <p className="text-slate-400 text-sm">
                        {projectCount} {projectCount === 1 ? "Project" : "Projects"} • Click to explore
                    </p>
                    <ChevronDown className="w-4 h-4 text-slate-500 animate-bounce" />
                </div>
            </div>
        </div>
    )
}
