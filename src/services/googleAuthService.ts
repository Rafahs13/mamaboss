import { jwtDecode } from 'jwt-decode';
import { GoogleUser, User } from '../types';
import { CredentialResponse } from '@react-oauth/google';
import { storage, STORAGE_KEYS } from '../utils/storage';

export class GoogleAuthService {
  /**
   * Decodifica o token JWT do Google e extrai as informações do usuário
   */
  static decodeGoogleToken(credential: string): GoogleUser {
    try {
      const decoded = jwtDecode<GoogleUser>(credential);
      return decoded;
    } catch (error) {
      throw new Error('Token do Google inválido');
    }
  }

  /**
   * Processa a resposta de credenciais do Google
   */
  static processGoogleResponse(response: CredentialResponse): GoogleUser {
    if (!response.credential) {
      throw new Error('Credencial do Google não fornecida');
    }

    return this.decodeGoogleToken(response.credential);
  }

  /**
   * Converte um usuário do Google para o formato do sistema
   */
  static convertGoogleUserToUser(googleUser: GoogleUser): User {
    return {
      id: googleUser.id,
      name: googleUser.name,
      email: googleUser.email,
      avatar: googleUser.picture,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Verifica se um usuário já existe no sistema pelo email
   */
  static async checkUserExists(email: string): Promise<User | null> {
    try {
      // Em um sistema real, isso seria uma chamada para a API
      // Por enquanto, vamos simular verificando o localStorage
      const existingUser = storage.get<User>(STORAGE_KEYS.USER);
      
      if (existingUser && existingUser.email === email) {
        return existingUser;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao verificar usuário existente:', error);
      return null;
    }
  }

  /**
   * Cria um novo usuário no sistema
   */
  static async createUser(googleUser: GoogleUser): Promise<User> {
    try {
      // Em um sistema real, isso seria uma chamada para a API
      const newUser = this.convertGoogleUserToUser(googleUser);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newUser;
    } catch (error) {
      throw new Error('Erro ao criar usuário');
    }
  }

  /**
   * Atualiza um usuário existente com informações do Google
   */
  static async updateUser(user: User, googleUser: GoogleUser): Promise<User> {
    try {
      const updatedUser: User = {
        ...user,
        name: googleUser.name,
        avatar: googleUser.picture,
        updatedAt: new Date(),
      };
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return updatedUser;
    } catch (error) {
      throw new Error('Erro ao atualizar usuário');
    }
  }

  /**
   * Processa o login completo do Google
   */
  static async handleGoogleLogin(credential: string): Promise<User> {
    try {
      // Decodificar o token do Google
      const googleUser = this.decodeGoogleToken(credential);
      
      // Verificar se o usuário já existe
      const existingUser = await this.checkUserExists(googleUser.email);
      
      let user: User;
      
      if (existingUser) {
        // Atualizar usuário existente
        user = await this.updateUser(existingUser, googleUser);
      } else {
        // Criar novo usuário
        user = await this.createUser(googleUser);
      }
      
      return user;
    } catch (error) {
      throw new Error(`Erro no login do Google: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Valida se o token do Google ainda é válido
   */
  static isTokenValid(credential: string): boolean {
    try {
      const decoded = jwtDecode<{ exp: number }>(credential);
      const currentTime = Math.floor(Date.now() / 1000);
      
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extrai informações úteis do token do Google
   */
  static getTokenInfo(credential: string): {
    email: string;
    name: string;
    picture: string;
    expiresAt: Date;
  } {
    try {
      const decoded = jwtDecode<GoogleUser & { exp: number }>(credential);
      
      return {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        expiresAt: new Date(decoded.exp * 1000),
      };
    } catch (error) {
      throw new Error('Token do Google inválido');
    }
  }
} 