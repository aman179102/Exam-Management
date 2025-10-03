import React, { useState } from 'react';
import api from '../utils/api'; // Use centralized API instance
import styles from '../styles/CreateTest.module.css';

const CreateTest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);
  const [questions, setQuestions] = useState([
    { questionText: '', options: { A: '', B: '', C: '', D: '' }, correctAnswer: 'A', difficulty: 'Easy' },
  ]);

  const handleQuestionChange = (index, event) => {
    const values = [...questions];
    values[index][event.target.name] = event.target.value;
    setQuestions(values);
  };

  const handleOptionChange = (qIndex, optionKey, event) => {
    const values = [...questions];
    values[qIndex].options[optionKey] = event.target.value;
    setQuestions(values);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: { A: '', B: '', C: '', D: '' }, correctAnswer: 'A', difficulty: 'Easy' }]);
  };

  const handleRemoveQuestion = (index) => {
    const values = [...questions];
    values.splice(index, 1);
    setQuestions(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!title.trim() || !description.trim()) {
      alert('Title and description are required');
      return;
    }
    
    if (timeLimit <= 0) {
      alert('Time limit must be greater than 0');
      return;
    }
    
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.questionText.trim()) {
        alert(`Question ${i + 1} text is required`);
        return;
      }
      if (!question.options.A.trim() || !question.options.B.trim() || 
          !question.options.C.trim() || !question.options.D.trim()) {
        alert(`All options for question ${i + 1} are required`);
        return;
      }
      if (!question.correctAnswer) {
        alert(`Correct answer for question ${i + 1} is required`);
        return;
      }
    }
    
    try {
      await api.post('/tests', { title, description, timeLimit, questions });
      alert('Test created successfully');
      // Reset form
      setTitle('');
      setDescription('');
      setTimeLimit(60);
      setQuestions([{ questionText: '', options: { A: '', B: '', C: '', D: '' }, correctAnswer: 'A', difficulty: 'Easy' }]);
    } catch (error) {
      console.error('Error creating test:', error);
      const errorMsg = error.response?.data?.message || 'Error creating test';
      alert(errorMsg);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create New Test</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Time Limit (minutes)</label>
          <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} required />
        </div>

        <h3>Questions</h3>
        {questions.map((question, qIndex) => (
          <div key={qIndex} className={styles.questionCard}>
            <div className={styles.formGroup}>
              <label>Question {qIndex + 1}</label>
              <textarea
                name="questionText"
                placeholder="Question Text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Options</label>
              {Object.keys(question.options).map((key) => (
                <input
                  key={key}
                  type="text"
                  placeholder={`Option ${key}`}
                  value={question.options[key]}
                  onChange={(e) => handleOptionChange(qIndex, key, e)}
                  required
                />
              ))}
            </div>
            <div className={styles.formGroup}>
              <label>Correct Answer</label>
              <select name="correctAnswer" value={question.correctAnswer} onChange={(e) => handleQuestionChange(qIndex, e)} required>
                <option value="">Select Correct Answer</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Difficulty</label>
              <select name="difficulty" value={question.difficulty} onChange={(e) => handleQuestionChange(qIndex, e)} required>
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className={styles.removeButton}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion} className={styles.addQuestionButton}>Add Question</button>
        <button type="submit" className={styles.submitButton}>Create Test</button>
      </form>
    </div>
  );
};

export default CreateTest;
