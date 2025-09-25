import axios from 'axios';
import { APIResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000';

export const apiService = {
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
    }
};
