import {useParams} from "react-router-dom";
import QuestionForm from "./QuestionForm.jsx";

const QuestionFormWrapper = () => {
  const { questionId } = useParams();
    return <QuestionForm questionId={questionId} />;
};

export default QuestionFormWrapper;