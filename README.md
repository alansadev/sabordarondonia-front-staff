# Sabor de Rondônia – Staff

Frontend interno do **Sabor de Rondônia** para equipe (admin, caixa e despacho), focado em acompanhar o fluxo de pedidos após o autoatendimento do cliente.

## Tecnologias

- **React** + **TypeScript**
- **Vite**
- **Chakra UI** (componentes e layout)
- **React Router DOM**
- **Axios** (HTTP, com cookies HttpOnly)
- **React Query** (fetch/cache de dados)

## Rotas principais (Staff)

- **Landing Staff (`/`)**

  - Landing simples explicando o painel de staff.
  - Botão "Acessar painel do staff" leva para `/staff/login`.

- **Login do Staff (`/staff/login`)**

  - Autenticação de usuários internos via `POST /auth/login`.
  - Ao logar, redireciona conforme `role` retornada pela API:
    - `ADMIN` → `/admin`
    - `CASHIER` → `/cashier`
    - `DISPATCHER` → `/dispatcher`

- **Painel Admin (`/admin`)**

  - Visão geral dos fluxos de **Caixa** e **Despacho**.
  - Links/indicação das rotas `/cashier` e `/dispatcher`.

- **Dashboard Caixa (`/cashier`)**

  - Lista pedidos com `status=PENDING_PAYMENT` via `GET /orders?status=PENDING_PAYMENT`.
  - Exibe:
    - Número do pedido, cliente, telefone.
    - Itens em formato `2x Nome do Produto`.
    - Forma de pagamento traduzida (Pix / Dinheiro / Cartão).
    - Total formatado em reais (centavos vindo do backend).
  - Ação "Confirmar pagamento" envia `PATCH /orders/:id/status` com `status='PAID'` e recarrega a lista.

- **Dashboard Despacho (`/dispatcher`)**
  - Lista pedidos com `status=READY_FOR_DELIVERY` via `GET /orders?status=READY_FOR_DELIVERY`.
  - Exibe dados similares ao caixa (cliente, itens, pagamento, total).
  - Ação "Concluir entrega" envia `PATCH /orders/:id/status` com `status='DELIVERED'` e recarrega.

## Autenticação e Sessão

- Baseada em **cookies HttpOnly** setados pelo backend.
- O frontend **não** salva token de autenticação em `localStorage`.
- O hook `useCurrentUser` chama `GET /users/me` para obter o usuário atual:
  - Em caso de `401`, redireciona automaticamente para `/staff/login`.
- O botão "Sair" no header do staff chama `POST /auth/logout` e volta para `/staff/login`.

## Layout do Staff

- Todas as telas internas usam `StaffLayout`:
  - Header com título "Sabor de Rondônia - Staff".
  - Subtítulo contextual (ex.: "Caixa - pedidos aguardando pagamento").
  - Exibe nome do usuário e `role` (admin/cashier/dispatcher) quando disponíveis em `/users/me`.
  - Mostra também a rota atual e botão "Sair".
