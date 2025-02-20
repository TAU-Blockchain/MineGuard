import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#9BC1BC] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-pixelify mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-gray-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-gray-200">
                  Admin
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-gray-200">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-pixelify mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>Email: info@example.com</li>
              <li>Phone: +1 234 567 8900</li>
              <li>Address: Lorem Ipsum Street No:1</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-pixelify mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/afurgapil/taubc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-gray-200"
              >
                <FaGithub />
              </a>
              <a
                href="https://twitter.com/@tdublockchain"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-gray-200"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/@taublockchain"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-gray-200"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-white/20">
          <p className="font-pixelify">
            © {new Date().getFullYear()} TAU Blockcain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
