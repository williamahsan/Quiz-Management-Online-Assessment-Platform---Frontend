import { useEffect } from "react";
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import questionService from '../../services/questionService.js';

const QuestionForm = ({ questionId }) => {
  const navigate = useNavigate();
  const { quizId } = useParams();

  const isEditing = Boolean(questionId);

  // Initialize React Hook Form with 4 default options
  const { register, handleSubmit, reset, setError, clearErrors, control, formState: { errors } } = useForm({
    defaultValues: {
      marks: 1,
      difficulty: 'INTERMEDIATE',
      options: [
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ],
    }
  });

  useEffect(() => {
    if (isEditing) {
      const loadQuestionData = async () => {
        try {
          const questionData = await questionService.getQuestionById(questionId);
          reset(questionData);
        } catch (error) {
          console.error("Failed to load question data:", error);
        }
      };

      loadQuestionData();
    }
  }, [isEditing, questionId, reset]);

  const { fields } = useFieldArray({
    control,
    name: "options"
  });

  const onSubmit = async (data) => {
    // Ensure at least one checkbox is selected
    const hasCorrectOption = data.options.some((opt) => opt.is_correct === true);
    if (!hasCorrectOption) {
      setError("options", {
        type: "manual",
        message: "Please select at least one correct option.",
      });
      return;
    }
    try {
      // Ensure marks is an integer
      const formattedData = {
        ...data,
        marks: parseInt(data.marks, 10),
        options: data.options.map((opt, idx) => ({
          ...opt,
          is_correct: Boolean(opt.is_correct),
        })),
      };

      if (isEditing) {
        await questionService.updateQuestion(questionId, formattedData);
        alert('Question updated successfully!');
      } else {
        await questionService.createQuestion(quizId, formattedData);
        alert('Question created successfully!');
      }

      handleCancelEdit();
    } catch (error) {
      console.error("Failed to save question:", error);
      alert('Error saving question.');
    }
  };

  const handleCancelEdit = () => {
    reset(); // Resets form to defaultValues (including the 4 blank options)
    navigate(`/admin/quizzes/${quizId}/questions`);
  };

  return (
    <div>
      {/* QUESTION BUILDER FORM */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Question' : 'Create New Question'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Main Question Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Question Text</label>
              <textarea
                {...register("question_text", { required: "Question text is required" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
              />
              {errors.question_text && <p className="text-red-500 text-sm mt-1">{errors.question_text.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Marks</label>
              <input
                type="number"
                {...register("marks", { required: true, min: 1 })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select
                {...register("difficulty")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="EASY">Easy</option>
                <option value="INTERMEDIATE">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Explanation (Optional)</label>
              <textarea
                {...register("explanation")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="2"
                placeholder="Show this explanation after the quiz is submitted..."
              />
            </div>
          </div>

          <hr className="my-4" />

          {/* Options Array */}
          <div>
            <h3 className="text-lg font-medium mb-3">Answers / Options</h3>
            <p className="text-sm text-gray-500 mb-4">Check all options that are correct answers.</p>
            {errors.options?.message && (
              <p className="text-red-500 text-sm mb-3">{errors.options.message}</p>
            )}

            <div className="space-y-3">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    {...register(`options.${index}.is_correct`, {
                      onChange: () => clearErrors("options"),
                    })}
                    className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    {...register(`options.${index}.option_text`, { required: "Option text is required" })}
                    placeholder={`Option ${index + 1}`}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              {isEditing ? 'Update Question' : 'Save Question'}
            </button>
            <button type="button" onClick={handleCancelEdit} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;