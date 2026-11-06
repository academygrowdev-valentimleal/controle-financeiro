# Planilha Dinâmica de Controle Financeiro

Aplicação web para registrar entradas e saídas e acompanhar o saldo em tempo real, feita apenas com **HTML, CSS e JavaScript** (sem bibliotecas).

## Funcionalidades
- Cadastro de lançamentos com validação (descrição, tipo, valor, data, categoria)
- Edição e exclusão de lançamentos
- Resumo automático: entradas, saídas, saldo e % das entradas já gastas
- Gastos por categoria com barras proporcionais
- Busca, filtro por tipo e por mês, ordenação por data ou valor
- Dados salvos no navegador (localStorage)
- Layout responsivo: no celular a tabela vira cartões

## Como rodar
Abra `index.html` no navegador, ou use a extensão **Live Server** do VS Code (botão direito → *Open with Live Server*).

## Conceitos praticados
Variáveis, tipos, arrays e objetos · operadores · condicionais (`if`, `switch`) · repetição (`for...of`) · funções e arrow functions · métodos de String, Number e Array (`filter`, `reduce`, `map`, `find`, `findIndex`, `splice`, `sort`, `includes`) · DOM (captura, criação de elementos, atributos, `dataset`, `classList`) · eventos e delegação de eventos · localStorage + JSON · `try/catch`.

---

## Pré-requisito EAD (cumprir antes do encontro)

| Módulo EAD | Blocos obrigatórios | Usado na etapa |
|---|---|---|
| Fundamentos da Programação em JS | Fundamentação, Variáveis, Dados Básicos, Dados Estruturados | 1 |
| Fundamentos da Programação em JS | Operadores, Estruturas Condicionais, Estruturas de Repetição, Escopos, Funções | 3 e 4 |
| Práticas Avançadas em JS | Métodos de String, Number e Arrays (push, filter, find/findIndex, forEach/map, slice/splice, includes, sort, reduce) | 4, 5 e 6 |
| Práticas Avançadas em JS | Erros no JavaScript + Modo debug do browser | durante todo o encontro, 7 |
| Tópicos Avançados de Front-End | JavaScript para o Front-End (DOM, atributos, criar/excluir elementos, eventos, Event Listener, Local Storage) | 2, 5, 6 e 7 |