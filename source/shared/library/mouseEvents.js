import debounce from "debounce";
import { trackUserActivity } from "./messaging";

export function trackMouseMovement() {
    const debouncedUserActivity = debounce(() => trackUserActivity(), 250, /* trailing: */ false);
    const handleMousemove = () => {
        debouncedUserActivity();
    };
    document.addEventListener("mousemove", handleMousemove, { passive: true });
}

export function trackScrolling() {
    const debouncedUserActivity = debounce(() => trackUserActivity(), 250, /* trailing: */ false);
    const handleScrollUpdate = () => {
        debouncedUserActivity();
    };
    window.addEventListener("scroll", handleScrollUpdate);
}
