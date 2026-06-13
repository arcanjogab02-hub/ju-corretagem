/**
 * CRM Juliana Alves — Google Sheets + Apps Script  (v2 — Painel de Ação)
 * =====================================================================
 * A planilha é só o motor (banco). Toda a gestão acontece no WEB APP:
 *   - feed de cards mobile
 *   - muda etapa com 1 toque (Novo → Conversando → Visita → Fechado/Perdido)
 *   - "Responder" abre o WhatsApp do lead E marca "Conversando" sozinho
 *   - resumo diário no WhatsApp da Ju
 * Ninguém precisa abrir a planilha.
 *
 * Depois de colar/editar este código: Implantar → Gerenciar implantações →
 * ✏ editar → Versão: Nova → Implementar (a URL /exec continua a mesma).
 */

var ABA_LEADS   = 'Leads';
var ABA_PAINEL  = 'Painel';
var ABA_VISITAS = 'Visitas';

var COLUNAS = ['Data/Hora','Nome','WhatsApp','Interesse','Página','Origem','Status','Observações','IA Perfil','IA Score','IA Sugestão'];
// 4 etapas + Perdido
var STATUS_LISTA = ['Novo','Conversando','Visita','Fechado','Perdido'];
var STATUS_CORES = {Novo:'#ffffff', Conversando:'#cfe0ff', Visita:'#ffe9bf', Fechado:'#c8f7d8', Perdido:'#e0e0e0'};
var INTERESSES = [
  'Apartamento para morar',
  'Imóvel para investir / renda',
  'Lançamento na planta',
  'Casa / condomínio',
  'Lote / terreno'
];

/* ====================== NOTIFICAÇÃO / LEMBRETE ======================
 * E-MAIL: automático (vazio = e-mail dono do script).
 * WHATSAPP (notificação de lead novo + resumo diário) via CallMeBot:
 *   No WhatsApp, adicione +34 644 51 95 23, mande "I allow callmebot to
 *   send me messages", e o bot te devolve a apikey.
 * =================================================================== */
var EMAIL_NOTIFICACAO = '';   // ex: 'juliana@gmail.com'
var CALLMEBOT_PHONE   = '';   // ex: '5563992226998'  (quem recebe os avisos)
var CALLMEBOT_APIKEY  = '';   // apikey do CallMeBot

/* RELATÓRIO MENSAL (dia 1) — leitura por IA é OPCIONAL.
 * Sem chave = leitura automática por código (heurística). Funciona, de graça.
 * Com chave = leitura escrita pela IA da Anthropic (análise mais rica — Sonnet 4.6).
 *
 * ⚠ SEGURANÇA: a chave NÃO fica neste arquivo (ele vai pro GitHub). Ela mora nas
 * Propriedades do Script — um cofre do próprio projeto, que não é versionado:
 *   ⚙ Configurações do projeto → Propriedades do script → Adicionar propriedade
 *   Propriedade:  ANTHROPIC_APIKEY      Valor:  sk-ant-...
 * Salvou ali, o código lê sozinho. (Deixe a linha abaixo VAZIA.)
 * Sonnet escreve análise mais rica; Haiku ('claude-haiku-4-5') é ~3x mais barato.
 * Os dois custam centavos por relatório. */
var ANTHROPIC_APIKEY         = '';   // NÃO cole a chave aqui — use as Propriedades do Script (ver acima)
var ANTHROPIC_MODELO         = 'claude-sonnet-4-6';   // relatório MENSAL (vitrine — escrita mais rica)
var ANTHROPIC_MODELO_SEMANAL = 'claude-haiku-4-5';    // recomendação SEMANAL (rápida, prática e barata)

/** Lê a chave do cofre (Propriedades do Script). Só usa a var local se alguém preenchê-la. */
function _anthropicKey(){
  try { var k = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_APIKEY'); if (k) return k; } catch(e){}
  return ANTHROPIC_APIKEY || '';
}

/** Chama a IA da Anthropic com um prompt + modelo. Retorna o texto, ou null se sem chave/erro. */
function _chamarIA(prompt, modelo){
  var apikey = _anthropicKey();
  if (!apikey) return null;
  try {
    var resp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method:'post', contentType:'application/json', muteHttpExceptions:true,
      headers:{ 'x-api-key':apikey, 'anthropic-version':'2023-06-01' },
      payload: JSON.stringify({ model:(modelo||ANTHROPIC_MODELO), max_tokens:400, messages:[{role:'user', content:prompt}] })
    });
    if (resp.getResponseCode()!==200) return null;
    var j = JSON.parse(resp.getContentText());
    return (j.content && j.content[0] && j.content[0].text) ? j.content[0].text.trim() : null;
  } catch(e){ return null; }
}

/* ============================ ENTRADA DE LEAD ============================ */
function doPost(e){
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var dados = {};
    try { dados = JSON.parse(e.postData.contents); } catch(err){ dados = e.parameter || {}; }
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // PING de visita (não é lead) → registra na aba Visitas e encerra
    if (dados.tipo === 'visita') {
      var shv = ss.getSheetByName(ABA_VISITAS) || criaAbaVisitas(ss);
      shv.appendRow([ new Date(), (dados.pagina||'').toString().substring(0,30), (dados.origem||'direto').toString().substring(0,120) ]);
      return ContentService.createTextOutput(JSON.stringify({ok:true,tipo:'visita'})).setMimeType(ContentService.MimeType.JSON);
    }

    var sh = ss.getSheetByName(ABA_LEADS) || criaAbaLeads(ss);
    var agora = new Date();
    sh.appendRow([
      agora,
      (dados.nome||'').toString().substring(0,80),
      (dados.whatsapp||'').toString().substring(0,30),
      (dados.interesse||'').toString().substring(0,60),
      (dados.pagina||'').toString().substring(0,30),
      (dados.origem||'').toString().substring(0,120),
      'Novo',
      ''
    ]);
    try { notificar(dados, agora); } catch(errN){}
    // IA embarcada: analisa o lead recém-criado (perfil/score/sugestão) já na entrada.
    // Em try próprio — se a IA falhar, o lead já está salvo e notificado.
    try { analisarEGravar(sh.getLastRow()); } catch(errA){}
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch(err){
    return ContentService.createTextOutput(JSON.stringify({ok:false, erro:String(err)})).setMimeType(ContentService.MimeType.JSON);
  } finally { lock.releaseLock(); }
}

/* ====================== AÇÕES DO PAINEL (1 toque) ====================== */
function atualizarStatus(linha, status){
  if (STATUS_LISTA.indexOf(status) < 0) return false;
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA_LEADS).getRange(linha, 7).setValue(status);
  return true;
}
function salvarNota(linha, nota){
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA_LEADS).getRange(linha, 8).setValue((nota||'').toString().substring(0,300));
  return true;
}
function lerLeads(){
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA_LEADS);
  if (!sh) return [];
  var vals = sh.getDataRange().getValues();
  var out = [];
  for (var i=1; i<vals.length; i++){
    var r = vals[i];
    if (!r[1] && !r[2]) continue;
    out.push({
      linha: i+1,
      data: r[0] ? new Date(r[0]).getTime() : 0,
      nome: (r[1]||'(sem nome)').toString(),
      zap: (r[2]||'').toString(),
      zapLimpo: limpaZap(r[2]),
      interesse: (r[3]||'—').toString(),
      origem: (r[5]||'direto').toString(),
      status: (r[6]||'Novo').toString(),
      nota: (r[7]||'').toString(),
      perfilIA: (r[8]||'').toString(),
      scoreIA: (r[9]!=='' && r[9]!=null) ? (parseInt(r[9],10)||0) : 0,
      sugestaoIA: (r[10]||'').toString()
    });
  }
  return out;
}

function lerVisitas(){
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA_VISITAS);
  if (!sh) return [];
  var vals = sh.getDataRange().getValues();
  var out = [];
  for (var i=1; i<vals.length; i++){
    if (!vals[i][0]) continue;
    out.push({ data: new Date(vals[i][0]).getTime(), pagina: (vals[i][1]||'').toString(), origem: (vals[i][2]||'direto').toString() });
  }
  return out;
}

/* ====================== BI DA PÁGINA (automático) ====================== */
function calcularBI(leads, visitas){
  var tz = Session.getScriptTimeZone();
  function dia(ms){ return Utilities.formatDate(new Date(ms), tz, 'dd/MM'); }
  var totalV = visitas.length, totalL = leads.length;
  var conv = totalV ? Math.round((totalL/totalV)*1000)/10 : 0;

  // série dos últimos 14 dias
  var hoje = new Date(), serie = [], idx = {};
  for (var d=13; d>=0; d--){
    var k = Utilities.formatDate(new Date(hoje.getTime()-d*86400000), tz, 'dd/MM');
    idx[k] = serie.length; serie.push({dia:k, v:0, l:0});
  }
  function bump(ms, campo){ var k = dia(ms); if (idx[k]!==undefined) serie[idx[k]][campo]++; }
  visitas.forEach(function(x){ bump(x.data,'v'); });
  leads.forEach(function(x){ bump(x.data,'l'); });

  // por origem (visitas e leads) e por interesse (leads)
  var porOrigem = {}, porInteresse = {};
  visitas.forEach(function(x){ var o=x.origem||'direto'; (porOrigem[o]=porOrigem[o]||{v:0,l:0}).v++; });
  leads.forEach(function(x){ var o=x.origem||'direto'; (porOrigem[o]=porOrigem[o]||{v:0,l:0}).l++; });
  leads.forEach(function(x){ var i=x.interesse||'—'; porInteresse[i]=(porInteresse[i]||0)+1; });

  return { totalV:totalV, totalL:totalL, conv:conv, serie:serie, porOrigem:porOrigem, porInteresse:porInteresse };
}

function limpaZap(s){
  var d = (s||'').toString().replace(/\D/g,'');
  if (!d) return '';
  if (d.length <= 11) d = '55' + d;       // sem código do país → adiciona 55
  if (d.indexOf('55') !== 0) d = '55' + d;
  return d;
}

