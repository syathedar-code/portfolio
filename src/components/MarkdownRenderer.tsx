import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    content: string;
    variant: "blog" | "newsletter";
}

export default function MarkdownRenderer({ content, variant }: MarkdownRendererProps) {
    const isNewsletter = variant === "newsletter";

    return (
        <div
            className={`w-full tracking-normal leading-relaxed ${isNewsletter
                ? "font-mono text-[15.5px] text-text-dim"
                : "font-mono text-[13.5px] text-text-dim/90"
                }`}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Headers with strict, clean manual spacing
                    h2: ({ children }) => (
                        <h2 className={`font-semibold mt-8 mb-4 block ${isNewsletter
                            ? "text-xl text-teal border-b border-line/30 pb-1"
                            : "text-base text-text"
                            }`}>
                            {isNewsletter ? "" : "> "}{children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className={`font-semibold mt-6 mb-3 block ${isNewsletter ? "text-lg text-text" : "text-sm text-text"
                            }`}>
                            {children}
                        </h3>
                    ),

                    // Standard Paragraphs: Explicitly add custom bottom spacing since prose is gone
                    p: ({ children }) => (
                        <p className="mb-4 block">
                            {children}
                        </p>
                    ),

                    // Lists Container Styles
                    ul: ({ children }) => (
                        <ul className="my-4 space-y-2.5 list-none p-0 m-0 block">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-4 space-y-2.5 list-none p-0 m-0 block">
                            {children}
                        </ol>
                    ),
                    li: ({ children, ...props }) => {
                        const hasCheckbox = props.className?.includes("task-list-item");

                        if (isNewsletter) {
                            return (
                                <li {...props} className={`flex items-start text-[15px] gap-2 mb-1.5 ${hasCheckbox ? "-ml-2" : ""}`}>
                                    {!hasCheckbox && <span className="text-teal mt-1 select-none text-xs">•</span>}
                                    <div className="flex-1">{children}</div>
                                </li>
                            );
                        }

                        // Blog terminal style item layout using a grid alignment column system
                        return (
                            <li {...props} className="grid grid-cols-[18px_1fr] text-[14px] items-start gap-1 mb-1.5">
                                <span className="font-mono text-teal select-none text-left">&gt;</span>
                                <div className="break-words min-w-0">{children}</div>
                            </li>
                        );
                    },

                    // Inline Code & Blocks
                    // Inside components mapping of src/components/MarkdownRenderer.tsx
                    code: ({ node, className, children, ...props }) => {
                        // Check if it's a multi-line code block or has a language class
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match && !String(children).includes('\n');

                        if (isInline) {
                            return (
                                <code className="bg-black/40 border border-line/60 rounded px-1.5 py-0.5 text-xs text-amber font-mono">
                                    {children}
                                </code>
                            );
                        }

                        // Multi-line terminal logs / ASCII flowcharts
                        return (
                            <pre className="font-mono text-[13px] bg-black/30 border border-line/50 text-amber leading-relaxed p-4 my-5 rounded overflow-x-auto whitespace-pre block tracking-normal select-text w-full">
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            </pre>
                        );
                    },

                    // Tables
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-6 border border-line rounded w-full">
                            <table className="w-full border-collapse font-mono text-xs text-left">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="border-b border-line bg-black/20">{children}</thead>
                    ),
                    th: ({ children }) => (
                        <th className="px-4 py-3 font-semibold text-text">{children}</th>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 py-3 border-t border-line text-text-dim">{children}</td>
                    ),

                    // Hyperlinks
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`underline decoration-1 underline-offset-4 transition-colors ${isNewsletter
                                ? "text-teal hover:text-amber decoration-teal/30"
                                : "text-amber hover:text-text decoration-amber/30"
                                }`}
                        >
                            {children}
                        </a>
                    ),

                    // Images
                    img: ({ src, alt }) => (
                        <img
                            src={src}
                            alt={alt}
                            className={`rounded border border-line my-6 max-w-full h-auto mx-auto block transition-all ${isNewsletter ? "hover:border-teal/50" : "hover:border-amber/50"
                                }`}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}