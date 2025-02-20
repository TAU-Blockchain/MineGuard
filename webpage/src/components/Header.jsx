import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
function Header() {
  return (
    <header className="bg-[#9BC1BC] min-h-20 shadow-md flex flex-row justify-center items-center w-full px-20">
      <nav className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row items-center justify-center flex-shrink-0">
          <img className="h-20 w-auto" src={Logo} alt="Logo" />
          <Link to="/" className="text-[#eaf3fc]  text-5xl font-pixelify">
            MineGuard
          </Link>
        </div>
        <div className="hidden sm:ml-6 sm:block">
          <div className="space-x-8">
            <Link to="/" className="text-white  text-3xl font-pixelify">
              Home
            </Link>
            <Link to="/scan" className="text-white  text-3xl font-pixelify">
              Scan
            </Link>
            <Link to="/report" className="text-white  text-3xl font-pixelify">
              Report
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
