# Data SUS - Sistema de Informações em Saúde

Sistema de informações em saúde pública do Brasil, desenvolvido para fornecer dados, estatísticas e informações sobre saúde pública de forma transparente e acessível.

## 🚀 Funcionalidades

- **Dashboard Interativo**: Visualização de dados de qualidade da água por região
- **Mapas Interativos**: Representação geográfica dos dados usando Leaflet
- **Filtros Avançados**: Filtragem por parâmetros (turbidez, pH) e métricas
- **Interface Responsiva**: Design adaptável para diferentes dispositivos
- **Dados em Tempo Real**: Acesso a informações atualizadas sobre saúde pública

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **Mapas**: Leaflet + React Leaflet
- **Backend**: Express.js + TypeScript
- **Roteamento**: Wouter
- **Estado**: React Query (TanStack Query)
- **Validação**: Zod
- **Animações**: Framer Motion

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd frontend_sus
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   NODE_ENV=development
   SERVER_HOST=0.0.0.0
   BACKEND_PORT=5000
   FRONTEND_PORT=80
   DOMAIN=
   FACEBOOK_API_KEY=
   SESSION_SECRET=your-super-secret-session-key-here
   LOG_LEVEL=info
   ```

## 🚀 Executando o Projeto

### Desenvolvimento

**Opção 1: Frontend e Backend juntos**
```bash
npm run dev
```

**Opção 2: Separadamente**
```bash
# Terminal 1 - Backend (porta 5000)
npm run dev:backend

# Terminal 2 - Frontend (porta 80)
npm run dev:frontend
```

### Produção

```bash
# Build do projeto
npm run build

# Executar em produção
npm start
```

## 🌐 Acessos

- **Frontend**: http://localhost:80
- **Backend/API**: http://localhost:5000
- **API Endpoints**:
  - `/api/water-quality` - Dados de qualidade da água
  - `/api/geographic-boundaries` - Limites geográficos
  - `/api/data-summary` - Resumo dos dados
  - `/api/metric-options` - Opções de métricas

## 📁 Estrutura do Projeto

```
frontend_sus/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Hooks customizados
│   │   └── lib/           # Utilitários e configurações
│   ├── public/            # Arquivos estáticos
│   └── index.html         # HTML principal
├── server/                # Backend Express
│   ├── index.ts          # Servidor principal
│   ├── routes.ts         # Rotas da API
│   └── storage.ts        # Armazenamento de dados (memória)
├── shared/               # Tipos e schemas compartilhados
└── attached_assets/      # Assets anexados
```

## 🔍 Solução de Problemas

### Porta 80 já em uso (Windows)
Se a porta 80 estiver ocupada, altere `FRONTEND_PORT` no arquivo `.env`:
```env
FRONTEND_PORT=3000
```

### Erro de permissão (Linux/Mac)
Para usar a porta 80, execute com sudo:
```bash
sudo npm run dev:frontend
```

### Problemas de dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de TypeScript
```bash
npm run check
```

## 📊 Dados de Exemplo

O sistema inclui dados de exemplo para:
- **Qualidade da Água**: Turbidez e pH por região
- **Regiões Brasileiras**: Norte, Nordeste, Centro-Oeste, Sudeste, Sul
- **Métricas**: Amostras analisadas, valores específicos por parâmetro

## 🎯 Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar mais parâmetros de qualidade da água
- [ ] Implementar histórico de dados
- [ ] Adicionar exportação de relatórios
- [ ] Implementar notificações em tempo real

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas, entre em contato através de:
- Email: suporte@datasus.gov.br
- Documentação: [docs.datasus.gov.br](https://docs.datasus.gov.br)

---

**Desenvolvido com ❤️ para a saúde pública brasileira**
