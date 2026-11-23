import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarItem {
  id: string;
  name: string;
  image?: string;
  fallbackColor?: string;
}

interface AvatarStackProps {
  avatars: AvatarItem[];
  max?: number;
  size?: number; // diameter in px, e.g. 28, 32
  className?: string;
}

const DEFAULT_COLORS = [
  "bg-[#F6C9DD] text-[#7A2E50]",
  "bg-[#D9C9F5] text-[#3D2D69]",
  "bg-[#FAD8C6] text-[#784323]",
  "bg-[#D3E57A] text-[#4A5418]",
];

export function AvatarStack({
  avatars,
  max = 3,
  size = 28,
  className,
}: AvatarStackProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn("inline-flex items-center -space-x-2 select-none", className)}>
      {visible.map((av, idx) => {
        const initials = av.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        const colorClass = av.fallbackColor || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];

        return (
          <div
            key={av.id || idx}
            title={av.name}
            style={{ width: size, height: size }}
            className={cn(
              "rounded-full ring-2 ring-white dark:ring-[#1E1E22] flex items-center justify-center font-bold text-[10px] overflow-hidden shrink-0",
              colorClass
            )}
          >
            {av.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={av.image}
                alt={av.name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        );
      })}

      {remaining > 0 && (
        <div
          style={{ width: size, height: size }}
          className="rounded-full ring-2 ring-white dark:ring-[#1E1E22] bg-[#26262B] text-white flex items-center justify-center text-[10px] font-bold shrink-0"
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
