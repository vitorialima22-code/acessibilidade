/**
 * Recursos de Acessibilidade e Leitor de Voz
 * Desenvolvido para facilitar a navegabilidade do idoso
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONTROLE DE TAMANHO DA FONTE ---
    const botaoAumentarFonte = document.getElementById('botao-aumentar-fonte');
    const botaoDiminuirFonte = document.getElementById('botao-diminuir-fonte');
    
    // Níveis de tamanho em pixels
    const TAMANHO_PADRAO = 18;
    const TAMANHO_MAXIMO = 28;
    const INCREMENTO = 2;
    
    let tamanhoAtualFonte = TAMANHO_PADRAO;
  
    botaoAumentarFonte.addEventListener('click', () => {
      if (tamanhoAtualFonte < TAMANHO_MAXIMO) {
        tamanhoAtualFonte += INCREMENTO;
        document.body.style.fontSize = `${tamanhoAtualFonte}px`;
      }
    });
  
    botaoDiminuirFonte.addEventListener('click', () => {
      tamanhoAtualFonte = TAMANHO_PADRAO;
      document.body.style.fontSize = `${tamanhoAtualFonte}px`;
    });
  
    // --- 2. CONTROLE DE MODO ALTO CONTRASTE ---
    const botaoAltoContraste = document.getElementById('botao-alto-contraste');
  
    botaoAltoContraste.addEventListener('click', () => {
      document.body.classList.toggle('modo-alto-contraste');
      const estaAtivo = document.body.classList.contains('modo-alto-contraste');
      
      // Anúncio para leitores de tela
      botaoAltoContraste.setAttribute('aria-pressed', estaAtivo);
    });
  
    // --- 3. SINTETIZADOR DE LEITURA DE VOZ (SpeechSynthesis) ---
    const botaoLeitorVoz = document.getElementById('botao-leitor-voz');
    const textoBotaoVoz = document.getElementById('texto-botao-voz');
    
    const suporteVoz = 'speechSynthesis' in window;
    let estaLendo = false;
    let locucao = null;
  
    if (!suporteVoz) {
      botaoLeitorVoz.style.display = 'none'; // Esconde se o navegador não apoiar
    } else {
  
      botaoLeitorVoz.addEventListener('click', () => {
        if (estaLendo) {
          pararLeituraVoz();
        } else {
          iniciarLeituraVoz();
        }
      });
    }
  
    function iniciarLeituraVoz() {
      // Coleta o texto visível e relevante da página principal
      const conteudoPrincipal = document.getElementById('conteudo-principal');
      if (!conteudoPrincipal) return;
  
      // Cancela leituras anteriores pendentes
      window.speechSynthesis.cancel();
  
      // Extrai o texto limpo excluindo emojis excessivos
      const textoParaLer = conteudoPrincipal.innerText;
  
      locucao = new SpeechSynthesisUtterance(textoParaLer);
      locucao.lang = 'pt-BR';
      locucao.rate = 0.9; // Velocidade um pouco mais pausada para melhor compreensão de idosos
  
      // Tenta encontrar uma voz em Português do Brasil
      const vocesDisponiveis = window.speechSynthesis.getVoices();
      const vozPtBr = vocesDisponiveis.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR'));
      if (vozPtBr) {
        locucao.voice = vozPtBr;
      }
  
      // Eventos da narração
      locucao.onstart = () => {
        estaLendo = true;
        botaoLeitorVoz.classList.add('lendo');
        textoBotaoVoz.textContent = 'Parar Leitura';
      };
  
      locucao.onend = () => {
        pararLeituraVoz();
      };
  
      locucao.onerror = () => {
        pararLeituraVoz();
      };
  
      window.speechSynthesis.speak(locucao);
    }
  
    function pararLeituraVoz() {
      if (suporteVoz) {
        window.speechSynthesis.cancel();
      }
      estaLendo = false;
      botaoLeitorVoz.classList.remove('lendo');
      textoBotaoVoz.textContent = 'Ouvir Página';
    }
  
    // Se o usuário fechar ou mudar de página, encerra a voz
    window.addEventListener('beforeunload', () => {
      if (suporteVoz) {
        window.speechSynthesis.cancel();
      }
    });
  
  });