import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { socket } from '../utils/socket';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, resultsRes] = await Promise.all([
          api.get('/exams'),
          api.get('/results/my-results'),
        ]);
        setExams(examsRes.data);
        setResults(resultsRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();

    socket.connect();

    function onExamCreated(exam) {
      setExams((prevExams) => [...prevExams, exam]);
    }

    socket.on('exam_created', onExamCreated);

    return () => {
      socket.off('exam_created', onExamCreated);
      socket.disconnect();
    };
  }, []);

  const isCompleted = (examId) => {
    return results.some(result => result.exam._id === examId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Available Exams</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <ul className="space-y-4">
          {exams.map(exam => (
            <li key={exam._id} className="p-4 bg-gray-50 rounded-md flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{exam.title}</p>
                <p className="text-sm text-gray-600">Level: {exam.level}</p>
              </div>
              {isCompleted(exam._id) ? (
                <span className="text-green-600 font-semibold">Completed</span>
              ) : (
                <Link to={`/exams/${exam._id}`} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Start Exam</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExamList;
