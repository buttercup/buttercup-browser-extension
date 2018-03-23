export function itemIsIgnored(element) {
    return element.matches("[data-bcupignore=true] *, [data-bcupignore=true]");
}
