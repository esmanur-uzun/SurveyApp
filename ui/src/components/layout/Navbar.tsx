"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Cookies from "js-cookie";

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = Cookies.get("token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    const interval = setInterval(checkLoginStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setIsLoggedIn(false);
    router.push("/login");
  };

  if (isLoggedIn === null) return null;

  return (
    <nav className="bg-gradient-to-r from-blue-950 to-purple-800 p-4 flex justify-between items-center">
      <h1 className="text-white text-xl font-bold">Anket Uygulaması</h1>
      <div>
        <button
          onClick={() => router.push("/all-surveys")}
          className="text-white mr-4"
        >
          Tüm Anketler
        </button>
        {isLoggedIn && (
          <button
            onClick={() => router.push("/my-surveys")}
            className="text-white mr-4"
          >
            Benim Anketlerim
          </button>
        )}
        {isLoggedIn ? (
          <Button onClick={handleLogout} className="text-white">
            Çıkış Yap
          </Button>
        ) : (
          <button onClick={() => router.push("/login")} className="text-white">
            Giriş Yap
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
