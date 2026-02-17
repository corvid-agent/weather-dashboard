import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton" [style.height]="height()" [style.width]="width()" [style.border-radius]="radius()" role="status" aria-label="Loading">
      <span class="sr-only">Loading...</span>
    </div>
  `,
  styles: [`
    .skeleton {
      background: linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-raised) 50%, var(--bg-surface) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
})
export class LoadingSkeletonComponent {
  readonly height = input('20px');
  readonly width = input('100%');
  readonly radius = input('var(--radius)');
}
