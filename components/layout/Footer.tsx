'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
        <Link href="/" className="shrink-0">
            <div className="relative w-20 h-12">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
          </Link>
          <p className="text-sm">
            Mua vé online
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Danh mục</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">Trang chủ</Link>
            </li>
            <li>
              <Link href="/bai-viet" className="hover:underline">Bài viết</Link>
            </li>
            <li>
              <Link href="/phim" className="hover:underline">Phim</Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">Giới thiệu</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">Liên hệ</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:underline">Câu hỏi thường gặp</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">Điều khoản</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">Chính sách bảo mật</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Kết nối với tôi</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="w-5 h-5 hover:text-blue-500" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub className="w-5 h-5 hover:text-white" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="w-5 h-5 hover:text-blue-400" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-sm text-center text-gray-400">
        © {new Date().getFullYear()} Cinema. All rights reserved.
      </div>
    </footer>
  )
}
