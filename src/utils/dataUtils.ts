import { simpleflake } from "simpleflakes";

export function getSnowflake(): string {
    return simpleflake().toString(36) + "";
}

export function getTimestamp(): number {
    return Math.floor(Date.now() / 1000);
}