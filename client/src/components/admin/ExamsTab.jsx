import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { socket } from '../../utils/socket';
import DatePicker from 'react-datepicker';
import styles from '../../styles/ExamsTab.module.css';

const ExamsTab = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examFormData, setExamFormData] = useState({ title: '', level: 'Easy', date: new Date() });
  const [questionFormData, setQuestionFormData] = useState({
    questionText: '',
    level: 'Easy',
    options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
  });

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get('/exams');
        setExams(res.data);
      } catch (err) {
        console.error('Failed to fetch exams', err);
      }
    };
    fetchExams();

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

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/exams', examFormData);
      setExamFormData({ title: '', level: 'Easy', date: new Date() });
    } catch (err) {
      console.error('Failed to create exam', err);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExam) {
      alert('Please select an exam first.');
      return;
    }
    try {
      await api.post(`/exams/${selectedExam._id}/questions`, questionFormData);
      alert('Question added successfully!');
      setQuestionFormData({ questionText: '', level: 'Easy', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] });
    } catch (err) {
      console.error('Failed to add question', err);
    }
  };
  
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...questionFormData.options];
    newOptions[index][field] = value;
    setQuestionFormData({ ...questionFormData, options: newOptions });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Manage Exams</h2>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Create New Exam</h3>
          <form onSubmit={handleExamSubmit} className={styles.form}>
            <input type="text" placeholder="Exam Title" value={examFormData.title} onChange={(e) => setExamFormData({ ...examFormData, title: e.target.value })} className={styles.input} required />
            <select value={examFormData.level} onChange={(e) => setExamFormData({ ...examFormData, level: e.target.value })} className={styles.input}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
              <option>Final</option>
            </select>
            <DatePicker selected={examFormData.date} onChange={(date) => setExamFormData({ ...examFormData, date })} className={styles.input} />
            <button type="submit" className={`${styles.button} ${styles.createButton}`}>Create Exam</button>
          </form>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Add Question to Exam</h3>
          <select onChange={(e) => setSelectedExam(exams.find(ex => ex._id === e.target.value))} className={styles.input}>
            <option>Select an Exam</option>
            {exams.map(exam => <option key={exam._id} value={exam._id}>{exam.title} ({exam.level})</option>)}
          </select>
          {selectedExam && (
            <form onSubmit={handleQuestionSubmit} className={styles.form}>
              <textarea placeholder="Question Text" value={questionFormData.questionText} onChange={(e) => setQuestionFormData({ ...questionFormData, questionText: e.target.value })} className={styles.textarea} required />
              <select value={questionFormData.level} onChange={(e) => setQuestionFormData({ ...questionFormData, level: e.target.value })} className={styles.input}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              {questionFormData.options.map((opt, index) => (
                <div key={index} className={styles.optionContainer}>
                  <input type="text" placeholder={`Option ${index + 1}`} value={opt.text} onChange={(e) => handleOptionChange(index, 'text', e.target.value)} className={styles.input} required />
                  <input type="checkbox" checked={opt.isCorrect} onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)} />
                  <label>Correct</label>
                </div>
              ))}
              <button type="submit" className={`${styles.button} ${styles.addButton}`}>Add Question</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamsTab;

