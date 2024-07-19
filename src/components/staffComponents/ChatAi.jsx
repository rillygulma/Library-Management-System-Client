import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiFillDelete } from 'react-icons/ai';
import Logo from '../userComponent/fubk-logo.jpg';

const ChatAi = () => {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  // Load saved chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem('savedChats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  // Update localStorage whenever chats change
  useEffect(() => {
    localStorage.setItem('savedChats', JSON.stringify(chats));
  }, [chats]);

  const sendMessage = async () => {
    setIsLoading(true); // Set loading to true when message is sent
    try {
      const res = await axios.post(
        'https://library-management-system-server-f0vl.onrender.com/api/fubk-ai',
        JSON.stringify({ history, message }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const newMessage = { user: message, ai: res.data };
      setHistory([...history, newMessage]);
      setResponse(res.data);
      setMessage('');
      setError('');
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.response) {
        setError(`Error: ${err.response.status} - ${err.response.data}`);
      } else if (err.request) {
        setError('Error: No response received from server');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false); // Set loading to false after the response is received
    }
  };

  const clearHistoryAndResponse = () => {
    setHistory([]);
    setResponse('');
    setError('');
  };

  const saveChat = () => {
    const newChat = { history, date: new Date().toISOString() };
    setChats([...chats, newChat]);
    clearHistoryAndResponse();
  };

  const loadChat = (chat) => {
    setHistory(chat.history);
  };

  const deleteChat = (index) => {
    const updatedChats = chats.filter((_, i) => i !== index);
    setChats(updatedChats);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <div className="md:w-1/4 bg-white shadow-md rounded-lg p-4 m-4">
        <h2 className="text-xl font-bold mb-4">Saved Chats</h2>
        <div className="space-y-2">
          {chats.map((chat, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-gray-200 rounded-lg cursor-pointer"
              onClick={() => loadChat(chat)}
            >
              <div>
                Chat from {new Date(chat.date).toLocaleString()}
              </div>
              <button onClick={(e) => {
                e.stopPropagation(); // Prevents the loadChat from triggering
                deleteChat(index);
              }}>
                <AiFillDelete className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="md:w-3/4 bg-white shadow-md rounded-lg p-4 m-4 flex flex-col items-center">
        <img src={Logo} alt="FUBK AI Logo" className="w-32 h-32 mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-500">Chat With FUBK AI</h1>
        <div className="flex-1 space-y-4 w-full">
          <div className="bg-gray-200 p-4 rounded-lg h-64 overflow-y-auto w-full">
            {history.map((msg, index) => (
              <div key={index} className="my-2">
                <div className="bg-blue-100 p-2 rounded-lg">{msg.user}</div>
                <div className="bg-green-100 p-2 rounded-lg mt-2">{msg.ai}</div>
              </div>
            ))}
            {isLoading && <div className="my-2 bg-yellow-100 p-2 rounded-lg text-center">Typing...</div>} {/* Typing indicator */}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg h-24"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className={`w-full bg-blue-500 text-white p-4 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
          {response && (
            <>
              <button
                onClick={saveChat}
                className="w-full bg-green-500 text-white p-4 rounded-lg mt-2"
              >
                Save Chat
              </button>
              <button
                onClick={clearHistoryAndResponse}
                className="w-full bg-red-500 text-white p-4 rounded-lg mt-2"
              >
                Clear Chat
              </button>
            </>
          )}
          {error && (
            <div className="text-red-500 mt-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAi;
