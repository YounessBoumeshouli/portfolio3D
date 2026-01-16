import { NextResponse } from "next/server"
import { parseReadme } from "../../../lib/readme-parser"
import type { Project } from "../../../lib/types"

const REPOSITORIES = ["FillRouge", "RandomChess", "aero"]

export async function GET() {
    try {
        const projects: Project[] = []

        for (const repo of REPOSITORIES) {
            const project = await fetchProjectData(repo)
            if (project) projects.push(project)
        }

        return NextResponse.json(projects)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        )
    }
}

async function fetchProjectData(repoName: string): Promise<Project | null> {
    const headers = {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw"
    }

    const base = `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${repoName}`

    try {
        // README
        const readmeRes = await fetch(`${base}/readme`, { headers })
        if (!readmeRes.ok) {
            console.error(`Failed to fetch README for ${repoName}:`, readmeRes.status)
            return null
        }

        const readmeContent = await readmeRes.text()
        const readmeData = parseReadme(readmeContent)

        // Repo metadata
        const repoRes = await fetch(base, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            }
        })

        if (!repoRes.ok) {
            console.error(`Failed to fetch repo data for ${repoName}:`, repoRes.status)
            return null
        }

        const repoData = await repoRes.json()

        return {
            id: repoData.id.toString(),
            name: readmeData.title || repoData.name,
            description: readmeData.description || repoData.description || "",
            image: readmeData.image || "/project-management-team.png",
            technologies: readmeData.technologies,
            githubUrl: repoData.html_url,
            liveUrl: readmeData.liveUrl,
            owner: process.env.GITHUB_USERNAME!,
            repo: repoName
        }
    } catch (error) {
        console.error(`Error fetching project ${repoName}:`, error)
        return null
    }
}