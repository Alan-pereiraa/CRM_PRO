# CRM PRO — Web (Frontend)

Interface web do CRM PRO. Gerencia funis de vendas em **kanban** (drag & drop), projetos/oportunidades, contatos, tarefas e dashboard de métricas.

> Este repositório é um **submódulo** do wrapper de orquestração. Para subir o ambiente completo (frontend + API + banco) via Docker, consulte o README do repositório raiz.

## Especificações técnicas

| Item                | Tecnologia / Valor                              |
|---------------------|-------------------------------------------------|
| Framework           | Next.js 16 (App Router)                          |
| Biblioteca UI       | React 19                                         |
| Linguagem           | TypeScript                                       |
| Estado de servidor  | TanStack Query (React Query) 5                   |
| Formulários         | React Hook Form + Zod (`@hookform/resolvers`)    |
| Estilização         | Tailwind CSS 4 + shadcn/ui + Base UI             |
| Ícones              | lucide-react                                     |
| Gráficos            | Recharts                                         |
| Drag & Drop         | dnd-kit (`core`, `sortable`, `utilities`)        |
| Tema (dark/light)   | next-themes                                      |
| Notificações        | Sonner (toasts)                                  |
| Porta (dev)         | `3000` (mapeada para `3001` no Docker)           |

## Variáveis de ambiente

| Variável              | Descrição                                  | Exemplo                   |
|-----------------------|--------------------------------------------|---------------------------|
| `NEXT_PUBLIC_API_URL` | URL base da API                            | `http://localhost:3000`   |

## Arquitetura

### Roteamento (App Router)

Usa **route groups** para separar áreas pública e autenticada:

```
app/
├── (public)/           # Rotas sem autenticação
│   ├── login/
│   └── register/
├── (auth)/             # Rotas protegidas
│   ├── page.tsx        # Dashboard (home)
│   ├── funnel/         # Funil em kanban / lista
│   └── project/[id]/   # Detalhe do projeto
├── layout.tsx          # Layout raiz (providers, tema)
└── not-found.tsx
```

### Proteção de rotas (`middleware.ts`)

O middleware verifica o cookie `crm_auth_token`:

- Usuário **autenticado** acessando `/login` ou `/register` → redirecionado para `/`.
- Usuário **não autenticado** acessando rota protegida → redirecionado para `/login`.

### Componentes (Atomic Design)

```
components/
├── atoms/         # Logo, ThemeToggle, ProgressBar, ViewToggle, LogoutButton
├── molecules/     # Campos de formulário, KanbanCard, StatCard, filtros...
├── organisms/     # Kanban, ChartsListView, Drawers, Header, formulários...
├── templates/     # Composições de layout de página
├── providers/     # Providers de contexto (React Query, tema...)
└── ui/            # Componentes base do shadcn/ui
```

### Camadas de dados

```
services/    # Chamadas HTTP por domínio (auth, contact, funnel, project, task, dashboard)
hooks/       # Hooks React Query por domínio + hooks de formulário (hooks/forms)
lib/         # api (cliente HTTP), mappers, queryClient, tokenStorage, utils
schemas/     # Schemas Zod de validação (account, contact, funnel, project, task, subtask)
types/       # Tipagens TypeScript por domínio
```

| Pasta       | Responsabilidade                                                       |
|-------------|-----------------------------------------------------------------------|
| `services/` | Comunicação com a API REST (um arquivo por domínio).                  |
| `hooks/`    | Encapsulam queries/mutations do React Query e lógica de formulário.   |
| `lib/api`   | Cliente HTTP base (injeta token, base URL).                           |
| `lib/tokenStorage` | Persistência do token de autenticação.                         |
| `lib/mappers` | Conversão entre DTOs da API e tipos do frontend.                    |
| `schemas/`  | Validação de formulários com Zod.                                     |

## Funcionalidades principais

- **Autenticação** — login/registro com proteção de rotas via cookie.
- **Funil de vendas** — visualização em **kanban** (com drag & drop via dnd-kit) e em lista.
- **Projetos/Oportunidades** — CRUD, mudança de status, posição e funil.
- **Contatos** — gerenciamento por projeto, com busca.
- **Tarefas** — CRUD, subtarefas, tarefas do dia, filtros e paginação.
- **Dashboard** — métricas agregadas com gráficos (Recharts).
- **Tema claro/escuro** — alternância via next-themes.