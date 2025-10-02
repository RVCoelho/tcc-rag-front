import axios from 'axios';
// import { APIResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000';

const stripTrailingCitations = (text: string) => {
  if (!text) return text;

  // Remove espaço + números entre colchetes antes da pontuação final (ou no fim da string)
  // Exemplos:
  // "texto [1] [2]." -> "texto."
  // "texto [1] [2]" -> "texto"
  // "texto [3] no meio [1] [2]." -> "texto [3] no meio."
  return text.replace(/\s+(\[\d+\]\s*)+([.!?]?)$/, '$2').trim();
};

const parseAnswer = (data: any): string => {
  if (!data) return '';
  if (typeof data === 'string') return stripTrailingCitations(data);
  const raw = data.answer ?? data.rag_answer ?? data.answer_text ?? JSON.stringify(data);
  return stripTrailingCitations(raw);
};

export const apiService = {
  async queryRAG(question: string): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/rag`, {
        question,
      });
      return parseAnswer(response.data);
    } catch (error) {
      console.error('Error querying RAG:', error);
      throw new Error('Falha ao consultar o sistema RAG');
    }
  },

  async queryLLM(question: string): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/llm`, {
        question,
      });
      return parseAnswer(response.data);
    } catch (error) {
      console.error('Error querying LLM:', error);
      throw new Error('Falha ao consultar o modelo de linguagem');
    }
  },

  async evaluateQuestion(question: string): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/evaluate`, {
        question,
      });
      return response.data;
    } catch (error) {
      console.error('Error evaluating question:', error);
      throw new Error('Falha ao avaliar a pergunta');
    }
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  /*
  async queryRAG(question: string): Promise<string> {
    try {
      const response = await axios.post<APIResponse>(`${API_BASE_URL}/query`, {
        question,
      });
      return response.data.answer;
    } catch (error) {
      console.error('Error querying RAG:', error);
      throw new Error('Falha ao consultar o sistema RAG');
    }
  },

  async queryLLM(question: string): Promise<string> {
    try {
      const response = await axios.post<APIResponse>(`${API_BASE_URL}/query_llm`, {
        question,
      });
      return response.data.answer;
    } catch (error) {
      console.error('Error querying LLM:', error);
      throw new Error('Falha ao consultar o modelo de linguagem');
    }
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
  */
};
