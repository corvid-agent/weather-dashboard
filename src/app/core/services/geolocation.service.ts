import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

interface IpApiResponse {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country_name: string;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  private readonly http = inject(HttpClient);

  /** Try browser GPS first, fall back to IP-based geolocation */
  async getCurrentPosition(): Promise<GeolocationPosition> {
    try {
      return await this.getBrowserPosition();
    } catch {
      return this.getIpPosition();
    }
  }

  /** Browser geolocation only — throws if denied or unavailable */
  getBrowserPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        err => reject(new Error(err.message)),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
      );
    });
  }

  /** IP-based approximate geolocation — no permission needed */
  async getIpPosition(): Promise<GeolocationPosition> {
    const res = await firstValueFrom(
      this.http.get<IpApiResponse>('https://ipapi.co/json/')
    );
    if (res?.latitude && res?.longitude) {
      return { latitude: res.latitude, longitude: res.longitude };
    }
    throw new Error('Could not determine location from IP');
  }
}
