'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarqueeTicker from '@/components/MarqueeTicker';
import { Star, MessageSquarePlus, CheckCircle, X, ShieldCheck, ThumbsUp } from 'lucide-react';

interface ReviewType {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: name, rating, comment }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        fetchReviews();
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitted(false);
          setName('');
          setComment('');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <main className="min-h-screen bg-black text-white flex flex-col bg-bw-grid">
      <Navbar />
      <MarqueeTicker />

      {/* Header */}
      <section className="py-20 border-b border-zinc-800 bg-zinc-950/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-xs font-mono-tech uppercase text-zinc-400 tracking-widest block mb-2">
                ✦ VERIFIED COMMUNITY FEEDBACK
              </span>
              <h1 className="text-4xl sm:text-6xl font-display font-black uppercase text-white tracking-tight">
                TESTIMONIALS & REVIEWS
              </h1>
              <p className="text-sm text-zinc-400 font-mono-tech mt-3 max-w-xl leading-relaxed">
                Real feedback from streetwear enthusiasts regarding our heavyweight fabric GSM, oversized silhouettes, and WhatsApp CTO speed.
              </p>
            </div>

            {/* Scorecard */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-6">
              <div>
                <div className="text-4xl font-display font-black text-white">{avgRating}</div>
                <div className="flex text-white mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-white text-white" />
                  ))}
                </div>
                <span className="text-[11px] font-mono-tech text-zinc-400 mt-1 block">
                  Based on {reviews.length} verified reviews
                </span>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-3 rounded-xl btn-bw-primary text-xs font-mono-tech flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Submit Review</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 animate-pulse h-48"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-8 rounded-2xl glass-card border border-zinc-800 flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-white">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating ? 'fill-white text-white' : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono-tech text-zinc-500">
                      {new Date(rev.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="text-sm font-mono-tech text-zinc-300 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-xs uppercase text-white">
                      {rev.customerName}
                    </h4>
                    <span className="text-[10px] font-mono-tech text-zinc-400 flex items-center gap-1">
                      ✓ Verified Buyer
                    </span>
                  </div>
                  <ThumbsUp className="w-3.5 h-3.5 text-zinc-600" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-display font-black text-white uppercase">
                  Leave a Review
                </h3>
                <p className="text-xs text-zinc-400 font-mono-tech">
                  Share your experience with the late90s archive & WhatsApp ordering.
                </p>

                <div>
                  <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Yash S."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono-tech focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-white text-white' : 'text-zinc-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                    Your Feedback *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the fabric weight, GSM quality, and WhatsApp speed..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono-tech focus:outline-none focus:border-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl btn-bw-primary text-xs font-mono-tech disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-white mx-auto animate-bounce" />
                <h4 className="text-lg font-display font-bold text-white uppercase">
                  Review Submitted!
                </h4>
                <p className="text-xs text-zinc-400 font-mono-tech">
                  Your feedback is now logged in the late90s community database.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
