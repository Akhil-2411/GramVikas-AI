"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  BotMessageSquare,
  Send,
  User,
  Sparkles,
  MapPin,
  Building2,
  HelpCircle,
  RotateCcw
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { sendChatMessage } from "@/lib/api";

interface Message {
  sender: "user" | "bot";
  text: string;
  time: string;
}

export default function AIChatPage() {
  const { district, village, businessCategory } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: `Hello! I am **GramVikas AI**, your dedicated rural business advisor under the Ministry of Social Justice and Empowerment (MoSJE).\n\nI have loaded market intelligence for **${district}** (${village || "District Habitations"}). Ask me anything about viable businesses, 90% loan eligibility, SWOT factors, or government subsidies!`,
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    `What are the best business opportunities in ${district}?`,
    "Calculate my EMI for ₹1,00,000 margin capital",
    "How does the MoSJE 90% loan scheme work?",
    "Explain SWOT analysis for a dairy chilling unit",
    "What documents do I need to apply for PMEGP subsidy?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage({
        query: textToSend,
        district,
        village,
        category: businessCategory,
      });

      const botMsg: Message = {
        sender: "bot",
        text: res.answer || "I am analyzing the MSME records for your region...",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Under MoSJE lending rules for **${district}**, an entrepreneur contributing ₹1,00,000 margin capital unlocks a **₹10,00,000 total project cost** with **₹9,00,000 loan coverage** under the Term Loan Scheme at 8.0% interest for 7 years with 6 months grace period.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-slate-900">GramVikas AI Assistant</h2>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Gemini Powered
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" /> Context: <b>{district}</b> {village ? `• ${village}` : ""}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                sender: "bot",
                text: `Conversation restarted. Ready to advise on MSME opportunities in **${district}**!`,
                time: "Just now",
              },
            ])
          }
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition"
          title="Restart Conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === "user"
                  ? "bg-emerald-700 text-white"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-600/20"
                  : "bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line"
              }`}
            >
              {msg.text}
              <div
                className={`text-[9px] mt-1.5 text-right ${
                  msg.sender === "user" ? "text-emerald-100" : "text-slate-400"
                }`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold border border-emerald-200 shrink-0">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs text-slate-500 rounded-tl-none">
              Consulting rural MSME intelligence engine...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Prompts */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Quick Prompts:
          </span>
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] font-medium bg-white text-slate-700 border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 px-3 py-1 rounded-full transition shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about business feasibility or loans in ${district}...`}
          className="flex-1 px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-slate-50 focus:bg-white transition"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-md shadow-emerald-600/20 transition shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
