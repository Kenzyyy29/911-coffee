"use client";
import {motion, AnimatePresence} from "framer-motion";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState, useEffect} from "react";
import {
 FiMenu,
 FiX,
 FiBriefcase,
 FiMail,
 FiBook,
 FiDollarSign,
} from "react-icons/fi";
import {FaHandshake} from "react-icons/fa";
import {BsFillLightningFill} from "react-icons/bs";
import {GiCoffeeBeans} from "react-icons/gi";

const itemVariants = {
 hidden: {opacity: 0, y: -20},
 visible: {
  opacity: 1,
  y: 0,
  transition: {
   type: "spring",
   stiffness: 100,
   damping: 10,
  },
 },
};

export default function Navbar() {
 const pathname = usePathname();
 const [isOpen, setIsOpen] = useState(false);
 const [scrolled, setScrolled] = useState(false);

 useEffect(() => {
  const handleScroll = () => {
   setScrolled(window.scrollY > 10);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
 }, []);

 const navItems = [
  {
   name: "Tentang Kami",
   path: "/about",
   icon: <FaHandshake className="text-lg" />,
  },
  {
   name: "Fitur",
   path: "/features",
   icon: <BsFillLightningFill className="text-lg" />,
  },
  {
   name: "Harga",
   path: "/pricing",
   icon: <FiDollarSign className="text-lg" />,
  },
  {
   name: "Blog",
   path: "/blog",
   icon: <FiBook className="text-lg" />,
  },
  {
   name: "Karir",
   path: "/career",
   icon: <FiBriefcase className="text-lg" />,
  },
  {
   name: "Kontak",
   path: "/contact",
   icon: <FiMail className="text-lg" />,
  },
 ];

 return (
  <motion.nav
   initial="hidden"
   animate="visible"
   variants={{
    visible: {
     transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
     },
    },
   }}
   className={`fixed w-full z-50 py-3 ${
    scrolled ? "bg-black" : "bg-black backdrop-blur-sm"
   }`}>
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
     {/* Logo/Brand */}
     <motion.div
      variants={itemVariants}
      className="flex-shrink-0 flex items-center">
      <Link
       href="/"
       className="flex items-center group">
       <motion.div
        className="bg-white p-2 rounded-full shadow-lg mr-3 group-hover:rotate-12 transition-transform"
        whileHover={{scale: 1.1}}>
        <GiCoffeeBeans className="text-black text-xl" />
       </motion.div>
       <span
        className="text-white text-3xl "
        style={{fontFamily: "Agency FB"}}>
        9/1/1
       </span>
      </Link>
     </motion.div>

     {/* Desktop Navigation */}
     <motion.div
      variants={itemVariants}
      className="hidden md:flex items-center space-x-3">
      {navItems.map((item) => (
       <div
        key={item.path}
        className="relative">
        <div className="flex items-center">
         <Link
          href={item.path}
          className={`flex items-center px-2 py-1 rounded-lg text-md font-medium transition-all ${
           pathname === item.path
            ? "bg-white text-black shadow-inner"
            : "text-white hover:bg-white hover:text-black"
          }`}>
          {item.name}
         </Link>
        </div>
       </div>
      ))}
     </motion.div>

     {/* Mobile Menu Button */}
     <motion.button
      className="md:hidden text-white p-2 rounded-lg hover:bg-blue-700/50"
      onClick={() => setIsOpen(!isOpen)}
      whileHover={{scale: 1.1}}
      whileTap={{scale: 0.95}}>
      {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
     </motion.button>
    </div>
   </div>

   {/* Mobile Menu */}
   <AnimatePresence>
    {isOpen && (
     <motion.div
      initial={{opacity: 0, height: 0}}
      animate={{opacity: 1, height: "auto"}}
      exit={{opacity: 0, height: 0}}
      transition={{duration: 0.3}}
      className="md:hidden bg-gradient-to-b from-blue-700 to-blue-800 overflow-hidden">
      <div className="px-4 pt-2 pb-4 space-y-1">
       {navItems.map((item) => (
        <div key={item.path}>
         <div className="flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium text-blue-100 hover:bg-blue-700/50 hover:text-white">
          <Link
           href={item.path}
           className="flex items-center flex-1">
           {item.name}
          </Link>
         </div>
        </div>
       ))}
      </div>
     </motion.div>
    )}
   </AnimatePresence>
  </motion.nav>
 );
}
