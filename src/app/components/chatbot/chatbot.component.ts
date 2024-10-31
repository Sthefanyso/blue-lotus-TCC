import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../chatbot.service';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',

})
export class ChatbotComponent {

  //userInput: string = '';
  chatMessages: Array<{ message: string, type: string }> = [];

  constructor(private chatbotService: ChatbotService) {}

  sendMessage() {
    const userInputElement = document.getElementById("user-input") as HTMLInputElement;
    let userInput: string = userInputElement.value.trim();
    console.log(userInput)
    if (userInput === '') return;

    // Adiciona a mensagem do usuário ao chat
    this.addMessageToChat(userInput, 'user-message', 'user');

    // Envia a mensagem ao Rasa
    this.chatbotService.sendMessage(userInput).subscribe(
      (response: any[]) => {
        response.forEach(res => {
          this.addMessageToChat(res.text, 'bot-message', 'bot');
        });
      },
      error => {
        console.error('Erro:', error);
        this.addMessageToChat('Ocorreu um erro ao se comunicar com o servidor.', 'bot-message', 'bot');
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
}
