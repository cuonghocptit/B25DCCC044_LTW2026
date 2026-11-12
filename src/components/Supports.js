const Supports = ({ status, used, insuredNow, onPreview, onInsurance, onHint }) => {
  const canPreview = status === 'betting' && !used.preview;
  const canInsure = (status === 'betting' || status === 'answering') && !used.insurance;
  const canHint = status === 'answering' && !used.hint;
  return (
    <div className="supports">
      <button disabled={!canPreview} onClick={onPreview}>Xem trước</button>
      <button disabled={!canInsure} onClick={onInsurance}>
        {insuredNow ? 'Đã bảo hiểm' : 'Bảo hiểm'}
      </button>
      <button disabled={!canHint} onClick={onHint}>Gợi ý</button>
    </div>
  );
};

export default Supports;
