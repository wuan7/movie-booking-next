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


const CastSchema = z.object({
  name: z.string().min(1, "Tên diễn viên không được để trống"),
  imageUrl: z.string().min(1, "Url ảnh không được để trống"),
});

type CastFormValues = z.infer<typeof CastSchema>;

const CastPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CastFormValues>({
    resolver: zodResolver(CastSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  

  const onSubmit = async (data: CastFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cast", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Thêm diễn viên thành công!");
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
                  <FormLabel>Tên diễn viên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url ảnh</FormLabel>
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
              Thêm diễn viên
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CastPage;
