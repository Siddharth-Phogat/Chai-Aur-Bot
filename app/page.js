"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { PERSONAS } from "@/app/data/personas"; // import personas
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function DualPersonaChat() {
  const [persona, setPersona] = useState("hitesh_choudhary");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollerRef = useRef(null);

  const current = PERSONAS[persona] || Object.values(PERSONAS)[1];
  const placeholder = useMemo(() => `Chat with ${current.name}...`, [current.name]);

  useEffect(() => {  //Adding time in the messages
    const now = new Date();
    const t = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages([
      { id: crypto.randomUUID(), who: "bot", text: current.greet, at: t }
    ]);
  }, [persona]);

  useEffect(() => {   //Automatically scroll to bottom of messages
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length]);

  const send = async () => {   //Sending user message
    const trimmed = input.trim();
    if (!trimmed) return;
    const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const yourMsg = { id: crypto.randomUUID(), who: "you", text: trimmed, at: t };
    setMessages((m) => [...m, yourMsg]);
    setInput("");

    try {
      const res = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed, personaIds: [persona], temperature: 0.7 }),
      });      
      const data = await res.json();
      const botMsg = { id: crypto.randomUUID(), who: "bot", text: data.text, at: t };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { id: crypto.randomUUID(), who: "bot", text: "⚠️ Sorry, I couldn't fetch a response.", at: t }]);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") { e.preventDefault(); send(); } };

  // To render avatar
  const renderAvatar = (avatar) => {
  if (typeof avatar === 'string' && avatar.startsWith('http')) {
    return <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />;
  }
  // Otherwise string content
  return avatar;
};

  return (
    <div className="min-h-screen w-full bg-[#0B0B10] text-white grid place-items-center py-10 px-6">
      <main className="w-full max-w-[1040px]">
        <div className="flex items-center justify-center gap-5">
          <h1 className="text-5xl font-extrabold text-center tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mt-5">
          Chai Aur Bot
          </h1>
          <img
            src="/americano.png"
            alt="Description of my image"
            width={100}
            height={50}
          />
        </div>
        <p className="text-2xl text-center text-slate-300 mt-2">
          {"Engage with Hitesh's friendly tech guidance or Piyush's high-energy coding insights"}
        </p>

        {/* Heading - Persona Selection */}
        <div className="mt-8 flex items-center justify-center gap-6">
          {Object.values(PERSONAS).map((p) => {
            const active = p.id === persona;
            return (
              <button key={p.id} onClick={() => setPersona(p.id)}
                className={`group flex items-center gap-3 h-24 rounded-2xl px-5 py-3 transition ${active ? p.id == "hitesh_choudhary" ? "bg-violet-700/70 shadow-[0_0_0_1px_rgba(139,92,246,.6)]" : "bg-indigo-700/70 shadow-[0_0_0_1px_rgba(99,102,241,.6)]" : "bg-slate-800/70 hover:bg-slate-700/70"}`}>
                <span className={`grid h-14 w-14 place-items-center rounded-full text-xl shadow-inner overflow-hidden ${active ? "bg-violet-500/70" : "bg-slate-600/70"}`}>
                  {renderAvatar(p.avatar)}
                </span>
                <div className="text-left">
                  <div className="text-xl font-semibold leading-5">{p.name}</div>
                  <div className="text-lg text-slate-300 mt-0.5">{p.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Message area */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-black/40">
          <div ref={scrollerRef} className="h-[520px] overflow-y-auto px-5 sm:px-8 pt-6 pb-28 space-y-6" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
            {messages.map((m) => <Message key={m.id} m={m} current={current} renderAvatar={renderAvatar} />)}
          </div>

          <div className="sticky bottom-0 w-full px-4 sm:px-6 pb-5">
            <div className="mx-auto flex max-w-[980px] items-center gap-3 rounded-2xl bg-[#14121A] px-4 py-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} placeholder={placeholder} className="flex-1 bg-transparent outline-none placeholder:text-slate-400" />
              <button onClick={send} className={`grid h-12 w-12 place-items-center rounded-2xl ${current.id == "hitesh_choudhary" ? "bg-violet-700 hover:bg-violet-600" : "bg-indigo-700 hover:bg-indigo-600"} active:scale-95 transition`} aria-label="Send">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Messages
function Message({ m, current, renderAvatar }) {
  const isYou = m.who === "you";

  return (
    <div className={`flex ${isYou ? "justify-end" : "justify-start"}`}>
      {!isYou && (
        <div className="mr-3 mt-1">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-violet-500/30 text-xl overflow-hidden">
            {renderAvatar(current.avatar)}
          </div>
        </div>
      )}
      <div className={`max-w-[720px] ${isYou ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`${
            isYou
              ? current.id === "hitesh_choudhary"
                ? "bg-violet-700 text-white"
                : "bg-indigo-700 text-white"
              : `${current.style?.bubble || "bg-[#111827] text-slate-200"}`
          } rounded-2xl px-5 py-4 shadow-sm`}
        >
          <ReactMarkdown
            children={m.text}
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match?.[1] || "text"}
                    PreTag="div"
                    {...props}
                    className="rounded-lg mb-2"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className="bg-slate-700 px-1 rounded"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>
        <div className={`mt-1 text-lg ${isYou ? "text-violet-300" : "text-slate-400"}`}>{m.at}</div>
      </div>
      {isYou && <div className="ml-3 w-10" />}
    </div>
  );
}
