export default function Modal({ open, title, children, onClose, onConfirm, confirmText = "Confirm" }) {
  if (!open) return null
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}
