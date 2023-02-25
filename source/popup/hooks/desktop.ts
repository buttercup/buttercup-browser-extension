import { useAsync } from "../../shared/hooks/async.js";
import { getDesktopConnectionAvailable } from "../queries/desktop.js";

export function useDesktopConnectionAvailable(): boolean | null {
    const { value } = useAsync(async () => {
        const isAvailable = await getDesktopConnectionAvailable();
        return isAvailable;
    });
    return value;
}
