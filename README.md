# R+Cidades — Parceiros e doações

Protótipo funcional do time de Desenvolvimento de Sistemas (Grupo 01) para o projeto R+Cidades / Cor na Comunidade.

## Executar localmente

Como o site é estático e não depende de pacotes, basta servir a pasta em um servidor HTTP:

```bash
python3 -m http.server 3000 --bind 0.0.0.0
```

Abra `http://localhost:3000`.

## O que está incluído

- Dashboard de captação com indicadores e atividade recente.
- Pipeline de doações com as sete etapas do processo.
- Cadastro e edição de parceiros e empresas.
- Registro e edição de doações, filtros por status e busca.
- Persistência local no navegador via `localStorage`.
- Documentação visual da estrutura inicial do banco e dos relacionamentos.
- Manifesto de rotas em `manus-routes.json`.

Os dados exibidos são demonstrativos e podem ser restaurados pelo botão **Restaurar demonstração** no pipeline.
