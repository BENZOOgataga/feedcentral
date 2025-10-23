"use client";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const categories = [
  "Technology",
  "Cybersecurity",
  "World News",
  "Business and Finance",
  "Science",
  "Programming",
  "Infrastructure and DevOps",
  "AI and Machine Learning",
];

export default function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-900/50 border border-gray-800/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 focus:bg-gray-900 transition-all min-w-[200px] backdrop-blur-sm cursor-pointer"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
