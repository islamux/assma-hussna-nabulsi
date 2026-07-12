export interface NamePart {
  index: number;
  title: string;
  content: string;
  contentHtml: string;
}

export interface NameEntry {
  index: number;
  slug: string;
  name: string;
  displayName: string;
  parts: NamePart[];
}

export interface SearchEntry {
  name: string;
  slug: string;
  content: string;
}
