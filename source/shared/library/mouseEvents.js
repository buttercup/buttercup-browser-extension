import debounce from "debounce";
import { trackUserActivity } from "./messaging";

export function trackMouseMovement() {
    const debouncedUserActivity = debounce(() => trackUserActivity(), 250, /* trailing: */ false);

    let handleMousemove = () => {
        debouncedUserActivity();
    };

    document.addEventListener("mousemove", handleMousemove, { passive: true });
}
