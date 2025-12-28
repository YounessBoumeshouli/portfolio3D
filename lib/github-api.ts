import { parseReadme } from "./readme-parser"
import type { Project } from "./types"

// Configuration: Add your GitHub username and selected repositories here
const GITHUB_CONFIG = {
    username: "yourusername", // Replace with your GitHub username
    repositories: ["repo-name-1", "repo-name-2", "repo-name-3"],
}

export async function fetchProjects(): Promise<Project[]> {
    try {
        const projects: Project[] = []

        for (const repo of GITHUB_CONFIG.repositories) {
            const project = await fetchProjectData(GITHUB_CONFIG.username, repo)
            if (project) {
                projects.push(project)
            }
        }

        return projects
    } catch (error) {
        console.error("Error fetching projects:", error)
        throw new Error("Failed to fetch GitHub projects")
    }
}

async function fetchProjectData(username: string, repoName: string): Promise<Project | null> {
    try {
        // Fetch README content
        const readmeUrl = `https://api.github.com/repos/${username}/${repoName}/readme`
        const readmeResponse = await fetch(readmeUrl, {
            headers: {
                Accept: "application/vnd.github.v3.raw",
            },
        })

        if (!readmeResponse.ok) {
            console.warn(`No README found for ${repoName}`)
            return null
        }

        const readmeContent = await readmeResponse.text()
        const readmeData = parseReadme(readmeContent)

        // Fetch repository metadata
        const repoUrl = `https://api.github.com/repos/${username}/${repoName}`
        const repoResponse = await fetch(repoUrl)
        const repoData = await repoResponse.json()

        return {
            id: repoData.id.toString(),
            name: readmeData.title || repoData.name,
            description: readmeData.description || repoData.description || "",
            image: readmeData.image || "/project-management-team.png",
            technologies: readmeData.technologies,
            githubUrl: repoData.html_url,
            liveUrl: readmeData.liveUrl,
            owner: username,
            repo: repoName,
        }
    } catch (error) {
        console.error(`Error fetching project ${repoName}:`, error)
        return null
    }
}
