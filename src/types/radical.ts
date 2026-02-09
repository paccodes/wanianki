import type { Subject } from "./subject";

interface Image {
  content_type: "image/png" | "image/svg+xml";
  url: string | undefined;
}

export interface Radical extends Subject {
  character_images: Image[];
  characters: string | null;
}
