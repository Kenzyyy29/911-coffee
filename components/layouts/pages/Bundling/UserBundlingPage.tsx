"use client";

import {useState, useEffect, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
  FaStore,
  FaSearch,
  FaSpinner,
  FaArrowLeft,
  FaBox,
} from "react-icons/fa";
import {useOutlets} from "@/lib/hooks/useOutlets";
import {useBundling} from "@/lib/hooks/useBundling";
import {useTaxes} from "@/lib/hooks/useTaxes";
import {Bundling} from "@/lib/types/bundling";
import {Outlet} from "@/lib/types/outlet";
import Image from "next/image";
import {useSearchParams} from "next/navigation";
import {formatPrice} from "@/lib/utils/formatPrice";

type CategoryRefs = {
  [key: string]: HTMLDivElement | null;
};

const UserBundlingPage = () => {
  const searchParams = useSearchParams();
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const {outlets, loading: outletsLoading} = useOutlets();
  const {bundlings, loading: bundlingsLoading} = useBundling(selectedOutlet?.id);
  const {taxes} = useTaxes();
  const carouselRefs = useRef<CategoryRefs>({});

  useEffect(() => {
    const outletId = searchParams.get("outlet");
    if (outletId && outlets.length > 0) {
      const outlet = outlets.find((o) => o.id === outletId);
      if (outlet) setSelectedOutlet(outlet);
    }
  }, [outlets, searchParams]);

  const calculateTotalPrice = (bundling: Bundling) => {
    if (!bundling?.taxIds || bundling.taxIds.length === 0) return bundling?.price || 0;

    const applicableTaxes = taxes.filter((tax) => bundling.taxIds.includes(tax.id));
    let totalPrice = bundling.price;

    applicableTaxes.forEach((tax) => {
      totalPrice *= 1 + tax.rate / 100;
    });

    return totalPrice;
  };

  const filteredBundlings = bundlings.filter((bundling) => {
    return bundling.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleBackToOutlets = () => {
    setSelectedOutlet(null);
    setSearchTerm("");
  };

  const getOutletImage = (outletId: string) => {
    try {
      return `/outlets/${outletId}.jpg`;
    } catch {
      return `/outlets/default.jpeg`;
    }
  };

  return (
    <div className="min-h-[100dvh] p-4 md:p-8 bg-gray-50 dark:bg-onyx1">
      <motion.div
        initial={{opacity: 0, y: -20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {selectedOutlet && (
            <motion.button
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              onClick={handleBackToOutlets}
              className="p-2 rounded-full bg-white dark:bg-onyx2 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-onyx3 transition-colors">
              <FaArrowLeft className="text-lg" />
            </motion.button>
          )}
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
            {selectedOutlet ? `${selectedOutlet.name} Bundling Packages` : "Our Bundling Packages"}
          </h1>
        </div>

        {/* Outlet Selection */}
        {!selectedOutlet && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.2}}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-onyx1 dark:text-white pb-0">
              <FaStore className="text-onyx1 dark:text-white" /> Select Outlet
            </h2>
            {outletsLoading ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin text-2xl text-onyx1 dark:text-white" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
                {outlets.map((outlet) => (
                  <motion.div
                    key={outlet.id}
                    whileHover={{scale: 1.03}}
                    whileTap={{scale: 0.98}}
                    className="border rounded-lg p-4 bg-white dark:bg-onyx2 cursor-pointer hover:bg-blue-50 dark:hover:bg-onyx3 transition-colors flex flex-col border-gray-200 dark:border-onyx3"
                    onClick={() => setSelectedOutlet(outlet)}>
                    <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                      <Image
                        src={getOutletImage(outlet.id)}
                        alt={outlet.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <h3 className="font-medium text-onyx1 dark:text-white">
                      {outlet.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {outlet.address}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Bundling Section */}
        {selectedOutlet && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.3}}>
            {/* Outlet Info */}
            <motion.div
              initial={{opacity: 0, y: -10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.3}}
              className="bg-white dark:bg-onyx2 rounded-xl shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 min-w-[80px] rounded-md overflow-hidden">
                    <Image
                      src={getOutletImage(selectedOutlet.id)}
                      alt={selectedOutlet.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-onyx1 dark:text-white">
                      {selectedOutlet.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      {selectedOutlet.address}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search Section */}
            <div className="bg-white dark:bg-onyx2 rounded-xl shadow-md p-6 mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search Bundling Packages..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-onyx3 focus:outline-none focus:ring-2 focus:ring-onyx1 focus:border-transparent bg-white dark:bg-onyx2 text-gray-800 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Bundling Items */}
            {bundlingsLoading ? (
              <div className="flex justify-center py-12 bg-white dark:bg-onyx2 rounded-xl shadow-sm">
                <FaSpinner className="animate-spin text-3xl text-black dark:text-white" />
              </div>
            ) : filteredBundlings.length === 0 ? (
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="text-center py-12 bg-white dark:bg-onyx2 rounded-xl shadow-sm">
                <FaBox className="mx-auto text-4xl text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm
                    ? "No bundling packages match your search criteria"
                    : "No bundling packages available at this outlet"}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredBundlings.map((bundling) => (
                    <motion.div
                      key={bundling.id}
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, scale: 0.9}}
                      transition={{duration: 0.3}}
                      whileHover={{y: -5}}
                      className="bg-white dark:bg-onyx2 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 w-full bg-white dark:bg-onyx2 p-4">
                        <div className="relative h-full w-full">
                          {bundling.imageUrl ? (
                            <Image
                              src={bundling.imageUrl}
                              alt={bundling.name}
                              fill
                              className="object-contain"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="bg-white dark:bg-onyx2 h-full w-full flex items-center justify-center rounded-lg">
                              <FaBox className="text-4xl text-gray-400 dark:text-gray-600" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-onyx1 dark:text-white">
                            {bundling.name}
                          </h3>
                          <span className="font-bold text-onyx1 dark:text-white">
                            {formatPrice(calculateTotalPrice(bundling))}
                          </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                          {bundling.description}
                        </p>
                        
                        {/* Included Items */}
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-onyx1 dark:text-white mb-2">
                            Included Items:
                          </h4>
                          <ul className="space-y-1">
                            {bundling.menuItems?.map((item) => (
                              <li key={item.id} className="text-sm text-gray-600 dark:text-gray-300">
                                • {item.name} (Qty: {item.quantity})
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              bundling.isAvailable
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}>
                            {bundling.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default UserBundlingPage;