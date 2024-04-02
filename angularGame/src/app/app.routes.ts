import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';

export const routes: Routes = [
    {path:'login',loadComponent:()=>{return import('./component/login/login.component').then((com) => com.LoginComponent);}},
    {path:'register',loadComponent:()=>{return import('./component/register/register.component').then((com) => com.RegisterComponent);}},
    {path:'game',loadComponent:()=>{return import('./component/game/game.component').then((com) => com.GameComponent);}},
    {path:'gameCreate',loadComponent:()=>{return import('./component/game-create-page/game-create-page.component').then((com) => com.GameCreatePageComponent);}},
    {path:'gameJoin',loadComponent:()=>{return import('./component/game-join/game-join.component').then((com) => com.GameJoinComponent);}},
    {path:'gameCode',loadComponent:()=>{return import('./component/joining-code/joining-code.component').then((com) => com.JoiningCodeComponent);}},
    {path:'home',component:HomeComponent},
    {path:"**",redirectTo:'home',pathMatch:'full'},
];
