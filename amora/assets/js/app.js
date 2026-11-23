/* ===== Amora Concept — lógica da loja ===== */
(function () {
  "use strict";
  const L = window.LOJA;
  const PRODUTOS = window.PRODUTOS || [];
  const CATEGORIAS = window.CATEGORIAS || [];
  const pagina = document.body.dataset.pagina;

  /* ---------- utilidades ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const porId = (id) => PRODUTOS.find((p) => p.id === id);
  const nomeCategoria = (id) => (CATEGORIAS.find((c) => c.id === id) || {}).nome || "";
  const linkWhats = (texto) => `https://wa.me/${L.whatsapp}?text=${encodeURIComponent(texto)}`;
  const parcelas = (v) => {
    const n = L.parcelamento.maxParcelas;
    return n > 1 ? `ou ${n}x de ${brl(v / n)}${L.parcelamento.semJuros ? " sem juros" : ""}` : "";
  };
  const tom = (id) => "tom-" + ((id.length % 3) + 1);
  const imagem = (p, i = 0) =>
    p.imagens && p.imagens[i]
      ? `<img src="${esc(p.imagens[i])}" alt="${esc(p.nome)}" loading="lazy">`
      : `<div class="placeholder ${tom(p.id)}" aria-hidden="true"><span>${esc(p.nome.charAt(0))}</span></div>`;

  /* ---------- carrinho (localStorage) ---------- */
  const CHAVE = "amora_carrinho";
  const Carrinho = {
    ler() { try { return JSON.parse(localStorage.getItem(CHAVE)) || []; } catch (e) { return Carrinho._mem || []; } },
    salvar(itens) {
      Carrinho._mem = itens;
      try { localStorage.setItem(CHAVE, JSON.stringify(itens)); } catch (e) { /* modo privado */ }
      atualizarBadge();
    },
    adicionar(id, tamanho, cor, qtd) {
      const itens = Carrinho.ler();
      const existente = itens.find((i) => i.id === id && i.tamanho === tamanho && i.cor === cor);
      if (existente) existente.qtd += qtd; else itens.push({ id, tamanho, cor, qtd });
      Carrinho.salvar(itens);
    },
    alterar(idx, qtd) { const itens = Carrinho.ler(); if (!itens[idx]) return; itens[idx].qtd = Math.max(1, qtd); Carrinho.salvar(itens); },
    remover(idx) { const itens = Carrinho.ler(); itens.splice(idx, 1); Carrinho.salvar(itens); },
    limpar() { Carrinho.salvar([]); },
    itensValidos() { return Carrinho.ler().map((i) => ({ ...i, produto: porId(i.id) })).filter((i) => i.produto); },
    quantidade() { return Carrinho.ler().reduce((s, i) => s + i.qtd, 0); },
    subtotal() { return Carrinho.itensValidos().reduce((s, i) => s + i.produto.preco * i.qtd, 0); }
  };

  function atualizarBadge() {
    const n = Carrinho.quantidade();
    $$(".badge").forEach((b) => { b.textContent = n; b.dataset.zero = n === 0; });
  }

  function toast(msg, link) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = esc(msg) + (link ? ` <a href="${link.href}">${esc(link.texto)}</a>` : "");
    t.classList.add("visivel");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("visivel"), 3500);
  }

  /* ---------- ícones ---------- */
  const ICONES = {
    sacola: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".8" fill="currentColor"/></svg>',
    whats: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>'
  };

  /* ---------- cabeçalho e rodapé compartilhados ---------- */
  function montarLayout() {
    const links = [["index.html", "Início", "inicio"], ["loja.html", "Loja", "loja"], ["loja.html?cat=vestidos", "Vestidos", ""], ["loja.html?cat=jeans", "Jeans", ""], ["index.html#visite", "Contato", ""]];
    const header = $("#header");
    if (header) {
      header.outerHTML = `${L.previa ? `
      <div class="faixa-previa" role="note">Prévia para aprovação · produtos, preços e fotos ilustrativos · desenvolvido por <a href="https://www.horizonframe.com.br" target="_blank" rel="noopener">Horizon Frame</a></div>` : ""}
      <div class="topbar">Frete grátis em Cruzeiro do Oeste · Parcele em até ${L.parcelamento.maxParcelas}x sem juros</div>
      <header class="header">
        <div class="container">
          <button class="icone-btn menu-toggle" aria-label="Abrir menu" aria-expanded="false">${ICONES.menu}</button>
          <a href="index.html" class="logo" aria-label="${esc(L.nome)} — início"><img src="assets/img/logo-horizontal.jpg" alt="${esc(L.nome)}" width="447" height="158"></a>
          <nav class="nav" aria-label="Principal">
            ${links.map(([h, t, p]) => `<a href="${h}" class="${p && p === pagina ? "ativo" : ""}">${t}</a>`).join("")}
          </nav>
          <div class="header-acoes">
            <a class="icone-btn" href="https://instagram.com/${L.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICONES.insta}</a>
            <a class="icone-btn" href="carrinho.html" aria-label="Sacola">${ICONES.sacola}<span class="badge" data-zero="true">0</span></a>
          </div>
        </div>
      </header>`;
      const toggle = $(".menu-toggle"), nav = $(".nav");
      toggle.addEventListener("click", () => {
        const aberto = nav.classList.toggle("aberto");
        toggle.setAttribute("aria-expanded", aberto);
      });
    }
    const footer = $("#footer");
    if (footer) {
      footer.outerHTML = `
      <footer class="footer">
        <div class="container">
          <div><strong style="color:var(--tinta)">${esc(L.nome)}</strong> · ${esc(L.endereco.rua)}, ${esc(L.endereco.cidade)}</div>
          <div>${esc(L.razaoSocial)} · CNPJ ${esc(L.cnpj)}</div>
          <div><a href="https://instagram.com/${L.instagram}" target="_blank" rel="noopener">@${esc(L.instagram)}</a> · <a href="${linkWhats("Olá! Vim pelo site da Amora Concept.")}" target="_blank" rel="noopener">${esc(L.whatsappExibicao)}</a></div>
        </div>
      </footer>
      <a class="whats-flutuante" href="${linkWhats("Olá! Vim pelo site da Amora Concept.")}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${ICONES.whats}</a>`;
    }
    atualizarBadge();
  }

  /* ---------- card de produto ---------- */
  function card(p) {
    const selo = !p.estoque ? '<span class="selo esgotado">Esgotado</span>'
      : p.precoDe ? '<span class="selo promo">Oferta</span>'
      : p.novo ? '<span class="selo">Novo</span>' : "";
    return `
      <a class="card" href="produto.html?id=${encodeURIComponent(p.id)}">
        <div class="card-img">${imagem(p)}${selo}</div>
        <h3>${esc(p.nome)}</h3>
        <div class="preco">${p.precoDe ? `<del>${brl(p.precoDe)}</del>` : ""}<span>${brl(p.preco)}</span></div>
        <div class="parcelas">${parcelas(p.preco)}</div>
      </a>`;
  }

  /* ---------- página inicial ---------- */
  function paginaInicio() {
    const cats = $("#categorias");
    if (cats) cats.innerHTML = CATEGORIAS.map((c) => `<a href="loja.html?cat=${c.id}">${esc(c.nome)}</a>`).join("");
    const dest = $("#destaques");
    if (dest) {
      const lista = PRODUTOS.filter((p) => p.destaque).slice(0, 4);
      dest.innerHTML = (lista.length ? lista : PRODUTOS.slice(0, 4)).map(card).join("");
    }
    const hor = $("#horarios");
    if (hor) hor.innerHTML = L.horarios.map((h) => `<li><span>${esc(h.dias)}</span><span>${esc(h.horas)}</span></li>`).join("");
    const end = $("#endereco");
    if (end) end.innerHTML = `${esc(L.endereco.rua)}<br>${esc(L.endereco.cidade)}<br>CEP ${esc(L.endereco.cep)}`;
    $$("[data-whats]").forEach((a) => { a.href = linkWhats(a.dataset.whats || "Olá! Vim pelo site da Amora Concept."); a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-mapa]").forEach((a) => { a.href = L.endereco.mapa; a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-insta]").forEach((a) => { a.href = "https://instagram.com/" + L.instagram; a.target = "_blank"; a.rel = "noopener"; });
  }

  /* ---------- página da loja ---------- */
  function paginaLoja() {
    const params = new URLSearchParams(location.search);
    let cat = params.get("cat") || "todos";
    let ordem = "relevancia";
    const filtros = $("#filtros"), grade = $("#grade"), contagem = $("#contagem"), titulo = $("#titulo-loja");

    filtros.innerHTML = [{ id: "todos", nome: "Todos" }, ...CATEGORIAS]
      .map((c) => `<button class="filtro" data-cat="${c.id}">${esc(c.nome)}</button>`).join("");

    function render() {
      $$(".filtro", filtros).forEach((b) => b.classList.toggle("ativo", b.dataset.cat === cat));
      titulo.textContent = cat === "todos" ? "Toda a coleção" : nomeCategoria(cat);
      let lista = PRODUTOS.filter((p) => cat === "todos" || p.categoria === cat);
      if (ordem === "menor") lista = [...lista].sort((a, b) => a.preco - b.preco);
      if (ordem === "maior") lista = [...lista].sort((a, b) => b.preco - a.preco);
      if (ordem === "novos") lista = [...lista].sort((a, b) => (b.novo ? 1 : 0) - (a.novo ? 1 : 0));
      lista = [...lista].sort((a, b) => (b.estoque ? 1 : 0) - (a.estoque ? 1 : 0));
      contagem.textContent = `${lista.length} ${lista.length === 1 ? "peça" : "peças"}`;
      grade.innerHTML = lista.length ? lista.map(card).join("") : "";
      $("#vazio").hidden = lista.length > 0;
    }

    filtros.addEventListener("click", (e) => {
      const b = e.target.closest(".filtro"); if (!b) return;
      cat = b.dataset.cat;
      history.replaceState(null, "", cat === "todos" ? "loja.html" : `loja.html?cat=${cat}`);
      render();
    });
    $("#ordem").addEventListener("change", (e) => { ordem = e.target.value; render(); });
    render();
  }

  /* ---------- página de produto ---------- */
  function paginaProduto() {
    const p = porId(new URLSearchParams(location.search).get("id"));
    const alvo = $("#produto");
    if (!p) {
      alvo.innerHTML = `<div class="vazio" style="grid-column:1/-1"><h2>Produto não encontrado</h2><p><a class="btn" href="loja.html">Ver a loja</a></p></div>`;
      return;
    }
    document.title = `${p.nome} | ${L.nome}`;
    let tamanho = p.tamanhos.length === 1 ? p.tamanhos[0] : null;
    let cor = p.cores && p.cores.length === 1 ? p.cores[0] : null;
    const totalImgs = Math.max(1, (p.imagens || []).length);

    alvo.innerHTML = `
      <div class="galeria">
        <div class="galeria-principal">${imagem(p, 0)}</div>
        ${totalImgs > 1 ? `<div class="miniaturas">${p.imagens.map((src, i) => `<button class="${i === 0 ? "ativo" : ""}" data-i="${i}" aria-label="Foto ${i + 1}"><img src="${esc(src)}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <div class="produto-info">
        <p class="eyebrow"><a href="loja.html?cat=${p.categoria}">${esc(nomeCategoria(p.categoria))}</a></p>
        <h1>${esc(p.nome)}</h1>
        <div class="preco">${p.precoDe ? `<del>${brl(p.precoDe)}</del>` : ""}<span>${brl(p.preco)}</span></div>
        <div class="parcelas">${parcelas(p.preco)} · ou à vista no Pix</div>
        <p class="descricao">${esc(p.descricao)}</p>
        ${p.cores && p.cores.length ? `<div class="opcoes"><div class="opcoes-titulo">Cor <span class="muted" id="cor-sel">${cor ? "· " + esc(cor) : ""}</span></div><div class="opcoes-lista" id="cores">${p.cores.map((c) => `<button class="opcao ${c === cor ? "ativo" : ""}" data-v="${esc(c)}">${esc(c)}</button>`).join("")}</div></div>` : ""}
        <div class="opcoes"><div class="opcoes-titulo">Tamanho</div><div class="opcoes-lista" id="tamanhos">${p.tamanhos.map((t) => `<button class="opcao ${t === tamanho ? "ativo" : ""}" data-v="${esc(t)}">${esc(t)}</button>`).join("")}</div></div>
        <div class="opcoes"><div class="opcoes-titulo">Quantidade</div>
          <div class="qtd"><button data-d="-1" aria-label="Diminuir">−</button><input id="qtd" type="number" min="1" value="1" aria-label="Quantidade"><button data-d="1" aria-label="Aumentar">+</button></div>
        </div>
        <div class="produto-acoes">
          <button class="btn btn-amora" id="add" ${p.estoque ? "" : "disabled"}>${p.estoque ? "Adicionar à sacola" : "Esgotado"}</button>
          <a class="btn btn-claro" id="duvida" target="_blank" rel="noopener">${ICONES.whats.replace("<svg", '<svg width="18" height="18"')} Tirar dúvida</a>
        </div>
        <div class="aviso" id="aviso" aria-live="polite"></div>
        <div class="produto-extra">
          <p><strong>Entrega:</strong> grátis em Cruzeiro do Oeste. Para outras cidades, enviamos e combinamos o frete pelo WhatsApp.</p>
          <p><strong>Retirada:</strong> você também pode retirar na loja, ${esc(L.endereco.rua)}.</p>
          <p><strong>Trocas:</strong> até 7 dias após o recebimento, com etiqueta.</p>
        </div>
      </div>`;

    const setDuvida = () => {
      $("#duvida").href = linkWhats(`Olá! Tenho uma dúvida sobre o produto "${p.nome}"${tamanho ? ` (tam. ${tamanho})` : ""}. ${location.href}`);
    };
    setDuvida();

    const escolher = (lista, cb) => lista && lista.addEventListener("click", (e) => {
      const b = e.target.closest(".opcao"); if (!b) return;
      $$(".opcao", lista).forEach((x) => x.classList.toggle("ativo", x === b));
      cb(b.dataset.v); $("#aviso").textContent = ""; setDuvida();
    });
    escolher($("#tamanhos"), (v) => (tamanho = v));
    escolher($("#cores"), (v) => { cor = v; $("#cor-sel").textContent = "· " + v; });

    const qtdInput = $("#qtd");
    $$(".qtd button", alvo).forEach((b) => b.addEventListener("click", () => {
      qtdInput.value = Math.max(1, (parseInt(qtdInput.value, 10) || 1) + Number(b.dataset.d));
    }));

    const mini = $(".miniaturas");
    if (mini) mini.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $$("button", mini).forEach((x) => x.classList.toggle("ativo", x === b));
      $(".galeria-principal").innerHTML = imagem(p, Number(b.dataset.i));
    });

    $("#add").addEventListener("click", () => {
      if (p.cores && p.cores.length && !cor) { $("#aviso").textContent = "Escolha uma cor."; return; }
      if (!tamanho) { $("#aviso").textContent = "Escolha um tamanho."; return; }
      Carrinho.adicionar(p.id, tamanho, cor, Math.max(1, parseInt(qtdInput.value, 10) || 1));
      toast(`${p.nome} foi para a sacola.`, { href: "carrinho.html", texto: "Ver sacola" });
    });

    const rel = $("#relacionados");
    if (rel) rel.innerHTML = PRODUTOS.filter((x) => x.id !== p.id && x.categoria === p.categoria).concat(PRODUTOS.filter((x) => x.id !== p.id && x.categoria !== p.categoria)).slice(0, 4).map(card).join("");
  }

  /* ---------- carrinho e checkout ---------- */
  function paginaCarrinho() {
    const lista = $("#itens"), resumo = $("#resumo");

    function frete() {
      const modo = ($("input[name=entrega]:checked") || {}).value;
      if (modo === "local") return L.entrega.taxaLocal;
      return 0; // retirada ou envio (frete combinado no WhatsApp)
    }

    function render() {
      const itens = Carrinho.itensValidos();
      if (!itens.length) {
        $("#carrinho").innerHTML = `<div class="vazio" style="grid-column:1/-1"><h2>Sua sacola está vazia</h2><p>Que tal dar uma olhada nas novidades?</p><p><a class="btn" href="loja.html">Ir para a loja</a></p></div>`;
        return;
      }
      lista.innerHTML = itens.map((i, idx) => `
        <div class="item">
          <a class="item-img" href="produto.html?id=${encodeURIComponent(i.id)}">${imagem(i.produto)}</a>
          <div>
            <h3>${esc(i.produto.nome)}</h3>
            <div class="detalhes">Tam. ${esc(i.tamanho)}${i.cor ? " · " + esc(i.cor) : ""} · ${brl(i.produto.preco)}</div>
            <div class="qtd"><button data-idx="${idx}" data-d="-1" aria-label="Diminuir">−</button><input value="${i.qtd}" readonly aria-label="Quantidade"><button data-idx="${idx}" data-d="1" aria-label="Aumentar">+</button></div>
            <button class="remover" data-rm="${idx}">Remover</button>
          </div>
          <div class="item-total">${brl(i.produto.preco * i.qtd)}</div>
        </div>`).join("");
      const sub = Carrinho.subtotal();
      const modo = ($("input[name=entrega]:checked") || {}).value;
      const f = frete();
      $("#subtotal").textContent = brl(sub);
      $("#frete").textContent = modo === "envio" ? (sub >= L.entrega.freteGratisAcima ? "Grátis" : "A combinar") : f === 0 ? "Grátis" : brl(f);
      $("#total").textContent = brl(sub + f);
      $("#parcelas-total").textContent = parcelas(sub + f);
      $("#bloco-endereco").hidden = modo === "retirada";
    }

    lista.addEventListener("click", (e) => {
      const b = e.target.closest("[data-d]");
      if (b) { const idx = Number(b.dataset.idx); const it = Carrinho.ler()[idx]; Carrinho.alterar(idx, it.qtd + Number(b.dataset.d)); render(); }
      const r = e.target.closest("[data-rm]");
      if (r) { Carrinho.remover(Number(r.dataset.rm)); render(); }
    });
    resumo.addEventListener("change", render);

    $("#form-checkout").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const itens = Carrinho.itensValidos();
      const modo = f.get("entrega");
      const sub = Carrinho.subtotal(), total = sub + frete();
      if (modo !== "retirada" && !String(f.get("endereco") || "").trim()) {
        toast("Informe o endereço de entrega."); e.target.endereco.focus(); return;
      }

      if (L.mercadoPago.ativo && f.get("pagamento") === "online") {
        try {
          const r = await fetch(L.mercadoPago.endpointPreferencia, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itens: itens.map((i) => ({ id: i.id, tamanho: i.tamanho, cor: i.cor, qtd: i.qtd })), cliente: Object.fromEntries(f) })
          });
          const dados = await r.json();
          if (dados.init_point) { location.href = dados.init_point; return; }
          throw new Error("sem link");
        } catch (err) {
          toast("Não foi possível abrir o pagamento online. Vamos finalizar pelo WhatsApp.");
        }
      }

      const linhas = [
        `*Novo pedido — ${L.nome}*`, "",
        ...itens.map((i) => `• ${i.qtd}x ${i.produto.nome} — tam. ${i.tamanho}${i.cor ? ", " + i.cor : ""} — ${brl(i.produto.preco * i.qtd)}`),
        "", `Subtotal: ${brl(sub)}`,
        `Entrega: ${modo === "retirada" ? "Retirar na loja" : modo === "local" ? "Entrega em Cruzeiro do Oeste" : "Envio para outra cidade (frete a combinar)"}`,
        `*Total: ${brl(total)}*`, "",
        `Pagamento: ${{ pix: "Pix", cartao: "Cartão (link de pagamento)", dinheiro: "Dinheiro na entrega/retirada", online: "Online" }[f.get("pagamento")] || f.get("pagamento")}`,
        "", `Nome: ${f.get("nome")}`, `WhatsApp: ${f.get("telefone")}`
      ];
      if (modo !== "retirada") linhas.push(`Endereço: ${f.get("endereco")}, ${f.get("bairro")} — ${f.get("cidade")}`);
      if (f.get("obs")) linhas.push(`Obs.: ${f.get("obs")}`);

      const url = linkWhats(linhas.join("\n"));
      try { window.open(url, "_blank", "noopener"); } catch (err) { /* pop-up bloqueado: há o botão abaixo */ }
      Carrinho.limpar();
      $("#carrinho").innerHTML = `<div class="vazio" style="grid-column:1/-1"><p class="eyebrow">Quase lá</p><h2>Obrigada, ${esc(String(f.get("nome")).split(" ")[0])}!</h2><p>Abrimos o WhatsApp com o resumo do seu pedido. É só enviar a mensagem que a nossa equipe confirma disponibilidade e pagamento.</p><p><a class="btn btn-amora" href="${url}" target="_blank" rel="noopener">Abrir WhatsApp novamente</a> <a class="btn btn-claro" href="loja.html">Continuar comprando</a></p></div>`;
    });

    if (L.mercadoPago.ativo) {
      $("#pagamentos").insertAdjacentHTML("afterbegin", `<label><input type="radio" name="pagamento" value="online"> <span>Pagar online agora<small>Pix ou cartão pelo Mercado Pago</small></span></label>`);
    }
    render();
  }

  /* ---------- inicialização ---------- */
  montarLayout();
  ({ inicio: paginaInicio, loja: paginaLoja, produto: paginaProduto, carrinho: paginaCarrinho }[pagina] || (() => {}))();
  window.addEventListener("storage", atualizarBadge);
})();
