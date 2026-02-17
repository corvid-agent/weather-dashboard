import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pressure', standalone: true })
export class PressurePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '--';
    return Math.round(value) + ' hPa';
  }
}
