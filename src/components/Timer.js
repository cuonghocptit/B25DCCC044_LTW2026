const Timer = ({ timeLeft }) => (
  <p className={timeLeft <= 5 ? 'timer danger' : 'timer'} style={timeLeft <= 5 ? { color: 'red' } : undefined}>
    {`Còn ${timeLeft} giây`}
  </p>
);

export default Timer;
