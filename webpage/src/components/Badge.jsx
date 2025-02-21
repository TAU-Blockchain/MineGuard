import PropTypes from "prop-types";

const Badge = ({ icon: Icon, text, color, tooltipText }) => (
  <div className="relative group">
    <div
      className={`flex items-center gap-1 ${color} px-2 py-1 rounded-full text-xs`}
    >
      <Icon className="text-lg" />
      {text}
    </div>
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
      {tooltipText}
    </div>
  </div>
);

Badge.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  tooltipText: PropTypes.string.isRequired,
};

export default Badge;
