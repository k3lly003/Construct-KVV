import React, { useState } from 'react';
import axios from '@/lib/axios';

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  eligibleOrders: any[];
  onReviewSubmitted?: () => void;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({ open, onClose, productId, eligibleOrders, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const mostRecentOrderId = eligibleOrders[0]?.id;
    if (!mostRecentOrderId) {
      setError('No eligible order found.');
      setLoading(false);
      return;
    }
    try {
      await axios.post('/api/v1/reviews', {
        rating,
        comment,
        productId,
        orderId: mostRecentOrderId,
      });
      setSuccess(true);
      setComment('');
      setRating(5);
      setTimeout(() => {
        setSuccess(false);
        if (onReviewSubmitted) onReviewSubmitted();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Write a Review</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">Review submitted!</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium">Rating</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              required
            >
              {[5,4,3,2,1].map(val => (
                <option key={val} value={val}>{val} Star{val > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Comment</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewDialog; 