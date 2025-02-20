import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { BsArrowDownCircleFill, BsArrowUpCircleFill } from "react-icons/bs";

function ScrollToBottomButton({ className = "" }) {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      const bottomThreshold = 50;
      const isNearBottom =
        scrollTop + windowHeight >= documentHeight - bottomThreshold;

      if (documentHeight > windowHeight) {
        setIsBottom(isNearBottom);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (isBottom) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      window.scrollTo({
        top: documentHeight,
        behavior: "smooth",
      });
    }
  };

  const isScrollable =
    document.documentElement.scrollHeight > window.innerHeight;

  if (!isScrollable) return null;

  return (
    <button
      onClick={handleScroll}
      className={`fixed md:bottom-24 md:right-6 bottom-20 right-4 p-3 bg-[#9BC1BC] text-white rounded-full hover:bg-[#92b6b1] transition-all shadow-lg hover:scale-110 z-10 ${className}`}
      aria-label={isBottom ? "Up" : "Down"}
    >
      {isBottom ? (
        <BsArrowUpCircleFill size={24} />
      ) : (
        <BsArrowDownCircleFill size={24} />
      )}
    </button>
  );
}

export default ScrollToBottomButton;

ScrollToBottomButton.propTypes = {
  className: PropTypes.string,
};
