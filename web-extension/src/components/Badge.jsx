import React from "react";

const Badge = ({ icon: Icon, text, color, tooltipText }) => (
  <div
    className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${color} text-xs font-medium`}
    title={tooltipText}
  >
    <Icon className="text-sm" />
    <span>{text}</span>
  </div>
);

export default Badge;
