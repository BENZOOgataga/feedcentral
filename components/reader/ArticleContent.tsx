interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <div
        className="text-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
