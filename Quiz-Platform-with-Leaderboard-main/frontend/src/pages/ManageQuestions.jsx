import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';

const ManageQuestions = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [formData, setFormData] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_option: 1,
    marks: 1
  });

  const fetchQuizDetails = async () => {
    try {
      const res = await API.get(`/quizzes/${quizId}/admin`);
      setQuiz(res.data);
      setQuestions(res.data.questions || []);
    } catch (err) {
      toast.error('Failed to load quiz questions.');
    }
  };

  useEffect(() => {
    fetchQuizDetails();
  }, [quizId]);

  const handleOpenModal = (q = null) => {
    if (q) {
      setEditingQuestion(q);
      setFormData({
        question: q.question,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4,
        correct_option: q.correct_option,
        marks: q.marks
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correct_option: 1,
        marks: 1
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await API.put(`/questions/${editingQuestion.id}`, formData);
        toast.success('Question updated successfully!');
      } else {
        await API.post('/questions', { ...formData, quiz_id: parseInt(quizId) });
        toast.success('Question added successfully!');
      }
      setShowModal(false);
      fetchQuizDetails();
    } catch (err) {
      toast.error('Failed to save question.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this question?')) {
      try {
        await API.delete(`/questions/${id}`);
        toast.success('Question deleted.');
        fetchQuizDetails();
      } catch (err) {
        toast.error('Failed to delete question.');
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/quizzes" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
          <FaArrowLeft /> Back to Quizzes
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>
            Question Bank: <span style={{ color: 'var(--primary)' }}>{quiz?.title}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Category: {quiz?.category} | Difficulty: {quiz?.difficulty} | Total Questions: {questions.length}
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FaPlus /> Add Question
        </button>
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {questions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No questions added to this quiz yet. Click <strong>Add Question</strong> to get started!
          </div>
        ) : (
          questions.map((q, idx) => (
            <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>
                  Q{idx + 1}. {q.question}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => handleOpenModal(q)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(q.id)}><FaTrash /></button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {[1, 2, 3, 4].map((num) => {
                  const isCorrect = q.correct_option === num;
                  return (
                    <div key={num} style={{
                      padding: '0.65rem 0.9rem',
                      borderRadius: '8px',
                      background: isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-dark-secondary)',
                      border: `1px solid ${isCorrect ? 'rgba(34, 197, 94, 0.35)' : 'var(--border-light)'}`,
                      color: isCorrect ? 'var(--success)' : 'var(--text-muted)',
                      fontWeight: isCorrect ? 700 : 500,
                      fontSize: '0.9rem'
                    }}>
                      Option {num}: {q[`option${num}`]} {isCorrect && '✓ (Correct)'}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Question Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Question Text</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Enter the question statement..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Option 1</label>
                  <input type="text" className="form-input" value={formData.option1} onChange={(e) => setFormData({ ...formData, option1: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Option 2</label>
                  <input type="text" className="form-input" value={formData.option2} onChange={(e) => setFormData({ ...formData, option2: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Option 3</label>
                  <input type="text" className="form-input" value={formData.option3} onChange={(e) => setFormData({ ...formData, option3: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Option 4</label>
                  <input type="text" className="form-input" value={formData.option4} onChange={(e) => setFormData({ ...formData, option4: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Correct Option</label>
                  <select
                    className="form-select"
                    value={formData.correct_option}
                    onChange={(e) => setFormData({ ...formData, correct_option: parseInt(e.target.value) })}
                  >
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                    <option value={3}>Option 3</option>
                    <option value={4}>Option 4</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Marks</label>
                  <input type="number" className="form-input" value={formData.marks} onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;
