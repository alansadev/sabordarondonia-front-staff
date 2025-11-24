# Sabor de Rondônia – Client

Frontend do autoatendimento **Sabor de Rondônia**, focado em experiência _mobile first_ para clientes: escolher produtos, montar o carrinho, se identificar e acompanhar pedidos.

## Tecnologias

- **React** + **TypeScript**
- **Vite**
- **Chakra UI** (componentes e layout)
- **React Router DOM**
- **Zustand** (estado do carrinho)
- **Axios** (HTTP, com cookies HttpOnly)
- **React Query** (fetch/cache de produtos)

## Funcionalidades principais

- **Landing Page**

  - Apresentação do projeto e fluxo de uso.
  - Botão "Ver Cardápio" que leva ao menu.

- **Cardápio (`/menu`)**

  - Lista de produtos vinda do backend (`GET /products`).
  - Adição de itens ao carrinho com feedback visual (toast).
  - Footer fixo com navegação: **Início**, **Pedidos**, **Perfil**.

- **Carrinho (`/cart`)**

  - Exibe itens adicionados (nome, preço, quantidade, imagem).
  - Permite aumentar/diminuir quantidades e remover itens.
  - Botão "CONTINUAR":
    - Se estiver logado (`GET /users/me` OK), vai para o **Checkout**.
    - Se não estiver logado (401), salva `next_path='/checkout'` e redireciona para **Login**.

- **Login do Cliente (`/login`)**

  - Identificação por **nome** e **telefone/WhatsApp**.
  - Fluxo:
    - Tenta `POST /auth/client-login`.
    - Se 401 (usuário não existe), faz `POST /users/register` e tenta login novamente.
  - Redirecionamento após login:
    - Se existir `sessionStorage.next_path`, volta para lá.
    - Caso contrário, se houver itens no carrinho → `/checkout`, senão → `/menu`.

- **Checkout (`/checkout`)**

  - Resumo dos itens e total.
  - Escolha da forma de pagamento: **Pix**, **Cartão**, **Dinheiro**.
  - Para dinheiro, permite informar valor para troco.
  - Envio do pedido:

    - `POST /orders` com payload:

      ```json
      {
        "clientInfo": { "name": "João da Silva", "phone": "69912345678" },
        "items": [
          { "productId": "...", "quantity": 2 }
        ],
        "payment_method": "PIX" | "CASH" | "CREDIT_CARD",
        "change_for": 500
      }
      ```

  - Limpa o carrinho ao finalizar e redireciona para **Order Success**.

- **Sucesso do Pedido ([/order-success](http://_vscodecontentref_/3))**

  - Tela full-screen, sem rolagem, com:
    - Número do pedido formatado: `#0001`, `#0025`, etc.
    - Total a pagar.
    - Botão "Voltar ao Cardápio".

- **Perfil (`/profile`)**

  - Exibe nome e telefone do cliente (via `GET /users/me`).
  - Permite editar e salvar (`PATCH /users/me`).
  - Botão "Salvar dados" só habilita quando há alterações.
  - Botão "Sair da conta":
    - Chama `POST /auth/logout`.
    - Limpa o carrinho ([useCart.clearCart](http://_vscodecontentref_/4)).
    - Redireciona para a landing (`/`).
  - Footer com navegação (Início, Pedidos, Perfil).

- **Lista de Pedidos ([/orders](http://_vscodecontentref_/5))**
  - Carrega pedidos do cliente em [GET /orders/my-orders](http://_vscodecontentref_/6).
  - Mostra:
    - [Pedido #<order_number>](http://_vscodecontentref_/7)
    - Status com badge.
    - Data do pedido.
    - Itens em formato `2x Nome do Produto · 1x ...`.
    - Total formatado em reais ([total_amount](http://_vscodecontentref_/8) em centavos).
    - Forma de pagamento traduzida:
      - `PIX` → **Pix**
      - `CASH` → **Dinheiro**
      - `CARD`/`CREDIT_CARD` → **Cartão**

## Autenticação e Sessão

- Baseada em **cookies HttpOnly** setados pelo backend.
- O frontend **não** usa [localStorage](http://_vscodecontentref_/9) para guardar token de autenticação.
- Checagem de sessão sempre via `GET /users/me`.
- Em caso de 401:
  - Fluxos sensíveis (checkout, perfil) redirecionam para `/login`.
  - O caminho desejado é salvo em [sessionStorage.next_path](http://_vscodecontentref_/10) para retorno após login.

## Estado do Carrinho

- Implementado com **Zustand** em [useCart.ts](http://_vscodecontentref_/11).
- Estrutura simples:

  ```ts
  interface CartItem {
  	productId: string;
  	quantity: number;
  }
  ```
