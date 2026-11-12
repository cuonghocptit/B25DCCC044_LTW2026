const AnswerButton = ({ letter, text, state, disabled, onClick }) => (
  <button className={`answer ${state}`} disabled={disabled} onClick={onClick}>
    {`${letter}. ${text}`}
  </button>
);

export default AnswerButton;
