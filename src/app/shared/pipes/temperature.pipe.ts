import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'temperature', standalone: true })
export class TemperaturePipe implements PipeTransform {
  transform(value: number | null | undefined, symbol = '°'): string {
    if (value == null) return '--';
    return Math.round(value) + symbol;
  }
}
