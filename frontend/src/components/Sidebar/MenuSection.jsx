import React from "react";
import MenuItem from "./MenuItem";

export default function MenuSection({
  title,
  items,
  currentPage,
  setCurrentPage,
  theme = "light"
}) {
  const isDark = theme === "dark";

  return (
    <div className="mb-2">
      <div className={`px-4 text-[11px] font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
        {title}
      </div>
      <nav className="space-y-1">
        {items.map((item, index) => (
          <MenuItem
            key={index}
            {...item}
            active={currentPage === item.page}
            onClick={() => setCurrentPage && setCurrentPage(item.page)}
            theme={theme}
          />
        ))}
      </nav>
    </div>
  );
}
