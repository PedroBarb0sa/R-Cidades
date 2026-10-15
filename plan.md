# Plano — R+Cidades / Parceiros

## Escopo
Construir uma experiência web responsiva e profissional para o time de Desenvolvimento de Sistemas do projeto **R+Cidades**, com foco em parceiros, doadores e controle das doações para a ação Cor na Comunidade. A entrega será um dashboard demonstrativo, funcional no navegador, com dados locais editáveis e estrutura de dados documentada no próprio produto.

## Abordagem de implementação
- **Frontend estático** em HTML, CSS e JavaScript vanilla, sem dependências externas, para reduzir pontos de falha e facilitar publicação como site estático.
- **Persistência demonstrativa local** com `localStorage`, mantendo os cadastros do navegador e permitindo restaurar os dados de demonstração.
- **Navegação em uma página** com visão geral, pipeline, parceiros, estrutura de dados e página de apoio do time DS, controlada por estado de rota simples e acessível por hash.
- **Dados relacionais demonstrados** em objetos de parceiros, contatos e doações; a seção de banco explica entidades, campos e relacionamentos para apoiar a futura implementação com banco gerenciado.
- **Publicação estática** com uma etapa de build sem dependências: copia os arquivos do projeto para `dist/`, incluindo o manifesto de rotas.

## Estrutura do projeto
- `index.html`: shell da aplicação, navegação e regiões semânticas de conteúdo.
- `styles.css`: sistema visual, responsividade, componentes e animações.
- `app.js`: estado, dados de exemplo, filtros, renderização de tabelas/cards, modais e persistência local.
- `public/manus-routes.json`: manifesto das rotas do site.
- `app.config.ts`: metadado de logo do projeto.
- `plan.md` e `TODO.md`: decisões e critérios de entrega.

## Direção visual

### Alternativas consideradas
- **Brutalismo editorial colorido** — 0,07: mais expressivo, porém menos adequado a um painel operacional.
- **Dashboard neoindustrial** — 0,06: forte e técnico, mas poderia endurecer demais a narrativa comunitária.
- **Sistema cívico solar** — 0,08: interface operacional com calor humano, transparência e cor vinculada à pintura comunitária.

### Escolha: Sistema cívico solar

- **Design Movement:** civic-tech editorial com referências de dashboards de impacto social e materiais de pintura.
- **Core Principles:** clareza operacional; calor comunitário; dados em primeiro plano; progresso visível.
- **Color Philosophy:** marinho profundo para confiança e legibilidade; off-white quente como base de caderno de campo; coral/tangerina como assinatura energética; verde e amarelo apenas para estados positivos e atenção.
- **Layout Paradigm:** rail lateral fixo e canvas assimétrico; cards com recortes e faixas de cor, evitando uma grade perfeitamente homogênea.
- **Signature Elements:** marca em forma de gota/rolo; linha de progresso com nós conectados; pílulas de status com borda de marcador.
- **Interaction Philosophy:** cada ação deve deixar o estado explícito; filtros e formulários respondem imediatamente sem navegação confusa.
- **Animation:** entrada curta em fade/slide para blocos; microelevação em hover; progresso com transição suave; respeito a `prefers-reduced-motion`.
- **Typography System:** `Arial`/`Helvetica Neue` para leitura e `Georgia` para títulos editoriais, criando contraste entre operação e propósito.
- **Brand Essence:** “A infraestrutura digital que transforma parceria em cor na comunidade.” Personalidade: acolhedora, precisa, mobilizadora.
- **Brand Voice:** headlines diretas e humanas; CTAs orientados à ação. Exemplos: “Dê visibilidade ao próximo passo.” e “Cada registro aproxima a tinta da escadaria.”
- **Wordmark & Logo:** “R+” formado por um sinal de soma integrado a uma gota de tinta, acompanhado do nome R+Cidades em caixa alta compacta.
- **Signature Brand Color:** coral tangerina `#F26A4F`, associada ao gesto humano de pintar e ao destaque de cada avanço no pipeline.

## Dados de demonstração
O produto será alimentado com empresas e parceiros fictícios, mas plausíveis, relacionados a tintas, construção, logística, ferramentas e apoio comunitário. Nenhum dado pessoal real será solicitado ou exposto.

## Limites e decisões
- O protótipo não executa login nem grava em banco remoto; a estrutura de banco é apresentada e os dados são persistidos localmente para a demonstração.
- Os campos obrigatórios e opcionais serão sinalizados no formulário.
- A publicação será estática; o futuro backend poderá substituir o adaptador de `localStorage` sem alterar a experiência principal.
