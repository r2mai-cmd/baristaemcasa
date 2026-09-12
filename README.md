# Barista em Casa — MVP 0.2

Interface inicial do produto em Next.js + TypeScript.

## Rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## O que já existe

- Navegação por métodos
- Receitas por método
- Ajuste de dose e água
- Proporção calculada
- Preparo passo a passo
- Timer guiado
- Favoritos locais (estado da sessão)
- Layout mobile
- Metadata básica para SEO

## Próxima etapa

A camada de dados deve ser separada em arquivos/rotas para permitir URLs indexáveis, por exemplo:

- `/metodos/v60`
- `/receitas/v60/equilibrado`
- `/calculadora`
- `/guias/moagem-para-v60`

Depois disso, vale adicionar Recipe JSON-LD, sitemap, Search Console/analytics e persistência de favoritos/histórico.
