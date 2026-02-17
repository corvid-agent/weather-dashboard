import { Pipe, PipeTransform } from '@angular/core';
import { degreesToCompass } from '../../core/utils/wind.utils';

@Pipe({ name: 'windDirection', standalone: true })
export class WindDirectionPipe implements PipeTransform {
  transform(degrees: number | null | undefined): string {
    if (degrees == null) return '--';
    return degreesToCompass(degrees);
  }
}
