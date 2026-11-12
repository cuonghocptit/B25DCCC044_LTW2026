import { formatScore } from '../data';

const CHART_HEIGHT = 200;

const ScoreChart = ({ rounds }) => {
  const max = Math.max(...rounds.map((r) => r.scoreAfter), 0);
  return (
    <div className="chart">
      {rounds.map((r, i) => {
        const height = max > 0 ? (r.scoreAfter / max) * CHART_HEIGHT : 0;
        return (
          <div className="chart-col" key={`${r.id}-${i}`}>
            <div className="chart-value">{formatScore(r.scoreAfter)}</div>
            <div
              className={r.correct ? 'chart-bar ok' : 'chart-bar bad'}
              style={{ height: `${height}px` }}
            />
            <div className="chart-label">{`Câu ${i + 1}`}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ScoreChart;
