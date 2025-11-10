import type { Space } from "./space";

type SpaceLookup = Pick<Space, "id" | "name" | "type">;

export type { SpaceLookup };
