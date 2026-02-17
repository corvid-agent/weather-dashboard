import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Weather Dashboard',
  },
  {
    path: 'hourly',
    loadComponent: () => import('./features/forecast/hourly-forecast.component').then(m => m.HourlyForecastComponent),
    title: 'Hourly Forecast',
  },
  {
    path: 'daily',
    loadComponent: () => import('./features/forecast/daily-forecast.component').then(m => m.DailyForecastComponent),
    title: 'Daily Forecast',
  },
  {
    path: 'air-quality',
    loadComponent: () => import('./features/air-quality/air-quality.component').then(m => m.AirQualityComponent),
    title: 'Air Quality',
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    title: 'Settings',
  },
  { path: '**', redirectTo: '' },
];
