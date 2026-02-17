import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts a Celsius temperature value to the requested display unit.
 * API always returns Celsius — this pipe handles conversion.
 *
 * Usage: {{ value | temperature:'°C' }} or {{ value | temperature:'°F' }}
 */
@Pipe({ name: 'temperature', standalone: true })
export class TemperaturePipe implements PipeTransform {
  transform(value: number | null | undefined, symbol = '°C'): string {
    if (value == null) return '--';
    const converted = symbol === '°F' ? value * 9 / 5 + 32 : value;
    return Math.round(converted) + symbol;
  }
}
