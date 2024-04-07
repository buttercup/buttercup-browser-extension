import { useEffect } from "react";

const TITLE_SEPARATOR = "⋅";

let __originalTitle: string | null = null;

export function useTitle(title: string) {
    useEffect(() => {
        if (!__originalTitle) {
            __originalTitle = document.title;
        }
        document.title = `${title} ${TITLE_SEPARATOR} ${__originalTitle}`;
        return () => {
            if (__originalTitle) {
                document.title = __originalTitle;
                __originalTitle = null;
            }
        };
    }, []);
}
