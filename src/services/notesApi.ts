import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/Note';

// Replace this URL with your mockapi.io endpoint (e.g., https://[your-project-id].mockapi.io)
const API_BASE_URL = 'https://68502cc5e7c42cfd1797b6f9.mockapi.io/notes';

class NotesApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getAllNotes(): Promise<Note[]> {
    return this.request<Note[]>('/notes');
  }

  async searchNotes(query: string): Promise<Note[]> {
    return this.request<Note[]>(`/notes?search=${encodeURIComponent(query)}`);
  }

  async createNote(note: CreateNoteRequest): Promise<Note> {
    return this.request<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  async updateNote(id: number, note: UpdateNoteRequest): Promise<Note> {
    return this.request<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
  }

  async deleteNote(id: number): Promise<void> {
    await this.request(`/notes/${id}`, {
      method: 'DELETE',
    });
  }
}

export const notesApi = new NotesApiService();