export function WhatsAppViewer({ chats }) {
  return (
    <div className="chat-window">
      {chats.map((chat) => (
        <div key={chat.id} className="chat-thread">
          <div className="chat-header">
            <span>{chat.title}</span>
            <small>{chat.participants.join(' • ')}</small>
          </div>

          <div className="chat-body">
            {chat.messages.map((message, index) => (
              <div
                key={`${chat.id}-${index}`}
                className={message.sender === 'Mara Quinn' || message.sender === 'Dorian Vale' ? 'message outgoing' : 'message incoming'}
              >
                <label>{message.sender}</label>
                <p>{message.text}</p>
                <small>{message.timestamp}</small>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
