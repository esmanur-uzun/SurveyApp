"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const AnimatedText = () => {
  const [isComplete, setIsComplete] = useState(false);
  const fullText = "Anket Uygulamasına Hoş Geldiniz";
  const router = useRouter();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      if (index === fullText.length) {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 70);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.h1
        className="text-4xl font-bold mb-4"
        style={{
          background: "linear-gradient(to right, #6EE7B7, #3B82F6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {fullText.split("").map((char, index) => (
          <span
            key={index}
            style={{ opacity: index < fullText.length ? 1 : 0 }}
          >
            {char}
          </span>
        ))}
      </motion.h1>
      {isComplete && (
        <Button
          onClick={() => router.push("/login")}
          className="bg-gradient-to-r from-blue-950 to-purple-800 text-white hover:bg-opacity-80"
        >
          Giriş Yap
        </Button>
      )}
    </div>
  );
};

export default AnimatedText;
