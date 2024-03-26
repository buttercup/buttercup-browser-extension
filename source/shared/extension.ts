export function getExtensionAPI(): typeof chrome {
    if (BROWSER === "firefox") {
        return browser;
    }
    return self.chrome || self["browser"];
}
