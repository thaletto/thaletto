const invalidChars = /[*.%#$!^&]/;

function validatePages(pages: readonly string[]) {
    for (const page of pages) {
        if (!page.startsWith("/")) {
            throw new Error(`Page "${page}" must start with /`);
        }
        if (invalidChars.test(page)) {
            throw new Error(`Page "${page}" contains invalid characters`);
        }
    }
    return pages;
}

export const viewsConfig = {
    pages: validatePages([
        "/",
        "/about",
        "/writings",
        "/projects",
        "/timeline",
    ]),
} as const;

export type ViewsConfig = typeof viewsConfig;