/* ====================== IA EMBARCADA — ANÁLISE POR LEAD ======================
 * Quando um lead entra (doPost) ou quando se aperta "Analisar" no painel, a IA
 * (Haiku — barata e rápida) faz 3 coisas e grava nas colunas I/J/K:
 *   • PERFIL    — que tipo de comprador é (Investidor, Pra morar, Lançamento…)
 *   • SCORE     — prioridade de atendimento 0-100 (o painel ordena por isso)
 *   • SUGESTÃO  — a 1ª mensagem de WhatsApp pronta, no tom da Ju (vai pré-preenchida)
 * Sem chave da Anthropic, cai numa análise heurística (de graça, sempre funciona).
 * Custo com Haiku: fração de centavo por lead. */

function perfilHeuristico(interesse){
  var i=(interesse||'').toLowerCase();
  if(i.indexOf('investir')>-1||i.indexOf('renda')>-1) return 'Investidor';
  if(i.indexOf('morar')>-1) return 'Pra morar';
  if(i.indexOf('lançamento')>-1||i.indexOf('lancamento')>-1||i.indexOf('planta')>-1) return 'Lançamento';
  if(i.indexOf('casa')>-1||i.indexOf('condom')>-1) return 'Casa/cond.';
  if(i.indexOf('lote')>-1||i.indexOf('terreno')>-1) return 'Terreno';
  return 'A definir';
}
function scoreHeuristico(lead){
  var s=55, o=(lead.origem||'').toLowerCase(), i=(lead.interesse||'').toLowerCase();
  if(o.indexOf('indicacao')>-1) s+=25;                 // indicação é o lead que mais converte
  else if(o.indexOf('story')>-1||o.indexOf('bio')>-1) s+=8;
  if(i.indexOf('investir')>-1||i.indexOf('renda')>-1) s+=12;   // investidor decide mais rápido
  if(i.indexOf('lançamento')>-1||i.indexOf('planta')>-1) s+=6;
  var h=(Date.now()-(lead.data||Date.now()))/3600000;
  if(h<6) s+=10; else if(h<24) s+=5;                   // quanto mais fresco, mais quente
  return Math.max(20,Math.min(98,s));
}
function sugestaoHeuristica(lead){
  var pn=(lead.nome||'').split(' ')[0]||'';
  return 'Oi'+(pn?' '+pn:'')+'! Aqui é a Juliana, corretora em Palmas. Vi que você procura '+
    (lead.interesse||'um imóvel').toLowerCase()+'. Tenho algumas opções que podem encaixar no seu perfil — posso te mandar?';
}

/** Análise via IA (Haiku). Retorna {perfil,score,sugestao} ou null se sem chave/erro. */
function analisarLeadIA(lead){
  var ctx='Você é assistente de uma corretora de imóveis em Palmas-TO (Juliana). '+
    'Analise o lead e responda APENAS um JSON válido, sem texto antes ou depois:\n'+
    '{"perfil":"<até 2 palavras>","score":<0-100>,"sugestao":"<1ª mensagem de WhatsApp>"}\n\n'+
    'perfil = tipo do comprador (ex: Investidor, Pra morar, Lançamento). '+
    'score = prioridade de atendimento 0-100 — indicação e investidor decidido pontuam mais alto; quanto mais recente, mais quente. '+
    'sugestao = a primeira mensagem que a Juliana mandaria, 1ª pessoa, tom leve e direto, citando o que o lead procura, máx 45 palavras, sem emoji.\n\n'+
    'LEAD: nome="'+(lead.nome||'')+'", procura="'+(lead.interesse||'')+'", veio de="'+(lead.origem||'direto')+'".';
  var raw=_chamarIA(ctx, ANTHROPIC_MODELO_SEMANAL);
  if(!raw) return null;
  try{
    var a=raw.indexOf('{'), b=raw.lastIndexOf('}');
    if(a<0||b<0) return null;
    var o=JSON.parse(raw.substring(a,b+1));
    var score=parseInt(o.score,10); if(isNaN(score)) score=scoreHeuristico(lead);
    return { perfil:(o.perfil||perfilHeuristico(lead.interesse)).toString().substring(0,24),
             score:Math.max(0,Math.min(100,score)),
             sugestao:(o.sugestao||sugestaoHeuristica(lead)).toString().substring(0,400) };
  }catch(e){ return null; }
}

/** Garante os cabeçalhos I/J/K (planilha antiga não tem). Idempotente e barato. */
function garantirHeaderIA(sh){
  var h=sh.getRange(1,9,1,3).getValues()[0];
  if(!h[0]&&!h[1]&&!h[2]){
    sh.getRange(1,9,1,3).setValues([['IA Perfil','IA Score','IA Sugestão']])
      .setBackground('#0c0c0c').setFontColor('#fff').setFontWeight('bold').setFontSize(11);
  }
}

/** Analisa o lead da linha e grava perfil/score/sugestão. Usa heurística se a IA falhar. */
function analisarEGravar(linha){
  var sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA_LEADS);
  if(!sh) return null;
  garantirHeaderIA(sh);
  var r=sh.getRange(linha,1,1,8).getValues()[0];
  var lead={ nome:(r[1]||'').toString(), interesse:(r[3]||'').toString(),
             origem:(r[5]||'direto').toString(), data:r[0]?new Date(r[0]).getTime():Date.now() };
  var a=analisarLeadIA(lead) || { perfil:perfilHeuristico(lead.interesse), score:scoreHeuristico(lead), sugestao:sugestaoHeuristica(lead) };
  sh.getRange(linha,9,1,3).setValues([[a.perfil, a.score, a.sugestao]]);
  return a;
}

/* ============================ PAINEL WEB (app) ============================ */
function doGet(e){
  var leads = lerLeads();
  var visitas = lerVisitas();
  var bi = calcularBI(leads, visitas);
  var html = APP_HTML()
    .replace('__DADOS__', function(){ return JSON.stringify(leads); })
    .replace('__BI__', function(){ return JSON.stringify(bi); })
    .replace('__STATUS__', function(){ return JSON.stringify(STATUS_LISTA); })
    .replace('__CORES__', function(){ return JSON.stringify(STATUS_CORES); });
  return HtmlService.createHtmlOutput(html)
    .setTitle('CRM · Juliana Alves')
    .addMetaTag('viewport','width=device-width, initial-scale=1');
}

