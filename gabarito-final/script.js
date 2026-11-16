/* =========================================================
   Planilha Dinâmica de Controle Financeiro — VERSÃO FINAL
   Cada ETAPA indica as aulas do EAD que ela revisa.
   ========================================================= */

/* ---------------------------------------------------------
   ETAPA 1 — MODELANDO OS DADOS
   EAD: Variáveis (const/let) · Tipos primitivos ·
        Listas (Array) · Objetos · Listas de Objetos
   --------------------------------------------------------- */

const CHAVE_STORAGE = 'planilhaFinanceira.lancamentos';

const CATEGORIAS = [
  'Salário', 'Freelance', 'Moradia', 'Alimentação',
  'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros',
];

// Cada linha da planilha é um OBJETO. A planilha é uma LISTA DE OBJETOS.
// { id: 'lx3k9a', descricao: 'Aluguel', valor: 1200, tipo: 'saida', categoria: 'Moradia', data: '2026-11-05' }
let lancamentos = carregarLancamentos();
let idEmEdicao = null; // null = criando um novo | string = editando um existente

/* ---------------------------------------------------------
   ETAPA 2 — CAPTURANDO ELEMENTOS DO DOM
   EAD: Entendendo o DOM · Capturando Elementos DOM
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
   ETAPA 3 — FUNÇÕES UTILITÁRIAS
   EAD: Funções (declaração, parâmetros, retorno) ·
        Métodos de String e de Number
   --------------------------------------------------------- */

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// '2026-11-05' -> '05/11/2026'
function formatarData(dataISO) {
  return dataISO.split('-').reverse().join('/');
}

// Data de hoje no formato do <input type="date"> respeitando o fuso local
function hojeISO() {
  const hoje = new Date();
  hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
  return hoje.toISOString().slice(0, 10);
}

const normalizar = (texto) => texto.trim().toLowerCase();

const gerarId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ---------------------------------------------------------
   ETAPA 4 — REGRAS DE NEGÓCIO (a lógica da planilha)
   EAD: Operadores · Estruturas Condicionais ·
        Estruturas de Repetição (for...of) ·
        Métodos de Array (filter, reduce, sort, includes)
   --------------------------------------------------------- */

function validarLancamento(lancamento) {
  const erros = [];

  if (lancamento.descricao.length < 3) {
    erros.push('A descrição precisa ter pelo menos 3 caracteres.');
  }
  if (Number.isNaN(lancamento.valor) || lancamento.valor <= 0) {
    erros.push('Informe um valor maior que zero.');
  }
  if (lancamento.tipo !== 'entrada' && lancamento.tipo !== 'saida') {
    erros.push('Escolha se é uma entrada ou uma saída.');
  }
  if (!CATEGORIAS.includes(lancamento.categoria)) {
    erros.push('Escolha uma categoria.');
  }
  if (!lancamento.data) {
    erros.push('Informe a data.');
  }

  return erros;
}

// reduce: "espreme" a lista inteira em um único objeto de resumo
function calcularResumo(lista) {
  const resumo = lista.reduce(
    (acumulado, item) => {
      if (item.tipo === 'entrada') {
        acumulado.entradas += item.valor;
      } else {
        acumulado.saidas += item.valor;
      }
      return acumulado;
    },
    { entradas: 0, saidas: 0 }
  );

  resumo.saldo = resumo.entradas - resumo.saidas;
  return resumo;
}

// for...of + objeto como "dicionário": { Moradia: 1200, Lazer: 150, ... }
function gastosPorCategoria(lista) {
  const totais = {};

  for (const item of lista) {
    if (item.tipo !== 'saida') continue;
    totais[item.categoria] = (totais[item.categoria] || 0) + item.valor;
  }

  return totais;
}

function ordenar(lista, criterio) {
  const copia = lista.slice(); // sort altera o array original; ordenamos uma cópia

  switch (criterio) {
    case 'data-asc':
      return copia.sort((a, b) => a.data.localeCompare(b.data));
    case 'valor-desc':
      return copia.sort((a, b) => b.valor - a.valor);
    case 'valor-asc':
      return copia.sort((a, b) => a.valor - b.valor);
    case 'data-desc':
    default:
      return copia.sort((a, b) => b.data.localeCompare(a.data));
  }
}

function obterLancamentosVisiveis() {
  const busca = normalizar(filtroBusca.value);
  const tipo = filtroTipo.value;
  const mes = filtroMes.value; // '2026-11' ou ''

  const filtrados = lancamentos.filter((item) => {
    const casaBusca =
      normalizar(item.descricao).includes(busca) ||
      normalizar(item.categoria).includes(busca);
    const casaTipo = tipo === 'todos' || item.tipo === tipo;
    const casaMes = mes === '' || item.data.startsWith(mes);

    return casaBusca && casaTipo && casaMes;
  });

  return ordenar(filtrados, ordenacao.value);
}

/* ---------------------------------------------------------
   ETAPA 5 — RENDERIZANDO NA TELA
   EAD: Manipulando Atributos · Criar e Inserir Elementos
        Dinamicamente · forEach
   --------------------------------------------------------- */

