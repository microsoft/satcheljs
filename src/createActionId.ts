// Global rather than per-satchel so that action IDs never collide across satchel instances
let nextActionId = 0;

export default function createActionId(): string {
    return (nextActionId++).toString();
}
