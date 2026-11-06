/* =========================================================
   Planilha Dinâmica de Controle Financeiro — VERSÃO INICIAL
   ---------------------------------------------------------
   O HTML e o CSS já estão prontos. Nossa missão hoje é dar
   vida à página com JavaScript, etapa por etapa.

   Procure pelos comentários "TODO" — cada um é um passo da aula.
   Dica: deixe o Console aberto (F12) o tempo todo. Errar faz
   parte; o Console é onde o erro vira pista.
   ========================================================= */

/* ---------------------------------------------------------
   ETAPA 1 — MODELANDO OS DADOS  (≈15 min)
   EAD: Variáveis · Tipos primitivos · Arrays · Objetos ·
        Listas de Objetos
   --------------------------------------------------------- */

const CHAVE_STORAGE = 'planilhaFinanceira.lancamentos';

// TODO 1.1 — Crie um array com as categorias da planilha.
// Sugestão: Salário, Freelance, Moradia, Alimentação, Transporte,
//           Saúde, Educação, Lazer, Outros
const CATEGORIAS = [];

// TODO 1.2 — Cada linha da planilha será um OBJETO. Escreva no Console
// um objeto de exemplo com: id, descricao, valor, tipo ('entrada' | 'saida'),
// categoria e data ('AAAA-MM-DD'). Depois, crie uma lista com 3 deles
// e teste: lista[0].valor, lista.length, lista[2].categoria...

let lancamentos = carregarLancamentos(); // a lista de objetos (estado da aplicação)
let idEmEdicao = null;

/* ---------------------------------------------------------
   ETAPA 2 — CAPTURANDO ELEMENTOS DO DOM  (já pronto)
   EAD: Entendendo o DOM · Capturando Elementos
   Repare: cada id aqui existe no index.html.
   --------------------------------------------------------- */

const form = document.getElementById('form-lancamento');
const campoDescricao = document.getElementById('descricao');
const campoValor = document.getElementById('valor');
const campoData = document.getElementById('data');
const campoCategoria = document.getElementById('categoria');
const mensagemErro = document.getElementById('mensagem-erro');
const tituloForm = document.getElementById('titulo-form');
const botaoSalvar = document.getElementById('botao-salvar');
const botaoCancelar = document.getElementById('botao-cancelar');

const filtroBusca = document.getElementById('filtro-busca');
const filtroTipo = document.getElementById('filtro-tipo');
const filtroMes = document.getElementById('filtro-mes');
const ordenacao = document.getElementById('ordenacao');

const corpoTabela = document.getElementById('corpo-tabela');
const totalFiltrado = document.getElementById('total-filtrado');
const contadorLinhas = document.getElementById('contador-linhas');

const elTotalEntradas = document.getElementById('total-entradas');
const elTotalSaidas = document.getElementById('total-saidas');
const elSaldo = document.getElementById('saldo');
const elBarraGasto = document.getElementById('barra-gasto');
const elPercentualGasto = document.getElementById('percentual-gasto');
const listaCategorias = document.getElementById('lista-categorias');

const botaoExemplo = document.getElementById('botao-exemplo');
const botaoLimpar = document.getElementById('botao-limpar');

/* ---------------------------------------------------------
   ETAPA 3 — FUNÇÕES UTILITÁRIAS  (já pronto — leia com calma)
   EAD: Funções · Métodos de String e Number
   --------------------------------------------------------- */

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(dataISO) {
  return dataISO.split('-').reverse().join('/');
}

function hojeISO() {
  const hoje = new Date();
  hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
  return hoje.toISOString().slice(0, 10);
}

const normalizar = (texto) => texto.trim().toLowerCase();

const gerarId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ---------------------------------------------------------
   ETAPA 4 — REGRAS DE NEGÓCIO  (≈20 min)
   EAD: Operadores · Condicionais · Repetição ·
        Métodos de Array (reduce, filter, includes, sort)
   Teste cada função no Console antes de ligar na tela!
   --------------------------------------------------------- */

function validarLancamento(lancamento) {
  const erros = [];
  // TODO 4.1 — Adicione mensagens em "erros" quando:
  //  - descricao tiver menos de 3 caracteres
  //  - valor não for número (Number.isNaN) ou for <= 0
  //  - categoria não estiver em CATEGORIAS (includes)
  //  - data estiver vazia
  return erros;
}

function calcularResumo(lista) {
  // TODO 4.2 — Some entradas e saídas.
  // 1º faça com for...of; depois refatore com reduce.
  // Retorne { entradas, saidas, saldo }
  return { entradas: 0, saidas: 0, saldo: 0 };
}

function gastosPorCategoria(lista) {
  // TODO 4.3 (bônus) — Retorne um objeto { Moradia: 1350, Lazer: 132.5, ... }
  // somando apenas as SAÍDAS.
  return {};
}

function ordenar(lista, criterio) {
  // TODO 5.3 — Use switch (criterio) com os casos:
  // 'data-desc', 'data-asc', 'valor-desc', 'valor-asc'
  // Atenção: sort altera o array original. Ordene uma cópia (slice).
  return lista;
}

function obterLancamentosVisiveis() {
  // TODO 6.1 — Aplique os filtros com filter:
  //  - busca (filtroBusca.value) em descricao OU categoria
  //  - tipo (filtroTipo.value): 'todos' | 'entrada' | 'saida'
  //  - mês (filtroMes.value): '2026-11' -> use startsWith
  // Depois retorne ordenar(filtrados, ordenacao.value)
  return lancamentos;
}

