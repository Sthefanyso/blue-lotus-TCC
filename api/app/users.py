from datetime import datetime, timedelta
import traceback
from flask import Flask, jsonify, render_template_string, request
import bcrypt
from dotenv import load_dotenv, find_dotenv
import os
from flask_mail import Message
import pymongo
from app.models.models import User
from bson import ObjectId
from app.templates.reset_password_email_content import(
    reset_password_email_html_content
)

load_dotenv(find_dotenv())

app = Flask(__name__)
app.secret_key = "testing"
passwordDB = os.environ.get("MONGODB_PWD")

connection_string = f"mongodb+srv://FatecItu:{passwordDB}@fatecitu.zqencgi.mongodb.net/"

# Criando um client
client = pymongo.MongoClient(connection_string)

try:
    database = client.blue_lotus
    collection = database.get_collection("usuarios")
    print("Conectado ao MongoDB")

except Exception as e:
    # imprimir mensagem de erro em caso de falha na conexão
    print(f"Erro: {e}")

#CRUD
def registerUser():
    data = request.json
    name = data['name']
    surname = data['surname']
    phone = data['phone']
    email = data['email']
    password1 = data['password1']
    password2 = data['password2']
    gender = data['gender'],
    birthDate = data['birthDate']

    
    emailExists = collection.find_one({"email": email})

    if emailExists:
        return jsonify({'error': 'Este e-mail já está em uso.'}), 400
    if password1!=password2:
        return jsonify({'error': 'Senhas não coincidem.'}), 400 

    #criptografia da senha
    #genSalt => impede que 2 senhas iguais tenham resultados iguais
    hashed_password = bcrypt.hashpw(password1.encode('utf-8'), bcrypt.gensalt())


    usuarios_document ={
        "nome": name,
        "sobrenome": surname,
        "email": email,
        "telefone": phone,
        "senha":  hashed_password,
        "genero": gender,
        "data_nasc": birthDate,
        "feelings": []}
    try:
        insert_id = collection.insert_one(usuarios_document).inserted_id
        return jsonify({'message': 'Usuário registrado com sucesso', 'insert_id': str(insert_id)}), 201
    except:
        return jsonify({'message': 'Não foi possível registrar', 'insert_id': str(insert_id)}), 500

def updateUser(id):
    data = request.get_json()
    if not data:            
        return jsonify({'message': 'Dados ausentes na requisição', 'error': 'Requisição sem JSON'}), 400
        print(data)
    # Verifica se os campos de senha foram enviados
    password = data.get('newPassword')
    if not password:
        return jsonify({'message': 'Senha não fornecida', 'error': 'Campo password1 ausente'}), 400

    user = user_by_id(id)
    if not user:
        return jsonify({'message': "Usuário não existe"}), 404

    #criptografia da senha
    #genSalt => impede que 2 senhas iguais tenham resultados iguais
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        insert_id = collection.update_one({'_id': ObjectId(id)}, {'$set': {'senha': hashed_password}})
        return jsonify({'message': 'Usuário atualizado com sucesso', 'insert_id': str(insert_id)}), 201
    except:
        return None

def deleteUser(id):
    user = user_by_id(id)

    if not user:
        return jsonify({'message': "Usuário não existe"}), 404
    
    try:
        delete_id = collection.delete_one({'_id': ObjectId(id)})
        return jsonify({'message': 'Usuário removido com sucesso'}), 201
    except:
        return jsonify({'message': 'Não foi possível remover'}), 500



def login():
    data = request.json
    email = data['email']
    password = data['password']

    
    emailExists = collection.find_one({'email': email})
    if not emailExists:
        return jsonify({'error': 'Credenciais inválidas'}), 401
    if not bcrypt.checkpw(password.encode('utf-8'), emailExists['senha']):
        return jsonify({'error': 'Credenciais inválidas'}), 401
    return jsonify({'message': 'Login bem-sucedido', 'user_id': str(emailExists['_id'])}), 200

def user_by_email(email):
    try:
        return collection.find_one({"email": email})
    except:
        return None
    
def user_by_id(id):
    try:
        return collection.find_one({"_id": ObjectId(id)})
    except:
        return None

def send_reset_password_email(email):
    try:
        # Verifica se o e-mail está presente na base de dados
        user = user_by_email(email)
        if not user:
            # Se não encontrar o usuário
            return jsonify({'message': 'Usuário não encontrado para o e-mail fornecido'}), 404
        
        try:
            # Gera o token para redefinição de senha
            print(user['senha'])
            token = User.get_token(user['email'], user['senha'])
        except Exception as e:
            # Se ocorrer erro na geração do token
            print(f"Erro ao gerar o token: {e}")
            return jsonify({'message': 'Erro ao gerar o token para redefinição'}), 500
        
        front_end_url = "http://localhost:4200"
        reset_password_url = f"{front_end_url}/password/{token}usuario_{user['_id']}"
        print(reset_password_url)

        try:
            # Renderiza o corpo do e-mail com o link para redefinir a senha
            email_body = render_template_string(reset_password_email_html_content, reset_password_url=reset_password_url)
        except Exception as e:
            # Se houver erro ao renderizar o conteúdo do e-mail
            print(f"Erro ao renderizar o conteúdo do e-mail: {e}")
            return jsonify({'message': 'Erro ao preparar o conteúdo do e-mail'}), 500

        try:
            # Cria a mensagem do e-mail
            from app import mail
            msg = Message('Solicitação de troca de senha', recipients=[email], sender='noreply@bluelotus@gmail.com')
            msg.html = email_body

            # Envia o e-mail
            mail.send(msg)
            # Se o e-mail foi enviado com sucesso
            return jsonify({'message': 'E-mail de recuperação enviado com sucesso'}), 202
        except Exception as e:
            # Se ocorrer erro ao enviar o e-mail
            print(f"Erro ao enviar o e-mail: {e}")
            traceback.print_exc()
            return jsonify({'message': 'Falha ao enviar o e-mail'}), 500

    except Exception as e:
        print(f"Erro inesperado: {e}")
        traceback.print_exc()  # Exibe a pilha de erro completa
        return jsonify({'message': 'Não foi possível processar a solicitação'}), 500
    

