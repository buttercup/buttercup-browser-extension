import debounce from "debounce";
import { trackUserActivity } from "./messaging";

export function trackKeydownEvent() {
    const debouncedUserActivity = debounce(() => trackUserActivity(), 250, /* trailing: */ false);

    let handleKeydown = () => {
        debouncedUserActivity();
    };

    document.addEventListener("keydown", handleKeydown, false);
}
