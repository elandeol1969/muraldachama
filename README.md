# Mural da Chama 🔥

Uma aplicação web de mural de mensagens estilo "Post-it", onde usuários cadastrados podem postar mensagens motivacionais com imagens.

## 🚀 Tecnologias

- **React 18** - Framework JavaScript
- **Vite** - Build tool
- **Supabase** - Backend como serviço (banco de dados)
- **React Router** - Roteamento
- **CSS3** - Estilização

## 📋 Funcionalidades

- ✅ Cadastro e autenticação de usuários
- ✅ Criação de mensagens com imagens
- ✅ Carrossel automático de mensagens recentes
- ✅ Mural em grid com estilo Post-it colorido
- ✅ Edição e exclusão de mensagens próprias
- ✅ Perfil de usuário com avatar
- ✅ Design responsivo e animado

## 🎨 Características de Design

- Tema alegre e colorido
- Cards estilo notas adesivas com cores pastéis vibrantes
- Efeito de rotação e profundidade nos cards
- Fonte handwritten para mensagens (Kalam)
- Carrossel automático a cada 5 segundos
- Layout responsivo para mobile

## 🔧 Instalação

1. **Instale as dependências:**
```bash
npm install
```

2. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

3. **Acesse a aplicação:**
```
http://localhost:3000
```

## 🗄️ Banco de Dados

A aplicação utiliza Supabase com a seguinte estrutura:

**Tabela: user_message**
- id (bigint, primary key)
- created_at (timestamp)
- nome_usuario (text)
- email_usuario (text)
- senha_usuario (text)
- imagem_usuario (text)
- imagem_message (text)

## 📱 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── Header.jsx
│   ├── MessageCard.jsx
│   ├── Carousel.jsx
│   ├── Mural.jsx
│   └── AuthModal.jsx
├── pages/            # Páginas da aplicação
│   ├── Home.jsx
│   ├── MessageForm.jsx
│   └── Profile.jsx
├── services/         # Serviços de API
│   ├── supabaseClient.js
│   ├── authService.js
│   └── messageService.js
├── App.jsx           # Componente principal
└── main.jsx          # Ponto de entrada
```

## 🎯 Como Usar

1. **Cadastro/Login:** Clique em "Registre sua Mensagem" e crie sua conta
2. **Postar Mensagem:** Faça upload de uma imagem com sua mensagem motivacional
3. **Ver Mural:** Navegue pelo carrossel e mural de mensagens
4. **Editar Perfil:** Acesse "Meus Dados" para atualizar seu perfil
5. **Gerenciar Mensagem:** Edite ou delete sua mensagem pelo menu no card

## 🌟 Regras de Negócio

- Exibe apenas as últimas 24 mensagens no total
- Cada usuário pode ter apenas 1 mensagem ativa no mural
- Carrossel exibe 3 cards por vez das mensagens mais recentes
- Limite de 32 caracteres para nome/apelido
- Imagens com limite de 5MB

## 🔒 Segurança

⚠️ **Nota:** Esta versão utiliza autenticação simples sem criptografia de senha. Para produção, implemente:
- Hash de senhas (bcrypt)
- JWT ou autenticação OAuth
- HTTPS obrigatório
- Validação server-side

## 📄 Licença

Este projeto foi criado para fins educacionais.

---

Desenvolvido com ❤️ e 🔥
