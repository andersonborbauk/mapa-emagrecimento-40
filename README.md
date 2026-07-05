# Mapa do Emagrecimento 40+ — App

MVP funcional, sem geração por IA (v1) — plano montado por regras determinísticas a partir de bibliotecas de alimentos fixas.

## Stack

- **Next.js 16** (App Router) + Tailwind CSS
- **Supabase** (Auth + Postgres)
- **Hostinger** — Node.js Web App Hosting (plano Business)

## Configuração inicial

### 1. Criar o projeto no Supabase

1. Crie um projeto novo em [supabase.com](https://supabase.com)
2. No **SQL Editor**, rode o conteúdo de `supabase/schema.sql`
3. Em **Project Settings → API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ nunca exponha essa chave no browser)

### 2. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com os valores do passo 1. Preencha também `ADMIN_EMAILS` com o(s) e-mail(s) que podem acessar `/admin`.

### 3. Instalar e rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

### 4. Build de produção (testado, builda sem erros)

```bash
npm run build
npm start
```

## Deploy na Hostinger (Node.js Web App Hosting)

1. Suba este projeto pra um repositório novo no GitHub
2. No painel da Hostinger, crie um **Node.js Web App**, conectando o repositório
3. Configure as mesmas variáveis de ambiente do `.env.local` no painel da Hostinger
4. Aponte o subdomínio (ex: `mapa40.vivodisso.com.br`) pro app — via CNAME/A record no painel de DNS onde o domínio está registrado (Wix, no caso deste projeto)

## Fluxo de liberação de acesso (MVP, manual)

1. Cliente compra na Kiwify/Hotmart
2. Você cria a conta dela manualmente — ou pede que ela mesma se cadastre em `/cadastro` com o e-mail usado na compra
3. Se ela comprou algum order bump (Doce Pode 40+ / DesinCHÁ 40+), acesse `/admin`, busque pelo e-mail dela, e libere o(s) produto(s)

## O que ainda falta pra v2 (documentado, não bloqueia o MVP)

- Geração de plano por IA
- Webhook automático Kiwify/Hotmart → criação de conta
- Calculadoras dedicadas (IMC, TMB, atividade física, água)
- Recados em áudio da Luana
- PWA instalável (manifest.json + service worker)

## Nota de segurança

O projeto usa `next@16.2.10` (versão sem vulnerabilidades críticas conhecidas — versões anteriores da 14.x e 15.x têm CVEs documentados). Restam 2 vulnerabilidades **moderadas** de uma dependência interna do próprio Next (`postcss`, XSS em stringificação de CSS) — baixo risco real pra esse app, que não recebe CSS arbitrário de usuário. Vale rodar `npm audit` periodicamente e atualizar quando o Next lançar correção.
