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
      className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all min-w-[200px]"
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
