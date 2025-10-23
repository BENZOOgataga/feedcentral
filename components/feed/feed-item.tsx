"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

interface FeedItemProps {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  source: string;
  pubDate: string;
  index: number;
}

export function FeedItem({
  title,
  description,
  url,
  category,
  source,
  pubDate,
  index,
}: FeedItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card className="group cursor-pointer">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <Badge variant="secondary">{category}</Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(pubDate)}
            </div>
          </div>

          {/* Content */}
          <Link href={url} target="_blank" rel="noopener noreferrer">
            <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{source}</span>
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Read more
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
