export interface Project {
    id: string
    name: string
    description: string
    image: string
    technologies: string[]
    githubUrl: string
    liveUrl?: string
    owner: string
    repo: string
}

export interface ReadmeData {
    title: string
    description: string
    image: string
    technologies: string[]
    githubUrl: string
    liveUrl?: string
}
