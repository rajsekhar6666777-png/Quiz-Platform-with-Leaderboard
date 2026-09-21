import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaQuestionCircle, FaClock, FaTimes } from 'react-icons/fa';

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'React',
    difficulty: 'Medium',
    time_limit: 300
  });

  const fetchQuizzes = async () => {
    try {
      const res = await API.get('/quizzes');
      setQuizzes(res.data);
    } catch (err) {
      toast.error('Failed to fetch quizzes.');
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleOpenModal = (quiz = null) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setFormData({
        title: quiz.title,
        description: quiz.description || '',
        category: quiz.category,
        difficulty: quiz.difficulty,
        time_limit: quiz.time_limit
      });
    } else {
      setEditingQuiz(null);
      setFormData({
        title: '',
        description: '',
        category: 'React',
        difficulty: 'Medium',
        time_limit: 300
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await API.put(`/quizzes/${editingQuiz.id}`, formData);
        toast.success('Quiz updated successfully!');
      } else {
        await API.post('/quizzes', formData);
        toast.success('Quiz created successfully!');
      }
      setShowModal(false);
      fetchQuizzes();
    } catch (err) {
      toast.error('Error saving quiz.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz and all its questions?')) {
      try {
        await API.delete(`/quizzes/${id}`);
        toast.success('Quiz deleted.');
        fetchQuizzes();
      } catch (err) {
        toast.error('Failed to delete quiz.');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>
            Manage <span className="gradient-text">Quizzes</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Create, edit, and organize quizzes and their question banks</p>
        </div>

        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FaPlus /> Add New Quiz
        </button>
      </div>

      {/* Quizzes Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="custom-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Time Limit</th>
                <th>Questions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td style={{ fontWeight: 600 }}>{quiz.title}</td>
                  <td><span className="badge badge-category">{quiz.category}</span></td>
                  <td><span className={`badge badge-${quiz.difficulty.toLowerCase()}`}>{quiz.difficulty}</span></td>
                  <td>{Math.floor(quiz.time_limit / 60)} mins</td>
                  <td>{quiz.question_count || 0} questions</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/admin/questions/${quiz.id}`} className="btn btn-secondary btn-sm" title="Manage Questions">
                        <FaQuestionCircle /> Questions
                      </Link>
                      <button className="btn btn-outline btn-sm" onClick={() => handleOpenModal(quiz)} title="Edit">
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(quiz.id)} title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem' }}>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</h3>
              <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Quiz Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. React Hooks Deep Dive"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Brief summary of quiz topics..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="React, Node.js, SQL, Aptitude..."
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-select"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Time Limit (Seconds)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="300 for 5 minutes"
                  value={formData.time_limit}
                  onChange={(e) => setFormData({ ...formData, time_limit: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Quiz</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuizzes;
