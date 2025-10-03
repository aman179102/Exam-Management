import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ExamTaker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await api.get(`/exams/${id}`);
        setExam(res.data);
      } catch (err) {
        console.error('Failed to fetch exam', err);
      }
    };
    fetchExam();
  }, [id]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === questionId);

    if (existingAnswerIndex > -1) {
      newAnswers[existingAnswerIndex].selectedOption = optionIndex;
    } else {
      newAnswers.push({ questionId, selectedOption: optionIndex });
    }
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post('/results/submit', { examId: id, answers });
      alert('Exam submitted successfully!');
      navigate('/student');
    } catch (err) {
      console.error('Failed to submit exam', err);
      alert('There was an error submitting your exam.');
    }
  };

  if (!exam) return <div>Loading...</div>;

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">{exam.title}</h2>
        <div className="mb-6">
          <p className="text-lg font-semibold">{currentQuestion.questionText}</p>
          <div className="mt-4 space-y-2">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="flex items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  onChange={() => handleAnswerSelect(currentQuestion._id, index)}
                  className="mr-3"
                />
                {option.text}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p>Question {currentQuestionIndex + 1} of {exam.questions.length}</p>
          {currentQuestionIndex < exam.questions.length - 1 ? (
            <button onClick={handleNext} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Next</button>
          ) : (
            <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit Exam</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamTaker;
