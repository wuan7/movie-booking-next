"use client";
import TiptapEditor from "../../../components/editor/TiptapEditor";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { toast } from "react-toastify";

import ImageUpload from "../../../components/ImageUpload";
import { getCategories } from "../../../actions/category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { PostCategory } from "../../../lib/generated/prisma";
import { handleUploadImage } from "../../../utils/uploadImage";
const PostSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  imageUrl: z.string().url("URL ảnh không hợp lệ"),
  imagePublicId: z.string().min(1, "Thiếu Public ID của ảnh"),
  categoryId: z.string().min(1, "Bạn phải chọn category"),
  content: z.string(),
  creator: z.string().min(1, "Bạn phải chọn tác giả"),
});

type PostFormValues = z.infer<typeof PostSchema>;

const PostPage = () => {
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      imagePublicId: "",
      categoryId: "",
      content: "",
      creator: "",
    },
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: PostFormValues) => {
    data.content = content;
    console.log("Dữ liệu đã nhập:", data);
    if (files.length <= 0) {
      toast.error("Vui lòng tải ảnh lên");
      return;
    }
    const uploadedImage = await handleUploadImage(files, setIsLoading);
    if (!uploadedImage) {
      return;
    }

    data.imageUrl = uploadedImage.url;
    data.imagePublicId = uploadedImage.publicId;

    try {
      setIsLoading(true);
      const response = await fetch("/api/post", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo bài viết thành công!");
      form.reset();
      setFiles([]);
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Tạo bài viết</h1>

      <TiptapEditor onChange={setContent} />

     
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề bài viết</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người tạo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <ImageUpload
                  files={files}
                  setFiles={setFiles}
                  loading={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value} // Set giá trị từ form
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat: PostCategory) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              onClick={() => onSubmit(form.getValues())}
            >
              Tạo bài viết
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PostPage;
