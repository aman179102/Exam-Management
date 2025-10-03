import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api'; // Use centralized API instance
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/TakeTest.module.css';

const TakeTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const timerRef = useRef(null); // Prevent memory leaks

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get(`/tests/${id}`);
        setTest(res.data);
        const initialAnswers = {};
        res.data.questions.forEach(q => {
          initialAnswers[q._id] = '';
        });
        setAnswers(initialAnswers);
        setTimeLeft(res.data.timeLimit * 60);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching test:', error);
        setError('Failed to load test. Please try again.');
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  useEffect(() => {
    if (timeLeft === 0 && test) {
      handleSubmit();
      return;
    }
    
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, test]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post(`/tests/${id}/submit`, { answers });
      navigate('/student/test-result', { 
        state: { 
          score: res.data.score, 
          totalQuestions: res.data.totalQuestions 
        } 
      });
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Failed to submit test. Please try again.');
    }
  };

  if (loading) return <div className={styles.loading}>Loading test...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!test) return <div className={styles.error}>Test not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{test.title}</h2>
        <div className={styles.timer}>Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</div>
      </div>
      
      {test.questions.map((question, qIndex) => (
        <div key={question._id} className={styles.questionContainer}>
          <h4 className={styles.questionText}>{qIndex + 1}. {question.questionText}</h4>
          <div className={styles.optionsGrid}>
            {Object.entries(question.options).map(([key, value]) => (
              <button
                key={key}
                className={`${styles.optionButton} ${answers[question._id] === key ? styles.selected : ''}`}
                onClick={() => handleAnswerChange(question._id, key)}
              >
                {key}: {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.navigation}>
        <button onClick={handleSubmit} className={styles.submitButton}>Submit Test</button>
      </div>
    </div>
  );
};

export default TakeTest;
