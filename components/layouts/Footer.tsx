"use client";
import {motion} from "framer-motion";
import Link from "next/link";
import {FiMail, FiPhone, FiMapPin, FiClock} from "react-icons/fi";
import {FaInstagram, FaFacebook, FaTwitter} from "react-icons/fa";
import {GiCoffeeBeans} from "react-icons/gi";

const itemVariants = {
 hidden: {opacity: 0, y: 20},
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

export default function Footer() {
 const footerLinks = [
  {
   title: "Tentang",
   links: [
    {name: "Tentang Kami", path: "/about"},
    {name: "Outlet", path: "/outlet"},
    {name: "Blog", path: "/blog"},
   ],
  },
  {
   title: "Layanan",
   links: [
    {name: "Menu", path: "/menu"},
    {name: "Karir", path: "/career"},
    {name: "Kontak", path: "/contact"},
   ],
  },
  {
   title: "Legal",
   links: [
    {name: "Kebijakan Privasi", path: "/privacy"},
    {name: "Syarat & Ketentuan", path: "/terms"},
   ],
  },
 ];

 const contactInfo = [
  {icon: <FiMail />, text: "911coffee.tasik@gmail.com"},
  {icon: <FiPhone />, text: "+62 811 2230 911"},
  {icon: <FiMapPin />, text: "Jl. Kopi No. 911, Jakarta"},
  {icon: <FiClock />, text: "Buka setiap hari 08.00 - 23.00"},
 ];

 const socialMedia = [
  {icon: <FaInstagram />, url: "#"},
  {icon: <FaFacebook />, url: "#"},
  {icon: <FaTwitter />, url: "#"},
 ];

 return (
  <motion.footer
   initial="hidden"
   whileInView="visible"
   viewport={{once: true}}
   variants={{
    visible: {
     transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
     },
    },
   }}
   className="bg-black text-white pt-16 pb-8">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
     {/* Brand Info */}
     <motion.div
      variants={itemVariants}
      className="flex flex-col items-start">
      <Link
       href="/"
       className="flex items-center group mb-4">
       <motion.div
        className="bg-white p-2 rounded-full shadow-lg mr-3 group-hover:rotate-12 transition-transform"
        whileHover={{scale: 1.1}}>
        <GiCoffeeBeans className="text-black text-xl" />
       </motion.div>
       <span
        className="text-white text-3xl"
        style={{fontFamily: "Agency FB"}}>
        9/1/1 Coffee
       </span>
      </Link>
      <p className="text-gray-400 mb-4">
       Menyajikan kopi berkualitas dengan cita rasa yang konsisten sejak 2016.
      </p>
      <div className="flex space-x-4">
       {socialMedia.map((social, index) => (
        <motion.a
         key={index}
         href={social.url}
         className="text-white hover:text-gray-300 text-xl"
         whileHover={{y: -3}}>
         {social.icon}
        </motion.a>
       ))}
      </div>
     </motion.div>

     {/* Footer Links */}
     {footerLinks.map((section, index) => (
      <motion.div
       key={index}
       variants={itemVariants}
       className="mt-4 md:mt-0">
       <h3 className="text-xl font-medium mb-4">{section.title}</h3>
       <ul className="space-y-3">
        {section.links.map((link, linkIndex) => (
         <li key={linkIndex}>
          <Link
           href={link.path}
           className="text-gray-400 hover:text-white transition-colors flex items-center">
           <span className="hover:underline">{link.name}</span>
          </Link>
         </li>
        ))}
       </ul>
      </motion.div>
     ))}

     {/* Contact Info */}
     <motion.div
      variants={itemVariants}
      className="mt-4 md:mt-0">
      <h3 className="text-xl font-medium mb-4">Kontak Kami</h3>
      <ul className="space-y-3">
       {contactInfo.map((info, index) => (
        <li
         key={index}
         className="text-gray-400 flex items-start">
         <span className="mr-3 mt-1">{info.icon}</span>
         <span>{info.text}</span>
        </li>
       ))}
      </ul>
     </motion.div>
    </div>

    {/* Copyright */}
    <motion.div
     variants={itemVariants}
     className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
     <p>© {new Date().getFullYear()} 911 Coffee. All rights reserved.</p>
    </motion.div>
   </div>
  </motion.footer>
 );
}
