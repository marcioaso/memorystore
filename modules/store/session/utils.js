import { EXPIRATION_MINUTES } from "./constants";

export const getExpiresAt = () => new Date().getTime() + (EXPIRATION_MINUTES * 60000);