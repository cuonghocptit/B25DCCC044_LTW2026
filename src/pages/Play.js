/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';
import Supports from '../components/Supports';
import {
  START_SCORE, MIN_BET, BET_STEP, TIME_PER_QUESTION, formatScore,
} from '../data';
import { validateBet, calcChange, getResult, maxBetFor } from '../utils';

const DEFAULT_TITLE = 'Đặt cược kiến thức';

const Play = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [rounds, setRounds] = useState([]);
  const [status, setStatus] = useState('betting'); // betting -> answering -> revealed
  const [betText, setBetText] = useState(String(MIN_BET));
  const [selected, setSelected] = useState(null); // vị trí đáp án đã chọn, -1 = hết giờ
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [used, setUsed] = useState({ preview: false, insurance: false, hint: false });
  const [previewNow, setPreviewNow] = useState(false);
  const [insuredNow, setInsuredNow] = useState(false);
  const [hintNow, setHintNow] = useState(false);

  const total = questions.length;
  const question = questions[index];
  const bet = Number(betText);

  const placeBet = () => {
    if (status !== 'betting' || validateBet(betText, score) !== '') return;
    setTimeLeft(TIME_PER_QUESTION);
    setStatus('answering');
  };

  const reveal = (choice) => {
    const correct = choice === question.answer;
    const insured = !correct && insuredNow;
    const change = insured ? 0 : calcChange(bet, question.level, correct);
    const newScore = score + change;
    setScore(newScore);
    setRounds((prev) => [
      ...prev,
      { id: question.id, bet, correct, change, scoreAfter: newScore, insured },
    ]);
    setSelected(choice);
    setStatus('revealed');
  };

  const handleSelect = (choice) => {
    if (status !== 'answering') return;
    reveal(choice);
  };

  const goNext = () => {
    setIndex((i) => i + 1);
    setStatus('betting');
    setBetText(String(MIN_BET));
    setSelected(null);
    setPreviewNow(false);
    setInsuredNow(false);
    setHintNow(false);
  };

  const finish = () => {
    const broke = score < MIN_BET;
    const correctCount = rounds.filter((r) => r.correct).length;
    onFinish({
      id: Date.now(),
      name: playerName,
      finalScore: score,
      correctCount,
      played: rounds.length,
      result: getResult(score).title,
      playedAt: new Date().toLocaleString('vi-VN'),
    });
    navigate('/result', {
      replace: true,
      state: {
        name: playerName,
        rounds,
        finalScore: score,
        correctCount,
        played: rounds.length,
        reason: broke ? 'broke' : 'done',
      },
    });
  };

  // Đồng hồ: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== 'answering') return;
    const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [status]);

  // Hết giờ
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) reveal(-1);
  }, [status, timeLeft]);

  // Chờ 2 giây sau khi lộ đáp án
  useEffect(() => {
    if (status !== 'revealed') return;
    const timeoutId = setTimeout(() => {
      if (index + 1 >= total || score < MIN_BET) finish();
      else goNext();
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [status]);

  // Phím tắt ở bước đặt cược
  useEffect(() => {
    if (status !== 'betting') return;
    const handleKey = (e) => {
      const n = Number(betText) || 0;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next = Math.floor(n / BET_STEP) * BET_STEP + BET_STEP;
        setBetText(String(Math.max(MIN_BET, Math.min(next, maxBetFor(score)))));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = Math.ceil(n / BET_STEP) * BET_STEP - BET_STEP;
        setBetText(String(Math.max(MIN_BET, Math.min(next, maxBetFor(score)))));
      } else if (e.key === 'Enter') {
        // Nút đang focus sẽ tự xử lý click của nó
        if (e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        placeBet();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, betText, score]);

  // Tiêu đề tab
  useEffect(() => {
    if (!question) return;
    document.title =
      status === 'betting'
        ? `Câu ${index + 1}/${total} – đặt cược`
        : `Câu ${index + 1}/${total} – cược ${bet}`;
  }, [status, index, betText]);

  useEffect(() => {
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  if (!playerName) return <Navigate to="/" replace />;
  if (!question) return <p>Không có câu hỏi nào.</p>;

  const last = rounds[rounds.length - 1];
  let changeText = '';
  let changeClass = 'change';
  if (status === 'revealed' && last) {
    if (last.insured) {
      changeText = 'Bảo hiểm: không bị trừ điểm';
    } else if (last.correct) {
      changeText = `+${formatScore(last.change)}`;
      changeClass = 'change up';
    } else {
      changeText = `−${formatScore(-last.change)}`;
      changeClass = 'change down';
    }
  }

  return (
    <div>
      {status === 'betting' ? (
        <BetPanel
          index={index}
          total={total}
          question={question}
          score={score}
          betText={betText}
          onBetChange={setBetText}
          onBet={placeBet}
          previewText={previewNow ? question.question : ''}
        />
      ) : (
        <>
          <div className="status-row">
            <Timer timeLeft={timeLeft} />
            <ScoreInfo score={score} bet={bet} />
          </div>
          <QuestionCard
            index={index}
            total={total}
            question={question}
            selected={selected}
            revealed={status === 'revealed'}
            onSelect={handleSelect}
          />
          {hintNow && <p className="preview">{`Gợi ý: ${question.hint}`}</p>}
          {status === 'revealed' && <p className={changeClass}>{changeText}</p>}
        </>
      )}
      <Supports
        status={status}
        used={used}
        insuredNow={insuredNow}
        onPreview={() => {
          setUsed((u) => ({ ...u, preview: true }));
          setPreviewNow(true);
        }}
        onInsurance={() => {
          setUsed((u) => ({ ...u, insurance: true }));
          setInsuredNow(true);
        }}
        onHint={() => {
          setUsed((u) => ({ ...u, hint: true }));
          setHintNow(true);
        }}
      />
    </div>
  );
};

export default Play;
