/* =========================================================
   CONFIGURAÇÕES DA LOJA — edite aqui os dados da Amora Concept
   ========================================================= */
window.LOJA = {
  nome: "Amora Concept",
  slogan: "Moda feminina com personalidade",
  razaoSocial: "J C Ribeiro Ltda",
  cnpj: "29.650.787/0001-19",

  // WhatsApp só com números: 55 + DDD + número
  whatsapp: "5544999701159",
  whatsappExibicao: "(44) 99970-1159",
  instagram: "amora.concept",

  endereco: {
    rua: "R. Edmundo Mercer Júnior, 914 – Centro",
    cidade: "Cruzeiro do Oeste – PR",
    cep: "87400-000",
    mapa: "https://www.google.com/maps/search/?api=1&query=Amora+Concept+Cruzeiro+do+Oeste+PR"
  },

  horarios: [
    { dias: "Segunda a sexta", horas: "9h às 18h" },
    { dias: "Sábado", horas: "9h às 13h" },
    { dias: "Domingo", horas: "Fechado" }
  ],

  entrega: {
    // Valor da entrega local (Cruzeiro do Oeste). 0 = grátis
    taxaLocal: 0,
    // Pedidos acima deste valor têm frete grátis para outras cidades (combinado no WhatsApp)
    freteGratisAcima: 299
  },

  parcelamento: { maxParcelas: 3, semJuros: true },

  /* Modo prévia: mostra uma faixa avisando que é uma versão para aprovação.
     Deixe false no site oficial. */
  previa: true,

  /* Pagamento online (Mercado Pago).
     Enquanto "ativo" for false, o checkout finaliza o pedido pelo WhatsApp.
     Veja o README para ativar. */
  mercadoPago: {
    ativo: false,
    endpointPreferencia: "/api/criar-pagamento"
  }
};
