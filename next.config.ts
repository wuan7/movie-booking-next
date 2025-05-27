import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com',  "platform-lookaside.fbsbx.com", "www.bhdstar.vn", "cinema.momocdn.net", "image.tmdb.org"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ngăn build fail do lỗi ESLint
  },
};

export default nextConfig;
