import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

interface InputAreaProps {
  onSendMessage?: (message: string) => void;
  onCreateChat?: (title?: string, initialMessage?: string) => string;
  isLoading?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export const InputArea: React.FC<InputAreaProps> = ({
  onSendMessage,
  onCreateChat,
  isLoading = false,
  placeholder,
  value: controlledValue,
  onChange,
  inputRef,
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue ?? '');
  const textareaRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  // sincroniza controlled -> internal
  useEffect(() => {
    if (typeof controlledValue === 'undefined') return;
    setInternalValue(controlledValue);
  }, [controlledValue]);

  useEffect(() => {
    const el = textareaRef.current as HTMLTextAreaElement | null;
    if (!el || el.tagName !== 'TEXTAREA') return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [internalValue]);

  const setValue = (v: string) => {
    if (onChange) onChange(v);
    setInternalValue(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = (controlledValue ?? internalValue).trim();
    if (!trimmed) return;

    if (onCreateChat && !onSendMessage) {
      onCreateChat(undefined, trimmed);
      setValue('');
      return;
    }

    if (onSendMessage && !isLoading) {
      onSendMessage(trimmed);
      setValue('');
      const el = textareaRef.current as HTMLTextAreaElement | null;
      if (el && el.tagName === 'TEXTAREA') el.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (onSendMessage || onCreateChat) {
        e.preventDefault();
        const form = (e.target as HTMLElement).closest('form') as HTMLFormElement | null;
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }
  };

  const combinedRef = (el: HTMLTextAreaElement | HTMLInputElement | null) => {
    textareaRef.current = el;
    if (inputRef) {
      (inputRef as React.RefObject<any>).current = el;
    }
  };

  if (onCreateChat && !onSendMessage) {
    return (
      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <input
              ref={combinedRef}
              type="text"
              value={controlledValue ?? internalValue}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder ?? 'Digite o título do novo chat...'}
              className="message-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!((controlledValue ?? internalValue).trim()) || isLoading}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="input-container">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-wrapper">
          <textarea
            ref={combinedRef}
            value={controlledValue ?? internalValue}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? 'Digite sua mensagem...'}
            className="message-input"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!((controlledValue ?? internalValue).trim()) || isLoading}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};