"use client"

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text as Text3DText, Text3D, Center, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Car Component with keyboard controls
function Car({ position }) {
    const carRef = useRef();
    const [velocity, setVelocity] = useState({ x: 0, z: 0 });
    const speed = 0.15;
    const friction = 0.92;

    const keys = useRef({
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        w: false,
        s: false,
        a: false,
        d: false,
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (keys.current.hasOwnProperty(e.key)) {
                keys.current[e.key] = true;
            }
        };
        const handleKeyUp = (e) => {
            if (keys.current.hasOwnProperty(e.key)) {
                keys.current[e.key] = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame(() => {
        if (!carRef.current) return;

        let newVelX = velocity.x;
        let newVelZ = velocity.z;

        // Forward/Backward
        if (keys.current.ArrowUp || keys.current.w) {
            newVelZ -= speed;
        }
        if (keys.current.ArrowDown || keys.current.s) {
            newVelZ += speed;
        }

        // Left/Right
        if (keys.current.ArrowLeft || keys.current.a) {
            newVelX -= speed;
        }
        if (keys.current.ArrowRight || keys.current.d) {
            newVelX += speed;
        }

        // Apply friction
        newVelX *= friction;
        newVelZ *= friction;

        // Update position
        carRef.current.position.x += newVelX;
        carRef.current.position.z += newVelZ;

        // Boundaries
        carRef.current.position.x = Math.max(-25, Math.min(25, carRef.current.position.x));
        carRef.current.position.z = Math.max(-25, Math.min(25, carRef.current.position.z));

        // Rotation based on movement
        if (Math.abs(newVelX) > 0.01 || Math.abs(newVelZ) > 0.01) {
            const angle = Math.atan2(newVelX, newVelZ);
            carRef.current.rotation.y = angle;
        }

        setVelocity({ x: newVelX, z: newVelZ });
    });

    return (
        <group ref={carRef} position={position}>
            {/* Car Body */}
            <mesh position={[0, 0.3, 0]} castShadow>
                <boxGeometry args={[1.2, 0.5, 1.8]} />
                <meshStandardMaterial color="#ff6b6b" roughness={0.3} metalness={0.2} />
            </mesh>

            {/* Car Top */}
            <mesh position={[0, 0.75, -0.2]} castShadow>
                <boxGeometry args={[0.9, 0.4, 0.8]} />
                <meshStandardMaterial color="#ee5a52" roughness={0.3} metalness={0.2} />
            </mesh>

            {/* Wheels */}
            {[
                [-0.5, 0.15, 0.6],
                [0.5, 0.15, 0.6],
                [-0.5, 0.15, -0.6],
                [0.5, 0.15, -0.6],
            ].map((pos, i) => (
                <mesh key={i} position={pos} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
                    <meshStandardMaterial color="#2d2d2d" roughness={0.8} />
                </mesh>
            ))}
        </group>
    );
}

// Ground with instructions
function Ground() {
    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#f0e68c" roughness={0.9} />
            </mesh>

            {/* Grid lines */}
            <gridHelper args={[100, 50, '#d4af37', '#d4af37']} position={[0, 0, 0]} />
        </group>
    );
}

// Interactive Project Card
function ProjectCard({ position, project, index }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + index) * 0.1;
        meshRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
    });

    return (
        <group position={position}>
            {/* Card Base */}
            <mesh
                ref={meshRef}
                position={[0, 1.5, 0]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => window.open(project.githubUrl, '_blank')}
                castShadow
            >
                <boxGeometry args={[3, 4, 0.3]} />
                <meshStandardMaterial
                    color={hovered ? '#4ecdc4' : '#95e1d3'}
                    emissive={hovered ? '#4ecdc4' : '#000000'}
                    emissiveIntensity={hovered ? 0.3 : 0}
                    roughness={0.4}
                    metalness={0.1}
                />
            </mesh>

            {/* Project Name */}
            <Text3DText
                position={[0, 2.8, 0.2]}
                fontSize={0.3}
                color="#2d3436"
                anchorX="center"
                anchorY="middle"
                maxWidth={2.5}
            >
                {project.name}
            </Text3DText>

            {/* Tech Stack */}
            {project.technologies.slice(0, 3).map((tech, i) => (
                <Text3DText
                    key={i}
                    position={[0, 1.2 - i * 0.4, 0.2]}
                    fontSize={0.2}
                    color="#636e72"
                    anchorX="center"
                    anchorY="middle"
                >
                    {tech}
                </Text3DText>
            ))}

            {/* Glow effect when hovered */}
            {hovered && (
                <pointLight position={[0, 1.5, 1]} intensity={2} color="#4ecdc4" distance={5} />
            )}
        </group>
    );
}

