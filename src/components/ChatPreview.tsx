import React, {  } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { 
Brain, 
  Send} from "lucide-react";

import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from '../constants/brand';



const ChatPreview = () => {
  const { t } = useTranslation();
  const messages = [
    { role: "user", text: t('chatbot.preview.msg1_user') },
    { role: "assistant", text: t('chatbot.preview.msg1_bot') },
    { role: "user", text: t('chatbot.preview.msg2_user') },
    { role: "assistant", text: t('chatbot.preview.msg2_bot') }
  ];

  return (
    <div className="relative glass p-6 md:p-8 rounded-[2.5rem] border border-white/10 nebula-shadow overflow-hidden h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
            <Brain size={20} className="text-primary-container" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">Gabi</div>
            <div className="text-[10px] text-green-500 uppercase tracking-widest font-bold flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
              online
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.5 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
              msg.role === "user" 
                ? "bg-primary-container text-on-primary rounded-tr-none" 
                : "bg-white/5 text-white border border-white/10 rounded-tl-none"
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="bg-white/5 rounded-full px-4 py-3 flex items-center justify-between border border-white/10">
          <span className="text-on-surface-variant/40 text-xs">{t('chatbot.placeholder')}</span>
          <Send size={16} className="text-primary-container" />
        </div>
      </div>
    </div>
  );
};


export default ChatPreview;
