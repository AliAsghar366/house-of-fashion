"use client";

import { useEffect, useState } from "react";
import { Star, MessageCircle, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { AuthGate } from "./AuthGate";
import { sanitize } from "@/lib/sanitize";

type Review = {
  id: string;
  user_id: string;
  product_slug: string;
  rating: number;
  title: string;
  body: string;
  helpful_count: number;
  admin_reply: string | null;
  admin_reply_at: string | null;
  created_at: string;
  profiles?: { full_name: string; avatar_url: string } | null;
};

export function ReviewSection({ productSlug }: { productSlug: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [productSlug]);

  async function fetchReviews() {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles(full_name, avatar_url)")
      .eq("product_slug", productSlug)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data as Review[]);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError("");

    const cleanTitle = sanitize(title.trim());
    const cleanBody = sanitize(body.trim());

    if (!cleanTitle || !cleanBody) {
      setError("Please fill in both title and review.");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("reviews").insert({
      user_id: user.id,
      product_slug: productSlug,
      rating,
      title: cleanTitle,
      body: cleanBody,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setSubmitted(true);
      setTitle("");
      setBody("");
      setRating(5);
      fetchReviews();
    }
    setSubmitting(false);
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-12 border-t-2 border-ink/10 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-ink/20"}
                />
              ))}
            </div>
            <span className="text-sm text-ink/60">
              {avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {!showForm && !submitted && (
          <AuthGate>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-ink hover:bg-primary/80 transition-colors"
            >
              Write a Review
            </button>
          </AuthGate>
        )}
      </div>

      {/* Review Form */}
      {showForm && !submitted && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border-2 border-ink/10 bg-white p-6">
          <h3 className="font-semibold text-lg mb-4">Your Review</h3>

          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5"
                >
                  <Star
                    size={24}
                    className={
                      s <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-ink/20 hover:text-amber-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold mb-1.5 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              className="w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold mb-1.5 block">Your Review</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tell others what you think about this product..."
              rows={4}
              className="w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-cream hover:bg-ink/85 transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border-2 border-ink/15 px-6 py-2.5 text-sm font-semibold text-ink/60 hover:bg-ink/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div className="mb-8 rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center">
          <p className="text-lg font-semibold text-green-800">✓ Review Submitted!</p>
          <p className="text-sm text-green-700 mt-1">Thank you for your feedback. Your review is now visible.</p>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-ink/5 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-ink/40">
          <MessageCircle size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const name = review.profiles?.full_name || "Anonymous";
  const initial = name.charAt(0).toUpperCase();
  const date = new Date(review.created_at).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-xl border-2 border-ink/10 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center shrink-0 text-sm font-bold text-ink">
          {review.profiles?.avatar_url ? (
            <img
              src={review.profiles.avatar_url}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            initial
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm">{name}</p>
            <span className="text-xs text-ink/40">· {date}</span>
          </div>
          <div className="flex gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={12}
                className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-ink/20"}
              />
            ))}
          </div>
          {review.title && (
            <p className="font-semibold text-sm mt-2">{review.title}</p>
          )}
          <p className="text-sm text-ink/70 mt-1 whitespace-pre-wrap">{review.body}</p>

          {/* Admin Reply */}
          {review.admin_reply && (
            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield size={14} className="text-blue-600" />
                <span className="text-xs font-bold text-blue-700">Store Reply</span>
                {review.admin_reply_at && (
                  <span className="text-[10px] text-blue-500">
                    · {new Date(review.admin_reply_at).toLocaleDateString("en-PK", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
              <p className="text-sm text-blue-900 whitespace-pre-wrap">{review.admin_reply}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
