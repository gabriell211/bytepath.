# BytePath — site de programação + experimento nCage (opcional)

Site estático em HTML, CSS e JavaScript ES Modules, em português brasileiro, pronto para publicar como **projeto estático**. Sem dependências de build, contas, backend ou telemetria.

## O que foi implementado

- Portal de programação com 12 trilhas com links reais para documentações gratuitas, navegação, seções e layout responsivo.
- Experimento **consensual** no próprio site, explicitamente descrito antes de ativar.
- Substituição pseudoaleatória determinística por imagem: começa com chance **1%**, aumenta **1 ponto percentual por dia de calendário local** e termina em **100%** no dia 100. Não há garantia de que uma imagem apareça substituída no primeiro dia em páginas com poucas imagens.
- Preferências no `localStorage`, com opção de desativar e zerar o progresso.
- Botão de prévia temporária (3,5s) sem instalar nada.
- Ao abrir o site pela primeira vez na sessão, um convite identificado apresenta a instalação da **nCage+ oficial**, com opção de continuar sem instalar.
- O rodapé não exibe mais o texto “Feito para quem gosta de aprender e brincar com código” nem o link de preferências.
- Link da **nCage+ oficial**: https://chromewebstore.google.com/detail/ncage%2B/blenoallcdijagcfhdbidjiimoandabh?hl=pt-BR

## O que **não** faz

- Não instala extensões automaticamente ou sem ciência do visitante.
- Não altera configurações da nCage+ oficial, nem ativa seu aumento gradual. Essas opções devem ser configuradas **na própria extensão**, e a disponibilidade de incremento exato de +1pp/dia não foi confirmada na extensão oficial.
- Não altera imagens de outros sites.
- Não obtém qualquer dado da navegação, não solicita permissões ou tenta imitar alertas de cookies.

## Rodar localmente

```bash
cd bytepath-ncage-site
python -m http.server 8080
```

Abrir http://localhost:8080. Também funciona com servidores estáticos de Vercel, Netlify e GitHub Pages. Módulos JS não executam corretamente ao abrir `index.html` via `file://`; use um servidor HTTP.

## Testes

```bash
npm test
```

## Instalar nCage+ original

1. Abra o link oficial da Chrome Web Store que aparece na página.
2. Clique em **Usar no Chrome** e confirme as permissões exibidas pelo navegador.
3. Abra as preferências da extensão original e selecione a biblioteca Nicolas Cage, 1% inicial e, se disponível, a opção de aumento gradual.
4. **Importante:** as preferências dessa extensão não podem ser preenchidas automaticamente por um site externo. A loja confirma que o aumento gradual existe, mas não documenta nesta página qual incremento diário exato é suportado.

## Licença de imagens e disponibilidade

Os desenhos dos cursos (`assets/trilha-*.svg`) são originais deste pacote. A foto de Nicolas Cage é requisitada em tempo de execução de https://upload.wikimedia.org/wikipedia/commons/3/33/Nicolas_Cage_2011_CC.jpg e exige internet para aparecer. A foto é de Gerald Geronimo, licença [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/); fonte: https://commons.wikimedia.org/wiki/File:Nicolas_Cage_2011_CC.jpg. Não foi empacotada por não estar disponível para download no ambiente de criação.

Este projeto é independente e não afiliado ao desenvolvedor da nCage+ ou ao Google.
