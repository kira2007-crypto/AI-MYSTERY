export function PhotoInspectModal({ image, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="image-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>{image.title}</h3>
        <img src={image.imageUrl} alt={image.title} />
        <p>{image.description}</p>
      </div>
    </div>
  );
}
