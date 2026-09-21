import React, { useEffect, useState } from 'react';
import API from '../services/api';
import QuizCard from '../components/QuizCard';
import { FaSearch, FaFilter, FaBrain } from 'react-icons/fa';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/quizzes/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
        if (searchTerm.trim() !== '') params.search = searchTerm;

        const res = await API.get('/quizzes', { params });
        setQuizzes(res.data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchQuizzes();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedDifficulty, searchTerm]);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
          Explore <span className="gradient-text">Quizzes</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Choose a domain, test your skills, and earn high scores for the leaderboard!
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="Search quiz by title or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Difficulty Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Difficulty:</span>
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                className={`btn btn-sm ${selectedDifficulty === diff ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedDifficulty(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button
            className={`btn btn-sm ${selectedCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory('All')}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category}
              className={`btn btn-sm ${selectedCategory === cat.category ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(cat.category)}
            >
              {cat.category} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading quizzes...
        </div>
      ) : quizzes.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', margin: '2rem 0' }}>
          <FaBrain style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }} />
          <h3>No Quizzes Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Try adjusting your search criteria or category filters.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
