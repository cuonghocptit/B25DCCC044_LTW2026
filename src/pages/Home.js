import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { START_SCORE, formatScore } from '../data';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(playerName);

  const best =
    history.length > 0
      ? history.reduce((b, h) => (h.finalScore > b.finalScore ? h : b), history[0])
      : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') return;
    setPlayerName(name.trim());
    navigate('/play');
  };

  return (
    <div>
      <h2>Đặt cược kiến thức</h2>
      {best && <p>{`Kỷ lục: ${formatScore(best.finalScore)} – ${best.name}`}</p>}
      <div className="card">
        <ul>
          <li>{`Bắt đầu với ${formatScore(START_SCORE)}, đi qua 12 câu hỏi HTML, CSS, JavaScript, React.`}</li>
          <li>Trước mỗi câu chỉ biết chủ đề và mức độ, phải đặt cược từ 100 đến 500 điểm.</li>
          <li>Sau đó câu hỏi hiện ra, có 25 giây để trả lời.</li>
          <li>Đúng: được thưởng mức cược × hệ số (Dễ x1, Trung bình x1,5, Khó x2). Sai hoặc hết giờ: mất đúng số điểm đã cược.</li>
          <li>Còn dưới 100 điểm là cháy túi, lượt chơi kết thúc.</li>
          <li>Có 3 quyền trợ giúp: Xem trước, Bảo hiểm, Gợi ý (mỗi quyền dùng một lần).</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Tên người chơi{' '}
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>{' '}
        <button className="primary" type="submit" disabled={name.trim() === ''}>
          Vào chơi
        </button>
      </form>
    </div>
  );
};

export default Home;
