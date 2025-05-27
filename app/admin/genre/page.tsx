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

const GenreSchema = z.object({
  name: z.string().min(1, "Tên thể loại không được để trống"),
});

type GenreFormValues = z.infer<typeof GenreSchema>;

const GenrePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<GenreFormValues>({
    resolver: zodResolver(GenreSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: GenreFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/genre", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo thể loại phim thành công!");
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
                  <FormLabel>Tên thể loại phim</FormLabel>
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
              Tạo thể loại
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default GenrePage;
