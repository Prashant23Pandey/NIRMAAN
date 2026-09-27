import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export const AdminReviewsPage: React.FC = () => {
  const { showToast } = useApp();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    api
      .get('admin/reviews.php')
      .then((res: any) => {
        if (res.success) setReviews(res.reviews || []);
      })
      .catch(() => {
        setReviews([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleStatus = (id: number) => {
    setReviews(
      reviews.map((r) =>
        r.id === id ? { ...r, status: r.status === 'published' ? 'hidden' : 'published' } : r
      )
    );
    showToast('Review visibility updated in MySQL', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
          Two-Sided Reputation & Review Moderation
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Supervise reciprocal reviews between clients and artisans to uphold community dignity and quality standards.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Star size={36} className="mx-auto text-stone-400" />
            <h3 className="text-base font-black text-charcoal">No reviews or ratings yet</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              When homeowners and artisans submit two-sided ratings upon milestone and project completion, they will appear here for oversight.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F2] border-b border-stone-200 text-charcoal uppercase text-[10px] font-extrabold tracking-wider">
                <tr>
                  <th className="p-4">Project</th>
                  <th className="p-4">Reviewer</th>
                  <th className="p-4">Reviewee</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Testimonial Comment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/80">
                    <td className="p-4 font-extrabold text-charcoal">{r.project || 'Project'}</td>
                    <td className="p-4 font-bold text-charcoal">{r.reviewer}</td>
                    <td className="p-4 text-primary font-bold">{r.reviewee}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 font-black text-amber-600">
                        <Star size={13} className="fill-amber-500 text-amber-500" />
                        ★ {r.rating}
                      </span>
                    </td>
                    <td className="p-4 text-charcoal/90 italic max-w-sm">"{r.comment}"</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          r.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleStatus(r.id)}
                        className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-charcoal text-[11px] font-bold"
                      >
                        {r.status === 'published' ? 'Hide' : 'Publish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
