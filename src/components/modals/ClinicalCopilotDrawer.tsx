import React, { useState } from 'react';
import { PatientInfo, LabAnalyte } from '../../types';
import { askClinicalCopilot } from '../../services/api';

interface ClinicalCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientInfo;
  analytes: LabAnalyte[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const ClinicalCopilotDrawer: React.FC<ClinicalCopilotDrawerProps> = ({
  isOpen,
  onClose,
  patient,
  analytes
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello Doctor, I'm your MedLens Clinical Copilot powered by Gemini 3.8 Flash. I have synchronized patient **${patient.name || patient.pid}** (${patient.pid} • ${patient.age}y ${patient.sex}) with **${analytes.length} lab parameters** (including ${analytes.filter((a) => a.status !== 'normal').length} abnormal). What would you like to investigate?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Explain elevated MPV with normal platelets',
    'Check Lisinopril interaction with lab findings',
    'Evaluate allergy contraindications (Penicillin)',
    'Draft a clinical SOAP note for this intake',
    'What follow-up workup is recommended?'
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await askClinicalCopilot(text, patient, analytes, history);

      const aiMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error connecting to clinical reasoning model: ${err.message || 'Network error'}. Please verify server connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-md h-full flex flex-col shadow-2xl border-l border-[#e2e8f0] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#003c90] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-[#0b1c30]">MedLens Clinical Copilot</h3>
                <span className="px-1.5 py-0.2 rounded bg-[#0f52ba] text-white text-[9px] font-mono font-bold">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-[#434653] truncate">
                Grounding on {patient.name || patient.pid} ({patient.pid}) • {analytes.length} Analytes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/60 text-[#434653] flex items-center justify-center transition-colors"
            aria-label="Close copilot"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Patient Context Tag Strip */}
        <div className="bg-white px-4 py-2 border-b border-[#f1f5f9] flex items-center justify-between text-xs">
          <span className="text-[#434653]">
            Rx: <strong className="text-[#0b1c30]">{patient.prescriptions.split(',')[0]}</strong>
          </span>
          <span className="font-mono text-[10px] text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded font-bold">
            ALLERGY: PENICILLIN
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#f8f9ff]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                  m.role === 'user'
                    ? 'bg-[#0f52ba] text-white rounded-tr-none'
                    : 'bg-white border border-[#e2e8f0] text-[#0b1c30] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
              <span className="text-[9px] text-[#737784] font-mono mt-1 px-1">
                {m.role === 'assistant' ? 'MedLens AI • ' : 'You • '}
                {m.timestamp}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 bg-white border border-[#dce9ff] rounded-2xl rounded-tl-none max-w-[75%] shadow-xs">
              <span className="material-symbols-outlined text-[#003c90] text-[18px] animate-spin">
                progress_activity
              </span>
              <span className="text-xs text-[#434653] font-medium animate-pulse">
                Gemini 3.8 Flash synthesizing response...
              </span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-[#e2e8f0] overflow-x-auto whitespace-nowrap space-x-1.5 scrollbar-thin">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="inline-block text-[11px] font-medium bg-[#eff4ff] hover:bg-[#dce9ff] text-[#003c90] px-2.5 py-1 rounded-full border border-[#dce9ff] transition-colors active:scale-95 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-[#e2e8f0] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about labs, differentials, or safety..."
            className="flex-1 h-10 px-3 text-xs bg-[#f8f9ff] border border-[#cbd5e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f52ba]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="h-10 px-4 bg-[#0f52ba] hover:bg-[#003c90] disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
