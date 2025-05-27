import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  href: string;
}

export default function ArticleCard({
  title,
  description,
  image,
  category,
  href,
}: ArticleCardProps) {
  return (
    <Link href={href}>
      <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
        {/* Image */}
        <div className="relative w-full h-60 md:h-72 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 w-full p-4 z-10">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
            {category}
          </span>
          <h2 className="text-white text-lg font-semibold mt-2 line-clamp-2 drop-shadow">
            {title}
          </h2>
          <p className="text-white text-sm mt-1 line-clamp-3 opacity-80 drop-shadow">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
