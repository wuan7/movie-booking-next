'use client'

import { getPosts } from '../actions/post'
import { PostWithPostCategory } from '../types'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Skeleton } from "../components/ui/skeleton";


export default function PostCards() {
  const [posts, setPosts] = useState<PostWithPostCategory[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const data = await getPosts();
        setPosts(data)
      } catch (error) {
        console.log(error)
      }finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  },[])

  const renderSkeletons = () => {

  return Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className="bg-white rounded-2xl shadow-md overflow-hidden space-y-3"
    >
      <Skeleton className="w-full h-48 bg-gray-200" />
      <div className="p-5 space-y-2">
        <Skeleton className="h-6 w-3/4 rounded bg-gray-200" />
        <Skeleton className="h-4 w-1/2 rounded bg-gray-200" />
        <Skeleton className="h-4 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  ));
};
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isLoading || posts === null ? renderSkeletons() : posts.map((post) => (
          <Link
            href={`/bai-viet/${post.slug}`}
            key={post.id}
            className="bg-white group rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative w-full h-48">
              <Image
                src={post.imageUrl || ''}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-transform line-clamp-3">{post.title}</h3>
              <p className="text-gray-600 text-sm">{post.postCategory.name}</p>
              <p className="text-gray-600 text-sm">{post.readingTime} phút đọc</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
