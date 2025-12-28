import type { ReadmeData } from "./types"

export function parseReadme(content: string): ReadmeData {
    const lines = content.split("\n")

    let title = ""
    let description = ""
    let image = ""
    let technologies: string[] = []
    let liveUrl = ""

    // Extract title (first h1)
    const titleMatch = content.match(/^#\s+(.+?)$/m)
    if (titleMatch) {
        title = titleMatch[1].trim()
    }

    // Extract image (first markdown image)
    const imageMatch = content.match(/!\[.*?\]$$(.*?)$$/)
    if (imageMatch) {
        image = imageMatch[1]
    }

    // Extract description (first paragraph after title)
    const descriptionStart = content.indexOf(title) + title.length
    const descriptionBlock = content.substring(descriptionStart)
    const descriptionMatch = descriptionBlock.match(/^\s*(.+?)(?:\n\n|#|$)/s)
    if (descriptionMatch) {
        description = descriptionMatch[1]
            .trim()
            .replace(/\[.*?\]$$.*?$$/g, "") // Remove links
            .split("\n")[0] // Take first line
    }

    // Extract tech stack (look for common patterns)
    const techSection = content.match(/(?:##\s+)?(?:Tech|Technologies|Stack|Built with)[\s\S]*?(?=##|$)/i)
    if (techSection) {
        const techMatches = techSection[0].match(/(?:[-•]|\d+\.)\s*([A-Za-z0-9#.\-+]+)/g)
        if (techMatches) {
            technologies = techMatches.map((t) => t.replace(/^[-•\d.]\s*/, "").trim()).filter((t) => t.length > 0)
        }
    }

    // Extract live URL (look for common patterns)
    const urlMatch = content.match(/(?:Live|Demo|Visit|Website|https?:\/\/[^\s)]+)/i)
    if (urlMatch) {
        const urlPattern = /https?:\/\/[^\s)]+/
        const urlMatch2 = content.match(urlPattern)
        if (urlMatch2) {
            liveUrl = urlMatch2[0]
        }
    }

    return {
        title: title || "Untitled Project",
        description: description || "No description available",
        image: image || "/project-management-team.png",
        technologies: technologies.length > 0 ? technologies : ["Web"],
        liveUrl: liveUrl || "",
    }
}
