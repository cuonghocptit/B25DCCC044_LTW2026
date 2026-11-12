import { useNavigate, useParams } from 'react-router-dom';
import { LEVELS, MULTIPLIERS, LETTERS, formatMultiplier } from '../data';

const QuestionDetail = ({ questions, bookmarks, toggleBookmark }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const q = questions.find((item) => item.id === Number(id));

  if (!q) {
    return (
      <div>
        <p>Không tìm thấy câu hỏi</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  const marked = bookmarks.includes(q.id);

  return (
    <div className="card">
      <h2>{`Câu hỏi số ${q.id} – ${q.topic} · ${LEVELS[q.level]} (${formatMultiplier(MULTIPLIERS[q.level])})`}</h2>
      <p>{q.question}</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {q.options.map((option, i) => (
          <li
            key={i}
            className={i === q.answer ? 'option-correct' : ''}
            style={{ padding: 8, marginBottom: 4 }}
          >
            {`${LETTERS[i]}. ${option}`}
            {i === q.answer ? ' (Đáp án đúng)' : ''}
          </li>
        ))}
      </ul>
      <p>{`Gợi ý: ${q.hint}`}</p>
      <div className="actions">
        <button onClick={() => toggleBookmark(q.id)}>
          {marked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
        </button>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    </div>
  );
};

export default QuestionDetail;
