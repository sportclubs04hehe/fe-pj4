import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/erors/not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { authorizationGuard } from './shared/guard/authorization.guard';
import { ListComponent } from './list/list.component';
import { MessageComponent } from './message/message.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authorizationGuard],
    children: [
      { path: 'play', component: PlayComponent },
      { path: 'list', component: ListComponent },
      { path: 'message', component: MessageComponent },
      {
        path: 'members',
        loadChildren: () =>
          import('./members/member.module').then(
            (module) => module.MemberModule
          ),
      },
      
    ],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((module) => module.AccountModule),
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
