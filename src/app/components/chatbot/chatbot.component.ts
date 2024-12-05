import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../chatbot.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',

})
export class ChatbotComponent implements OnInit{
  //userInput: string = '';
  chatMessages: Array<{ message: string, type: string }> = [];
  authService: any;
  user: any;
  unparsedUser: any;
  isTyping: boolean = false;

  constructor(private chatbotService: ChatbotService, private router: Router) {}


  ngOnInit(): void {
    this.unparsedUser = localStorage.getItem('user');
    this.user = JSON.parse(this.unparsedUser);


    if (!this.user) {
      console.error('Usuário não está logado ou dados não encontrados!');
      return; // Evita erros se o usuário não estiver logado
    }
    console.log('Usuário logado:', this.user);
  

  }
  
  sendMessage() {
    const userInputElement = document.getElementById("user-input") as HTMLInputElement;
    let userInput: string = userInputElement.value.trim();
    console.log(userInput)
    if (userInput === '') return;

    // Adiciona a mensagem do usuário ao chat
    this.addMessageToChat(userInput, 'user-message', 'user');
    userInputElement.value = '';
    this.isTyping = true;
    // Envia a mensagem ao Rasa
    this.chatbotService.sendMessage(userInput,this.user.id).subscribe(
      (response: any[]) => {
        response.forEach(res => {
          this.addMessageToChat(res.text, 'bot-message', 'bot');
          this.isTyping = false;
        });
      },
      error => {
        console.error('Erro:', error);
        this.addMessageToChat('Ocorreu um erro ao se comunicar com o servidor.', 'bot-message', 'bot');
        this.isTyping = false;
      }
    );

    // Limpa o campo de input
    userInput = '';
  }

  addMessageToChat(message: string, messageClass: string, typeClass: string) {
    this.chatMessages.push({ message: message, type: messageClass });
    setTimeout(() => {
    const chatBody = document.getElementById('chat-body') as HTMLElement;
      // Cria o contêiner principal
    const textBoxElement = document.createElement("div");
    textBoxElement.classList.add("text-box", messageClass);

    // Cria o elemento da mensagem
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.textContent = message;

    // Cria o decorador de mensagem (ícone, bolha, etc.)
    const decorElement = document.createElement("div");
    decorElement.classList.add("decor", messageClass, typeClass);

    // Anexa os elementos ao textBoxElement
    textBoxElement.appendChild(messageElement);
    textBoxElement.appendChild(decorElement);

    chatBody.appendChild(textBoxElement);

    // Rola o chat para a última mensagem
    chatBody.scrollTop = chatBody.scrollHeight;
    
  })
  }

  logout(): void {
      localStorage.clear();
      this.router.navigate(['login']);

  }

  feelingRegister(){
    this.router.navigate(['feeling'])
  }

  refresh(): void {
    window.location.reload();
}


}
