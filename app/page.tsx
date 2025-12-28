"use client"

import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import ProjectCard3D from "@/components/project-card-3d"
import ProjectModal from "@/components/project-modal"
import PortfolioHeader from "@/components/portfolio-header"
import PortfolioControls from "@/components/portfolio-controls"
import KeyboardControls from "@/components/keyboard-controls"
import { fetchProjects } from "@/lib/github-api"
import type { Project } from "@/lib/types"

export default function Portfolio() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await fetchProjects()
                setProjects(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load projects")
            } finally {
                setLoading(false)
            }
        }

        loadProjects()
    }, [])

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    return (
        <main className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
            {/* Portfolio Header */}
            <PortfolioHeader />

            {/* Canvas 3D Scene */}
            <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
                <Environment preset="night" />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0ea5e9" />

                {!loading &&
                    projects.map((project, index) => (
                        <ProjectCard3D
                            key={project.id}
                            project={project}
                            position={[(index % 3) * 8 - 8, Math.floor(index / 3) * -8, (index % 2) * 4 - 2]}
                            onClick={() => handleProjectClick(project)}
                        />
                    ))}

                <OrbitControls enableDamping damping={0.05} autoRotate autoRotateSpeed={2} />
            </Canvas>

            {/* Portfolio Controls */}
            <PortfolioControls projectCount={projects.length} />

            {/* Keyboard Controls */}
            <KeyboardControls onEsc={handleCloseModal} />

            {/* Loading State */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="w-12 h-12 border-3 border-slate-600 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-300">Loading projects...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="text-center">
                        <p className="text-red-400 mb-2">Error loading projects</p>
                        <p className="text-slate-400 text-sm">{error}</p>
                    </div>
                </div>
            )}

            <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
        </main>
    )
}
