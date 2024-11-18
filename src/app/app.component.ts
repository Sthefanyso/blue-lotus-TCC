import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { ModalComponent } from './components/modal/modal.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HomeComponent,AboutComponent,LoginComponent,RegisterComponent, ContactsComponent,ChatbotComponent, ModalComponent,RecoverPasswordComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'blue-lotus';

  @ViewChild(ModalComponent) modalComponent: ModalComponent | undefined;  // Referência ao ModalComponent

}