def save_feeling():    
    data = request.json
    user_id = data.get('_id')
    feeling = data.get('feeling')

    print(user_id)

    # Verificando se 'user_id' e 'feeling' foram fornecidos
    if not user_id or not feeling:
        return jsonify({'error': 'user_id and feeling are required'}), 400

    # Adiciona a data de hoje
    timestamp = datetime.utcnow()
    date_str = timestamp.strftime('%Y-%m-%d')


    # Verificar se já existe um sentimento para o dia de hoje
    existing_feeling = collection.find_one(
            {'_id': ObjectId(user_id), 'feelings.timestamp': date_str}
        )

    if existing_feeling:
        current_feeling = None
        for feeling_entry in existing_feeling['feelings']:
            if feeling_entry['timestamp'] == date_str:
                current_feeling = feeling_entry['feeling']
                break
        if current_feeling == feeling:
            # Se o sentimento não mudou, podemos retornar uma resposta dizendo que não é necessário atualizar
            return jsonify({'message': 'Sentimento para o dia já registrado e não houve alteração.'}), 200

        print('Sentimento para o dia já existe, atualizando...')
            # Substitui o sentimento atual com o novo sentimento
        update_result = collection.update_one(
                {'_id': ObjectId(user_id), 'feelings.timestamp': date_str},
                {'$set': {'feelings.$.feeling': feeling, 'feelings.$.timestamp': date_str}}
            )

        if update_result.modified_count == 0:
            error_msg = 'Erro ao atualizar o sentimento'
            print(f"{error_msg}. Detalhes do erro: {str(update_result.raw_result)}")
            return jsonify({'error': error_msg, 'details': str(update_result.raw_result)}), 500

        return jsonify({'message': 'Sentimento atualizado com sucesso'}), 200


    try:

        update_result = collection.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$push': {
                    'feelings': {
                        'feeling': feeling,
                        'timestamp': date_str
                    }
                }
            }
        )

        # Verificar se a atualização foi bem-sucedida
        if update_result.modified_count == 0:
            return jsonify({'error': 'No document was updated. Check if user_id is correct and ensure there is data to update.'}), 400

        return jsonify({'message': 'Atualizado com sucesso', 'modified_count': update_result.modified_count}), 201

    except Exception as e:
        # Exibir detalhes do erro para depuração
        print(f"Error details: {str(e)}")
        return jsonify({'error': 'Erro ao atualizar o usuário', 'details': str(e)}), 500

    
def get_feelings(user_id):
    try:
        # Obtém o dia atual
        today = datetime.utcnow()
        start_of_week = today - timedelta(days=today.weekday())  # Segunda-feira

        # Converte a data de início da semana para string (formato YYYY-MM-DD)
        start_of_week_str = start_of_week.strftime('%Y-%m-%d')

        # Consulta as emoções da semana, assumindo que temos um campo 'feelings' com um campo 'timestamp'
        user_data = user_by_id(user_id)

        if not user_data:
            return jsonify({'error': 'Usuário não encontrado'}), 404

        # Filtra as emoções para os dias da semana
        feelings_week = []
        for feeling in user_data.get('feelings', []):
            feeling_date = feeling.get('timestamp')
            if feeling_date >= start_of_week_str:
                feelings_week.append(feeling)

        # Se não encontrar dados de emoções para essa semana
        if not feelings_week:
            return jsonify({'message': 'Nenhuma emoção registrada esta semana'}), 200

        # Organiza as emoções de acordo com os dias da semana (Segunda, Terça, ...)
        feelings_by_day = {
            'Segunda': None, 'Terça': None, 'Quarta': None, 'Quinta': None,
            'Sexta': None, 'Sábado': None, 'Domingo': None
        }

        for feeling in feelings_week:
            timestamp = datetime.strptime(feeling['timestamp'], '%Y-%m-%d')
            weekday = timestamp.strftime('%A')  # Nome do dia da semana (Ex: 'Monday')
            feelings_by_day[weekday] = feeling['feeling']

        return jsonify(feelings_by_day), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

def get_feelings_by_month(user_id):
    today = datetime.today()
    month = today.month
    year = today.year
    
    # Formata o primeiro e último dia do mês atual
    start_date = datetime(year, month, 1)
    end_date = datetime(year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)
    
    # Realiza a consulta ao MongoDB
    user_data = user_by_id(user_id)
    
    if user_data:
        try:
            # Filtra os sentimentos para o mês atual
            feelings_month = {day: None for day in range(1, 32)}  # Para os dias de 1 a 31
            for feeling in user_data['feelings']:
                timestamp = datetime.strptime(feeling['timestamp'], '%Y-%m-%d')
                if start_date <= timestamp < end_date:
                    day = timestamp.day
                    feelings_month[day] = feeling['feeling']
            return jsonify(feelings_month), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    