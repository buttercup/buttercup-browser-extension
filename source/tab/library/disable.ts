export function itemIsIgnored(element: HTMLElement): boolean {
    return element.matches("[data-bcupignore=true] *, [data-bcupignore=true]");
}