function APP_HTML(){
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:-apple-system,Segoe UI,Roboto,sans-serif;-webkit-tap-highlight-color:transparent}
body{background:#0c0c0c;color:#f5f5f5;padding:16px 12px 80px}
.wrap{max-width:560px;margin:0 auto}
h1{font-size:19px;font-weight:600}h1 small{display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8f8f8f;font-weight:400;margin-top:3px}
.resumo{display:flex;gap:10px;margin:16px 0}
.rc{flex:1;background:#161616;border:1px solid #262626;border-radius:12px;padding:13px}
.rc b{font-size:24px;display:block;line-height:1}.rc span{font-size:10px;letter-spacing:.5px;text-transform:uppercase;color:#8f8f8f}
.filtros{display:flex;gap:8px;margin-bottom:14px;overflow-x:auto}
.filtros button{background:#161616;border:1px solid #262626;color:#cfcfcf;padding:9px 15px;border-radius:50px;font-size:13px;white-space:nowrap;cursor:pointer}
.filtros button.on{background:#fff;color:#0a0a0a;border-color:#fff;font-weight:600}
.card{background:#161616;border:1px solid #262626;border-radius:16px;padding:16px;margin-bottom:12px}
.card.frio{border-color:#5a2d2d}
.top{display:flex;align-items:center;gap:9px;margin-bottom:3px}
.dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.nome{font-size:17px;font-weight:600;flex:1}
.idade{font-size:12px;color:#8f8f8f}
.inter{font-size:13px;color:#bdbdbd;margin:2px 0 0 18px}
.resp{display:flex;align-items:center;justify-content:center;gap:8px;background:#25D366;color:#06310f;text-decoration:none;font-weight:600;font-size:14.5px;padding:12px;border-radius:11px;margin:13px 0 11px}
.resp svg{width:17px;height:17px;fill:#06310f}
.etapas{display:flex;gap:6px;flex-wrap:wrap}
.etapas .et{flex:1;min-width:60px;text-align:center;background:#1c1c1c;border:1px solid #2a2a2a;color:#bdbdbd;font-size:11.5px;padding:8px 4px;border-radius:9px;cursor:pointer}
.etapas .et.sel{background:#fff;color:#0a0a0a;border-color:#fff;font-weight:700}
.nota{margin-top:10px;display:flex;gap:7px;align-items:center}
.nota input{flex:1;background:#101010;border:1px solid #262626;color:#f5f5f5;border-radius:9px;padding:9px 11px;font-size:13px}
.nota button{background:#262626;border:none;color:#ccc;border-radius:9px;padding:9px 12px;font-size:12px;cursor:pointer}
.vazio{text-align:center;color:#5a5a5a;padding:50px 20px;font-size:14px}
.toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#fff;color:#000;padding:11px 20px;border-radius:50px;font-size:13px;font-weight:600;opacity:0;transition:.3s;pointer-events:none;z-index:99}
.toast.show{opacity:1}
.rfr{position:fixed;top:14px;right:14px;background:#161616;border:1px solid #262626;color:#ccc;width:38px;height:38px;border-radius:50%;font-size:16px;cursor:pointer}
.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:14px 0}
.kpi{background:#161616;border:1px solid #262626;border-radius:12px;padding:13px}
.kpi b{font-size:23px;display:block;line-height:1}.kpi span{font-size:9.5px;letter-spacing:.5px;text-transform:uppercase;color:#8f8f8f}
.kpi.hl b{color:#25D366}
.abas{display:flex;gap:8px;margin-bottom:16px}
.abas button{flex:1;background:#161616;border:1px solid #262626;color:#cfcfcf;padding:11px;border-radius:11px;font-size:13px;font-weight:500;cursor:pointer}
.abas button.on{background:#fff;color:#0a0a0a;border-color:#fff;font-weight:700}
.barra-exp{display:flex;justify-content:flex-end;margin-bottom:11px}
.btnexp{background:#161616;border:1px solid #262626;color:#cfcfcf;padding:9px 15px;border-radius:50px;font-size:12.5px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.btnexp:hover{background:#1c1c1c;border-color:#3a3a3a}
.secao{margin-bottom:24px}
.secao h3{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8f8f8f;margin-bottom:12px}
.chart{display:flex;align-items:flex-end;gap:3px;height:120px}
.col{flex:1;height:100%;display:flex;align-items:flex-end}
.col .bar{width:100%;background:#242424;border-radius:3px 3px 0 0;position:relative;min-height:2px}
.col .bar .lead{position:absolute;bottom:0;left:0;right:0;background:#25D366;border-radius:0 0 3px 3px}
.chart-x{display:flex;gap:3px;margin-top:5px}
.chart-x span{flex:1;text-align:center;font-size:8px;color:#6a6a6a;overflow:hidden}
.legenda{display:flex;gap:16px;font-size:10.5px;color:#8f8f8f;margin-top:10px}
.legenda i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:5px;vertical-align:middle}
.brow{display:flex;align-items:center;gap:9px;margin-bottom:9px;font-size:12px}
.brow .bl{width:135px;color:#cfcfcf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.brow .bt{flex:1;height:7px;background:#222;border-radius:50px;overflow:hidden}
.brow .bf{display:block;height:100%;background:#fff;border-radius:50px}
.brow b{width:26px;text-align:right}
/* contextual (mobile) */
.acx{margin-top:12px}
.bigwa{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;border:none;border-radius:11px;padding:13px;font-size:14.5px;font-weight:600;cursor:pointer;background:#25D366;color:#06310f;text-decoration:none}
.bigp{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;border:none;border-radius:11px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;background:#fff;color:#0a0a0a;margin-top:8px}
.ctx-sec{display:flex;gap:8px;margin-top:8px}
.ctx-sec button{flex:1;background:#1c1c1c;border:1px solid #2a2a2a;color:#cfcfcf;border-radius:9px;padding:10px;font-size:12.5px;cursor:pointer}
.ctx-sec .ok{color:#7fd4a8}.ctx-sec .no{color:#cf8a8a}
.ctx-hint{font-size:11px;color:#6a6a6a;margin-top:8px;text-align:center;font-style:italic}
.ctx-est{color:#8f8f8f}
/* IA: badges de perfil/score, sugestão e reativação */
.badges{display:flex;gap:6px;margin:7px 0 0 18px;flex-wrap:wrap}
.bperfil{font-size:10.5px;color:#cfcfcf;background:#1c1c1c;border:1px solid #2f2f2f;border-radius:50px;padding:3px 9px}
.bscore{font-size:10.5px;color:#0a0a0a;background:#e8c97a;border-radius:50px;padding:3px 9px;font-weight:700}
.bscore.morno{background:#bdbdbd}.bscore.frio2{background:#3a3a3a;color:#bdbdbd}
.sugia{background:#11140f;border:1px solid #2a3320;border-left:3px solid #25D366;border-radius:9px;padding:10px 12px;margin:11px 0 0;font-size:12.5px;color:#cfe6d4;line-height:1.5}
.sugia b{color:#7fd4a8;font-weight:600;display:block;font-size:10px;letter-spacing:.5px;text-transform:uppercase;margin-bottom:3px}
.reat-btn{background:#241a10 !important;color:#e8c97a !important;border:1px solid #4a3a1f !important}
.reatbox{margin-top:9px}
.reatbox .ger{font-size:12px;color:#8f8f8f;font-style:italic;text-align:center;padding:8px}
.reatmsg{background:#141414;border:1px solid #2a2a2a;border-radius:9px;padding:10px 12px;font-size:12.5px;color:#dcdcdc;line-height:1.5;margin-bottom:8px}
.kbadge{display:inline-block;font-size:9.5px;color:#0a0a0a;background:#e8c97a;border-radius:50px;padding:1px 7px;font-weight:700;margin-left:5px}
.kbadge.morno{background:#bdbdbd}.kbadge.frio2{background:#3a3a3a;color:#bdbdbd}
/* kanban (desktop) */
.board{display:flex;gap:10px;overflow-x:auto;padding-bottom:8px}
.kcol{flex:0 0 230px;background:#111;border:1px solid #1f1f1f;border-radius:13px;padding:10px}
.kbar{height:3px;border-radius:50px;margin:0 4px 9px}
.kh{display:flex;justify-content:space-between;align-items:center;padding:0 4px 9px}
.kh b{font-size:12px}.kh span{font-size:10px;color:#8f8f8f;background:#1c1c1c;border-radius:50px;padding:2px 9px}
.kcard{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;padding:11px;margin-bottom:8px}
.kcard.frio{border-color:#5a2d2d}
.kn{font-size:13px;font-weight:600}.ki{font-size:10.5px;color:#9a9a9a;margin:2px 0 8px}
.kwa{display:block;text-align:center;background:#16301f;color:#7fd4a8;text-decoration:none;border-radius:7px;padding:6px;font-size:11px;margin-bottom:7px}
.kmv{display:flex;gap:6px}.kmv button{flex:1;background:#262626;border:none;color:#cfcfcf;border-radius:7px;padding:7px;font-size:15px;cursor:pointer}
.kmv button:disabled{opacity:.25;cursor:default}
.kempty{font-size:10px;color:#5a5a5a;text-align:center;padding:12px}
/* tamanho do ícone WhatsApp nos botões */
.bigwa svg{width:17px;height:17px;fill:#06310f;flex-shrink:0}
.kwa svg{width:12px;height:12px;fill:#7fd4a8;vertical-align:-2px;margin-right:3px}
/* DESKTOP — painel largo + kanban ocupa a tela */
@media(min-width:760px){
  body{padding:20px 20px 60px}
  .wrap{max-width:1160px}
  h1,.kpis,.abas{max-width:600px;margin-left:auto;margin-right:auto}
  #viewDesempenho{max-width:720px;margin:0 auto}
  .kcol{flex:1 1 0;min-width:0}
  .board{overflow-x:visible}
}
</style></head><body>
<button class="rfr" onclick="location.reload()">⟳</button>
<div class="wrap">
  <h1>CRM · Juliana<small>Desempenho da captação + seus leads</small></h1>
  <div class="kpis" id="kpis"></div>
  <div class="abas">
    <button id="ab-desempenho" class="on" onclick="trocaAba('desempenho')">📊 Desempenho</button>
    <button id="ab-leads" onclick="trocaAba('leads')">📇 Leads</button>
  </div>
  <div id="viewDesempenho"></div>
  <div id="viewLeads" style="display:none">
    <div class="barra-exp"><button class="btnexp" id="btnIA" onclick="analisarTodos()">✨ Analisar leads</button><button class="btnexp" onclick="baixarCSV()">⬇ Baixar leads (CSV)</button></div>
    <div class="filtros" id="filtros"></div>
    <div id="lista"></div>
  </div>
</div>
<div class="toast" id="toast"></div>
<script>
var LEADS = __DADOS__;
var BI = __BI__;
var STATUS = __STATUS__;
var CORES = __CORES__;
var FILTRO = 'ativos';
var ABA = 'desempenho';
var WA = '<svg viewBox="0 0 24 24"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.12-.27-.2-.57-.35M12.05 21.78h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.88-9.88 9.88M20.46 3.49A11.81 11.81 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.49-8.42"/></svg>';

function idade(ms){
  if(!ms) return '';
  var min = Math.floor((Date.now()-ms)/60000);
  if(min<60) return 'há '+Math.max(1,min)+' min';
  var h = Math.floor(min/60); if(h<24) return 'há '+h+'h';
  var d = Math.floor(h/24); if(d===1) return 'ontem';
  return 'há '+d+' dias';
}
function frio(l){
  var h=(Date.now()-l.data)/3600000;
  return (l.status==='Novo'&&h>20)||(l.status==='Conversando'&&h>72);
}
function prio(s){return STATUS.indexOf(s);}
function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function toast(t){var e=document.getElementById('toast');e.textContent=t;e.className='toast show';setTimeout(function(){e.className='toast';},1600);}

function trocaAba(a){
  ABA=a;
  document.getElementById('ab-desempenho').className = a==='desempenho'?'on':'';
  document.getElementById('ab-leads').className = a==='leads'?'on':'';
  document.getElementById('viewDesempenho').style.display = a==='desempenho'?'':'none';
  document.getElementById('viewLeads').style.display = a==='leads'?'':'none';
}

/* ---- DESEMPENHO (BI da página, automático) ---- */
function renderKPIs(){
  document.getElementById('kpis').innerHTML=
    '<div class="kpi"><b>'+BI.totalV+'</b><span>Visitas</span></div>'+
    '<div class="kpi"><b>'+BI.totalL+'</b><span>Leads</span></div>'+
    '<div class="kpi hl"><b>'+BI.conv+'%</b><span>Conversão</span></div>';
}
function barrasMapa(mapa, comConv){
  var keys=[],k; for(k in mapa) keys.push(k);
  function val(x){ return comConv ? (mapa[x].l||0) : mapa[x]; }
  keys.sort(function(a,b){return val(b)-val(a);});
  var max=1,i; for(i=0;i<keys.length;i++) if(val(keys[i])>max) max=val(keys[i]);
  var h='';
  for(i=0;i<keys.length;i++){
    var v=val(keys[i]); var pct=Math.round(v/max*100); var extra='';
    if(comConv){ var vis=mapa[keys[i]].v||0; var c=vis?Math.round(mapa[keys[i]].l/vis*100):0; extra=' <span style="color:#6a6a6a">('+vis+' vis · '+c+'%)</span>'; }
    h+='<div class="brow"><span class="bl">'+esc(keys[i])+extra+'</span><span class="bt"><span class="bf" style="width:'+pct+'%"></span></span><b>'+v+'</b></div>';
  }
  return h || '<div style="color:#5a5a5a;font-size:12px">Sem dados ainda</div>';
}
function renderDesempenho(){
  var s=BI.serie, maxV=1, i;
  for(i=0;i<s.length;i++) if(s[i].v>maxV) maxV=s[i].v;
  var bars='', xs='';
  for(i=0;i<s.length;i++){
    var hv=Math.max(Math.round(s[i].v/maxV*100),2);
    var hl=s[i].v?Math.round(s[i].l/s[i].v*100):0;
    bars+='<div class="col"><div class="bar" style="height:'+hv+'%"><div class="lead" style="height:'+hl+'%"></div></div></div>';
    xs+='<span>'+((i%2)?'':s[i].dia)+'</span>';
  }
  document.getElementById('viewDesempenho').innerHTML=
    '<div class="secao"><h3>Visitas e leads · últimos 14 dias</h3>'+
      '<div class="chart">'+bars+'</div><div class="chart-x">'+xs+'</div>'+
      '<div class="legenda"><span><i style="background:#242424"></i>visitas</span><span><i style="background:#25D366"></i>viraram lead</span></div></div>'+
    '<div class="secao"><h3>Por origem (de onde vêm)</h3>'+barrasMapa(BI.porOrigem,true)+'</div>'+
    '<div class="secao"><h3>Leads por interesse</h3>'+barrasMapa(BI.porInteresse,false)+'</div>';
}

/* ---- LEADS (operacional, 1 toque) ---- */
function setStatus(linha,status){
  var L; for(var i=0;i<LEADS.length;i++){if(LEADS[i].linha===linha)L=LEADS[i];}
  if(!L)return; L.status=status;
  google.script.run.atualizarStatus(linha,status);
  toast('Movido para "'+status+'"'); renderLeads();
}
function responder(linha){
  var L; for(var i=0;i<LEADS.length;i++){if(LEADS[i].linha===linha)L=LEADS[i];}
  if(L&&L.status==='Novo'){L.status='Conversando';google.script.run.atualizarStatus(linha,'Conversando');renderLeads();}
}
function nota(linha){
  var v=document.getElementById('nota'+linha).value;
  google.script.run.salvarNota(linha,v); toast('Anotação salva');
}
/* ---- IA: badge, reativação e análise em lote ---- */
function scoreClasse(s){ return s>=70?'':(s>=45?'morno':'frio2'); }
function badgeHTML(l){
  if(!l.perfilIA && !l.scoreIA) return '';
  var h='<div class="badges">';
  if(l.perfilIA) h+='<span class="bperfil">'+esc(l.perfilIA)+'</span>';
  if(l.scoreIA){ var fogo=l.scoreIA>=70?'🔥 ':''; h+='<span class="bscore '+scoreClasse(l.scoreIA)+'">'+fogo+l.scoreIA+'</span>'; }
  return h+'</div>';
}
function reativar(linha){
  var box=document.getElementById('reat'+linha); if(!box) return;
  box.innerHTML='<div class="ger">Escrevendo follow-up…</div>';
  google.script.run.withSuccessHandler(function(msg){
    var L; for(var i=0;i<LEADS.length;i++){if(LEADS[i].linha===linha)L=LEADS[i];}
    var zap=L?L.zapLimpo:'';
    var href='https://wa.me/'+zap+'?text='+encodeURIComponent(msg);
    box.innerHTML='<div class="reatmsg">'+esc(msg)+'</div>'+
      (zap?'<a class="bigwa" href="'+href+'" target="_blank" rel="noopener" onclick="responder('+linha+')">'+WA+' Enviar follow-up</a>':'');
  }).withFailureHandler(function(){
    box.innerHTML='<div class="ger">Não consegui gerar agora. Tente de novo.</div>';
  }).gerarReativacao(linha);
}
function analisarTodos(){
  var b=document.getElementById('btnIA'); if(b){ b.disabled=true; b.textContent='✨ Analisando…'; }
  google.script.run.withSuccessHandler(function(n){
    toast(n>0?(n+' lead(s) analisado(s)'):'Tudo já analisado');
    if(n>0) setTimeout(function(){location.reload();},900);
    else if(b){ b.disabled=false; b.textContent='✨ Analisar leads'; }
  }).withFailureHandler(function(){
    if(b){ b.disabled=false; b.textContent='✨ Analisar leads'; } toast('Erro ao analisar');
  }).analisarPendentes();
}
/* ---- EXPORTAR LEADS (CSV, baixa no aparelho) ---- */
function csvData(ms){
  if(!ms) return '';
  var d=new Date(ms); function p(n){return ('0'+n).slice(-2);}
  return p(d.getDate())+'/'+p(d.getMonth()+1)+'/'+d.getFullYear()+' '+p(d.getHours())+':'+p(d.getMinutes());
}
function baixarCSV(){
  var sep=';';  // Excel BR usa ponto-e-vírgula
  var linhas=[['Data','Nome','WhatsApp','Interesse','Origem','Status','Anotação']];
  var arr=LEADS.slice().sort(function(a,b){return b.data-a.data;});
  arr.forEach(function(l){ linhas.push([csvData(l.data),l.nome,l.zap,l.interesse,l.origem,l.status,l.nota]); });
  var csv=linhas.map(function(row){
    return row.map(function(c){
      c=(c==null?'':String(c));
      if(/[";\\n\\r]/.test(c)) c='"'+c.replace(/"/g,'""')+'"';
      return c;
    }).join(sep);
  }).join('\\r\\n');
  var blob=new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8;'});  // BOM = acento certo no Excel
  var hoje=new Date(); function p(n){return ('0'+n).slice(-2);}
  var nome='leads-'+hoje.getFullYear()+'-'+p(hoje.getMonth()+1)+'-'+p(hoje.getDate())+'.csv';
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download=nome;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){URL.revokeObjectURL(a.href);},1500);
  toast(arr.length+' leads exportados');
}
function ehDesktop(){ return window.innerWidth >= 760; }
function renderLeads(){
  if(ehDesktop()){ document.getElementById('filtros').style.display='none'; renderKanban(); }
  else { document.getElementById('filtros').style.display=''; renderContextual(); }
}
function mover(linha,dir){
  var L; for(var i=0;i<LEADS.length;i++){if(LEADS[i].linha===linha)L=LEADS[i];}
  if(!L)return; var idx=STATUS.indexOf(L.status); var n=idx+dir;
  if(n>=0 && n<STATUS.length) setStatus(linha, STATUS[n]);
}

/* MOBILE — ação contextual (só o próximo passo) */
function renderContextual(){
  var fs=[['ativos','A trabalhar'],['Visita','Visita'],['fechados','Fechados'],['todos','Todos']];
  var fh='';for(var f=0;f<fs.length;f++){fh+='<button class="'+(FILTRO===fs[f][0]?'on':'')+'" onclick="FILTRO=\\''+fs[f][0]+'\\';renderLeads()">'+fs[f][1]+'</button>';}
  document.getElementById('filtros').innerHTML=fh;
  var arr=LEADS.filter(function(l){
    if(FILTRO==='ativos')return l.status!=='Fechado'&&l.status!=='Perdido';
    if(FILTRO==='fechados')return l.status==='Fechado'||l.status==='Perdido';
    if(FILTRO==='todos')return true;
    return l.status===FILTRO;
  });
  if(FILTRO==='ativos'){  // a trabalhar: mais quente (maior score) primeiro
    arr.sort(function(a,b){var s=(b.scoreIA||0)-(a.scoreIA||0);return s!==0?s:b.data-a.data;});
  } else {
    arr.sort(function(a,b){var p=prio(a.status)-prio(b.status);return p!==0?p:a.data-b.data;});
  }
  if(!arr.length){document.getElementById('lista').innerHTML='<div class="vazio">Nenhum lead aqui. 🎯</div>';return;}
  var html='';
  for(var k=0;k<arr.length;k++){
    var l=arr[k];var c=CORES[l.status]||'#fff';var fr=frio(l);
    // sugestão da IA pré-preenchida no WhatsApp (só pro 1º contato, status Novo)
    var temSug=(l.status==='Novo' && l.sugestaoIA);
    var waUrl='https://wa.me/'+l.zapLimpo+(temSug?'?text='+encodeURIComponent(l.sugestaoIA):'');
    var wa=l.zapLimpo?'<a class="bigwa" href="'+waUrl+'" target="_blank" rel="noopener" onclick="responder('+l.linha+')">'+WA+' Responder no WhatsApp</a>':'';
    var sug=temSug?'<div class="sugia"><b>✨ Sugestão da IA — já vai escrita no WhatsApp</b>'+esc(l.sugestaoIA)+'</div>':'';
    // botão de follow-up (IA) pros leads esfriando em aberto
    var reatBtn=(fr&&(l.status==='Novo'||l.status==='Conversando'))?'<button class="bigp reat-btn" onclick="reativar('+l.linha+')">🔥 Gerar follow-up</button>':'';
    var reatBox='<div id="reat'+l.linha+'" class="reatbox"></div>';
    var acao;
    if(l.status==='Novo'){
      acao='<div class="acx">'+sug+wa+reatBtn+reatBox+'<div class="ctx-hint">ao responder, vira "Conversando" sozinho</div></div>';
    } else if(l.status==='Conversando'){
      acao='<div class="acx">'+wa+reatBtn+reatBox+'<button class="bigp" onclick="setStatus('+l.linha+',\\'Visita\\')">📅 Marcou visita</button><div class="ctx-sec"><button class="ok" onclick="setStatus('+l.linha+',\\'Fechado\\')">✓ Fechou</button><button class="no" onclick="setStatus('+l.linha+',\\'Perdido\\')">✕ Não rolou</button></div></div>';
    } else if(l.status==='Visita'){
      acao='<div class="acx">'+wa+'<button class="bigp" style="background:#25D366;color:#06310f" onclick="setStatus('+l.linha+',\\'Fechado\\')">✓ Fechou o negócio</button><div class="ctx-sec"><button class="no" onclick="setStatus('+l.linha+',\\'Perdido\\')">✕ Não rolou</button></div></div>';
    } else {
      acao='<div class="acx"><div class="ctx-hint">'+(l.status==='Fechado'?'🎉 Negócio fechado':'Lead perdido')+' — <span onclick="setStatus('+l.linha+',\\'Conversando\\')" style="color:#9a9a9a;text-decoration:underline;cursor:pointer">reabrir</span></div></div>';
    }
    html+='<div class="card'+(fr?' frio':'')+'">'+
      '<div class="top"><span class="dot" style="background:'+c+'"></span><span class="nome">'+esc(l.nome)+'</span><span class="idade">'+(fr?'🔴 ':'')+idade(l.data)+'</span></div>'+
      '<div class="inter">'+esc(l.interesse)+' · <span class="ctx-est">'+l.status+'</span></div>'+badgeHTML(l)+acao+
      '<div class="nota"><input id="nota'+l.linha+'" placeholder="Anotação rápida…" value="'+esc(l.nota)+'"><button onclick="nota('+l.linha+')">Salvar</button></div></div>';
  }
  document.getElementById('lista').innerHTML=html;
}

/* DESKTOP — kanban (pipeline) */
function renderKanban(){
  var html='<div class="board">';
  for(var s=0;s<STATUS.length;s++){
    var st=STATUS[s];var c=CORES[st]||'#fff';
    var arr=LEADS.filter(function(l){return l.status===st;});
    // Novo/Conversando: ordena por score (quente primeiro); demais: por recência
    if(st==='Novo'||st==='Conversando') arr.sort(function(a,b){var s=(b.scoreIA||0)-(a.scoreIA||0);return s!==0?s:b.data-a.data;});
    else arr.sort(function(a,b){return b.data-a.data;});
    var cards='';
    for(var k=0;k<arr.length;k++){
      var l=arr[k];var fr=frio(l);
      var temSug=(l.status==='Novo' && l.sugestaoIA);
      var waUrl='https://wa.me/'+l.zapLimpo+(temSug?'?text='+encodeURIComponent(l.sugestaoIA):'');
      var wa=l.zapLimpo?'<a class="kwa" href="'+waUrl+'" target="_blank" rel="noopener" onclick="responder('+l.linha+')">'+WA+' responder</a>':'';
      var kb=l.scoreIA?'<span class="kbadge '+scoreClasse(l.scoreIA)+'">'+(l.scoreIA>=70?'🔥':'')+l.scoreIA+'</span>':'';
      cards+='<div class="kcard'+(fr?' frio':'')+'"><div class="kn">'+(fr?'🔴 ':'')+esc(l.nome)+kb+'</div><div class="ki">'+(l.perfilIA?esc(l.perfilIA)+' · ':'')+esc(l.interesse)+' · '+idade(l.data)+'</div>'+wa+
        '<div class="kmv"><button onclick="mover('+l.linha+',-1)" '+(s===0?'disabled':'')+'>‹</button><button onclick="mover('+l.linha+',1)" '+(s===STATUS.length-1?'disabled':'')+'>›</button></div></div>';
    }
    html+='<div class="kcol"><div class="kbar" style="background:'+c+'"></div><div class="kh"><b>'+st+'</b><span>'+arr.length+'</span></div>'+(cards||'<div class="kempty">vazio</div>')+'</div>';
  }
  document.getElementById('lista').innerHTML=html+'</div>';
}

var _desk = ehDesktop();
window.addEventListener('resize', function(){ var n=ehDesktop(); if(n!==_desk){ _desk=n; renderLeads(); } });
renderKPIs(); renderDesempenho(); renderLeads();
</script></body></html>`;
}

/* ====================== AÇÕES DE IA DO PAINEL ====================== */

/** Botão "Analisar leads": analisa todos os leads ativos que ainda não têm score.
 *  Teto de 25 por execução pra não estourar o tempo do Apps Script. Retorna quantos fez. */
function analisarPendentes(){
  var sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA_LEADS);
  if(!sh) return 0;
  garantirHeaderIA(sh);
  var vals=sh.getDataRange().getValues(), n=0;
  for(var i=1;i<vals.length;i++){
    var r=vals[i]; if(!r[1]&&!r[2]) continue;
    var status=(r[6]||'Novo').toString();
    if(status==='Fechado'||status==='Perdido') continue;
    if(r[9]) continue;                 // já tem score (coluna J)
    analisarEGravar(i+1); n++;
    if(n>=25) break;
  }
  return n;
}

/** Botão "Reativar" (lead frio): a IA escreve uma mensagem de follow-up no tom da Ju. */
function gerarReativacao(linha){
  var sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA_LEADS);
  if(!sh) return '';
  var r=sh.getRange(linha,1,1,8).getValues()[0];
  var nome=(r[1]||'').toString(), inter=(r[3]||'').toString(), nota=(r[7]||'').toString();
  var dias=r[0]?Math.floor((Date.now()-new Date(r[0]).getTime())/86400000):0;
  var ctx='Você é a corretora Juliana (Palmas-TO) escrevendo no WhatsApp pra reaquecer um lead parado. '+
    'Escreva UMA mensagem curta (máx 40 palavras), 1ª pessoa, calorosa mas sem forçar, sem soar cobrança, sem emoji. '+
    'Retome o contato de forma natural e ofereça um próximo passo leve. Responda só a mensagem, sem aspas.\n\n'+
    'LEAD: nome="'+nome+'", procura="'+inter+'", parado há '+dias+' dias.'+(nota?' Anotação da corretora: "'+nota+'".':'');
  var raw=_chamarIA(ctx, ANTHROPIC_MODELO_SEMANAL);
  if(raw) return raw.replace(/^["']+|["']+$/g,'').substring(0,400);
  var pn=(nome.split(' ')[0]||'');
  return 'Oi'+(pn?' '+pn:'')+'! Passando pra saber se você ainda está procurando '+(inter||'imóvel').toLowerCase()+
    '. Apareceram opções novas aqui que acho que valem o seu olhar. Quer que eu te mande?';
}

/* ====================== NOTIFICAÇÃO + RESUMO DIÁRIO ====================== */
function notificar(dados, quando){
  var nome=(dados.nome||'(sem nome)').toString(), inter=(dados.interesse||'—').toString(), pag=(dados.pagina||'—').toString();
  var zapRaw=(dados.whatsapp||'').toString(), zap=limpaZap(zapRaw), waLink=zap?'https://wa.me/'+zap:'';
  var quandoTxt=Utilities.formatDate(quando, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
  var dest=EMAIL_NOTIFICACAO||Session.getEffectiveUser().getEmail();
  // E-mail só como backup: com o WhatsApp (CallMeBot) ligado, notifica só por lá. (Ju pediu só WhatsApp.)
  if(dest && !(CALLMEBOT_PHONE&&CALLMEBOT_APIKEY)){
    MailApp.sendEmail({to:dest, subject:'🔔 Novo lead: '+nome+' — '+inter, htmlBody:
      '<div style="font-family:Arial,sans-serif;max-width:480px;border:1px solid #eee;border-radius:12px;overflow:hidden">'+
      '<div style="background:#0c0c0c;color:#fff;padding:18px 22px"><h2 style="margin:0;font-size:18px">Novo lead da Juliana 🎯</h2><p style="margin:4px 0 0;color:#aaa;font-size:12px">'+quandoTxt+'</p></div>'+
      '<table style="width:100%;font-size:15px;line-height:1.9;padding:18px 22px"><tr><td style="color:#888;width:90px">Nome</td><td><b>'+nome+'</b></td></tr>'+
      '<tr><td style="color:#888">WhatsApp</td><td>'+zapRaw+'</td></tr><tr><td style="color:#888">Procura</td><td>'+inter+'</td></tr>'+
      '<tr><td style="color:#888">Página</td><td>'+pag+'</td></tr></table>'+
      (waLink?'<div style="padding:0 22px 22px"><a href="'+waLink+'" style="display:inline-block;background:#25D366;color:#06310f;padding:13px 26px;border-radius:8px;text-decoration:none;font-weight:bold">Responder no WhatsApp →</a></div>':'')+
      '</div>'});
  }
  if(CALLMEBOT_PHONE&&CALLMEBOT_APIKEY){
    var msg='🔔 Novo lead\n'+nome+'\n'+inter+'\nWhats: '+zapRaw+'\nPágina: '+pag;
    UrlFetchApp.fetch('https://api.callmebot.com/whatsapp.php?phone='+CALLMEBOT_PHONE+'&text='+encodeURIComponent(msg)+'&apikey='+CALLMEBOT_APIKEY, {muteHttpExceptions:true});
  }
}

/* BRIEFING MATINAL (8h no WhatsApp). Antes era só uma contagem; agora a IA escreve
 * um briefing acionável: quem contatar primeiro e por quê, e quem precisa de follow-up.
 * Usa o score gravado por lead pra priorizar. Sem chave da IA, cai na versão heurística. */
function resumoDiario(){
  var leads=lerLeads(), agora=Date.now(), novos=[], esfriando=[];
  for(var i=0;i<leads.length;i++){
    var l=leads[i], h=(agora-l.data)/3600000;
    if(l.status==='Novo') novos.push(l);
    if((l.status==='Novo'&&h>20)||(l.status==='Conversando'&&h>72)) esfriando.push(l);
  }
  novos.sort(function(a,b){return (b.scoreIA||0)-(a.scoreIA||0);});       // mais quente primeiro
  esfriando.sort(function(a,b){return a.data-b.data;});                   // mais parado primeiro
  var ctx={novos:novos, esfriando:esfriando};
  var texto = briefingIA(ctx) || briefingHeuristico(ctx);
  var url=''; try{url=ScriptApp.getService().getUrl()||'';}catch(e){}
  var msg='☀️ '+texto+(url?'\n\nAbrir painel: '+url:'');
  if(CALLMEBOT_PHONE&&CALLMEBOT_APIKEY){
    UrlFetchApp.fetch('https://api.callmebot.com/whatsapp.php?phone='+CALLMEBOT_PHONE+'&text='+encodeURIComponent(msg)+'&apikey='+CALLMEBOT_APIKEY, {muteHttpExceptions:true});
  } else {
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), '☀️ Briefing do dia — CRM Juliana', msg);
  }
}

/** Briefing por código (sem IA). Sempre funciona. */
function briefingHeuristico(c){
  function pn(l){ return (l.nome||'').split(' ')[0]||l.nome; }
  var p=[];
  if(c.novos.length){
    var t=c.novos[0];
    p.push('Bom dia! Você tem '+c.novos.length+' lead'+(c.novos.length>1?'s':'')+' novo'+(c.novos.length>1?'s':'')+'.');
    p.push('Comece pelo '+pn(t)+' ('+(t.perfilIA||t.interesse)+') — é o mais quente da fila.');
  } else {
    p.push('Bom dia! Nenhum lead novo na fila hoje.');
  }
  if(c.esfriando.length){
    p.push(c.esfriando.length+' lead'+(c.esfriando.length>1?'s':'')+' esfriando precisa'+(c.esfriando.length>1?'m':'')+' de follow-up — no painel, o botão "Reativar" já escreve a mensagem.');
  }
  return p.join(' ');
}

/** Briefing escrito pela IA (Haiku). Retorna null se sem chave/erro ou nada relevante. */
function briefingIA(c){
  if(!c.novos.length && !c.esfriando.length) return null;
  function lista(arr,comDias){
    return arr.slice(0,6).map(function(l){
      var pn=(l.nome||'').split(' ')[0]||l.nome;
      var d=comDias?(' — parado há '+Math.floor((Date.now()-l.data)/86400000)+'d'):'';
      return '- '+pn+' ('+(l.perfilIA||l.interesse)+', via '+l.origem+', score '+(l.scoreIA||'?')+')'+d;
    }).join('\n') || '(nenhum)';
  }
  var ctx='Você é o assistente pessoal da corretora Juliana (Palmas-TO). Escreva o BRIEFING MATINAL dela pro WhatsApp. '+
    'Curto (máx 80 palavras), tom de quem organiza o dia dela, direto e prático. Comece dizendo quem contatar primeiro e por quê. '+
    'Traduza os dados em ação, não repita números crus nem o score. No máximo 1 emoji no total. Sem saudação longa.\n\n'+
    'LEADS NOVOS (do mais quente pro mais frio):\n'+lista(c.novos,false)+'\n\n'+
    'LEADS ESFRIANDO (parados, precisam follow-up):\n'+lista(c.esfriando,true);
  return _chamarIA(ctx, ANTHROPIC_MODELO_SEMANAL);
}

/** Rode pra ver o briefing agora, sem esperar as 8h. */
function testarBriefing(){
  resumoDiario();
  SpreadsheetApp.getUi().alert('✅ Briefing de teste enviado!\nConfira o e-mail'+(CALLMEBOT_APIKEY?' e o WhatsApp':'')+'.');
}

/** Rode 1x pra ligar o lembrete diário (8h). */
function ativarLembreteDiario(){
  ScriptApp.getProjectTriggers().forEach(function(t){ if(t.getHandlerFunction()==='resumoDiario') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('resumoDiario').timeBased().atHour(8).everyDays(1).create();
  SpreadsheetApp.getUi().alert('✅ Lembrete diário ligado!\nTodo dia às 8h a Ju recebe o resumo dos leads.');
}

/* ====================== RELATÓRIO MENSAL (entregável dia 1) ======================
 * Roda automático todo dia 1 às 8h (ver ativarRelatorioMensal). Fecha o mês anterior,
 * compara com o mês retrasado e manda um relatório com NÚMEROS (código) + LEITURA
 * (IA, se a chave estiver configurada; senão, leitura automática por heurística).
 * É o entregável do plano Performance. */

var MESES_PT = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

/** Métricas de um mês específico (ano, mes 0-11). */
function metricasMes(leads, visitas, ano, mes, tz){
  function noMes(ms){ if(!ms) return false; var d=new Date(ms); return d.getFullYear()===ano && d.getMonth()===mes; }
  var L = leads.filter(function(l){ return noMes(l.data); });
  var V = visitas.filter(function(v){ return noMes(v.data); });
  var totalV=V.length, totalL=L.length;
  var conv = totalV ? Math.round((totalL/totalV)*1000)/10 : 0;

  var porOrigem = {};
  L.forEach(function(l){ var o=l.origem||'direto'; porOrigem[o]=(porOrigem[o]||0)+1; });
  var melhorCanal='—', melhorN=0;
  for (var o in porOrigem){ if(porOrigem[o]>melhorN){ melhorN=porOrigem[o]; melhorCanal=o; } }

  var funil={Novo:0,Conversando:0,Visita:0,Fechado:0,Perdido:0};
  L.forEach(function(l){ if(funil[l.status]!==undefined) funil[l.status]++; });

  return {
    ano:ano, mes:mes, nomeMes:MESES_PT[mes], rotulo:MESES_PT[mes]+'/'+ano,
    totalV:totalV, totalL:totalL, conv:conv,
    porOrigem:porOrigem, melhorCanal:melhorCanal, melhorN:melhorN,
    funil:funil, fechados:funil.Fechado, visitasAgendadas:funil.Visita
  };
}

/** Leitura automática por código (sem IA). Sempre funciona. */
function leituraHeuristica(a, b){
  var f=[];
  // tendência de leads
  if (b.totalL>0){
    var dl=a.totalL-b.totalL, pct=Math.round((dl/b.totalL)*100);
    if (dl>0) f.push('Você captou '+a.totalL+' leads — '+pct+'% a mais que em '+b.nomeMes+'. Tá crescendo, mantenha o ritmo de conteúdo.');
    else if (dl<0) f.push('Foram '+a.totalL+' leads, '+Math.abs(pct)+'% a menos que em '+b.nomeMes+'. Vale reforçar a chamada pro link de captura nos stories.');
    else f.push('Você captou '+a.totalL+' leads, mesmo patamar de '+b.nomeMes+'.');
  } else {
    f.push('Você captou '+a.totalL+' leads no mês.');
  }
  // canal
  if (a.melhorN>0) f.push('Seu melhor canal foi o '+a.melhorCanal+' ('+a.melhorN+' leads). Onde converte, invista mais — poste e marque o link com mais frequência por aí.');
  // conversão da página
  if (a.totalV>0) f.push('A página recebeu '+a.totalV+' visitas e converteu '+a.conv+'% em lead'+(a.conv<10?' — abaixo de 10%, vale revisar a primeira dobra e a oferta da página.':'.'));
  // funil / fechamento
  if (a.visitasAgendadas>0) f.push(a.visitasAgendadas+' lead(s) chegaram a marcar visita e '+a.fechados+' fechou(aram). Foco do mês: puxar quem visitou e ainda não decidiu.');
  else if (a.fechados>0) f.push(a.fechados+' negócio(s) fechado(s) no mês 🎉');
  // alerta de leads parados
  var parados=a.funil.Novo+a.funil.Conversando;
  if (parados>3) f.push('Atenção: '+parados+' leads ainda estão em aberto (Novo/Conversando). Responder rápido é o que mais move o ponteiro.');
  return f.join('\n\n');
}

/** Leitura escrita pela IA (Sonnet). Retorna null se não houver chave ou der erro. */
function leituraIA(a, b){
  var ctx = 'Você é analista de captação de leads de um corretor de imóveis em Palmas-TO. '+
    'Escreva uma análise curta (máx 140 palavras), em português do Brasil, tom direto e prático, '+
    'sem clichê e sem emoji em excesso (no máximo 1). Foque no que melhorar no próximo mês.\n\n'+
    'MÊS ANALISADO ('+a.rotulo+'): '+a.totalV+' visitas na página, '+a.totalL+' leads, '+a.conv+'% de conversão. '+
    'Melhor canal: '+a.melhorCanal+' ('+a.melhorN+' leads). '+
    'Funil — Novo:'+a.funil.Novo+', Conversando:'+a.funil.Conversando+', Visita:'+a.funil.Visita+', Fechado:'+a.fechados+', Perdido:'+a.funil.Perdido+'.\n'+
    'MÊS ANTERIOR ('+b.rotulo+'): '+b.totalL+' leads, '+b.conv+'% de conversão.';
  return _chamarIA(ctx, ANTHROPIC_MODELO);
}

function relatorioMensal(){
  var tz = Session.getScriptTimeZone();
  var hoje = new Date();
  // mês de referência = mês anterior (o que acabou de fechar)
  var refAno=hoje.getFullYear(), refMes=hoje.getMonth()-1; if(refMes<0){refMes=11;refAno--;}
  // mês retrasado, pra comparar
  var pAno=refAno, pMes=refMes-1; if(pMes<0){pMes=11;pAno--;}

  var leads=lerLeads(), visitas=lerVisitas();
  var a = metricasMes(leads, visitas, refAno, refMes, tz);
  var b = metricasMes(leads, visitas, pAno, pMes, tz);
  var leitura = leituraIA(a, b) || leituraHeuristica(a, b);
  var viaIA = !!_anthropicKey();

  // ---- E-MAIL (HTML) ----
  var dest = EMAIL_NOTIFICACAO || Session.getEffectiveUser().getEmail();
  var url=''; try{url=ScriptApp.getService().getUrl()||'';}catch(e){}
  if (dest){
    function kpi(v,l){ return '<td style="padding:10px 6px;text-align:center;border:1px solid #eee;border-radius:8px"><div style="font-size:24px;font-weight:bold">'+v+'</div><div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.5px">'+l+'</div></td>'; }
    var html =
      '<div style="font-family:Arial,sans-serif;max-width:520px;border:1px solid #eee;border-radius:12px;overflow:hidden">'+
      '<div style="background:#0c0c0c;color:#fff;padding:20px 24px"><div style="font-size:11px;letter-spacing:2px;color:#aaa;text-transform:uppercase">Relatório mensal</div><h2 style="margin:4px 0 0;font-size:22px;text-transform:capitalize">'+a.rotulo+'</h2></div>'+
      '<table style="width:100%;border-collapse:separate;border-spacing:8px;padding:14px 16px 4px">'+
        '<tr>'+kpi(a.totalV,'Visitas')+kpi(a.totalL,'Leads')+kpi(a.conv+'%','Conversão')+'</tr>'+
        '<tr>'+kpi(a.visitasAgendadas,'Visitas agend.')+kpi(a.fechados,'Fechados')+kpi(a.melhorCanal,'Melhor canal')+'</tr>'+
      '</table>'+
      '<div style="padding:8px 24px 4px"><div style="font-size:11px;letter-spacing:1.5px;color:#888;text-transform:uppercase;margin-bottom:8px">Leitura do mês '+(viaIA?'(por IA)':'')+'</div>'+
        '<div style="font-size:14px;line-height:1.7;color:#333;white-space:pre-line">'+leitura+'</div></div>'+
      (url?'<div style="padding:18px 24px 24px"><a href="'+url+'" style="display:inline-block;background:#0c0c0c;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Abrir o painel completo →</a></div>':'<div style="height:16px"></div>')+
      '</div>';
    MailApp.sendEmail({ to:dest, subject:'📊 Relatório de '+a.rotulo+' — '+a.totalL+' leads', htmlBody:html });
  }

  // ---- WHATSAPP (resumo curto) ----
  if (CALLMEBOT_PHONE && CALLMEBOT_APIKEY){
    var msg='📊 Relatório de '+a.rotulo+'\n\n'+
      a.totalV+' visitas · '+a.totalL+' leads · '+a.conv+'% conversão\n'+
      'Melhor canal: '+a.melhorCanal+'\nFechados: '+a.fechados+'\n\n'+leitura+(url?'\n\nPainel: '+url:'');
    UrlFetchApp.fetch('https://api.callmebot.com/whatsapp.php?phone='+CALLMEBOT_PHONE+'&text='+encodeURIComponent(msg)+'&apikey='+CALLMEBOT_APIKEY, {muteHttpExceptions:true});
  }
}

/** Rode 1x pra ligar o relatório automático (todo dia 1, 8h). */
function ativarRelatorioMensal(){
  ScriptApp.getProjectTriggers().forEach(function(t){ if(t.getHandlerFunction()==='relatorioMensal') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('relatorioMensal').timeBased().onMonthDay(1).atHour(8).create();
  SpreadsheetApp.getUi().alert('✅ Relatório mensal ligado!\nTodo dia 1 às 8h sai o fechamento do mês anterior por e-mail'+(CALLMEBOT_APIKEY?' e WhatsApp':'')+'.');
}

/** Rode pra ver o relatório agora (do mês anterior), sem esperar o dia 1. */
function testarRelatorioMensal(){
  relatorioMensal();
  SpreadsheetApp.getUi().alert('✅ Relatório de teste enviado!\nConfira o e-mail'+(CALLMEBOT_APIKEY?' e o WhatsApp':'')+'.');
}

/* ================== RECOMENDAÇÕES SEMANAIS (entregável toda segunda) ==================
 * Toda segunda às 8h (ver ativarRecomendacoesSemanais). Olha os últimos 7 dias + os leads
 * em aberto/esfriando e manda 2-3 AÇÕES práticas pra semana. Curtinho e direto.
 * Usa o modelo SEMANAL (Haiku — rápido e barato); sem chave, cai na heurística. */

/** Métricas da última semana (7 dias) + estado dos leads em aberto. */
function metricasSemana(leads, visitas, tz){
  var agora=Date.now(), corte=agora-7*86400000;
  var L=leads.filter(function(l){ return l.data>=corte; });
  var V=visitas.filter(function(v){ return v.data>=corte; });
  var totalV=V.length, totalL=L.length;
  var conv = totalV ? Math.round((totalL/totalV)*1000)/10 : 0;

  var porOrigem={}; L.forEach(function(l){ var o=l.origem||'direto'; porOrigem[o]=(porOrigem[o]||0)+1; });
  var melhorCanal='—', melhorN=0;
  for (var o in porOrigem){ if(porOrigem[o]>melhorN){ melhorN=porOrigem[o]; melhorCanal=o; } }

  // leads em aberto (todos, não só da semana) e quantos estão esfriando
  var novos=0, conversando=0, esfriando=0;
  leads.forEach(function(l){
    if(l.status==='Novo') novos++;
    if(l.status==='Conversando') conversando++;
    var h=(agora-l.data)/3600000;
    if((l.status==='Novo'&&h>20)||(l.status==='Conversando'&&h>72)) esfriando++;
  });
  var fechados=0; L.forEach(function(l){ if(l.status==='Fechado') fechados++; });

  return { totalV:totalV, totalL:totalL, conv:conv, melhorCanal:melhorCanal, melhorN:melhorN,
           novos:novos, conversando:conversando, esfriando:esfriando, fechados:fechados, abertos:novos+conversando };
}

/** Recomendações automáticas por código (sem IA). Sempre funciona. */
function recomendacaoHeuristica(s){
  var f=[];
  if (s.esfriando>0) f.push('🔴 '+s.esfriando+' lead(s) esfriando (sem resposta faz tempo). Responde esses primeiro hoje — é onde mais se perde venda.');
  if (s.totalL===0) f.push('Semana parada na captação: 0 lead novo. Hora de aquecer — poste com chamada pro link de captura, principalmente em dia de plantão e visita.');
  else f.push('Você captou '+s.totalL+' lead(s) na semana'+(s.melhorN>0?', a maioria via '+s.melhorCanal:'')+'. Mantenha o ritmo de conteúdo no canal que mais traz.');
  if (s.abertos>0) f.push(s.abertos+' lead(s) em aberto (Novo/Conversando). Meta da semana: puxar pelo menos 1 deles pra visita.');
  if (s.fechados>0) f.push(s.fechados+' fechamento(s) essa semana 🎉 Pede indicação pra quem fechou — indicação é o lead que mais converte.');
  return f.join('\n\n');
}

/** Recomendações escritas pela IA (Haiku). Retorna null se não houver chave ou der erro. */
function recomendacaoIA(s){
  var ctx = 'Você é consultor de captação de um corretor de imóveis em Palmas-TO. '+
    'Com base nos dados da ÚLTIMA SEMANA, escreva de 2 a 3 recomendações curtas e práticas pra ESTA semana — '+
    'o que fazer primeiro. Português do Brasil, tom direto, sem clichê, no máximo 1 emoji no total. '+
    'Comece pela ação mais urgente. Não repita os números crus: transforme em ação.\n\n'+
    'SEMANA: '+s.totalL+' leads novos, '+s.totalV+' visitas na página, '+s.conv+'% de conversão. '+
    'Melhor canal: '+s.melhorCanal+'. '+
    'Leads em aberto: '+s.abertos+' (Novo:'+s.novos+', Conversando:'+s.conversando+'). '+
    'Esfriando (sem resposta faz tempo): '+s.esfriando+'. Fechados na semana: '+s.fechados+'.';
  return _chamarIA(ctx, ANTHROPIC_MODELO_SEMANAL);
}

function recomendacoesSemanais(){
  var tz = Session.getScriptTimeZone();
  var leads=lerLeads(), visitas=lerVisitas();
  var s = metricasSemana(leads, visitas, tz);
  var texto = recomendacaoIA(s) || recomendacaoHeuristica(s);
  var viaIA = !!_anthropicKey();
  var url=''; try{url=ScriptApp.getService().getUrl()||'';}catch(e){}

  // ---- E-MAIL (HTML) ----
  var dest = EMAIL_NOTIFICACAO || Session.getEffectiveUser().getEmail();
  if (dest){
    function kpi(v,l){ return '<td style="padding:10px 6px;text-align:center;border:1px solid #eee;border-radius:8px"><div style="font-size:24px;font-weight:bold">'+v+'</div><div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.5px">'+l+'</div></td>'; }
    var html =
      '<div style="font-family:Arial,sans-serif;max-width:520px;border:1px solid #eee;border-radius:12px;overflow:hidden">'+
      '<div style="background:#0c0c0c;color:#fff;padding:20px 24px"><div style="font-size:11px;letter-spacing:2px;color:#aaa;text-transform:uppercase">Foco da semana</div><h2 style="margin:4px 0 0;font-size:22px">Suas recomendações</h2></div>'+
      '<table style="width:100%;border-collapse:separate;border-spacing:8px;padding:14px 16px 4px">'+
        '<tr>'+kpi(s.totalL,'Leads (7d)')+kpi(s.abertos,'Em aberto')+kpi(s.esfriando,'Esfriando')+'</tr>'+
      '</table>'+
      '<div style="padding:8px 24px 4px"><div style="font-size:11px;letter-spacing:1.5px;color:#888;text-transform:uppercase;margin-bottom:8px">O que fazer essa semana '+(viaIA?'(por IA)':'')+'</div>'+
        '<div style="font-size:14px;line-height:1.7;color:#333;white-space:pre-line">'+texto+'</div></div>'+
      (url?'<div style="padding:18px 24px 24px"><a href="'+url+'" style="display:inline-block;background:#0c0c0c;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Abrir o painel →</a></div>':'<div style="height:16px"></div>')+
      '</div>';
    MailApp.sendEmail({ to:dest, subject:'🎯 Foco da semana — '+s.abertos+' leads pra trabalhar', htmlBody:html });
  }

  // ---- WHATSAPP (resumo curto) ----
  if (CALLMEBOT_PHONE && CALLMEBOT_APIKEY){
    var msg='🎯 Foco da semana\n\n'+
      s.totalL+' leads (7d) · '+s.abertos+' em aberto · '+s.esfriando+' esfriando\n\n'+texto+(url?'\n\nPainel: '+url:'');
    UrlFetchApp.fetch('https://api.callmebot.com/whatsapp.php?phone='+CALLMEBOT_PHONE+'&text='+encodeURIComponent(msg)+'&apikey='+CALLMEBOT_APIKEY, {muteHttpExceptions:true});
  }
}

/** Rode 1x pra ligar as recomendações semanais (toda segunda, 8h). */
function ativarRecomendacoesSemanais(){
  ScriptApp.getProjectTriggers().forEach(function(t){ if(t.getHandlerFunction()==='recomendacoesSemanais') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('recomendacoesSemanais').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
  SpreadsheetApp.getUi().alert('✅ Recomendações semanais ligadas!\nToda segunda às 8h sai o foco da semana por e-mail'+(CALLMEBOT_APIKEY?' e WhatsApp':'')+'.');
}

/** Rode pra ver as recomendações da semana agora, sem esperar segunda. */
function testarRecomendacoesSemanais(){
  recomendacoesSemanais();
  SpreadsheetApp.getUi().alert('✅ Recomendações de teste enviadas!\nConfira o e-mail'+(CALLMEBOT_APIKEY?' e o WhatsApp':'')+'.');
}

/** Rode 1x pra testar a notificação (e autorizar o e-mail). */
function testarNotificacao(){
  notificar({nome:'Lead de Teste', whatsapp:'63 99222-6998', interesse:'Imóvel para investir / renda', pagina:'teste'}, new Date());
  SpreadsheetApp.getUi().alert('✅ Notificação de teste enviada!\nConfira o e-mail (e o WhatsApp, se configurou o CallMeBot).');
}

/**
 * Rode pra encher o painel com 13 leads FICTÍCIOS e validar o CRM.
 * Não envia e-mail/WhatsApp (só popula a planilha). Depois, use limparTeste() pra apagar.
 */
function popularTeste(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(ABA_LEADS) || criaAbaLeads(ss);
  var agora = Date.now();
  function quando(h){ return new Date(agora - h*3600000); }
  // [horas atrás, nome, whatsapp, interesse, origem, status, nota]
  var dados = [
    [0.25, 'Marina Costa',        '(63) 99812-3344', 'Imóvel para investir / renda', 'instagram', 'Novo', ''],
    [1.5,  'Rafael Andrade',      '(63) 99654-7788', 'Apartamento para morar',       'instagram', 'Novo', ''],
    [5,    'Vanessa Lopes',       '(63) 99811-2255', 'Lançamento na planta',         'instagram', 'Novo', ''],
    [9,    'Juliana Menezes',     '(63) 99201-5566', 'Lançamento na planta',         'direto',    'Novo', ''],
    [27,   'Carlos Eduardo Lima', '(63) 99488-1290', 'Casa / condomínio',            'instagram', 'Novo', ''],
    [8,    'Patrícia Souza',      '(63) 99745-3321', 'Imóvel para investir / renda', 'instagram', 'Conversando', 'Quer 2 quartos, até 600k'],
    [31,   'Bruno Tavares',       '(63) 99633-8890', 'Apartamento para morar',       'direto',    'Conversando', 'Mandei 3 opções, aguardando resposta'],
    [82,   'Fernanda Ribeiro',    '(63) 99102-4455', 'Lote / terreno',               'instagram', 'Conversando', 'Sumiu — fazer follow-up'],
    [49,   'Anderson Pires',      '(63) 99877-1234', 'Lançamento na planta',         'instagram', 'Visita', 'Visita marcada sábado 10h'],
    [73,   'Camila Nogueira',     '(63) 99566-7001', 'Apartamento para morar',       'direto',    'Visita', 'Gostou do 204 Sul'],
    [122,  'Diego Martins',       '(63) 99344-2211', 'Imóvel para investir / renda', 'instagram', 'Fechado', 'Fechou apê 204 Sul 🎉'],
    [205,  'Letícia Barros',      '(63) 99788-9900', 'Casa / condomínio',            'indicação', 'Fechado', 'Comprou casa na Graciosa'],
    [98,   'Marcelo Dias',        '(63) 99455-6677', 'Lote / terreno',               'instagram', 'Perdido', 'Achou caro, comprou com outro']
  ];
  dados.forEach(function(d){
    sh.appendRow([ quando(d[0]), d[1], d[2], d[3], 'B-imersiva', d[4], d[5], d[6] ]);
  });

  // visitas fictícias (~95) pra dar uma taxa de conversão realista (~14%)
  var shv = ss.getSheetByName(ABA_VISITAS) || criaAbaVisitas(ss);
  var origens = ['instagram','instagram','instagram','direto','indicação']; // instagram domina
  var porDia = [4,6,9,7,11,8,13,10,6,9,12,7,5,8]; // últimos 14 dias (hoje = índice 13)
  for (var dd = 13; dd >= 0; dd--){
    var qtd = porDia[13-dd];
    for (var k = 0; k < qtd; k++){
      var hora = dd*24 + (k*1.7 % 23); // espalha no dia
      shv.appendRow([ quando(hora), 'investir', origens[(dd+k) % origens.length] ]);
    }
  }
  SpreadsheetApp.getUi().alert('✅ 13 leads + ~118 visitas fictícias adicionados!\nAbra o painel (/exec) → aba Desempenho pra ver o BI. Pra limpar: rode limparTeste().');
}

/** Apaga TODOS os leads E visitas (mantém os cabeçalhos). Use pra limpar os fictícios. */
function limparTeste(){
  [ABA_LEADS, ABA_VISITAS].forEach(function(nome){
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nome);
    if (sh){ var n = sh.getLastRow(); if (n > 1) sh.getRange(2,1,n-1,sh.getLastColumn()).clearContent(); }
  });
  SpreadsheetApp.getUi().alert('🧹 Leads e visitas limpos. Pronto pros dados reais.');
}

/* ============================ SETUP (rodar 1x) ============================ */
function setup(){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var leads=ss.getSheetByName(ABA_LEADS)||criaAbaLeads(ss);
  criaAbaVisitas(ss);
  montaPainel(ss, leads);
  SpreadsheetApp.getUi().alert('✅ CRM configurado!\n\nAbas "Leads" e "Painel" prontas.\n\nPróximo: Implantar → App da Web. A gestão é toda no painel web (não na planilha).');
}

function criaAbaVisitas(ss){
  var sh = ss.getSheetByName(ABA_VISITAS);
  if (!sh) sh = ss.insertSheet(ABA_VISITAS);
  if (sh.getLastRow() === 0){
    sh.getRange(1,1,1,3).setValues([['Data/Hora','Página','Origem']])
      .setBackground('#0c0c0c').setFontColor('#fff').setFontWeight('bold').setFontSize(11);
    sh.setFrozenRows(1);
    sh.setColumnWidth(1,140); sh.setColumnWidth(2,120); sh.setColumnWidth(3,160);
  }
  return sh;
}

function criaAbaLeads(ss){
  var sh=ss.getSheetByName(ABA_LEADS); if(!sh) sh=ss.insertSheet(ABA_LEADS,0);
  sh.clear();
  sh.getRange(1,1,1,COLUNAS.length).setValues([COLUNAS]).setBackground('#0c0c0c').setFontColor('#fff').setFontWeight('bold').setFontSize(11);
  sh.setFrozenRows(1);
  var larg=[130,160,140,190,110,150,130,240,110,70,360]; for(var c=0;c<larg.length;c++) sh.setColumnWidth(c+1,larg[c]);
  sh.getRange(2,7,2000,1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUS_LISTA,true).build());
  var regras=STATUS_LISTA.map(function(st){
    return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(st).setBackground(STATUS_CORES[st]).setRanges([sh.getRange(2,7,2000,1)]).build();
  });
  sh.setConditionalFormatRules(regras);
  return sh;
}

function montaPainel(ss, leads){
  var sh=ss.getSheetByName(ABA_PAINEL); if(!sh) sh=ss.insertSheet(ABA_PAINEL);
  sh.clear(); sh.getCharts().forEach(function(c){sh.removeChart(c);});
  sh.getRange('B2').setValue('PAINEL — CRM JULIANA ALVES').setFontSize(16).setFontWeight('bold');
  sh.getRange('B3').setValue('A gestão do dia a dia é no painel web. Aqui é só o resumo.').setFontColor('#888').setFontSize(10);
  sh.getRange('B5').setValue('RESUMO').setFontWeight('bold').setFontColor('#666');
  var resumo=[['Total de leads','=COUNTA(Leads!B2:B)'],['Leads (7 dias)','=COUNTIFS(Leads!A2:A,">="&(TODAY()-7))'],
    ['Novos (a contatar)','=COUNTIF(Leads!G2:G,"Novo")'],['Em conversa','=COUNTIF(Leads!G2:G,"Conversando")'],
    ['Visitas','=COUNTIF(Leads!G2:G,"Visita")'],['Fechados','=COUNTIF(Leads!G2:G,"Fechado")'],
    ['Taxa de fechamento','=IFERROR(COUNTIF(Leads!G2:G,"Fechado")/COUNTA(Leads!B2:B),0)']];
  sh.getRange(6,2,resumo.length,2).setValues(resumo);
  sh.getRange(6,2,resumo.length,1).setFontWeight('bold');
  sh.getRange(12,3).setNumberFormat('0%');
  sh.getRange('B15').setValue('POR INTERESSE').setFontWeight('bold').setFontColor('#666');
  var ti=INTERESSES.map(function(it){return [it,'=COUNTIF(Leads!D2:D,"'+it+'")'];});
  sh.getRange(16,2,ti.length,2).setValues(ti);
  var baseS=16+INTERESSES.length+2;
  sh.getRange(baseS-1,2).setValue('FUNIL (POR ETAPA)').setFontWeight('bold').setFontColor('#666');
  var tsv=STATUS_LISTA.map(function(st){return [st,'=COUNTIF(Leads!G2:G,"'+st+'")'];});
  sh.getRange(baseS,2,tsv.length,2).setValues(tsv);
  sh.insertChart(sh.newChart().asPieChart().addRange(sh.getRange(16,2,INTERESSES.length,2)).setPosition(5,5,0,0).setOption('title','Leads por interesse').setOption('width',440).setOption('height',280).setOption('pieHole',0.4).build());
  sh.insertChart(sh.newChart().asColumnChart().addRange(sh.getRange(baseS,2,STATUS_LISTA.length,2)).setPosition(20,5,0,0).setOption('title','Funil por etapa').setOption('width',440).setOption('height',280).setOption('legend',{position:'none'}).build());
  sh.setColumnWidth(2,180); sh.setColumnWidth(3,90);
  return sh;
}
