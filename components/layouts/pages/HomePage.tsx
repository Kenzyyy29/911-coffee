"use client";
import {motion} from "framer-motion";
import {SiCoffeescript} from "react-icons/si";
import {PiForkKnifeFill} from "react-icons/pi";
import {BsFillPersonCheckFill, BsArrowRight} from "react-icons/bs";
import {TbBuildingStore, TbClock, TbMapPin} from "react-icons/tb";
import {FaInstagram} from "react-icons/fa";
import {FiCoffee} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

const kelebihan = {
 name: "APA YANG BISA KAMI SAJIKAN?",
 items: [
  {
   name: "Foods",
   icon: <PiForkKnifeFill />,
   description: "Kami menyajikan makanan kami dengan kualitas terbaik.",
  },
  {
   name: "Beverages",
   icon: <SiCoffeescript />,
   description: "Kami menyajikan minuman kami dengan kualitas terbaik.",
  },
  {
   name: "Services",
   icon: <BsFillPersonCheckFill />,
   description: "Kami memberikan pelayanan terbaik kepada pelanggan kami.",
  },
  {
   name: "Spaces",
   icon: <TbBuildingStore />,
   description: "Ketersediaan tempat kami cukup luas dan nyaman.",
  },
 ],
};

const menu = [
 {name: "Butter Coffee", image: "/bestSeller/8.png", price: "Rp. 32,340"},
 {name: "Tahu Lada Garam", image: "/menus/4.png", price: "Rp. 19,635"},
 {name: "Korova Mushroom", image: "/bestSeller/27.png", price: "Rp. 78,540"},
];

const testimonials = [
 {
  name: "Rizky F.",
  comment:
   "Kopi di sini benar-benar spesial! Suasana yang sangat nyaman untuk bekerja.",
  rating: 5,
 },
 {
  name: "Sarah M.",
  comment: "Pelayanan ramah dan makanan lezat. Aku selalu kembali ke sini!",
  rating: 4,
 },
 {
  name: "Dimas P.",
  comment:
   "Tempat favoritku di Tasikmalaya. Konsep monokromnya sangat aesthetic!",
  rating: 5,
 },
];

const instagramPosts = [
 {
  id: 1,
  url: "https://www.instagram.com/p/DC3imuWpKWs/?next=%2F911coffee.tasik%2F",
  imageUrl: "/igPost/1.jpg",
 },
 {
  id: 2,
  url: "https://www.instagram.com/p/DGVEz3tJEv2/?next=%2F911coffee.tasik%2F&img_index=1",
  imageUrl: "/igPost/2.jpg",
 },
 {
  id: 3,
  url: "https://www.instagram.com/p/C_5SUwcyydq/?next=%2F911coffee.tasik%2F&img_index=7",
  imageUrl: "/igPost/3.jpg",
 },
 {
  id: 4,
  url: "https://www.instagram.com/p/C6yNN5FrbHi/?next=%2F911coffee.tasik%2F",
  imageUrl: "/igPost/4.jpg",
 },
];

const fadeIn = {
 hidden: {opacity: 0, y: 20},
 visible: {opacity: 1, y: 0},
};

const staggerContainer = {
 hidden: {opacity: 0},
 visible: {
  opacity: 1,
  transition: {
   staggerChildren: 0.2,
  },
 },
};

