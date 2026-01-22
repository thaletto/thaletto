export function getSessionId() {
    const key = "viewer-id";

    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
    }

    return id;
}
