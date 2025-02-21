import { FaRocket, FaLightbulb, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-[#9BC1BC] shadow-lg shadow-[#9BC1BC] text-white py-20 my-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-4 justify-center items-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-pixelify">
              MineGuard: Smart Contract Security Platform
            </h1>
            <p className="text-xl mb-8">
              Let&apos;s build a secure future in the blockchain ecosystem
              together. Scan smart contracts, report threats, and discuss
              security with the community.
            </p>
            <div className="flex gap-4">
              <Link
                to="scan"
                className="bg-[#ED6A5A] hover:bg-white text-white hover:text-[#ED6A5A] px-8 py-3 rounded-full font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Start Scanning Now
              </Link>
              <Link
                to="education"
                className="bg-[#ED6A5A] hover:bg-white text-white hover:text-[#ED6A5A] px-8 py-3 rounded-full font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A] text-center">
              <div className="text-[#ED6A5A] text-4xl mb-4 flex justify-center">
                <FaRocket />
              </div>
              <h3 className="text-xl text-[#ED6A5A] font-semibold mb-4 pixelify">
                Quick Scan
              </h3>
              <p className="text-[#ed6b5aa1]">
                Scan smart contracts in seconds and detect potential security
                threats. Make quick decisions with instant results.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A] text-center">
              <div className="text-[#ED6A5A] text-4xl mb-4 flex justify-center">
                <FaLightbulb />
              </div>
              <h3 className="text-xl text-[#ED6A5A] font-semibold mb-4">
                Community Intelligence
              </h3>
              <p className="text-[#ed6b5aa1]">
                Report suspicious contracts and benefit from other users&apos;
                experiences. Discuss security threats with the community.
              </p>
            </div>

            <div className="text-[#ED6A5A] p-8 rounded-lg shadow-lg shadow-[#ED6A5A] text-center">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <FaUsers />
              </div>
              <h3 className="text-xl text[#ED6A5A] font-semibold mb-4">
                Secure Ecosystem
              </h3>
              <p className="text-[#ed6b5aa1]">
                Harness the power of community to make the blockchain ecosystem
                more secure. Every contribution matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-pixelify">
              Let&apos;s Build a Secure Future Together!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Have questions about blockchain security? Get in touch with us.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-6 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-[#ED6A5A]"
              />
              <button className="bg-[#ED6A5A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#e85a49] transition duration-300">
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
