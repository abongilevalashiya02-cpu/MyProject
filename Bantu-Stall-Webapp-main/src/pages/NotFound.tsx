import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bantu-orange/10 via-bantu-yellow/10 to-orange-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-bantu-orange/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-bantu-yellow/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-emerald-200/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid-pattern"></div>
      </div>

      <div className="text-center relative z-10 max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* 404 Illustration */}
          <motion.div 
            className="mb-8"
            initial={{ y: -30 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <div className="relative">
              <div className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-bantu-orange to-bantu-yellow bg-clip-text text-transparent leading-none">
                404
              </div>
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-4 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <MapPin className="h-8 w-8 text-bantu-orange" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Oops! You've wandered off the map
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            The page you're looking for doesn't exist. Let's get you back on track to explore Africa's amazing experiences.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="group bg-gradient-to-r from-bantu-orange to-bantu-yellow hover:from-bantu-orange/90 hover:to-bantu-yellow/90 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" />
                  Return Home
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold border-gray-300 hover:bg-gray-50">
                <Link to="/countries">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Countries
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Helpful Links */}
          <motion.div 
            className="mt-12 pt-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p className="text-sm text-gray-500 mb-4">Quick links to get you back on track:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/about" className="text-bantu-orange hover:text-bantu-orange/80 transition-colors">About Us</Link>
              <Link to="/musika" className="text-bantu-orange hover:text-bantu-orange/80 transition-colors">Music & Culture</Link>
              <Link to="/mafunzo" className="text-bantu-orange hover:text-bantu-orange/80 transition-colors">Learning Hub</Link>
              <Link to="/abantu" className="text-bantu-orange hover:text-bantu-orange/80 transition-colors">Community</Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
