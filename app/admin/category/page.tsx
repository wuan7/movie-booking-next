"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { toast } from "react-toastify";

const CategorySchema = z.object({
  name: z.string().min(1, "Tên thể loại không được để trống"),
});

type CategoryFormValues = z.infer<typeof CategorySchema>;
const CategoryPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/category", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo danh mục thành công!");
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div className="max-w-2xl p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              onClick={() => onSubmit(form.getValues())}
              className="w-full"
              disabled={isLoading}
            >
              Tạo danh mục
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CategoryPage;
