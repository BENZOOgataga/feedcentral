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
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <article className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] rounded-xl p-5 transition-all duration-300 hover:border-white/[0.12] hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
            {category}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-medium">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(pubDate)}
          </div>
        </div>

        {/* Content */}
        <Link href={url} target="_blank" rel="noopener noreferrer" className="block mb-3">
          <h3 className="text-[15px] font-semibold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
            {title}
          </h3>
        </Link>

        <p className="text-[13px] text-white/60 leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <span className="text-[11px] text-white/40 font-medium tracking-wide">{source}</span>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors group/link"
          >
            Read more
            <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </article>
    </motion.div>
  );
}