// Title Text
function Title3D() {
    return (
        <Center position={[0, 3, -10]}>
            <Text3DText
                fontSize={1.2}
                color="#ff6b6b"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="#ffffff"
            >
                DEVELOPER PORTFOLIO
            </Text3DText>
        </Center>
    );
}

// Instructions on ground
function Instructions() {
    return (
        <group position={[0, 0.02, 5]}>
            <Text3DText
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.5}
                color="#2d3436"
                anchorX="center"
            >
                USE ARROW KEYS OR WASD TO DRIVE
            </Text3DText>
        </group>
    );
}

// Camera Follow
function CameraRig({ target }) {
    const { camera } = useThree();

    useFrame(() => {
        if (target.current) {
            const targetPos = target.current.position;
            camera.position.lerp(
                new THREE.Vector3(targetPos.x, targetPos.y + 15, targetPos.z + 12),
                0.05
            );
            camera.lookAt(targetPos.x, 0, targetPos.z);
        }
    });

    return null;
}

// Decorative Objects
function DecoObjects() {
    return (
        <>
            {/* Trees/Cylinders */}
            {[-15, -8, 8, 15].map((x, i) => (
                <mesh key={`tree-${i}`} position={[x, 1.5, -15]} castShadow>
                    <cylinderGeometry args={[0.3, 0.5, 3, 8]} />
                    <meshStandardMaterial color="#38ada9" roughness={0.6} />
                </mesh>
            ))}

            {/* Boxes */}
            {[
                [-20, 10],
                [20, 10],
                [-20, -10],
                [20, -10],
            ].map(([x, z], i) => (
                <mesh key={`box-${i}`} position={[x, 0.75, z]} castShadow>
                    <boxGeometry args={[1.5, 1.5, 1.5]} />
                    <meshStandardMaterial color="#fab1a0" roughness={0.5} />
                </mesh>
            ))}
        </>
    );
}

// Main Component
export default function BrunoStylePortfolio() {
    const carRef = useRef();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockProjects = [
            {
                id: '1',
                name: 'Project Alpha',
                technologies: ['React', 'Three.js', 'Node.js'],
                githubUrl: 'https://github.com',
            },
            {
                id: '2',
                name: 'Project Beta',
                technologies: ['Vue', 'WebGL', 'Express'],
                githubUrl: 'https://github.com',
            },
            {
                id: '3',
                name: 'Project Gamma',
                technologies: ['Next.js', 'TypeScript', 'Prisma'],
                githubUrl: 'https://github.com',
            },
        ];

        setTimeout(() => {
            setProjects(mockProjects);
            setLoading(false);
        }, 1000);
    }, []);

    return (<>

        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <div className="w-full h-screen bg-gradient-to-b from-sky-200 to-sky-100">
            {/* Instructions Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <p className="text-sm font-medium text-gray-700">
                    🎮 Use Arrow Keys or WASD to Drive Around
                </p>
            </div>

            {/* Info Panel */}
            <div className="absolute top-20 left-6 z-10 bg-white/90 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-lg max-w-xs">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Your Name</h2>
                <p className="text-sm text-gray-600 mb-3">Creative Developer & Designer</p>
                <div className="flex gap-3">
                    <a href="https://github.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                    <a href="https://linkedin.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                    </a>
                </div>
            </div>

            {/* Projects Info */}
            <div className="absolute bottom-6 right-6 z-10 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-lg">
                <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-800">{projects.length}</span> Projects • Click to explore
                </p>
            </div>

            <Canvas shadows camera={{ position: [0, 15, 12], fov: 60 }}>
                <color attach="background" args={['#87ceeb']} />
                <fog attach="fog" args={['#87ceeb', 30, 60]} />

                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-far={50}
                    shadow-camera-left={-30}
                    shadow-camera-right={30}
                    shadow-camera-top={30}
                    shadow-camera-bottom={-30}
                />
                <hemisphereLight intensity={0.4} groundColor="#f0e68c" />

                <Suspense fallback={null}>
                    <Ground />
                    <Instructions />
                    <Car ref={carRef} position={[0, 0, 0]} />
                    <Title3D />
                    <DecoObjects />

                    {/* Project Cards in a curve */}
                    {projects.map((project, index) => {
                        const angle = (index / projects.length) * Math.PI * 0.8 - Math.PI * 0.4;
                        const radius = 8;
                        const x = Math.sin(angle) * radius;
                        const z = Math.cos(angle) * radius - 5;

                        return (
                            <ProjectCard
                                key={project.id}
                                position={[x, 0, z]}
                                project={project}
                                index={index}
                            />
                        );
                    })}

                    <CameraRig target={carRef} />
                </Suspense>
            </Canvas>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-700 font-medium">Loading Experience...</p>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}