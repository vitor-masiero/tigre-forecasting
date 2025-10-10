import React from "react";

export default function TableRow({ cells, hover = true }) {
  return (
    <tr className={hover ? "hover:bg-gray-50 transition" : ""}>
      {cells?.map((cell, index) => (
        <td key={index} className="px-6 py-4">
          {cell}
        </td>
      ))}
    </tr>
  );
}