function preencherCategorias() {
  CATEGORIAS.forEach((categoria) => {
    const opcao = document.createElement('option');
    opcao.value = categoria;
    opcao.textContent = categoria;
    campoCategoria.appendChild(opcao);
  });
}

function criarCelula(texto, rotulo, classe) {
  const td = document.createElement('td');
  td.textContent = texto; // textContent (e não innerHTML) evita injeção de HTML
  td.dataset.label = rotulo; // usado pelo CSS no layout mobile
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

  if (lista.length === 0) {
    const tr = document.createElement('tr');
    tr.className = 'linha-vazia';
    const td = document.createElement('td');
    td.colSpan = 6;
    td.textContent = lancamentos.length === 0
      ? 'Nenhum lançamento ainda. Adicione o primeiro ou clique em "Carregar exemplo".'
      : 'Nenhum lançamento encontrado com esses filtros.';
    tr.appendChild(td);
    corpoTabela.appendChild(tr);
    return;
  }

  lista.forEach((item) => {
    const tr = document.createElement('tr');
    tr.classList.add(`linha--${item.tipo}`);
    if (item.id === idEmEdicao) tr.classList.add('linha--editando');

    const ehEntrada = item.tipo === 'entrada';

    const celulaTipo = criarCelula('', 'Tipo');
    const badge = document.createElement('span');
    badge.className = `badge badge--${item.tipo}`;
    badge.textContent = ehEntrada ? 'Entrada' : 'Saída';
    celulaTipo.appendChild(badge);

    const celulaAcoes = document.createElement('td');
    celulaAcoes.className = 'celula-acoes';
    celulaAcoes.append(
      criarBotao('Editar', 'editar', item.id, `Editar ${item.descricao}`),
      criarBotao('Excluir', 'excluir', item.id, `Excluir ${item.descricao}`)
    );

    tr.append(
      criarCelula(formatarData(item.data), 'Data'),
      criarCelula(item.descricao, 'Descrição', 'celula-descricao'),
      criarCelula(item.categoria, 'Categoria'),
      celulaTipo,
      criarCelula(`${ehEntrada ? '+' : '−'} ${formatarMoeda(item.valor)}`, 'Valor', 'celula-valor'),
      celulaAcoes
    );

    corpoTabela.appendChild(tr);
  });
}

function renderizarResumo(lista) {
  const { entradas, saidas, saldo } = calcularResumo(lista);

  elTotalEntradas.textContent = formatarMoeda(entradas);
  elTotalSaidas.textContent = formatarMoeda(saidas);
  elSaldo.textContent = formatarMoeda(saldo);
  elSaldo.classList.toggle('negativo', saldo < 0);

  // Quanto das entradas já foi gasto? (operadores + if / else if)
  let percentual = 0;
  if (entradas > 0) {
    percentual = (saidas / entradas) * 100;
  } else if (saidas > 0) {
    percentual = 100;
  }

  elBarraGasto.style.width = `${Math.min(percentual, 100)}%`;
  elBarraGasto.classList.toggle('alerta', percentual >= 70 && percentual < 100);
  elBarraGasto.classList.toggle('perigo', percentual >= 100);
  elPercentualGasto.textContent = `${percentual.toFixed(0)}% das entradas já foram gastos`;

  totalFiltrado.textContent = formatarMoeda(saldo);
  contadorLinhas.textContent = lista.length;
}

function renderizarCategorias(lista) {
  listaCategorias.innerHTML = '';

  // Object.entries transforma { Moradia: 1200 } em [['Moradia', 1200]]
  const ranking = Object.entries(gastosPorCategoria(lista)).sort((a, b) => b[1] - a[1]);

  if (ranking.length === 0) {
    const li = document.createElement('li');
    li.innerHTML = '<span class="vazio">Sem saídas no período.</span>';
    listaCategorias.appendChild(li);
    return;
  }

  const maiorGasto = ranking[0][1];

  for (const [categoria, total] of ranking) {
    const li = document.createElement('li');

    const nome = document.createElement('span');
    nome.textContent = categoria;

    const valor = document.createElement('span');
    valor.className = 'valor';
    valor.textContent = formatarMoeda(total);

    const barra = document.createElement('div');
    barra.className = 'barra';
    const preenchimento = document.createElement('div');
    preenchimento.className = 'barra__preenchimento';
    preenchimento.style.width = `${(total / maiorGasto) * 100}%`;
    barra.appendChild(preenchimento);

    li.append(nome, valor, barra);
    listaCategorias.appendChild(li);
  }
}

// Uma única função que redesenha tudo a partir do estado (o array)
function renderizar() {
  const visiveis = obterLancamentosVisiveis();
  renderizarTabela(visiveis);
  renderizarResumo(visiveis);
  renderizarCategorias(visiveis);
}

/* ---------------------------------------------------------
   ETAPA 6 — INTERAÇÃO DO USUÁRIO (CRUD)
   EAD: Eventos do DOM · Event Listener ·
        Métodos de Array (push, find, findIndex, splice, filter)
   --------------------------------------------------------- */

