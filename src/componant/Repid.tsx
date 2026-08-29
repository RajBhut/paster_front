import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Code2,
  Send,
  Copy,
  Link2,
  LogOut,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Hash,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { io, type Socket } from "socket.io-client";

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  timestamp: string;
}

interface RoomJoinedPayload { roomId: string; users: string[]; }
interface UserChangedPayload { socketId: string; users: string[]; }
interface NoteUpdatePayload { content: string; sender: string; }

// ─── CollabNotes ──────────────────────────────────────────────────────────────
export default function CollabNotes() {
  const url = import.meta.env.VITE_SOC_URL as string;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [userId] = useState<string>(`u_${Math.random().toString(36).substr(2, 7)}`);

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [showRoomInput, setShowRoomInput] = useState(true);
  const [notification, setNotification] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const [noteContent, setNoteContent] = useState(
    "// Start typing to collaborate in real time.\n"
  );
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const s = io(url);
    setSocket(s);
    return () => { s.disconnect(); };
  }, [url]);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => { setIsConnected(true); notify("Connected"); });
    socket.on("disconnect", () => { setIsConnected(false); notify("Disconnected"); });
    socket.on("room_joined", ({ roomId: rid, users }: RoomJoinedPayload) => {
      setCurrentRoom(rid);
      setConnectedUsers(users.filter((id) => id !== socket.id));
      setShowRoomInput(false);
      notify(`Joined ${rid}`);
    });
    socket.on("user_joined", ({ users }: UserChangedPayload) => {
      setConnectedUsers(users.filter((id) => id !== socket.id));
      notify("A user joined");
    });
    socket.on("user_left", ({ users }: UserChangedPayload) => {
      setConnectedUsers(users.filter((id) => id !== socket.id));
      notify("A user left");
    });
    socket.on("note_update", ({ content, sender }: NoteUpdatePayload) => {
      if (sender !== socket.id) setNoteContent(content);
    });
    socket.on("chat_message", (msg: ChatMessage) => {
      if (msg.user !== userId) setChatHistory((p) => [...p, msg]);
    });
    return () => {
      ["connect","disconnect","room_joined","user_joined","user_left","note_update","chat_message"]
        .forEach((e) => socket.off(e));
    };
  }, [socket, userId]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("room");
    if (p) setRoomId(p);
  }, []);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const joinRoom = () => {
    if (!roomId.trim() || !socket || !isConnected) return;
    socket.emit("join_room", roomId.trim());
  };

  const leaveRoom = () => {
    if (!socket || !currentRoom) return;
    socket.emit("leave_room", currentRoom);
    setCurrentRoom("");
    setShowRoomInput(true);
    setConnectedUsers([]);
    setChatHistory([]);
    notify("Left room");
  };

  const handleNoteChange = (value: string) => {
    setNoteContent(value);
    if (socket && currentRoom) socket.emit("note_change", { roomId: currentRoom, content: value });
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(noteContent);
    notify("Code copied");
  };

  const shareRoomLink = async () => {
    const link = `${window.location.origin}/collab?room=${currentRoom}`;
    await navigator.clipboard.writeText(link);
    notify("Room link copied");
  };

  const sendChat = () => {
    if (!chatMessage.trim() || !socket || !currentRoom) return;
    const msg: ChatMessage = {
      id: Date.now(),
      user: userId,
      message: chatMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    socket.emit("chat_message", { roomId: currentRoom, message: msg });
    setChatHistory((p) => [...p, msg]);
    setChatMessage("");
  };

  const dim = darkMode;
  const border = dim ? "border-gray-800" : "border-border";
  const bg0 = dim ? "bg-gray-950" : "bg-surface-0";
  const bg1 = dim ? "bg-gray-900" : "bg-surface-1";
  const text = dim ? "text-gray-100" : "text-ink";
  const textMuted = dim ? "text-gray-400" : "text-ink-3";
  const btnGhost = dim ? "text-gray-300 hover:bg-gray-800" : "";
  const inputCls = dim ? "bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500" : "";

  // ── Room join screen ──────────────────────────────────────────────────────
  if (showRoomInput) {
    return (
      <div className={`min-h-screen ${dim ? "bg-gray-950" : "bg-surface-1"} flex items-center justify-center p-4`}>
        <div className={`w-full max-w-sm ${bg0} border ${border} rounded-md p-8 shadow`}>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Code2 className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-ink-4">Paster Collab</span>
            </div>
            <h1 className={`text-lg font-semibold ${text}`}>Join a room</h1>
            <p className={`text-xs ${textMuted} mt-0.5`}>
              Share a room ID with collaborators to edit together in real time.
            </p>
          </div>

          {/* Connection status */}
          <div className="flex items-center gap-2 mb-5">
            <span className={`status-dot ${isConnected ? "text-green-500" : "text-red-500"} ${isConnected ? "animate-pulse" : ""}`} />
            <span className={`text-xs ${textMuted}`}>
              {isConnected ? "Server connected" : "Connecting…"}
            </span>
            {!isConnected && <Loader2 className="w-3 h-3 animate-spin text-ink-4" />}
          </div>

          <div className="space-y-3">
            <div className="field">
              <label htmlFor="room-id">Room ID</label>
              <div className="relative">
                <Hash className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${textMuted}`} />
                <input
                  id="room-id"
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                  placeholder="my-room-123"
                  className={`input pl-8 ${inputCls}`}
                  autoFocus
                />
              </div>
            </div>

            <button
              onClick={joinRoom}
              disabled={!roomId.trim() || !isConnected}
              className="btn-primary w-full"
            >
              Join room
            </button>

            <button
              type="button"
              onClick={() => setRoomId(`room-${Date.now().toString(36)}`)}
              className={`text-xs ${dim ? "text-accent hover:text-accent-hover" : "text-accent hover:text-accent-hover"} transition-colors`}
            >
              Generate a random room ID
            </button>
          </div>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`fixed top-4 right-4 btn-ghost btn-icon ${btnGhost}`}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  // ── Editor screen ─────────────────────────────────────────────────────────
  return (
    <div className={`flex flex-col h-screen ${dim ? "bg-gray-950 text-gray-100" : "bg-surface-1 text-ink"}`}>
      {/* Toolbar */}
      <header className={`toolbar ${dim ? "bg-gray-900 border-gray-800" : ""}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`status-dot ${isConnected ? "text-green-500 animate-pulse" : "text-red-500"}`} />
            <span className="text-sm font-medium font-mono">{currentRoom}</span>
          </div>
          <span className={`text-xs ${textMuted}`}>
            {connectedUsers.length + 1} online
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`btn-ghost btn-sm text-xs ${isPreview ? (dim ? "bg-gray-800" : "bg-surface-2") : ""} ${btnGhost}`}
          >
            {isPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isPreview ? "Edit" : "Preview"}
          </button>

          <button onClick={copyCode} className={`btn-ghost btn-icon btn-sm ${btnGhost}`} title="Copy code">
            <Copy className="w-4 h-4" />
          </button>

          <button onClick={shareRoomLink} className={`btn-ghost btn-sm text-xs ${btnGhost}`} title="Share room link">
            <Link2 className="w-3.5 h-3.5" />
            Share room
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`btn-ghost btn-icon btn-sm ${showChat ? (dim ? "bg-gray-800" : "bg-surface-2") : ""} ${btnGhost}`}
            title="Toggle chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`btn-ghost btn-icon btn-sm ${btnGhost}`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={leaveRoom}
            className={`btn-ghost btn-sm text-xs text-danger ${dim ? "hover:bg-red-900/20" : "hover:bg-danger-subtle"}`}
          >
            <LogOut className="w-3.5 h-3.5" />
            Leave
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Editor */}
        <div className="flex-1 min-w-0 flex flex-col">
          {isPreview ? (
            <pre className={`flex-1 p-5 overflow-auto text-sm font-mono leading-relaxed ${dim ? "text-gray-300" : "text-ink-2"}`}>
              <code>{noteContent}</code>
            </pre>
          ) : (
            <textarea
              value={noteContent}
              onChange={(e) => handleNoteChange(e.target.value)}
              className={`flex-1 resize-none p-5 font-mono text-sm leading-relaxed outline-none ${dim ? "bg-gray-950 text-gray-100 placeholder:text-gray-600" : "bg-surface-0 text-ink placeholder:text-ink-4"}`}
              placeholder="Start typing…"
              spellCheck={false}
            />
          )}
        </div>

        {/* Sidebar: Users + Chat */}
        <aside className={`flex flex-col border-l ${border} ${showChat ? "w-72" : "w-48"} shrink-0 transition-all duration-150`}>
          {/* Users */}
          <div className={`p-4 border-b ${border} ${bg1}`}>
            <div className="flex items-center gap-2 mb-3">
              <Users className={`w-3.5 h-3.5 ${textMuted}`} />
              <span className={`text-xs font-semibold uppercase tracking-wider ${textMuted}`}>
                In room ({connectedUsers.length + 1})
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="status-dot text-green-500" />
                <span className={`text-xs font-medium ${text}`}>You</span>
              </div>
              {connectedUsers.map((uid, i) => (
                <div key={uid} className="flex items-center gap-2">
                  <span className="status-dot text-blue-400" />
                  <span className={`text-xs ${textMuted}`}>Collaborator {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          {showChat && (
            <div className="flex flex-col flex-1 min-h-0">
              <div className={`px-4 py-2.5 border-b ${border} ${bg1}`}>
                <span className={`text-xs font-semibold uppercase tracking-wider ${textMuted}`}>Chat</span>
              </div>
              <div ref={chatBodyRef} className={`flex-1 overflow-y-auto p-3 space-y-3 ${bg0}`}>
                {chatHistory.length === 0 && (
                  <p className={`text-xs ${textMuted} text-center py-4`}>No messages yet.</p>
                )}
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.user === userId ? "items-end" : "items-start"}`}>
                    <div className={`px-2.5 py-1.5 rounded text-xs max-w-[85%] ${msg.user === userId ? "bg-accent text-white" : dim ? "bg-gray-800 text-gray-200" : "bg-surface-2 text-ink"}`}>
                      {msg.message}
                    </div>
                    <span className={`text-2xs mt-1 ${textMuted}`}>{msg.timestamp}</span>
                  </div>
                ))}
              </div>
              <div className={`p-3 border-t ${border} ${bg1}`}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    placeholder="Message…"
                    className={`input-sm flex-1 ${inputCls}`}
                  />
                  <button onClick={sendChat} className="btn-primary btn-icon btn-sm">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded text-xs font-medium shadow-md ${dim ? "bg-gray-800 text-gray-100 border border-gray-700" : "bg-ink text-white"} fade-in`}>
          {notification}
        </div>
      )}
    </div>
  );
}
