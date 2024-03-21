export function getExtensionAPI(): typeof chrome {
    return self.chrome || self["browser"];
}