function mostrarErros(erros) {
  mensagemErro.innerHTML = '';
  const ul = document.createElement('ul');
  erros.forEach((erro) => {
    const li = document.createElement('li');
    li.textContent = erro;
    ul.appendChild(li);
  });
  mensagemErro.appendChild(ul);
  mensagemErro.hidden = false;
}

function resetarFormulario() {
  form.reset();
  campoData.value = hojeISO();
  mensagemErro.hidden = true;
  idEmEdicao = null;
  tituloForm.textContent = 'Novo lançamento';
  botaoSalvar.textContent = 'Adicionar';
  botaoCancelar.hidden = true;
}

function salvarLancamento(evento) {
  evento.preventDefault(); // impede o recarregamento da página

  const dados = {
    descricao: campoDescricao.value.trim(),
    valor: Math.round(parseFloat(campoValor.value) * 100) / 100,
    tipo: form.elements.tipo.value,
    categoria: campoCategoria.value,
    data: campoData.value,
  };

  const erros = validarLancamento(dados);
  if (erros.length > 0) {
    mostrarErros(erros);
    return;
  }

  if (idEmEdicao) {
    const indice = lancamentos.findIndex((item) => item.id === idEmEdicao);
    dados.id = idEmEdicao;
    lancamentos.splice(indice, 1, dados); // troca o item antigo pelo novo
  } else {
    dados.id = gerarId();
    lancamentos.push(dados);
  }

  salvarNoStorage();
  resetarFormulario();
  renderizar();
  campoDescricao.focus();
}

function iniciarEdicao(id) {
  const item = lancamentos.find((l) => l.id === id);
  if (!item) return;

  idEmEdicao = id;
  campoDescricao.value = item.descricao;
  campoValor.value = item.valor;
  campoData.value = item.data;
  campoCategoria.value = item.categoria;
  form.elements.tipo.value = item.tipo;

  tituloForm.textContent = 'Editando lançamento';
  botaoSalvar.textContent = 'Salvar alterações';
  botaoCancelar.hidden = false;
  mensagemErro.hidden = true;

  renderizar(); // destaca a linha em edição
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  campoDescricao.focus({ preventScroll: true });
}

function excluirLancamento(id) {
  const item = lancamentos.find((l) => l.id === id);
  if (!item) return;

  const confirmou = confirm(`Excluir "${item.descricao}" (${formatarMoeda(item.valor)})?`);
  if (!confirmou) return;

  lancamentos = lancamentos.filter((l) => l.id !== id);
  if (idEmEdicao === id) resetarFormulario();

  salvarNoStorage();
  renderizar();
}

function carregarExemplo() {
  if (lancamentos.length > 0 && !confirm('Isso vai substituir os lançamentos atuais. Continuar?')) {
    return;
  }

  const mes = hojeISO().slice(0, 7); // '2026-11'
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

  // map: transforma cada array "cru" em um objeto de lançamento
  lancamentos = exemplos.map(([descricao, valor, tipo, categoria, dia]) => ({
    id: gerarId(),
    descricao,
    valor,
    tipo,
    categoria,
    data: `${mes}-${dia}`,
  }));

  salvarNoStorage();
  resetarFormulario();
  renderizar();
}

function limparTudo() {
  if (lancamentos.length === 0) return;
  if (!confirm('Apagar todos os lançamentos? Essa ação não pode ser desfeita.')) return;

  lancamentos = [];
  salvarNoStorage();
  resetarFormulario();
  renderizar();
}

/* ---------------------------------------------------------
   ETAPA 7 — PERSISTÊNCIA
   EAD: Armazenamento Web (Local Storage) ·
        Lidando com erros (try/catch)
   --------------------------------------------------------- */

function carregarLancamentos() {
  try {
    const salvo = localStorage.getItem(CHAVE_STORAGE);
    const lista = salvo ? JSON.parse(salvo) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (erro) {
    console.error('Não foi possível ler os dados salvos:', erro);
    return [];
  }
}

function salvarNoStorage() {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lancamentos));
  } catch (erro) {
    console.error('Não foi possível salvar os dados:', erro);
  }
}

/* ---------------------------------------------------------
   INICIALIZAÇÃO — ligando os eventos
   --------------------------------------------------------- */

form.addEventListener('submit', salvarLancamento);
botaoCancelar.addEventListener('click', () => {
  resetarFormulario();
  renderizar();
});

// Delegação de eventos: UM listener no <tbody> atende os botões de todas as linhas
corpoTabela.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button[data-acao]');
  if (!botao) return;

  if (botao.dataset.acao === 'editar') iniciarEdicao(botao.dataset.id);
  if (botao.dataset.acao === 'excluir') excluirLancamento(botao.dataset.id);
});

filtroBusca.addEventListener('input', renderizar);
filtroTipo.addEventListener('change', renderizar);
filtroMes.addEventListener('change', renderizar);
ordenacao.addEventListener('change', renderizar);

botaoExemplo.addEventListener('click', carregarExemplo);
botaoLimpar.addEventListener('click', limparTudo);

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && idEmEdicao) {
    resetarFormulario();
    renderizar();
  }
});

preencherCategorias();
campoData.value = hojeISO();
renderizar();
