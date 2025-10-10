import React from "react";

export default function InfoCard({
  title,
  content,
  icon: Icon,
  iconBg,
  footer,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      {title && (
        <div className="flex justify-between items-start mb-4">
          <div className="text-sm font-medium text-gray-500 uppercase">
            {title}
          </div>
          {Icon && (
            <div className={`${iconBg} p-2 rounded-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      )}
      <div className="mb-2">{content}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}
