-- Mapa do Emagrecimento 40+ — Schema do banco de dados
-- Rodar isso no SQL Editor do Supabase, no projeto novo

-- Tabela principal de usuárias (perfil estendido, ligado ao auth.users do Supabase)
create table if not exists usuarias (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  idade int,
  altura_cm numeric,
  peso_inicial numeric,
  peso_atual numeric,
  meta_kg numeric,
  bloqueio text check (bloqueio in ('HOR', 'ACU', 'INF', 'EST')),
  data_cadastro timestamptz default now(),
  refeicoes_ativas jsonb default '{"cafe": true, "almoco": true, "lanche": true, "jantar": true, "ceia": false}',
  preferencia_proteinas text[] default '{}',
  preferencia_carboidratos text[] default '{}',
  plano_principal boolean default true,
  doce_pode_40 boolean default false,
  desincha_40 boolean default false,
  created_at timestamptz default now()
);

-- Medidas corporais (silhueta) — histórico, uma linha por registro
create table if not exists medidas_corporais (
  id uuid primary key default gen_random_uuid(),
  usuaria_id uuid references usuarias(id) on delete cascade,
  braco_cm numeric,
  peito_cm numeric,
  cintura_cm numeric,
  quadril_cm numeric,
  registrado_em timestamptz default now()
);

-- Missão diária — 1 linha por item por dia por usuária
create table if not exists missao_diaria (
  id uuid primary key default gen_random_uuid(),
  usuaria_id uuid references usuarias(id) on delete cascade,
  data date not null,
  item text not null, -- ex: 'cafe', 'almoco', 'lanche', 'jantar', 'ceia'
  concluido boolean default false,
  unique (usuaria_id, data, item)
);

-- Check-ins semanais (peso ao longo do tempo, pra Evolução)
create table if not exists checkins_semanais (
  id uuid primary key default gen_random_uuid(),
  usuaria_id uuid references usuarias(id) on delete cascade,
  numero_semana int not null,
  peso numeric not null,
  criado_em timestamptz default now()
);

-- Uso de extras (doce/chá/suco) — controla a cota semanal de doce
create table if not exists extras_usados (
  id uuid primary key default gen_random_uuid(),
  usuaria_id uuid references usuarias(id) on delete cascade,
  tipo text check (tipo in ('doce', 'cha', 'suco')),
  receita_id int,
  data date not null,
  numero_semana int not null
);

-- RLS (Row Level Security) — cada usuária só acessa os próprios dados
alter table usuarias enable row level security;
alter table medidas_corporais enable row level security;
alter table missao_diaria enable row level security;
alter table checkins_semanais enable row level security;
alter table extras_usados enable row level security;

create policy "usuaria le proprio perfil" on usuarias for select using (auth.uid() = id);
create policy "usuaria atualiza proprio perfil" on usuarias for update using (auth.uid() = id);
create policy "usuaria insere proprio perfil" on usuarias for insert with check (auth.uid() = id);

create policy "usuaria le proprias medidas" on medidas_corporais for select using (auth.uid() = usuaria_id);
create policy "usuaria insere proprias medidas" on medidas_corporais for insert with check (auth.uid() = usuaria_id);

create policy "usuaria le propria missao" on missao_diaria for select using (auth.uid() = usuaria_id);
create policy "usuaria atualiza propria missao" on missao_diaria for all using (auth.uid() = usuaria_id);

create policy "usuaria le proprios checkins" on checkins_semanais for select using (auth.uid() = usuaria_id);
create policy "usuaria insere proprios checkins" on checkins_semanais for insert with check (auth.uid() = usuaria_id);

create policy "usuaria le proprios extras" on extras_usados for select using (auth.uid() = usuaria_id);
create policy "usuaria insere proprios extras" on extras_usados for insert with check (auth.uid() = usuaria_id);

-- IMPORTANTE: a tabela `usuarias` NÃO tem policy de UPDATE liberada para os campos
-- doce_pode_40 / desincha_40 mudarem via cliente comum (a policy de update acima libera
-- update geral, mas a tela de perfil no app só deve enviar os campos pessoais, nunca esses
-- dois). A alteração desses dois campos deve ser feita só pela rota /admin, usando a
-- SUPABASE_SERVICE_ROLE_KEY (que ignora RLS), nunca pelo cliente autenticado comum.
