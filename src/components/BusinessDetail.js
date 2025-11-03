import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BusinessCard.css';
import { getBusinessById } from '../services/businessService';
import { findReviewsByBusiness, createReview } from '../models/Review';
import { isAuthenticated, subscribe as subscribeAuth } from './Auth/authService';
import { useLocation, useNavigate } from 'react-router-dom';

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, text: '' });
  const [error, setError] = useState(null);
  const [authed, setAuthed] = useState(isAuthenticated());
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const unsub = subscribeAuth(() => setAuthed(isAuthenticated()));
    return unsub;
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const b = await getBusinessById(id);
        setBusiness(b);

        // try to load parse-backed reviews; if business has objectId use it
        if (b && b.objectId) {
          const revs = await findReviewsByBusiness(b.objectId);
          setReviews(revs.map((r) => (r.toJSON ? r.toJSON() : r)));
        } else {
          setReviews([]);
        }
      } catch (e) {
        console.error('Error loading business detail', e);
        setError('Could not load business details');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!business || !business.objectId) {
      setError('Reviews are only available when using the online database.');
      return;
    }

    if (!authed) {
      // redirect to login, preserve return location
      navigate('/login', { state: { from: location }, replace: false });
      return;
    }

    try {
      const saved = await createReview({ businessId: business.objectId, rating: form.rating, text: form.text });
      // append
      setReviews((prev) => [...prev, saved.toJSON ? saved.toJSON() : saved]);
      setForm({ rating: 5, text: '' });
    } catch (err) {
      console.error('Failed to create review', err);
      setError(err?.message || 'Failed to post review');
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!business) return <div className="container"><p>Business not found.</p></div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 260px' }}>
          <img src={business.Image || '/images/pizza.jpg'} alt={business.Name} style={{ width: '100%', borderRadius: 8 }} />
        </div>
        <div style={{ flex: 1 }}>
          <h1>{business.Name}</h1>
          <p><strong>Category:</strong> {business.Category}</p>
          <p><strong>Address:</strong> {business.Address || (business.Addresses ? business.Addresses.join(', ') : '—')}</p>
          <p><strong>Keywords:</strong> {(business.Keywords || []).join ? (business.Keywords.join(', ')) : (business.Keywords || '—')}</p>
        </div>
      </div>

      <hr />

      <section>
        <h2>Reviews</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {reviews.length === 0 ? <p>No reviews yet.</p> : (
          <div>
            {reviews.map((r, i) => {
              const author = r.authorName || (r.author && r.author.username) || (r.author && r.author.objectId) || 'Anonymous';
              const created = r.createdAt || r.created_at || r.created || null;
              const createdStr = created ? new Date(created).toLocaleString() : '';
              return (
                <div key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <p style={{ margin: 0 }}><strong>{author}</strong> <span style={{ color: '#666', fontSize: '0.9rem' }}>{createdStr}</span></p>
                  <p style={{ margin: '0.25rem 0' }}><strong>Rating:</strong> {r.rating || r.Rating || '—'}</p>
                  <p style={{ margin: 0 }}>{r.text || r.Text || r.comment || ''}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section style={{ marginTop: '1rem' }}>
        <h3>Leave a review</h3>
        <form onSubmit={handleSubmit}>
          <label>Rating</label>
          <select name="rating" value={form.rating} onChange={handleChange}>
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
            <option value={2}>2</option>
            <option value={1}>1</option>
          </select>
          <label>Comment</label>
          <textarea name="text" value={form.text} onChange={handleChange} />
          <div style={{ marginTop: '0.5rem' }}>
            <button type="submit">Post review</button>
            <Link to="/" style={{ marginLeft: 8 }}>Back</Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default BusinessDetail;
