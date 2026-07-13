"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import api from "@/lib/api";
import { getStoredCustomerToken } from "@/config/auth";

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: number;
  isAuthenticated: boolean;
}

export function ProductReviews({ productId, isAuthenticated }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products/${productId}/reviews`);
        setReviews(res.data.data ?? []);
      } catch {
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to submit a review");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getStoredCustomerToken();
      await api.post(
        "/reviews",
        { productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      setRating(5);
      setShowForm(false);
      alert("Review submitted! It will appear after moderation.");
    } catch {
      alert("Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 pb-4 border-b border-[var(--lux-border)]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(Number(avgRating)) ? "fill-current" : ""}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{avgRating}</span>
          </div>
          <span className="text-sm text-[var(--lux-muted)]">({reviews.length} reviews)</span>
        </div>
      )}

      {/* Submit Review Button */}
      {isAuthenticated && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="text-sm font-medium underline hover:opacity-60 transition"
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-[var(--lux-card)] rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  className="transition hover:opacity-60"
                >
                  <Star
                    size={20}
                    className={r <= rating ? "fill-current" : ""}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-2 border border-[var(--lux-border)] rounded text-sm"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[var(--lux-fg)] text-[var(--lux-bg)] rounded text-sm font-medium hover:opacity-80 transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-[var(--lux-border)] rounded text-sm font-medium hover:opacity-60 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-sm text-[var(--lux-muted)]">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-sm text-[var(--lux-muted)]">No reviews yet. Be the first to review!</div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="pb-4 border-b border-[var(--lux-border)] last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{review.customerName}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < review.rating ? "fill-current" : ""}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-[var(--lux-muted)]">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-[var(--lux-muted)] leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
