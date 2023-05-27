import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [{
  path: '', 
  component: AppComponent,
  children: [
    { path: '', loadChildren: () => import('./component/list/list.module').then(m => m.ListModule) },
    { path: 'form', loadChildren: () => import('./component/form/form.module').then(m => m.FormModule) },
    { path: 'form/:id', loadChildren: () => import('./component/form/form.module').then(m => m.FormModule) },
  ]
},
  { path: 'index', loadChildren: () => import('./component/index/index.module').then(m => m.IndexModule) },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
