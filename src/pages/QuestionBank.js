import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS, MULTIPLIERS, formatMultiplier } from '../data';

const QuestionBank = ({ questions, bookmarks, toggleBookmark }) => {
  const [levels, setLevels] = useState([1, 2, 3]);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [search, setSearch] = useState('');

  const handleLevelChange = (level) => {
    setLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleLookupShift = (e) => {
    setSearch(e.target.value);
  };

  const keyword = search.trim().toLowerCase();
  const shown = questions.filter(
    (q) =>
      levels.includes(q.level) &&
      (!onlyBookmarked || bookmarks.includes(q.id)) &&
      q.question.toLowerCase().includes(keyword)
  );

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>
      <div className="filters">
        {Object.keys(LEVELS).map((key) => {
          const level = Number(key);
          return (
            <label key={level}>
              <input
                type="checkbox"
                checked={levels.includes(level)}
                onChange={() => handleLevelChange(level)}
              />{' '}
              {LEVELS[level]}
            </label>
          );
        })}
        <label>
          <input
            type="checkbox"
            checked={onlyBookmarked}
            onChange={(e) => setOnlyBookmarked(e.target.checked)}
          />{' '}
          Chỉ hiện câu đã đánh dấu
        </label>
        <label>
          Tìm kiếm{' '}
          <input
            value={search}
            onChange={handleLookupShift}
            placeholder="Nội dung câu hỏi"
          />
        </label>
      </div>
      <p>{`Có ${shown.length} câu hỏi`}</p>
      <p>{`Đã đánh dấu: ${bookmarks.length} câu`}</p>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Chủ đề</th>
            <th>Mức độ</th>
            <th>Hệ số</th>
            <th>Câu hỏi</th>
            <th>Đánh dấu</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{q.topic}</td>
              <td>{LEVELS[q.level]}</td>
              <td>{formatMultiplier(MULTIPLIERS[q.level])}</td>
              <td><Link to={`/questions/${q.id}`}>{q.question}</Link></td>
              <td>
                <button className="star" onClick={() => toggleBookmark(q.id)}>
                  {bookmarks.includes(q.id) ? '★' : '☆'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;
