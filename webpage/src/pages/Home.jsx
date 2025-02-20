import { FaRocket, FaLightbulb, FaUsers } from "react-icons/fa";

function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-[#9BC1BC] shadow-lg shadow-[#9BC1BC] text-white py-20 my-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-pixelify">
              Lorem Ipsum Dolor
            </h1>
            <p className="text-xl mb-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut illo
            </p>
            <button className="bg-[#ED6A5A] hover:bg-white text-white hover:text-[#ED6A5A]  px-8 py-3 rounded-full font-semibold  transition duration-300 focus:outline-none focus:ring-2 focus:ring-white">
              Lorem Ipsum
            </button>
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
                Lorem Ipsum
              </h3>
              <p className="text-[#ed6b5aa1]">Lorem Ipsum</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A] text-center">
              <div className="text-[#ED6A5A] text-4xl mb-4 flex justify-center">
                <FaLightbulb />
              </div>
              <h3 className="text-xl text-[#ED6A5A] font-semibold mb-4">
                Lorem Ipsum
              </h3>
              <p className="text-[#ed6b5aa1]">Lorem Ipsum</p>
            </div>

            <div className="text-[#ED6A5A] p-8 rounded-lg shadow-lg shadow-[#ED6A5A] text-center">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <FaUsers />
              </div>
              <h3 className="text-xl text[#ED6A5A] font-semibold mb-4">
                Lorem Ipsum
              </h3>
              <p className="text-[#ed6b5aa1]">Lorem Ipsum</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-pixelify">
              Lets Build Together!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us for any questions or concerns.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Your Email"
                className="px-6 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-[#d0c852] text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition duration-300">
                Send
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
