import { Injectable } from '@angular/core';

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        err => reject(new Error(err.message)),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    });
  }
}
