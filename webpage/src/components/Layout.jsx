import PropTypes from "prop-types";
import Footer from "./Footer";
import Header from "./Header";
import ScrollToTopButton from "./ScrollToTopButton";
import ScrollToBottomButton from "./ScrolltoBottom";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <Header />
      <main className="flex-1 container mx-auto px-4">{children}</main>
      <div className="fixed-buttons">
        <ScrollToTopButton />
        <ScrollToBottomButton />
      </div>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
