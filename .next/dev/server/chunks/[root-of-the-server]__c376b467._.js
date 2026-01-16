module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/readme-parser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseReadme",
    ()=>parseReadme
]);
function parseReadme(content) {
    const lines = content.split("\n");
    let title = "";
    let description = "";
    let image = "";
    let technologies = [];
    let liveUrl = "";
    // Extract title (first h1)
    const titleMatch = content.match(/^#\s+(.+?)$/m);
    if (titleMatch) {
        title = titleMatch[1].trim();
    }
    // Extract image (first markdown image)
    const imageMatch = content.match(/!\[.*?\]$$(.*?)$$/);
    if (imageMatch) {
        image = imageMatch[1];
    }
    // Extract description (first paragraph after title)
    const descriptionStart = content.indexOf(title) + title.length;
    const descriptionBlock = content.substring(descriptionStart);
    const descriptionMatch = descriptionBlock.match(/^\s*(.+?)(?:\n\n|#|$)/s);
    if (descriptionMatch) {
        description = descriptionMatch[1].trim().replace(/\[.*?\]$$.*?$$/g, "") // Remove links
        .split("\n")[0]; // Take first line
    }
    // Extract tech stack (look for common patterns)
    const techSection = content.match(/(?:##\s+)?(?:Tech|Technologies|Stack|Built with)[\s\S]*?(?=##|$)/i);
    if (techSection) {
        const techMatches = techSection[0].match(/(?:[-•]|\d+\.)\s*([A-Za-z0-9#.\-+]+)/g);
        if (techMatches) {
            technologies = techMatches.map((t)=>t.replace(/^[-•\d.]\s*/, "").trim()).filter((t)=>t.length > 0);
        }
    }
    // Extract live URL (look for common patterns)
    const urlMatch = content.match(/(?:Live|Demo|Visit|Website|https?:\/\/[^\s)]+)/i);
    if (urlMatch) {
        const urlPattern = /https?:\/\/[^\s)]+/;
        const urlMatch2 = content.match(urlPattern);
        if (urlMatch2) {
            liveUrl = urlMatch2[0];
        }
    }
    return {
        title: title || "Untitled Project",
        description: description || "No description available",
        image: image || "/project-management-team.png",
        technologies: technologies.length > 0 ? technologies : [
            "Web"
        ],
        liveUrl: liveUrl || ""
    };
}
}),
"[project]/app/api/projects/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$readme$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/readme-parser.ts [app-route] (ecmascript)");
;
;
const REPOSITORIES = [
    "FillRouge",
    "RandomChess",
    "aero"
];
async function GET() {
    try {
        const projects = [];
        for (const repo of REPOSITORIES){
            const project = await fetchProjectData(repo);
            if (project) projects.push(project);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(projects);
    } catch (error) {
        console.error(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch projects"
        }, {
            status: 500
        });
    }
}
async function fetchProjectData(repoName) {
    const headers = {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw"
    };
    const base = `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${repoName}`;
    try {
        // README
        const readmeRes = await fetch(`${base}/readme`, {
            headers
        });
        if (!readmeRes.ok) {
            console.error(`Failed to fetch README for ${repoName}:`, readmeRes.status);
            return null;
        }
        const readmeContent = await readmeRes.text();
        const readmeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$readme$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseReadme"])(readmeContent);
        // Repo metadata
        const repoRes = await fetch(base, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            }
        });
        if (!repoRes.ok) {
            console.error(`Failed to fetch repo data for ${repoName}:`, repoRes.status);
            return null;
        }
        const repoData = await repoRes.json();
        return {
            id: repoData.id.toString(),
            name: readmeData.title || repoData.name,
            description: readmeData.description || repoData.description || "",
            image: readmeData.image || "/project-management-team.png",
            technologies: readmeData.technologies,
            githubUrl: repoData.html_url,
            liveUrl: readmeData.liveUrl,
            owner: process.env.GITHUB_USERNAME,
            repo: repoName
        };
    } catch (error) {
        console.error(`Error fetching project ${repoName}:`, error);
        return null;
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c376b467._.js.map