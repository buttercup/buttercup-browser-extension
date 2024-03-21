import { TITLE as WelcomeV3Title, Page as WelcomeV3Page } from "./pages/WelcomeV3.jsx";

export const NOTIFICATIONS: Record<string, [string, () => JSX.Element]> = {
    "2024-03-welcome-v3": [WelcomeV3Title, WelcomeV3Page]
};

export const NOTIFICATION_NAMES = Object.keys(NOTIFICATIONS);
