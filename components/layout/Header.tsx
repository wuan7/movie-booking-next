"use client";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import UserAvatar from "./UserAvatar";
import { Button } from "../../components/ui/button";
import { useAuthModal } from "../../hooks/useAuthModal";
const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Phim", href: "/phim" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Bài viết", href: "/bai-viet" },
];

type SessionUser = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: "USER" | "ADMIN";
};
const Header = () => {
  const session = useSession();
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(true);
  const { openLogin, openRegister } = useAuthModal();
  useEffect(() => {
    const handleScroll = () => {
      setShowBanner(window.scrollY <= 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <div
        className={cn(
          "transition-transform duration-300 ease-in-out w-full overflow-hidden",
          showBanner
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        )}
      >
        <div className="relative h-[50px] md:h-[100px] w-full">
          <Image
            src="/banner-top.jpg"
            alt="Banner"
            fill
            priority
            className="object-cover" // tốt hơn object-contain nếu muốn ảnh đầy đủ khung
            sizes="100vw"
          />
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="shrink-0">
            <div className="relative w-20 h-12">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-black hover:text-black/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {session.status !== "authenticated" && (
              <div className="ml-4 flex gap-2">
                <Button variant="outline" onClick={openLogin}>
                  Đăng nhập
                </Button>
                <Button onClick={openRegister}>Đăng ký</Button>
              </div>
            )}
            {session?.data?.user ? (
              <UserAvatar data={session.data.user as SessionUser} />
            ) : null}
          </nav>
          <div className="flex gap-x-2 md:hidden">
            <div className="">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-4 mt-6 p-3">
                    {session?.data?.user ? (
                      <div className="flex gap-x-1.5 items-center">
                        <UserAvatar data={session.data.user as SessionUser} />
                        <p className="font-bold">{session.data.user.name}</p>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-4  p-3">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`transition ${
                            isActive
                              ? "text-primary font-semibold"
                              : "text-black hover:text-black/80"
                          }`}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
