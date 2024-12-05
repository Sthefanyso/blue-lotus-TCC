import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { UsuarioAutenticadoGuard } from './usuario-autenticado.guard';
import { UsuarioNaoAutenticadoGuard } from './usuario-nao-autenticado.guard';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { FeelingRegisterComponent } from './components/feeling-register/feeling-register.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
      { path: 'about', component: AboutComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'register', component: RegisterComponent, canActivate:[UsuarioNaoAutenticadoGuard]},
      { path: 'login', component: LoginComponent, canActivate:[UsuarioNaoAutenticadoGuard]},
      { path: 'recover-password', component: RecoverPasswordComponent, canActivate:[UsuarioNaoAutenticadoGuard]},
      { path: 'chatbot', component: ChatbotComponent, canActivate:[UsuarioAutenticadoGuard]},
      { path: 'password/:token', component: NewPasswordComponent },
      { path: 'feeling', component: FeelingRegisterComponent, canActivate:[UsuarioAutenticadoGuard] }
      

];