export default function HomePage() {
 return (
  <div className="flex flex-col">
   {/* Hero Section */}
   <section
    className="relative h-screen w-full flex items-center justify-center text-white"
    style={{
     backgroundImage: "url('/1.jpeg')",
     backgroundSize: "cover",
     backgroundPosition: "center",
    }}>
    <div className="absolute inset-0 bg-black/40" />
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     transition={{duration: 1}}
     className="relative z-10 text-center h-full w-full flex flex-col gap-6 items-center justify-center px-10">
     <motion.div
      initial={{scale: 0.9}}
      animate={{scale: 1}}
      transition={{duration: 0.5}}>
      <FiCoffee className="mx-auto text-5xl mb-4" />
      <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
       911 COFFEE
      </h1>
      <p className="text-xl md:text-2xl font-light mb-8">
       GOOD COFFEE START FROM HERE
      </p>
     </motion.div>

     <motion.div
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      className="mt-4">
      <Link
       href="/product"
       className="bg-white text-black px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors">
       Explore Menu <BsArrowRight />
      </Link>
     </motion.div>
    </motion.div>
   </section>

   {/* Kelebihan */}
   <section className="min-h-screen w-full py-20 bg-white">
    <div className="container mx-auto px-6">
     <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{once: true}}
      className="flex flex-col lg:flex-row items-center gap-12">
      <motion.div
       variants={fadeIn}
       className="lg:w-1/2 space-y-10">
       <h1 className="text-4xl font-bold mb-10 text-black/40">
        {kelebihan.name}
       </h1>

       {kelebihan.items.map((item, index) => (
        <motion.div
         key={index}
         variants={fadeIn}
         whileHover={{x: 10}}
         className="flex gap-6 items-start">
         <div className="rounded-full bg-black text-white p-4 flex-shrink-0">
          <div className="text-2xl">{item.icon}</div>
         </div>
         <div>
          <h2 className="text-xl font-semibold text-black/40">{item.name}</h2>
          <p className="text-gray-600">{item.description}</p>
         </div>
        </motion.div>
       ))}
      </motion.div>

      <motion.div
       variants={fadeIn}
       className="lg:w-1/2 overflow-hidden rounded-xl shadow-2xl">
       <Image
        height={600}
        width={600}
        src="/6.jpeg"
        alt="Coffee Shop Interior"
        className="w-full h-auto object-cover"
       />
      </motion.div>
     </motion.div>
    </div>
   </section>

   {/* Menu Section */}
   <section className="py-20 bg-[#f4f4f4]">
    <div className="container mx-auto px-6">
     <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{duration: 0.5}}
      className="text-center mb-16">
      <h1 className="text-3xl font-bold text-black/40 mb-4">
       BEST SELLER MENU
      </h1>
      <div className="w-20 h-1 bg-black mx-auto"></div>
     </motion.div>

     <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{once: true}}
      className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {menu.map((item, index) => (
       <motion.div
        key={index}
        variants={fadeIn}
        whileHover={{y: -10}}
        className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="p-6 flex flex-col items-center">
         <div className="w-40 h-40 flex items-center justify-center mb-6 overflow-hidden">
          <Image
           height={200}
           width={200}
           src={item.image}
           alt={item.name}
           className="w-full h-full object-cover"
          />
         </div>
         <h3 className="text-xl font-semibold mb-2 text-black">{item.name}</h3>
         <p className="text-gray-600 font-medium mb-4">{item.price}</p>
        </div>
       </motion.div>
      ))}
     </motion.div>

     <motion.div
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      className="text-center mt-12">
      <Link
       href="/product"
       className="inline-flex items-center px-6 py-3 border border-black rounded-full font-medium hover:bg-black hover:text-white transition-colors text-black">
       Lihat Semua Produk <BsArrowRight className="ml-2" />
      </Link>
     </motion.div>
    </div>
   </section>

   {/* About Section */}
   <section className="py-20 bg-white">
    <div className="container mx-auto px-6">
     <motion.div
      initial={{opacity: 0}}
      whileInView={{opacity: 1}}
      viewport={{once: true}}
      className="flex flex-col lg:flex-row items-center gap-12">
      <motion.div
       whileHover={{scale: 1.02}}
       className="lg:w-1/2">
       <div className="bg-black rounded-xl md:h-[400px] h-[270px] w-full overflow-hidden shadow-2xl">
        <Image
         height={600}
         width={600}
         src="/5.jpeg"
         alt="Coffee Shop Interior"
         className="w-full h-auto object-cover"
        />
       </div>
      </motion.div>

      <motion.div
       initial={{x: 50, opacity: 0}}
       whileInView={{x: 0, opacity: 1}}
       viewport={{once: true}}
       transition={{delay: 0.2}}
       className="lg:w-1/2">
       <h1 className="text-4xl font-bold mb-6 text-black/40">
        Kami selalu memberikan pelayanan terbaik untuk anda
       </h1>
       <p className="text-gray-600 mb-8 text-lg">
        Nikmati pengalaman berkuliner yang luar biasa bersama 911 Coffee
        Tasikmalaya. Kami berkomitmen untuk menyajikan kopi berkualitas tinggi
        dalam suasana yang nyaman dan estetik dengan konsep monokrom yang
        elegan.
       </p>

       <div className="space-y-4">
        <div className="flex items-center gap-4">
         <TbClock className="text-2xl text-black" />
         <p className="text-black">Buka setiap hari: 08:00 - 23:00</p>
        </div>
        <div className="flex items-center gap-4">
         <TbMapPin className="text-2xl text-black" />
         <p className="text-black">
          Jl. Kapten Naseh, No.7, Cipedes, Kota Tasikmalaya
         </p>
        </div>
       </div>
      </motion.div>
     </motion.div>
    </div>
   </section>

   {/* Testimonials */}
   <section className="py-20 bg-black text-white">
    <div className="container mx-auto px-6">
     <motion.div
      initial={{opacity: 0}}
      whileInView={{opacity: 1}}
      viewport={{once: true}}
      className="text-center mb-16">
      <h1 className="text-3xl font-bold mb-4">APA KATA MEREKA?</h1>
      <p className="text-gray-400">Testimoni dari pelanggan kami</p>
     </motion.div>

     <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{once: true}}
      className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
       <motion.div
        key={index}
        variants={fadeIn}
        className="bg-gray-900 rounded-xl p-8">
        <div className="flex mb-4">
         {[...Array(5)].map((_, i) => (
          <svg
           key={i}
           className={`w-5 h-5 ${
            i < testimonial.rating ? "text-yellow-400" : "text-gray-600"
           }`}
           fill="currentColor"
           viewBox="0 0 20 20">
           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
         ))}
        </div>
        <p className="text-gray-300 mb-6">&quot;{testimonial.comment}&quot;</p>
        <p className="font-semibold">- {testimonial.name}</p>
       </motion.div>
      ))}
     </motion.div>
    </div>
   </section>

   {/* Instagram Section */}
   <section className="py-20 bg-white">
    <div className="container mx-auto px-6">
     <motion.div
      initial={{opacity: 0}}
      whileInView={{opacity: 1}}
      viewport={{once: true}}
      className="text-center mb-16">
      <div className="flex justify-center items-center gap-3 mb-4">
       <FaInstagram className="text-3xl text-black/40" />
       <h1 className="md:text-3xl text-xl font-bold text-black/40">
        FOLLOW US ON INSTAGRAM
       </h1>
      </div>
      <p className="text-gray-600">@911coffee.tasik</p>
     </motion.div>

     <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{once: true}}
      className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {instagramPosts.map((post) => (
       <motion.a
        key={post.id}
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        variants={fadeIn}
        whileHover={{scale: 1.03}}
        className="overflow-hidden rounded-lg shadow-md relative group">
        <Image
         width={500}
         height={500}
         src={post.imageUrl}
         alt="Instagram Post"
         className="w-full h-full object-cover hover:opacity-90 transition-opacity aspect-square"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
         <FaInstagram className="text-white text-3xl" />
        </div>
       </motion.a>
      ))}
     </motion.div>
    </div>
   </section>

   {/* CTA Section */}
   <section className="py-20 bg-[#f4f4f4]">
    <div className="container mx-auto px-6 text-center">
     <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-black/40">
       Siap menikmati kopi terbaik di Tasikmalaya?
      </h1>
      <p className="text-gray-600 mb-8 text-lg">
       Kunjungi kedai kami atau pesan sekarang melalui delivery partner favorit
       Anda.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
       <motion.div
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.95}}>
        <Link
         href="/contact"
         className="bg-black text-white px-8 py-4 rounded-full font-medium inline-flex items-center gap-2">
         Kunjungi Kami <BsArrowRight />
        </Link>
       </motion.div>

       <motion.div
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.95}}>
        <Link
         href="/product"
         className="border border-black text-black px-8 py-4 rounded-full font-medium inline-flex items-center gap-2">
         Lihat Menu
        </Link>
       </motion.div>
      </div>
     </motion.div>
    </div>
   </section>
  </div>
 );
}
