# CRM Pro para Freelancers

Um CRM simples e prático para freelancers gerirem melhor **tempo, projetos, clientes e receita** em um só lugar.

## Funcionalidades principais

### 1) Gestão de Funil e Leads
- **Kanban de vendas:** mover leads entre etapas (Contato → Reunião → Proposta Enviada → Contrato Assinado).
- **Captura de leads:** formulário público para bio/portfólio, com envio direto para o CRM.
- **Quick notes:** anotações rápidas sobre preferências e contexto de cada cliente.

### 2) Gestão de Projetos
- **Checklist de entrega automático:** proposta ganha vira tarefas do projeto.
- **Time tracking (cronômetro):** botão de play para registrar horas por projeto.
- **Central de arquivos:** organização de briefings, referências e entregáveis por cliente.

### 3) Financeiro e Propostas
- **Gerador de orçamentos (PDF):** modelos prontos com preenchimento rápido de escopo e valor.
- **Controle de pagamentos:** status por parcela (Pendente, Pago, Atrasado).
- **Relatório de receita:** visão mensal do que entrou vs. propostas em aberto.

### 4) Comunicação e Histórico
- **Log de interações:** histórico de conversas e decisões com clientes.
- **Integração com agenda:** sincronização de reuniões e prazos com Google Calendar.

## Objetivo do projeto

Dar ao freelancer clareza sobre o funil comercial, execução dos projetos e fluxo financeiro, reduzindo retrabalho e melhorando gestão de tempo.

## Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente. Copie o exemplo e ajuste se necessário:

```bash
cp .env.local.example .env.local
```

Variáveis suportadas:
- `NEXT_PUBLIC_API_URL` — URL do backend `CRM_PRO_API` (default `http://localhost:3000`).

3. Suba o backend em outra porta antes (ex.: `cd ../CRM_PRO_API && npm run start:dev`).

4. Rode o frontend em ambiente de desenvolvimento (em porta diferente do backend):

```bash
PORT=3001 npm run dev
```

5. Abra no navegador:

```text
http://localhost:3001
```

### Comandos úteis
- `npm run lint` — valida o código com ESLint.
- `npm run build` — gera build de produção.
- `npm run start` — inicia a aplicação em modo produção.