/* ---------------------------------------------------------
   ETAPA 5 — RENDERIZANDO NA TELA  (≈25 min)
   EAD: Manipulando Atributos · Criar e Inserir Elementos
   --------------------------------------------------------- */

function preencherCategorias() {
  // TODO 5.1 — Para cada categoria, crie um <option> e insira em campoCategoria.
}

// Helpers prontos: criam células e botões da tabela com segurança (textContent)
function criarCelula(texto, rotulo, classe) {
  const td = document.createElement('td');
  td.textContent = texto;
  td.dataset.label = rotulo; // o CSS usa isso no celular
  if (classe) td.className = classe;
  return td;
}

function criarBotao(texto, acao, id, rotuloAcessivel) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = `botao-icone botao-icone--${acao}`;
  botao.textContent = texto;
  botao.dataset.acao = acao;
  botao.dataset.id = id;
  botao.setAttribute('aria-label', rotuloAcessivel);
  return botao;
}

function renderizarTabela(lista) {
  corpoTabela.innerHTML = '';
  // TODO 5.2 — Para cada item da lista:
  //  1. crie um <tr> com a classe `linha--${item.tipo}`
  //  2. adicione as células: Data, Descrição, Categoria, Tipo, Valor
  //     (use criarCelula, formatarData e formatarMoeda)
  //  3. adicione uma <td class="celula-acoes"> com os botões
  //     criarBotao('Editar', 'editar', item.id, ...) e 'Excluir'
  //  4. insira o <tr> no corpoTabela
  // Extra: se a lista estiver vazia, mostre uma linha "Nenhum lançamento".
}

function renderizarResumo(lista) {
  // TODO 5.4 — Use calcularResumo(lista) e preencha:
  // elTotalEntradas, elTotalSaidas, elSaldo, totalFiltrado e contadorLinhas
  // Extra: barra de gasto -> elBarraGasto.style.width = `${percentual}%`
}

function renderizarCategorias(lista) {
  // TODO 5.5 (bônus) — Monte a lista "Gastos por categoria" usando
  // Object.entries(gastosPorCategoria(lista))
}

function renderizar() {
  const visiveis = obterLancamentosVisiveis();
  renderizarTabela(visiveis);
  renderizarResumo(visiveis);
  renderizarCategorias(visiveis);
}

/* ---------------------------------------------------------
   ETAPA 6 — INTERAÇÃO DO USUÁRIO  (≈25 min)
   EAD: Eventos do DOM · Event Listener ·
        push, find, findIndex, splice, filter
   --------------------------------------------------------- */

function salvarLancamento(evento) {
  // TODO 6.2 — O coração da planilha:
  //  1. evento.preventDefault()
  //  2. monte o objeto "dados" lendo os campos do formulário
  //     (tipo: form.elements.tipo.value | valor: parseFloat(...))
  //  3. valide com validarLancamento; se houver erros, mostre em mensagemErro
  //  4. se idEmEdicao existir, substitua (findIndex + splice); senão, push com gerarId()
  //  5. salvarNoStorage(), form.reset(), renderizar()
}

function iniciarEdicao(id) {
  // TODO 6.4 (desafio) — Encontre o item (find), preencha o formulário,
  // guarde o id em idEmEdicao e mude o texto do botão para "Salvar alterações".
}

function excluirLancamento(id) {
  // TODO 6.3 — Confirme com confirm(), remova com filter, salve e renderize.
}

function carregarExemplo() {
  // Pronto: popula a planilha com dados de exemplo do mês atual.
  const mes = hojeISO().slice(0, 7);
  const exemplos = [
    ['Salário', 4200, 'entrada', 'Salário', '05'],
    ['Projeto landing page', 850, 'entrada', 'Freelance', '12'],
    ['Aluguel', 1350, 'saida', 'Moradia', '06'],
    ['Mercado do mês', 780.45, 'saida', 'Alimentação', '08'],
    ['Cartão transporte', 220, 'saida', 'Transporte', '02'],
    ['Curso de inglês', 289.9, 'saida', 'Educação', '10'],
    ['Cinema e pizza', 132.5, 'saida', 'Lazer', '14'],
    ['Farmácia', 64.3, 'saida', 'Saúde', '03'],
  ];
  lancamentos = exemplos.map(([descricao, valor, tipo, categoria, dia]) => ({
    id: gerarId(), descricao, valor, tipo, categoria, data: `${mes}-${dia}`,
  }));
  salvarNoStorage();
  renderizar();
}

/* ---------------------------------------------------------
   ETAPA 7 — PERSISTÊNCIA  (≈10 min)
   EAD: Local Storage · Lidando com erros (try/catch)
   --------------------------------------------------------- */

function carregarLancamentos() {
  // TODO 7.1 — Leia localStorage.getItem(CHAVE_STORAGE), converta com
  // JSON.parse e retorne a lista. Proteja com try/catch e retorne [] se falhar.
  return [];
}

function salvarNoStorage() {
  // TODO 7.2 — localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lancamentos))
}

/* ---------------------------------------------------------
   INICIALIZAÇÃO
   --------------------------------------------------------- */

form.addEventListener('submit', salvarLancamento);

// TODO 6.3 — Delegação de eventos: um único listener no corpoTabela.
// Descubra qual botão foi clicado com evento.target.closest('button[data-acao]')
// e chame iniciarEdicao(id) ou excluirLancamento(id).

// TODO 6.1 — Ligue os filtros: 'input' na busca, 'change' nos selects/mês.

botaoExemplo.addEventListener('click', carregarExemplo);

preencherCategorias();
campoData.value = hojeISO();
renderizar();
