'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle, X, ShieldCheck, ThumbsUp } from 'lucide-react';

interface ReviewType {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
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

  return (
    <section id="reviews" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase text-[#dfff00] tracking-widest mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VERIFIED STREETWEAR COMMUNITY</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            WHAT THE SCENE SAYS
          </h2>
          <p className="text-sm text-zinc-400 mt-2 font-light">
            Real feedback from early adopters of the late90s archive & WhatsApp ordering experience.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3.5 rounded-xl btn-neon-lime text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl glass-card border border-zinc-800 flex flex-col justify-between"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rev.rating
                        ? 'text-[#dfff00] fill-[#dfff00]'
                        : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-zinc-300 font-light leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-xs text-white uppercase">
                  {rev.customerName}
                </h4>
                <span className="text-[10px] font-mono-tech text-emerald-400 flex items-center gap-1">
                  ✓ Verified Order
                </span>
              </div>
              <ThumbsUp className="w-3.5 h-3.5 text-zinc-600" />
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
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
                  Drop Your Review
                </h3>
                <p className="text-xs text-zinc-400 font-mono-tech">
                  Share your thoughts on fit, fabric weight, or WhatsApp CTO speed.
                </p>

                <div>
                  <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Samarth R."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#dfff00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                    Rating (1 to 5 Stars)
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
                            star <= rating
                              ? 'text-[#dfff00] fill-[#dfff00]'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                    Your Review
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How does the garment fit? What do you think of the GSM quality?"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#dfff00]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl btn-neon-lime text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-[#dfff00] mx-auto animate-bounce" />
                <h4 className="text-lg font-display font-bold text-white uppercase">
                  Thank You for the Review!
                </h4>
                <p className="text-xs text-zinc-400 font-mono-tech">
                  Your feedback helps shape our future drops.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
