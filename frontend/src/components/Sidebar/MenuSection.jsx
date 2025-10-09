import React from "react";
import MenuItem from "./MenuItem";

export default function MenuSection({ title, items }) {
  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase mb-3">
        {title}
      </div>
      <nav className="space-y-1">
        {items.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </nav>
    </div>
  );
}
