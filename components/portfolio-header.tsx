"use client"

import { Github, Linkedin, Mail } from "lucide-react"

export default function PortfolioHeader() {
    return (
        <header className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-slate-950/80 to-transparent backdrop-blur-sm border-b border-slate-800/50">
            <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Developer Portfolio</h1>
                    <p className="text-sm text-slate-400 mt-1">Explore my 3D project showcase</p>
                </div>

                {/* Social Links */}
                <div className="flex gap-4">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-cyan-400"
                        aria-label="GitHub"
                    >
                        <Github className="w-5 h-5" />
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-cyan-400"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                        href="mailto:hello@example.com"
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-cyan-400"
                        aria-label="Email"
                    >
                        <Mail className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </header>
    )
}
