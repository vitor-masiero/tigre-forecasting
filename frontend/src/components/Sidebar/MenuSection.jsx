import React from "react";
import MenuItem from "./MenuItem";

export default function MenuSection({
  title,
  items,
  currentPage,
  setCurrentPage,
}) {
  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase mb-3">
        {title}
      </div>
      <nav className="space-y-1">
        {items.map((item, index) => (
          <MenuItem
            key={index}
            {...item}
            active={currentPage === item.page}
            onClick={() => setCurrentPage && setCurrentPage(item.page)}
          />
        ))}
      </nav>
    </div>
  );
}
