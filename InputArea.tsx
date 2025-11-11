[1mdiff --git a/package.json b/package.json[m
[1mindex 8d020c9..6affa43 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -20,7 +20,7 @@[m
     "web-vitals": "^5.1.0"[m
   },[m
   "scripts": {[m
[31m-    "start": "react-scripts start",[m
[32m+[m[32m    "start": "PORT=8080 react-scripts start",[m
     "build": "react-scripts build",[m
     "test": "react-scripts test",[m
     "eject": "react-scripts eject"[m
[1mdiff --git a/src/components/InputArea.tsx b/src/components/InputArea.tsx[m
[1mindex d91142a..0eb8307 100644[m
[1m--- a/src/components/InputArea.tsx[m
[1m+++ b/src/components/InputArea.tsx[m
[36m@@ -2,13 +2,13 @@[m [mimport React, { useEffect, useRef, useState } from 'react';[m
 import { Send } from 'lucide-react';[m
 [m
 interface InputAreaProps {[m
[31m-  onSendMessage?: (message: string) => void;[m
[31m-  onCreateChat?: (title?: string, initialMessage?: string) => string;[m
[32m+[m[32m  onSendMessage?: (text: string) => void | Promise<void>;[m
[32m+[m[32m  onCreateChat?: (title?: string, initialMessage?: string) => string | Promise<string>;[m
   isLoading?: boolean;[m
   placeholder?: string;[m
   value?: string;[m
   onChange?: (value: string) => void;[m
[31m-  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;[m
[32m+[m[32m  inputRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;[m
 }[m
 [m
 export const InputArea: React.FC<InputAreaProps> = ({[m
[36m@@ -41,19 +41,19 @@[m [mexport const InputArea: React.FC<InputAreaProps> = ({[m
     setInternalValue(v);[m
   };[m
 [m
[31m-  const handleSubmit = (e: React.FormEvent) => {[m
[32m+[m[32m  const handleSubmit = async (e: React.FormEvent) => {[m
     e.preventDefault();[m
     const trimmed = (controlledValue ?? internalValue).trim();[m
     if (!trimmed) return;[m
 [m
     if (onCreateChat && !onSendMessage) {[m
[31m-      onCreateChat(undefined, trimmed);[m
[32m+[m[32m      await onCreateChat(undefined, trimmed);[m
       setValue('');[m
       return;[m
     }[m
 [m
     if (onSendMessage && !isLoading) {[m
[31m-      onSendMessage(trimmed);[m
[32m+[m[32m      await onSendMessage(trimmed);[m
       setValue('');[m
       const el = textareaRef.current as HTMLTextAreaElement | null;[m
       if (el && el.tagName === 'TEXTAREA') el.style.height = 'auto';[m
[36m@@ -73,7 +73,7 @@[m [mexport const InputArea: React.FC<InputAreaProps> = ({[m
   const combinedRef = (el: HTMLTextAreaElement | HTMLInputElement | null) => {[m
     textareaRef.current = el;[m
     if (inputRef) {[m
[31m-      (inputRef as React.RefObject<any>).current = el;[m
[32m+[m[32m      (inputRef as React.MutableRefObject<any>).current = el;[m
     }[m
   };[m
 [m
[1mdiff --git a/src/components/WelcomePanel.tsx b/src/components/WelcomePanel.tsx[m
[1mindex 54395f3..f933405 100644[m
[1m--- a/src/components/WelcomePanel.tsx[m
[1m+++ b/src/components/WelcomePanel.tsx[m
[36m@@ -3,7 +3,7 @@[m [mimport { InputArea } from './InputArea';[m
 import './ChatArea.css';[m
 [m
 interface WelcomePanelProps {[m
[31m-  onCreateChat?: (title?: string, initialMessage?: string) => string;[m
[32m+[m[32m  onCreateChat?: (title?: string, initialMessage?: string) => string | Promise<string>;[m
   onSendMessage?: (message: string) => void;[m
   isLoading?: boolean;[m
 }[m
[36m@@ -25,11 +25,11 @@[m [mexport const WelcomePanel: React.FC<WelcomePanelProps> = ({[m
   );[m
 [m
   const [currentText, setCurrentText] = useState('');[m
[31m-  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);[m
[32m+[m[32m  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);[m
 [m
   const isCustom = currentText !== '' && !examples.includes(currentText);[m
 [m
[31m-  const handleExampleClick = (ex: string) => {[m
[32m+[m[32m  const handleExampleClick = async (ex: string) => {[m
     if (isCustom) return;[m
     if (currentText === ex) {[m
       inputRef.current?.focus();[m
[1mdiff --git a/src/hooks/useChat.ts b/src/hooks/useChat.ts[m
[1mindex c1cb8b1..94983fb 100644[m
[1m--- a/src/hooks/useChat.ts[m
[1m+++ b/src/hooks/useChat.ts[m
[36m@@ -47,41 +47,67 @@[m [mexport const useChat = () => {[m
       (async () => {[m
         setIsLoading(true);[m
 [m
[31m-        // chama LLM e RAG em paralelo[m
[31m-        const [llmResult, ragResult] = await Promise.allSettled([[m
[31m-          apiService.queryLLM(buildRequest(initialMessage)),[m
[31m-          apiService.queryRAG(buildRequest(initialMessage)),[m
[31m-        ]);[m
[31m-[m
[31m-        const llmMessage: Message = {[m
[31m-          id: generateId(),[m
[31m-          content: llmResult.status === 'fulfilled' ? llmResult.value : 'Erro ao obter resposta da LLM',[m
[31m-          isUser: false,[m
[31m-          timestamp: new Date(),[m
[31m-          createdAt: new Date().toISOString(),[m
[31m-          role: 'assistant',[m
[31m-          source: 'llm',[m
[31m-        };[m
[31m-[m
[31m-        const ragMessage: Message = {[m
[31m-          id: generateId(),[m
[31m-          content: ragResult.status === 'fulfilled' ? ragResult.value : 'Erro ao obter resposta do RAG',[m
[31m-          isUser: false,[m
[31m-          timestamp: new Date(),[m
[31m-          createdAt: new Date().toISOString(),[m
[31m-          role: 'assistant',[m
[31m-          source: 'rag',[m
[31m-        };[m
[31m-[m
[31m-        setChats(prev =>[m
[31m-          prev.map(chat =>[m
[31m-            chat.id === newChat.id[m
[31m-              ? { ...chat, messages: [userMessage, llmMessage, ragMessage], updatedAt: new Date() }[m
[31m-              : chat[m
[31m-          )[m
[31m-        );[m
[31m-[m
[31m-        setIsLoading(false);[m
[32m+[m[32m        try {[m
[32m+[m[32m          // chama LLM e RAG em paralelo[m
[32m+[m[32m          const [llmResult, ragResult] = await Promise.allSettled([[m
[32m+[m[32m            apiService.queryLLM(buildRequest(initialMessage)),[m
[32m+[m[32m            apiService.queryRAG(buildRequest(initialMessage)),[m
[32m+[m[32m          ]);[m
[32m+[m
[32m+[m[32m          const llmMessage: Message = {[m
[32m+[m[32m            id: generateId(),[m
[32m+[m[32m            content: llmResult.status === 'fulfilled'[m[41m [m
[32m+[m[32m              ? llmResult.value[m[41m [m
[32m+[m[32m              : `Erro ao obter resposta da LLM: ${llmResult.reason?.message || 'Erro desconhecido'}`,[m
[32m+[m[32m            isUser: false,[m
[32m+[m[32m            timestamp: new Date(),[m
[32m+[m[32m            createdAt: new Date().toISOString(),[m
[32m+[m[32m            role: 'assistant',[m
[32m+[m[32m            source: 'llm',[m
[32m+[m[32m          };[m
[32m+[m
[32m+[m[32m          const ragMessage: Message = {[m
[32m+[m[32m            id: generateId(),[m
[32m+[m[32m            content: ragResult.status === 'fulfilled'[m[41m [m
[32m+[m[32m              ? ragResult.value[m[41m [m
[32m+[m[32m              : `Erro ao obter resposta da RAG: ${ragResult.reason?.message || 'Erro desconhecido'}`,[m
[32m+[m[32m            isUser: false,[m
[32m+[m[32m            timestamp: new Date(),[m
[32m+[m[32m            createdAt: new Date().toISOString(),[m
[32m+[m[32m            role: 'assistant',[m
[32m+[m[32m            source: 'rag',[m
[32m+[m[32m          };[m
[32m+[m
[32m+[m[32m          setChats(prev =>[m
[32m+[m[32m            prev.map(chat =>[m
[32m+[m[32m              chat.id === newChat.id[m
[32m+[m[32m                ? { ...chat, messages: [userMessage, llmMessage, ragMessage], updatedAt: new Date() }[m
[32m+[m[32m                : chat[m
[32m+[m[32m            )[m
[32m+[m[32m          );[m
[32m+[m[32m        } catch (error) {[m
[32m+[m[32m          console.error('Error in createNewChat:', error);[m
[32m+[m[41m          [m
[32m+[m[32m          const errorMessage: Message = {[m
[32m+[m[32m            id: generateId(),[m
[32m+[m[32m