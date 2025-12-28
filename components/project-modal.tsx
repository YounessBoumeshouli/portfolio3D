"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import ReactMarkdown from "react-markdown"
import type { Project } from "@/lib/types"

interface ProjectModalProps {
    project: Project | null
    isOpen: boolean
    onClose: () => void
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    const [readmeContent, setReadmeContent] = useState<string>("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen && project) {
            loadReadme()
        }
    }, [isOpen, project])

    const loadReadme = async () => {
        if (!project) return

        setLoading(true)
        try {
            const response = await fetch(`https://api.github.com/repos/${project.owner}/${project.repo}/readme`, {
                headers: {
                    Accept: "application/vnd.github.v3.raw",
                },
            })

            if (response.ok) {
                const content = await response.text()
                setReadmeContent(content)
            }
        } catch (error) {
            console.error("Error loading README:", error)
            setReadmeContent("Failed to load README content.")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen || !project) return null

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in-50 zoom-in-95">
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
                            <p className="text-slate-400 text-sm">{project.description}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-4 p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                        >
                            <X className="w-5 h-5 text-slate-300" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Project Image */}
                        {project.image && (
                            <img
                                src={project.image || "/placeholder.svg"}
                                alt={project.name}
                                className="w-full h-48 object-cover rounded-lg mb-6 bg-slate-800"
                            />
                        )}

                        {/* Tech Stack */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Technology Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs font-medium rounded-full"
                                    >
                    {tech}
                  </span>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex gap-3 mb-6">
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors text-center"
                            >
                                View on GitHub
                            </a>
                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-medium rounded-lg transition-colors text-center"
                                >
                                    Live Demo
                                </a>
                            )}
                        </div>

                        {/* README Content */}
                        <div className="border-t border-slate-700 pt-6">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Project Details</h3>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-slate-600 border-t-cyan-500 rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div className="prose prose-invert max-w-none text-sm">
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white mt-5 mb-3" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                                            p: ({ node, ...props }) => <p className="text-slate-300 mb-4 leading-relaxed" {...props} />,
                                            a: ({ node, ...props }) => (
                                                <a
                                                    className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    {...props}
                                                />
                                            ),
                                            ul: ({ node, ...props }) => (
                                                <ul className="list-disc list-inside text-slate-300 mb-4 space-y-1" {...props} />
                                            ),
                                            ol: ({ node, ...props }) => (
                                                <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-1" {...props} />
                                            ),
                                            code: ({ node, ...props }) => (
                                                <code className="bg-slate-800 text-cyan-400 px-2 py-1 rounded text-xs font-mono" {...props} />
                                            ),
                                            pre: ({ node, ...props }) => (
                                                <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                                            ),
                                        }}
                                    >
                                        {readmeContent}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
