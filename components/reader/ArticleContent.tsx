interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg prose-img:my-6">
      <div
        className="text-foreground leading-relaxed [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-6 [&_img]:mx-auto [&_img]:block"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
