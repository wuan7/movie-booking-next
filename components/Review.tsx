import { getReviewsByMovieId } from "../actions/review";
import { ReviewWithUser } from "../types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import ImageUpload from "./ImageUpload";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { handleUploadImage } from "../utils/uploadImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
type ReviewProps = {
  movieId: string;
};
const Review = ({ movieId }: ReviewProps) => {
  const [isCanComment, setIsCanComment] = useState(false);
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const fetchReviews = async () => {
    const reviews = await getReviewsByMovieId(movieId);
    console.log("reviews", reviews);
    setReviews(reviews);
  };
  useEffect(() => {
    const checkCanComment = async () => {
      const response = await fetch("/api/review/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId }),
      });
      const data = await response.json();
      setIsCanComment(data.allowed);
    };
    checkCanComment();

    fetchReviews();
  }, [movieId]);

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) return;
    let uploadedImage: { url: string; publicId: string } | undefined;
    if (files.length > 0) {
      uploadedImage = await handleUploadImage(files, setIsLoading);
    }
    try {
      setIsLoading(true);
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          rating,
          comment,
          imageUrl: uploadedImage?.url,
          imagePublicId: uploadedImage?.publicId,
        }),
      });
      if (!res.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }
      toast.success("Đã gửi!");
      fetchReviews();
      setRating(0);
      setComment("");
      setFiles([]);
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  const averageRating = reviews?.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  return (
    <div className="space-y-4 bg-white dark:bg-[#0f0f0f] p-4 rounded-md">
      {/* Tổng quan sao */}
      {reviews.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold mb-2">Đánh giá phim</h2>
        <div className="flex items-center gap-4">
          <p className="text-3xl font-bold text-yellow-500">
            {averageRating.toFixed(1)}
          </p>

          <p className="text-sm text-gray-500">
            {reviews.length} lượt đánh giá
          </p>
        </div>
      </div>
      )}
      {isCanComment && (
        <>
          {/* Gửi đánh giá mới */}
          <div className="space-y-2 border-t border-gray-200 pt-4">
            <h3 className="text-base font-semibold">Thêm đánh giá của bạn</h3>
            <Select
              value={rating.toString()}
              onValueChange={(value) => setRating(Number(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Chọn điểm" />
              </SelectTrigger>
              <SelectContent>
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((score) => (
                  <SelectItem key={score} value={score.toString()}>
                    {score} điểm
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Hãy chia sẻ cảm nhận của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <ImageUpload
              files={files}
              setFiles={setFiles}
              loading={isLoading}
            />

            <Button onClick={handleSubmit} disabled={isLoading}>
              Gửi đánh giá
            </Button>
          </div>
        </>
      ) }

      {reviews.length > 0 ? (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          {reviews.map((r) => (
            <div key={r.id} className="space-y-1 border-b pb-4">
              <div className="flex items-center gap-2">
                <Image
                  src={r.user.imageUrl || "default-avatar.png"}
                  alt={r.user.name || "Anonymous"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm">{r.user.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {r.comment}
              </p>
              {r.imageUrl && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Image
                    src={r.imageUrl}
                    alt={`review-img`}
                    width={100}
                    height={100}
                    className="rounded object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm font-semibold">Không có bình luận</div>
      )}
    </div>
  );
};

export default Review;
