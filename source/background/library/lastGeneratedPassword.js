import TTLValue from "mini-ttl";

const __lastPassword = new TTLValue(null, "2m");
__lastPassword.expire();

export const lastPassword = __lastPassword;
