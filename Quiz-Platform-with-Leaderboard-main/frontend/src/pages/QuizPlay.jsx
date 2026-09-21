import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaFlag } from 'react-icons/fa';

const QuizPlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const res = await API.get(`/quizzes/${id}`);
        setQuiz(res.data);
        setQuestions(res.data.questions || []);
        setStartTime(Date.now());
      } catch (err) {
        toast.error('Failed to load quiz questions.');
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id, navigate]);

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

    try {
      const res = await API.post('/attempts/submit', {
        quiz_id: parseInt(id),
        user_answers: answers,
        time_taken: timeSpentSeconds
      });

      toast.success('Quiz submitted successfully!');
      navigate(`/result/${res.data.attemptId}`, { state: { resultData: res.data.result } });
    } catch (err) {
      toast.error('Failed to submit quiz attempt.');
      setSubmitting(false);
    }
  }, [submitting, startTime, id, answers, navigate]);

  const handleTimeUp = useCallback(() => {
    toast.warning('⏱️ Time is up! Submitting your quiz automatically...');
    handleSubmitQuiz();
  }, [handleSubmitQuiz]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading quiz content...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', margin: '2rem 0' }}>
        <h3>No Questions Available</h3>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>This quiz doesn't have any questions configured yet.</p>
        <button className="btn btn-primary" onClick={() => navigate('/quizzes')}>Return to Quizzes</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedOption = answers[currentQ.id];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Quiz Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>{quiz.title}</h2>
          <span className="badge badge-category" style={{ marginTop: '0.2rem' }}>{quiz.category}</span>
        </div>

        <div>
          <Timer initialSeconds={quiz.time_limit || 300} onTimeUp={handleTimeUp} />
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar current={currentIndex + 1} total={questions.length} />

      {/* Main Question Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.3rem', lineHeight: '1.5', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
          Q{currentIndex + 1}. {currentQ.question}
        </h3>

        {/* 4 Options Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3, 4].map((optNum) => {
            const optionText = currentQ[`option${optNum}`];
            const isSelected = selectedOption === optNum;

            return (
              <div
                key={optNum}
                onClick={() => handleSelectOption(currentQ.id, optNum)}
                style={{
                  padding: '1.15rem 1.35rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'rgba(37, 99, 235, 0.15)' : 'var(--bg-dark-secondary)',
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-light)'}`,
                  boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}`,
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {String.fromCharCode(64 + optNum)}
                </div>

                <span style={{ fontSize: '1.02rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)', fontWeight: isSelected ? 700 : 500 }}>
                  {optionText}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Navigation Palette & Controls */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Number Buttons Grid */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                  background: isAnswered ? 'rgba(34, 197, 94, 0.2)' : 'var(--bg-dark-secondary)',
                  color: isAnswered ? 'var(--success)' : 'var(--text-main)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none'
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            <FaArrowLeft /> Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            >
              Next <FaArrowRight />
            </button>
          ) : (
            <button
              className="btn btn-primary"
              style={{ background: 'var(--success)' }}
              onClick={handleSubmitQuiz}
              disabled={submitting}
            >
              <FaCheckCircle /> {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPlay;
