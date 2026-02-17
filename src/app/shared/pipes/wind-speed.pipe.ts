import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'windSpeed', standalone: true })
export class WindSpeedPipe implements PipeTransform {
  transform(value: number | null | undefined, unit = 'km/h'): string {
    if (value == null) return '--';
    return Math.round(value) + ' ' + unit;
  }
}
