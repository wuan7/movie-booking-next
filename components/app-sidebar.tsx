/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import {
  BookCheck,
  CalendarCheck,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  CircleDollarSign,
  CircleUser,
  Home,
  ListPlus,
  Star,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useSidebar, SidebarTrigger } from "../components/ui/sidebar";
// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Company",
    url: "#",
    icon: CircleUser,
    submenu: [
      { title: "Thêm công ty", url: "/admin/company" },
    ],
  },
  {
    title: "Brand",
    url: "#",
    icon: CircleUser,
    submenu: [
      { title: "Thêm chi nhánh", url: "/admin/brand" },
    ],
  },

  {
    title: "Room",
    url: "#",
    icon: CircleUser,
    submenu: [
      { title: "Thêm phòng chiếu cho chi nhánh", url: "/admin/room" },
    ],
  },

  {
    title: "Row",
    url: "#",
    icon: CircleUser,
    submenu: [
      { title: "Thêm hàng ghế cho phòng chiếu", url: "/admin/row" },
    ],
  },
  {
    title: "Seat",
    url: "#",
    icon: CircleUser,
    submenu: [
      { title: "Tạo ghế cho hàng ghế trong phòng chiếu", url: "/admin/seat" },
    ],
  },

  {
    title: "Genre",
    url: "#",
    icon: CircleUser,
    submenu: [
      { title: "Tạo thể loại phim", url: "/admin/genre" },
    ],
  },
   {
    title: "Nation",
    url: "#",
    icon: CircleUser,
    submenu: [
      { title: "Tạo quốc gia", url: "/admin/nation" },
    ],
  },
 {
    title: "Cast",
    url: "#",
    icon: CircleUser,
    submenu: [
      { title: "Thêm diễn viên cho phim", url: "/admin/cast" },
    ],
  },
  {
    title: "Bài viết",
    url: "#",
    icon: CircleUser,
    submenu: [
      { title: "Thêm bài viết", url: "/admin/post" },
    ],
  },
  {
    title: "Danh mục bài viết",
    url: "#",
    icon: CircleUser,
    submenu: [
      { title: "Thêm danh mục bài viết", url: "/admin/category" },
    ],
  },
  {
    title: "Movie",
    url: "/admin/movie",
    icon: ListPlus,
    submenu: [
      { title: "Thêm phim", url: "/admin/movie" },
      { title: "Danh sách phim", url: "/admin/movie/list" },
    ],
  },
 
  {
    title: "Post",
    url: "/admin/post",
    icon: CalendarCheck,
  },
  {
    title: "Banner",
    url: "/admin/banner",
    icon: CalendarCheck,
  },
  {
    title: "Suất chiếu",
    url: "/admin/showtime",
    icon: BookCheck,
  },
  {
    title: "Review",
    url: "#",
    icon: Star,
  },
  {
    title: "Payment",
    url: "#",
    icon: CircleDollarSign,
  },
];

export function AppSidebar() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex ">
            <Link href="/" className={`${state === "collapsed" && "hidden"}`}>
              <Image src="/logo.png" alt="logo" width={70} height={43} />
            </Link>
            <SidebarTrigger
              className="!text-primary cursor-pointer ml-auto size-10"
              icon={state === "expanded" ? ChevronsLeft : ChevronsRight}
            />
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <div key={item.title}>
                  {item.submenu && state === "expanded" ? (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === index ? null : index
                            )
                          }
                        >
                          <item.icon className="!size-6 text-primary" />
                          <span className="font-medium">{item.title}</span>
                          {openDropdown === index ? (
                            <ChevronUp className="ml-auto" />
                          ) : (
                            <ChevronDown className="ml-auto" />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {openDropdown === index && (
                        <div className="ml-6 space-y-2">
                          {item.submenu.map((sub) => (
                            <SidebarMenuItem key={sub.title}>
                              <SidebarMenuButton asChild>
                                <Link href={sub.url}>{sub.title}</Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon className="!size-6 text-primary" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}