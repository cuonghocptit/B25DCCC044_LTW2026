/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';
import { START_SCORE, MIN_BET, TIME_PER_QUESTION, formatScore } from '../data';
import { validateBet, calcChange } from '../utils';

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [rounds, setRounds] = useState([]);
  const [status, setStatus] = useState('betting'); // betting -> answering -> revealed
  const [betText, setBetText] = useState(String(MIN_BET));
  const [selected, setSelected] = useState(null); // -1 = hết giờ
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

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
    const change = calcChange(bet, question.level, correct);
    const newScore = score + change;
    setScore(newScore);
    setRounds((prev) => [
      ...prev,
      { id: question.id, bet, correct, change, scoreAfter: newScore },
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
  };

  const finish = () => {
    navigate('/result', {
      replace: true,
      state: {
        name: playerName,
        rounds,
        finalScore: score,
        correctCount: rounds.filter((r) => r.correct).length,
        played: rounds.length,
        reason: score < MIN_BET ? 'broke' : 'done',
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

  if (!playerName) return <Navigate to="/" replace />;
  if (!question) return <p>Không có câu hỏi nào.</p>;

  const last = rounds[rounds.length - 1];
  let changeText = '';
  let changeClass = 'change';
  if (status === 'revealed' && last) {
    if (last.correct) {
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
          {status === 'revealed' && <p className={changeClass}>{changeText}</p>}
        </>
      )}
    </div>
  );
};

export default Play;
