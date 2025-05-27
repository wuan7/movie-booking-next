import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut } from "next-auth/react"
import Link from "next/link";
import { User } from "../../lib/generated/prisma";

interface UserAvatarProps {
  data: Partial<User>
}
const UserAvatar = ({ data }: UserAvatarProps) => {
  return (
   <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer !outline-none">
          <Avatar>
            <AvatarImage src={data.imageUrl || "/default-avatar.png"} />
            <AvatarFallback>{data.name && data?.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><Link href="/profile">Thông tin cá nhân</Link></DropdownMenuItem>
          <DropdownMenuItem><Link href="/order">Lịch sử đặt vé</Link></DropdownMenuItem>
          {data.role === "ADMIN" && (
            <DropdownMenuItem><Link href="/admin">Trang quản trị</Link></DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => signOut()}>Đăng xuất</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAvatar;