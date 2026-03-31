import { useState, useEffect, useContext } from "react";
import NavLink from "./NavbarLink";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import PrimaryButton from "./button/PrimaryButton";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [active, setActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, role, token } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router_link = [
    { link: "/", name: "Beranda" },
    { link: "/tentang", name: "Tentang Kami" },
    { link: "/prosedur", name: "Prosedur" },
    { link: "/hubungi-kami", name: "Hubungi Kami" },
    { link: "/lowongan", name: "Lowongan" },
    { link: "/post", name: "Post"},
  ];

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav
        className={`fixed w-full z-[998] px-4 lg:px-10 flex justify-between items-center transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-white/30 backdrop-blur-sm border-b border-gray-300/50 py-2.5"
            : "bg-white shadow-sm py-4"
        }`}
      >
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <img
              src="/assets/img/Logo.png"
              alt="Logo"
              className="w-12 lg:w-14 transition-all duration-300"
            />
            <div className="mt-2">
              <p className="font-bold text-base lg:text-lg -mb-2">Manajemen</p>
              <p className="font-bold text-base lg:text-lg text-[#0069AB]">Magang</p>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-7 items-center">
          {router_link.map((item, index) => (
            <NavLink
              link={item.link}
              name={item.name}
              key={index}
              active={active === item.link}
              className="relative text-gray-700 hover:text-[#0069AB] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#0069AB] after:transition-all after:duration-300 hover:after:w-full"
            />
          ))}
          <PrimaryButton
            to={!user && !token ? `/auth/login` : `/${role}/dashboard`}
            icon={`${!user && !token ? "bi-arrow-right" : "bi-house-door"}`}
            rounded="rounded-2xl"
          >
             {!user && !token ? (
              <>
                Login
      
              </>
            ) : (
              <>
                Dashboard
                
              </>
            )}
          </PrimaryButton>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Mobile Login Button */}
          <PrimaryButton
            to={!user && !token ? `/auth/login` : `/${role}/dashboard`}
            icon={`${!user && !token ? "bi-arrow-right" : "bi-house-door"}`}
            rounded="rounded-2xl"
          >
             {!user && !token ? (
              <>
                Masuk
      
              </>
            ) : (
              <>
                Dashboard
                
              </>
            )}
          </PrimaryButton>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-700 hover:text-[#0069AB] focus:outline-none transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                }`}
              ></span>
              <span
                className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              ></span>
              <span
                className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                }`}
              ></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleMobileMenu}
      ></div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img
              src="/assets/img/Logo.png"
              alt="Logo"
              className="w-10"
            />
            <div>
              <p className="font-bold text-sm -mb-1">Manajemen</p>
              <p className="font-bold text-sm text-[#0069AB]">Magang</p>
            </div>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close mobile menu"
          >
            <i className="bi bi-x-lg text-xl"></i>
          </button>
        </div>

        {/* Mobile Menu Links */}
        <div className="py-6">
          {router_link.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`block px-6 py-4 text-gray-700 hover:text-[#0069AB] hover:bg-gray-50 transition-colors duration-200 border-l-4 ${
                active === item.link
                  ? 'border-[#0069AB] text-[#0069AB] bg-blue-50'
                  : 'border-transparent'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <Link
            to={!user && !token ? `/auth/login` : `/${role}/dashboard`}
            className="w-full bg-[#0069AB] text-white text-center py-3 px-6 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#005588] flex items-center justify-center gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {!user && !token ? (
              <>
                Masuk
                <i className="bi bi-arrow-right"></i>
              </>
            ) : (
              <>
                Dashboard
                <i className="bi bi-house-door"></i>
              </>
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;