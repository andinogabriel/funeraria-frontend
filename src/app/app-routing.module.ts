import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/components/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/components/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/components/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'categorias',
    loadChildren: () => import('./features/components/categories/categories.module').then(m => m.CategoriesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ingresos',
    loadChildren: () => import('./features/components/incomes/incomes.module').then(m => m.IncomesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'articulos',
    loadChildren: () => import('./features/components/items/items.module').then(m => m.ItemsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'proveedores',
    loadChildren: () => import('./features/components/suppliers/suppliers.module').then(m => m.SuppliersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'planes',
    loadChildren: () => import('./features/components/plans/plans.module').then(m => m.PlansModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./features/components/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'afiliados',
    loadChildren: () => import('./features/components/affiliates/affiliates.module').then(m => m.AffiliatesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mi-cuenta',
    loadChildren: () => import('./features/components/account/account.module').then(m => m.AccountModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'icons',
    loadChildren: () => import('./features/components/icons/icons.module').then(m => m.IconsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    loadChildren: () => import('./features/components/about/about.module').then(m => m.AboutModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
