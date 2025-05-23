# BabáMatch - Plataforma de Babás estilo Tinder

Uma aplicação web moderna para conectar pais e babás de forma intuitiva, inspirada no Tinder.

## 🚀 Funcionalidades

- **Sistema de Swipe**: Interface estilo Tinder para navegar pelos perfis
- **Chat em Tempo Real**: Converse com suas matches
- **Cadastro e Login**: Sistema completo de autenticação
- **Perfis Detalhados**: Informações completas sobre as babás
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile

## 🎨 Design

- **Cores**: Azul hospital (#0066CC) e branco
- **Interface**: Clean e moderna
- **UX**: Intuitiva e fácil de usar

## 🛠️ Tecnologias

- **Next.js 14**: Framework React
- **TypeScript**: Type safety
- **Tailwind CSS**: Estilização
- **Shadcn/ui**: Componentes UI
- **MySQL**: Banco de dados (configuração incluída)

## 📦 Instalação

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/seu-usuario/babamatch.git
cd babamatch
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente (opcional):
\`\`\`env
NEXT_PUBLIC_DB_HOST=localhost
NEXT_PUBLIC_DB_USER=root
NEXT_PUBLIC_DB_PASSWORD=senha
NEXT_PUBLIC_DB_NAME=babamatch
\`\`\`

4. Execute o projeto:
\`\`\`bash
npm run dev
\`\`\`

5. Acesse http://localhost:3000

## 🗄️ Banco de Dados

O schema do MySQL está incluído em `lib/db-config.ts`. Para usar com um banco real, você precisará:

1. Criar um backend API (Node.js, PHP, etc.)
2. Implementar as rotas de autenticação e CRUD
3. Conectar o frontend às APIs

## 📱 Funcionalidades Principais

### Para Pais:
- Navegue pelos perfis de babás
- Dê "match" nas babás que você gostou
- Converse através do chat integrado
- Veja informações detalhadas (experiência, habilidades, valor/hora)

### Para Babás:
- Crie seu perfil profissional
- Receba notificações de matches
- Converse com pais interessados
- Gerencie sua disponibilidade

## 🚀 Deploy

### GitHub Pages (Estático):
1. Adicione ao package.json:
\`\`\`json
"scripts": {
  "export": "next export"
}
\`\`\`

2. Build e export:
\`\`\`bash
npm run build
npm run export
\`\`\`

3. Deploy a pasta `out` no GitHub Pages

### Vercel (Recomendado):
1. Conecte seu repositório ao Vercel
2. Deploy automático a cada push

## 📝 Notas Importantes

- Esta é uma versão demo com dados mockados
- Para produção, implemente autenticação real e backend
- O chat atual é simulado - implemente WebSockets para tempo real
- Adicione validações e segurança antes de ir para produção

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
