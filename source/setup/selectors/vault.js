const KEY = "vault";

export function getVaultFacade(state) {
    return state[KEY].vaultFacade;
}
