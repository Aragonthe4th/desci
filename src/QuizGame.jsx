import React, { useState, useEffect } from 'react';
import './QuizGame.css';

const topics = [
  { name: 'Space', file: 'space_questions.json' },
  { name: 'Biology', file: 'biology_questions.json' },
  { name: 'Chemistry', file: 'chemistry_questions.json' },
  { name: 'Health', file: 'health_questions.json' }
];

const fetchQuestions = async (file) => {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const questions = await response.json();
    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

const QuizGame = ({ updatePoints }) => {
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  useEffect(() => {
    if (topic) {
      fetchQuestions(topic.file).then((questions) => {
        if (questions.length > 0) {
          const selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 5);
          setQuestions(selectedQuestions);
          setCurrentQuestionIndex(0);
          setScore(0);
          setIsQuizFinished(false);
        } else {
          alert('Failed to load questions. Please try again.');
          setTopic(null);
        }
      });
    }
  }, [topic]);

  const handleTopicSelection = (topic) => {
    setTopic(topic);
  };

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 20);
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setIsQuizFinished(true);
      updatePoints(score + (isCorrect ? 20 : 0));
    }
  };

  return (
    <div className="quiz-container">
      {!topic ? (
        <div>
          <div className="quiz-header">
            <h2>Welcome to the Quiz Game</h2>
            <p>Select a topic to start the quiz:</p>
          </div>
          <div className="topic-selection">
            {topics.map((topic) => (
              <button key={topic.name} onClick={() => handleTopicSelection(topic)}>
                {topic.name}
              </button>
            ))}
          </div>
        </div>
      ) : isQuizFinished ? (
        <div>
          <div className="quiz-header">
            <h2>Quiz Finished</h2>
            <p>Your score: {score}</p>
          </div>
          <div className="quiz-footer">
            <button onClick={() => setTopic(null)}>Try another topic</button>
          </div>
        </div>
      ) : (
        <div>
          {questions.length > 0 && questions[currentQuestionIndex] ? (
            <div className="question-container">
              <h2>Question {currentQuestionIndex + 1}</h2>
              <p>{questions[currentQuestionIndex].questionText}</p>
              <div className="answer-options">
                {questions[currentQuestionIndex].answerOptions.map((option, index) => (
                  <button key={index} onClick={() => handleAnswerClick(option.isCorrect)}>
                    {option.answerText}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizGame;
