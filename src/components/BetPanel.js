import { LEVELS, MULTIPLIERS, formatScore, formatMultiplier } from '../data';
import { validateBet } from '../utils';

const BetPanel = ({ index, total, question, score, betText, onBetChange, onBet, previewText }) => {
  const error = validateBet(betText, score);
  return (
    <div className="card">
      <p>{`Câu ${index + 1}/${total} · ${question.topic} · ${LEVELS[question.level]} (${formatMultiplier(MULTIPLIERS[question.level])})`}</p>
      <p>{`Điểm hiện có: ${formatScore(score)}`}</p>
      {previewText && (
        <p className="preview">
          <strong>Xem trước:</strong> <span>{previewText}</span>
        </p>
      )}
      <label>
        Mức cược{' '}
        <input
          type="number"
          value={betText}
          onChange={(e) => onBetChange(e.target.value)}
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="primary" disabled={error !== ''} onClick={onBet}>
        Đặt cược
      </button>
    </div>
  );
};

export default BetPanel;
