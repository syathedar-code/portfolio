// src/lib/posts.ts
export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

const files = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {} as Record<string, string>, content: raw };

  const [, frontmatter, content] = match;
  const data: Record<string, string> = {};
  frontmatter.split(/\r?\n/).forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = value;
  });

  return { data, content: content.trim() };
}

export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    const slug = path.split("/").pop()!.replace(".md", "");
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      content,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));