'use client';

import { jwtDecode } from 'jwt-decode';

import type { User } from '@/types/user';

function decodeJwt<T = any>(token: string): T | null {
  try {
    return jwtDecode<T>(token);
  } catch (err) {
    console.error('[decodeJwt] Failed to decode token:', err);
    return null;
  }
}

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  senha: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  private baseUrl = process.env.NEXT_PUBLIC_AUTH_SERVER_URL;

  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, senha } = params;

    try {
      const res = await fetch(`${this.baseUrl}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: 'Erro desconhecido.' }));
        return { error: message || 'Falha ao autenticar.' };
      }

      const response = await res.json();
      const token = response.token?.token;

      localStorage.setItem('custom-auth-token', token);

      return {};
    } catch (err) {
      console.error('[authClient] Erro no login:', err);
      return { error: 'Erro de conexão com o servidor.' };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async updateUser(data: { novoNome?: string; novaSenha?: string }): Promise<{ error?: string }> {
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { error: 'Token não encontrado.' };
    }

    try {
      const response = await fetch(`${this.baseUrl}usuarios/atualizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Erro ao atualizar.' };
      }

      const { token: newToken } = await response.json();

      if (newToken?.token) {
        localStorage.setItem('custom-auth-token', newToken.token);
      }

      return {};
    } catch (err) {
      console.error('[authClient] Erro ao atualizar usuário:', err);
      return { error: 'Erro de conexão com o servidor.' };
    }
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    const payload = decodeJwt(token);

    if (!payload) {
      return { data: null, error: 'Token inválido' };
    }

    const user: User = {
      id: `USR-${payload.id}`,
      email: payload.email,
      firstName: payload.nome,
      avatar: '/assets/avatar.png',
      isAdmin: payload.is_adm,
      isViewer: payload.is_viewer,
    };

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
