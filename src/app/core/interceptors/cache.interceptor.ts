import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

interface CacheEntry {
  response: HttpResponse<unknown>;
  expiry: number;
}

const cache = new Map<string, CacheEntry>();

const TTL_WEATHER = 10 * 60 * 1000;
const TTL_GEOCODING = 30 * 60 * 1000;

function getTtl(url: string): number {
  if (url.includes('geocoding-api.open-meteo.com')) return TTL_GEOCODING;
  if (url.includes('open-meteo.com')) return TTL_WEATHER;
  return 0;
}

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') return next(req);

  const ttl = getTtl(req.urlWithParams);
  if (ttl === 0) return next(req);

  const key = req.urlWithParams;
  const cached = cache.get(key);

  if (cached && cached.expiry > Date.now()) {
    return of(cached.response.clone());
  }

  cache.delete(key);

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(key, { response: event.clone(), expiry: Date.now() + ttl });
      }
    })
  );
};
