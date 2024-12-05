from typing import Any, Text, Dict, List
import openai
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict
import requests

import openai
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Dict, Text, Any, List
from rasa_sdk.events import Restarted



class ActionReformulateThought(Action):
    def name(self) -> Text:
        return "action_reformular_pensamento"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Extrair a entidade 'thought' da mensagem do usuário
        thought = tracker.latest_message.get('text')

        
        if not thought:
            dispatcher.utter_message(text="Não consegui identificar o pensamento negativo. Pode reformular?")
            return []
        
        try:
            client = openai.OpenAI(api_key='CHAVE')

            chat_completion = client.chat.completions.create(
                 messages=[
                    {"role": "system", "content": "Você é um assistente positivo e motivador."},
                    {"role": "user", "content": f"o usuário está se sentindo mal devido a um pensamento negativo. Use de teoria cognitivo comportamental e reformule o seguinte pensamento negativo em uma resposta positiva falando na segunda pessoa e que não deixe espaço para resposta: '{thought}'"}
                ],
                max_tokens=100,
                temperature=0.7,
                model="gpt-4o-mini",
            )
            # Extrair o texto reformulado da resposta da API
            reformulated_thought = chat_completion.choices[0].message.content
        except Exception as e:
            reformulated_thought = (
                "Desculpe, não consegui reformular o pensamento no momento. Tente novamente mais tarde."
            )
            print(f"Erro ao chamar a API do OpenAI: {e}")  # Log para depuração

        # Enviar a resposta reformulada ao usuário
        dispatcher.utter_message(text=reformulated_thought)

        return []

class ActionRestartConversation(Action):
    def name(self):
        return "action_restart_conversation"

    def run(self, dispatcher, tracker, domain):
        # Retorna o evento Restarted para reiniciar a conversa
        return [Restarted()]
     
class ActionProvideSuicideHelp(Action):
    def name(self) -> str:
        return "action_provide_suicide_help"

    def run(self, dispatcher, tracker, domain):
        # Mensagem a ser enviada para o usuário
        response = (
            """Se você está pensando em suicídio ou está em perigo, por favor, busque ajuda imediatamente. 
      O Centro de Valorização da Vida (CVV) está disponível para te apoiar.
      Horário de atendimento por telefone: Disponível 24 horas
      Horário de atendimento por chat:
        - Domingo: 17h às 01h
        - Segunda a Quinta-feira: 09h às 01h
        - Sexta-feira: 15h às 23h
        - Sábado: 16h às 01h
    Telefone: 188
      Acesse o chat do CVV(https://cvv.org.br/chat/)
      O CVV pode te ajudar, e você não está sozinho."""
        )
        
        # Enviar a resposta ao usuário
        dispatcher.utter_message(text=response)
        
        return []

class ActionSaveFeelingToDB(Action):
    def name(self) -> Text:
        return "action_save_feeling_to_db"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        # Obtém o slot 'feeling' do tracker
        feeling = tracker.get_slot("feeling")
        #user_id = "675097140c225df6a8df6a75"
        user_id = tracker.sender_id
        print(user_id)
        # Configura os dados para enviar à API
        data = {
            "_id": user_id,
            "feeling": feeling
        }

        # URL da sua API
        api_url = "http://127.0.0.1:5000/api/slots/feeling"
        

        try:
            # Envia os dados para a API
            print(f"URL: {api_url}, Data: {data}")
            response = requests.post(api_url, json=data)
            if response.status_code == 200 or response.status_code == 201:
                dispatcher.utter_message(text="Registrei esse sentimento para você, é possível visualiza-lo em registros.")
            else:
                dispatcher.utter_message(text="Houve um problema ao registrar sua emoção. Tente novamente mais tarde.")
                print({response.status_code},{response.text})
        except Exception as e:
            dispatcher.utter_message(text="Erro ao se conectar com o banco de dados.")
            print(f"Erro: {e}")

        return []
