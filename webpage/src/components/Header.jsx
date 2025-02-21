import { Link, useLocation } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import Logo from "../assets/logo.svg";

function Header() {
  const location = useLocation();
  const { connectWallet, account, isLoading } = useWeb3();

  return (
    <header className="bg-[#9BC1BC] text-white py-4 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-20 w-auto" />
            <Link to="/" className="text-2xl font-pixelify">
              Units Security Scanner
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex gap-4">
              <Link
                to="/"
                className={`hover:text-gray-200 ${
                  location.pathname === "/" ? "font-bold" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/scan"
                className={`hover:text-gray-200  ${
                  location.pathname === "/scan" ? "font-bold" : ""
                }`}
              >
                Scan
              </Link>
              <Link
                to="/report"
                className={`hover:text-gray-200 ${
                  !account ? "opacity-50 cursor-not-allowed" : ""
                } ${location.pathname === "/report" ? "font-bold" : ""}`}
                onClick={(e) => !account && e.preventDefault()}
              >
                Report
              </Link>
            </nav>

            {!account ? (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-[#ED6A5A] text-white px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-[#ED6A5A] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <div className="bg-white/10 px-4 py-2 rounded-full">
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
