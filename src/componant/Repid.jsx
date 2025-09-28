import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Code,
  Send,
  Copy,
  Share,
  LogOut,
  Eye,
  Moon,
  Sun,
  Hash,
} from "lucide-react";
import { io } from "socket.io-client";
export default function CollabNotes() {
  const url = import.meta.env.VITE_SOC_URL;
  // Connection & Room Management
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);

  const [darkMode, setDarkMode] = useState(true);
  const [showRoomInput, setShowRoomInput] = useState(true);
  const [notification, setNotification] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  // Note Content
  const [noteContent, setNoteContent] = useState(
    '// Welcome to Real-time Collaborative Notes!\n// Start typing to share your code in real-time\n\nconsole.log("Hello, collaborative world!");'
  );

  // Chat
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const textareaRef = useRef(null);

  useEffect(() => {
    const initSocket = async () => {
      try {
        const newSocket = io(url);
        setSocket(newSocket);
      } catch (error) {
        console.error("Failed to load Socket.io:", error);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setIsConnected(true);
      showNotification("Connected to server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      showNotification("Disconnected from server");
    });

    socket.on("room_joined", ({ roomId, users }) => {
      setCurrentRoom(roomId);
      setConnectedUsers(users.filter((id) => id !== socket.id));
      setShowRoomInput(false);
      showNotification(`Joined room: ${roomId}`);
    });

    socket.on("user_joined", ({ socketId, users }) => {
      setConnectedUsers(users.filter((id) => id !== socket.id));
      showNotification(`User joined the room`);
    });

    socket.on("user_left", ({ socketId, users }) => {
      setConnectedUsers(users.filter((id) => id !== socket.id));
      showNotification(`User left the room`);
    });

    socket.on("note_update", ({ content, sender }) => {
      if (sender !== socket.id) {
        setNoteContent(content);
      }
    });

    socket.on("chat_message", (message) => {
      setChatHistory((prev) => [...prev, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room_joined");
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("note_update");
      socket.off("chat_message");
    };
  }, [socket]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const joinRoom = () => {
    if (!roomId.trim() || !socket || !isConnected) return;
    socket.emit("join_room", roomId);
  };

  const leaveRoom = () => {
    if (!socket || !currentRoom) return;
    socket.emit("leave_room", currentRoom);
    setCurrentRoom("");
    setShowRoomInput(true);
    setConnectedUsers([]);
    setChatHistory([]);
    showNotification("Left the room");
  };

  const handleNoteChange = (value) => {
    setNoteContent(value);
    if (socket && currentRoom) {
      socket.emit("note_change", {
        roomId: currentRoom,
        content: value,
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(noteContent);
      showNotification("Code copied to clipboard!");
    } catch (err) {
      showNotification("Failed to copy code");
    }
  };

  const shareRoom = async () => {
    const roomLink = `${window.location.origin}?room=${currentRoom}`;
    try {
      await navigator.clipboard.writeText(roomLink);
      showNotification("Room link copied!");
    } catch (err) {
      showNotification("Failed to copy link");
    }
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim() || !socket || !currentRoom) return;

    const message = {
      id: Date.now(),
      user: userId,
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit("chat_message", { roomId: currentRoom, message });
    setChatMessage("");
  };

  // Check URL for room parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get("room");
    if (roomParam) {
      setRoomId(roomParam);
    }
  }, []);

  if (showRoomInput) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
          <div
            className={`w-full max-w-md p-4 sm:p-8 rounded-lg shadow-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Code className="w-8 h-8 text-blue-500" />
                <h1
                  className={`text-xl sm:text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Collab Notes
                </h1>
              </div>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Real-time collaborative coding
              </p>
            </div>

            {/* Connection Status */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {isConnected ? "Connected" : "Connecting..."}
              </span>
            </div>

            {/* Room Input */}
            <div className="space-y-4">
              <div className="relative">
                <Hash
                  className={`absolute left-3 top-3 w-5 h-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border text-base sm:text-lg ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  onKeyPress={(e) => e.key === "Enter" && joinRoom()}
                />
              </div>

              <button
                onClick={joinRoom}
                disabled={!roomId.trim() || !isConnected}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
              >
                Join Room
              </button>

              <button
                onClick={() => setRoomId(`room_${Date.now()}`)}
                className={`w-full text-sm ${
                  darkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Generate Random Room
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-yellow-400"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
            {notification}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Code className="w-6 h-6 text-blue-500" />
              <div>
                <h1
                  className={`text-lg font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Room: {currentRoom}
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {connectedUsers.length + 1} users online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowChat(!showChat)}
                className={`px-3 py-2 rounded-lg ${
                  showChat
                    ? "bg-blue-500 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Chat
              </button>

              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`p-2 rounded-lg ${
                  isPreview
                    ? "bg-blue-500 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Eye className="w-5 h-5" />
              </button>

              <button
                onClick={copyToClipboard}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Copy className="w-5 h-5" />
              </button>

              <button
                onClick={shareRoom}
                className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Share className="w-5 h-5" />
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-yellow-400"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={leaveRoom}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Editor */}
          <div className={showChat ? "lg:col-span-2" : "lg:col-span-3"}>
            <div
              className={`$${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-lg overflow-hidden flex flex-col h-[50vh] sm:h-96`}
            >
              {isPreview ? (
                <pre
                  className={`p-2 sm:p-4 overflow-auto flex-1 text-xs sm:text-sm font-mono ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                  style={{ minWidth: 0 }}
                >
                  {noteContent}
                </pre>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={noteContent}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  className={`w-full flex-1 min-h-[120px] h-full p-2 sm:p-4 font-mono text-xs sm:text-sm resize-none outline-none ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                  }`}
                  placeholder="Start typing your code here..."
                  style={{ minWidth: 0 }}
                />
              )}
            </div>
          </div>

          {/* Users Panel */}
          <div className="lg:col-span-1 mt-4 lg:mt-0">
            <div
              className={`$${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-lg p-3 sm:p-4`}
            >
              <h3
                className={`font-bold mb-4 flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <Users className="w-5 h-5" />
                Users ({connectedUsers.length + 1})
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    You
                  </span>
                </div>
                {connectedUsers.map((user, index) => (
                  <div key={user} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      User {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          {showChat && (
            <div className="lg:col-span-1 mt-4 lg:mt-0">
              <div
                className={`$${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-lg flex flex-col h-[35vh] sm:h-96`}
              >
                <div className="p-3 sm:p-4 border-b border-gray-700">
                  <h3
                    className={`font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Chat
                  </h3>
                </div>

                <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2">
                  {chatHistory.map((msg) => (
                    <div key={msg.id} className="text-sm">
                      <span
                        className={`font-medium ${
                          msg.user === userId
                            ? "text-blue-500"
                            : darkMode
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        {msg.user === userId ? "You" : "User"}:
                      </span>
                      <span
                        className={`ml-2 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {msg.message}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 sm:p-4 border-t border-gray-700">
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message..."
                      className={`flex-1 px-2 py-2 sm:px-3 sm:py-2 rounded border text-xs sm:text-sm ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                    />
                    <button
                      onClick={sendChatMessage}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {notification && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
          {notification}
        </div>
      )}
    </div>
  );
}
