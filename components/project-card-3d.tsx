"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Image as DreiImage } from "@react-three/drei"
import * as THREE from "three"
import type { Project } from "../lib/types"

interface ProjectCard3DProps {
    project: Project
    position: [number, number, number]
    onClick?: () => void
}

export default function ProjectCard3D({ project, position, onClick }: ProjectCard3DProps) {
    const groupRef = useRef<THREE.Group>(null)
    const [hovered, setHovered] = useState(false)

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.position.y += Math.sin(Date.now() * 0.0008) * 0.008
            groupRef.current.rotation.z += (Math.random() - 0.5) * 0.0001

            if (hovered) {
                groupRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.12)
                groupRef.current.rotation.y += 0.01
            } else {
                groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
                groupRef.current.rotation.y += 0.002
            }
        }
    })

    return (
        <group
            ref={groupRef}
            position={position}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onClick={onClick}
        >
            {/* Card background */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[5, 6.5, 0.2]} />
                <meshStandardMaterial
                    color={hovered ? "#0ea5e9" : "#1e293b"}
                    emissive={hovered ? "#0ea5e9" : "#334155"}
                    emissiveIntensity={hovered ? 0.4 : 0.15}
                    metalness={0.4}
                    roughness={0.3}
                />
            </mesh>

            {hovered && (
                <>
                    <mesh position={[0, 0, -0.15]}>
                        <boxGeometry args={[5.1, 6.6, 0.1]} />
                        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.3} />
                    </mesh>
                    <mesh position={[0, 0, -0.25]}>
                        <boxGeometry args={[5.2, 6.7, 0.1]} />
                        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.1} />
                    </mesh>
                </>
            )}

            {/* Project image */}
            <group position={[0, 2, 0.15]}>
                <mesh>
                    <planeGeometry args={[4.8, 2.5]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>
                <DreiImage url={project.image} scale={[4.8, 2.5, 1]} position={[0, 0, 0.01]} />
            </group>

            {/* Project title */}
            <Text
                position={[0, 0.8, 0.15]}
                fontSize={0.5}
                fontWeight="bold"
                color="#f1f5f9"
                maxWidth={4.5}
                textAlign="center"
                anchorY="middle"
            >
                {project.name}
            </Text>

            {/* Project description */}
            <Text
                position={[0, 0.2, 0.15]}
                fontSize={0.22}
                color="#cbd5e1"
                maxWidth={4.5}
                textAlign="center"
                anchorY="middle"
            >
                {project.description.substring(0, 80)}
                {project.description.length > 80 ? "..." : ""}
            </Text>

            {/* Tech stack tags */}
            <group position={[0, -1.2, 0.15]}>
                {project.technologies.slice(0, 3).map((tech, index) => (
                    <group key={tech} position={[(index - 1) * 1.4, 0, 0]}>
                        <mesh>
                            <planeGeometry args={[1.2, 0.35]} />
                            <meshBasicMaterial color="#0f172a" />
                        </mesh>
                        <Text fontSize={0.2} color="#0ea5e9" position={[0, 0, 0.01]} anchorY="middle">
                            {tech}
                        </Text>
                    </group>
                ))}
            </group>

            {/* Links section */}
            <group position={[0, -2.1, 0.15]}>
                <Text
                    position={[-1, 0, 0]}
                    fontSize={0.25}
                    color="#06b6d4"
                    onClick={(e) => {
                        e.stopPropagation()
                        window.open(project.githubUrl)
                    }}
                    style={{ cursor: "pointer" }}
                >
                    GitHub
                </Text>
                {project.liveUrl && (
                    <Text
                        position={[1, 0, 0]}
                        fontSize={0.25}
                        color="#06b6d4"
                        onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.liveUrl)
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        Live
                    </Text>
                )}
            </group>
        </group>
    )
}
