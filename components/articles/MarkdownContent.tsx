import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

type MarkdownContentProps = {
  content: string;
};

export default function MarkdownContent({
  content,
}: MarkdownContentProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}