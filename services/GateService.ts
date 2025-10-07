import { ApiService, ApiError } from './ApiService';

export interface GateStatus {
  status: string;
  message?: string;
  version?: string;
  timestamp?: string;
  auto_close_enabled?: boolean;
  auto_close_time?: number;
  auto_close_remaining?: number;
}

export interface GateOperation {
  status: 'opening' | 'closing';
  sensor_closed: boolean;
  sensor_open: boolean;
  operation_time: number;
  timeout_remaining: number;
  alert_active: boolean;
  auto_close_enabled: boolean;
}

export class GateService {
  /**
   * Vérifie le statut de l'API
   */
  static async getStatus(): Promise<GateStatus> {
    try {
      const response = await ApiService.get<GateStatus>('/gate/status');
      return response.data!;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la vérification du statut', 0);
    }
  }

  /**
   * Ouvre la porte du garage
   */
  static async open(): Promise<GateOperation> {
    try {
      const response = await ApiService.get<GateOperation>('/gate/open');
      return response.data!;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de l\'ouverture de la porte', 0);
    }
  }

  /**
   * Ferme la porte du garage
   */
  static async close(): Promise<GateOperation> {
    try {
      const response = await ApiService.get<GateOperation>('/gate/close');
      return response.data!;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la fermeture de la porte', 0);
    }
  }

  /**
   * Vérifie si l'API est accessible et les credentials sont valides
   */
  static async isApiHealthy(): Promise<boolean> {
    try {
      const status = await this.getStatus();
      // L'API est considérée comme saine si elle répond avec un statut valide
      return ['open', 'closed', 'unknown', 'opening', 'closing'].includes(status.status);
    } catch (error) {
      return false;
    }
  }
}
