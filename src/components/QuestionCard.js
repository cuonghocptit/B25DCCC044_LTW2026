import AnswerButton from './AnswerButton';
import { LEVELS, MULTIPLIERS, LETTERS, formatMultiplier } from '../data';

const QuestionCard = ({ index, total, question, selected, revealed, onSelect }) => {
  const getState = (i) => {
    if (!revealed) return '';
    if (i === question.answer) return 'correct';
    if (i === selected) return 'wrong';
    return '';
  };
  return (
    <div className="card">
      <p>{`Câu ${index + 1}/${total} · ${question.topic} · ${LEVELS[question.level]} (${formatMultiplier(MULTIPLIERS[question.level])})`}</p>
      <h3>{question.question}</h3>
      <div className="answers">
        {question.options.map((option, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={option}
            state={getState(i)}
            disabled={revealed}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
