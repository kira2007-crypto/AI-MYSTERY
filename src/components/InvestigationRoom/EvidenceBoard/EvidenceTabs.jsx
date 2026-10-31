import { useState } from 'react';
import { WhatsAppViewer } from './WhatsAppViewer';
import { CCTVViewer } from './CCTVViewer';
import { PhotoInspectModal } from './PhotoInspectModal';

export function EvidenceTabs({ evidence }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div>
      <div className="panel-head evidence-head">
        <h3>Evidence board</h3>
        <div className="tab-row">
          <button className={activeTab === 'chat' ? 'tab active' : 'tab'} onClick={() => setActiveTab('chat')}>
            WhatsApp
          </button>
          <button className={activeTab === 'cctv' ? 'tab active' : 'tab'} onClick={() => setActiveTab('cctv')}>
            CCTV
          </button>
          <button className={activeTab === 'images' ? 'tab active' : 'tab'} onClick={() => setActiveTab('images')}>
            Images
          </button>
        </div>
      </div>

      {activeTab === 'chat' && <WhatsAppViewer chats={evidence.chats} />}
      {activeTab === 'cctv' && <CCTVViewer logs={evidence.cctvLogs} />}
      {activeTab === 'images' && (
        <div className="image-grid">
          {evidence.images.map((image) => (
            <button key={image.id} className="image-card" onClick={() => setSelectedImage(image)}>
              <img src={image.imageUrl} alt={image.title} />
              <span>{image.title}</span>
            </button>
          ))}
        </div>
      )}

      {selectedImage && <PhotoInspectModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
}
