import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts a km/h wind speed value to the requested display unit.
 * API always returns km/h — this pipe handles conversion.
 *
 * Usage: {{ value | windSpeed:'km/h' }} or {{ value | windSpeed:'mph' }}
 */
@Pipe({ name: 'windSpeed', standalone: true })
export class WindSpeedPipe implements PipeTransform {
  transform(value: number | null | undefined, unit = 'km/h'): string {
    if (value == null) return '--';
    let converted: number;
    switch (unit) {
      case 'mph': converted = value * 0.621371; break;
      case 'm/s': converted = value / 3.6; break;
      case 'kn':  converted = value * 0.539957; break;
      default:    converted = value; break; // km/h
    }
    return Math.round(converted) + ' ' + unit;
  }
}
