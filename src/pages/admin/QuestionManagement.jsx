import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService.js';

const QuestionManagement = () => {
  const { quizId } = useParams(); // Extract quizId from the URL
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

  const fetchQuestions = async () => {
    try {
      const data = await questionService.getQuestionsByQuiz(quizId);
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const handleEdit = (question) => {
    navigate(`/admin/quizzes/${quizId}/questions/edit/${question.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionService.deleteQuestion(id);
        setQuestions(questions.filter(q => q.id !== id));
      } catch (error) {
        console.error("Failed to delete question:", error);
        alert('Error deleting question.');
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/admin/quizzes')}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Back to Quizzes
      </button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Questions</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={() => navigate(`/admin/quizzes/${quizId}/questions/create`)}
        >
          + Create New Question
        </button>
      </div>

      {/* QUESTION LIST */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Questions ({questions.length})</h2>
        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <div key={q.id} className="border p-4 rounded-md bg-gray-50 flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Q{index + 1}: {q.question_text}</h4>
                  <p className="text-sm text-gray-500 mt-1">Marks: {q.marks} | Difficulty: {q.difficulty}</p>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    {q.options?.map((opt, i) => (
                      <li key={opt.id} className={opt.is_correct ? 'text-green-600 font-semibold' : ''}>
                        {String.fromCharCode(65 + i)}. {opt.option_text} {opt.is_correct && '(Correct)'}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => handleEdit(q)} className="text-blue-600 hover:text-blue-900">Edit</button>
                  <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No questions added to this quiz yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionManagement;