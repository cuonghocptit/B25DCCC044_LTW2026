import { MIN_BET, MAX_BET, BET_STEP, MULTIPLIERS, RESULTS } from './data';

export const BET_ERROR =
  'Mức cược phải là bội số của 100, từ 100 đến 500 và không vượt quá số điểm đang có';

// Trả về câu báo lỗi, hoặc chuỗi rỗng nếu hợp lệ
export const validateBet = (bet, score) => {
  const n = Number(bet);
  if (
    bet === '' ||
    !Number.isInteger(n) ||
    n < MIN_BET ||
    n > MAX_BET ||
    n % BET_STEP !== 0 ||
    n > score
  ) {
    return BET_ERROR;
  }
  return '';
};

// Mức cược lớn nhất cho phép: min(500, điểm hiện có) làm tròn xuống bội số của 100
export const maxBetFor = (score) =>
  Math.min(MAX_BET, Math.floor(score / BET_STEP) * BET_STEP);

// Số điểm cộng (đúng) hoặc trừ (sai / hết giờ)
export const calcChange = (bet, level, correct) =>
  correct ? bet * MULTIPLIERS[level] : -bet;

// Mục đầu tiên có điểm >= min
export const getResult = (score) => RESULTS.find((r) => score >= r.min);
