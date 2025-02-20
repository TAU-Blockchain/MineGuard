import { Link } from "react-router-dom";
import { BiHomeAlt } from "react-icons/bi";

function NotFound() {
  return (
    <div className="min-h-screen">
      <section className="bg-[#9BC1BC] shadow-lg shadow-[#9BC1BC] text-white py-20 my-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-8xl font-bold mb-6 font-pixelify">404</h1>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-pixelify">
              Page Not Found
            </h2>
            <p className="text-xl mb-8">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#ED6A5A] text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#ED6A5A] border border-[#ED6A5A] transition duration-300"
            >
              <BiHomeAlt size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NotFound;
