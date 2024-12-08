const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ajusta o tamanho do canvas para caber dentro da tela de um smartphone
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variáveis do jogo
const aguaviva = { x: 50, y: canvas.height / 2, size: 85, speed: 35 };
let peixes = [];
let bolhas = [];
let fase = 1;
let terminou = false;

const cenas = ["cena1.png", "cena2.png", "cena3.png", "cena4.png"];

// Carrega imagens
const imgAguaviva = new Image();
const imgPeix = new Image();
const imgBolha = new Image();

let imagensCarregadas = 0;
const totalImagens = 4; // Incluindo as 3 imagens de fundo

imgAguaviva.src = "aguaviva.gif";
imgPeix.src = "peix.gif";
imgBolha.src = "bolha.png";

// Função para verificar se todas as imagens foram carregadas
function imagemCarregada() {
  imagensCarregadas++;
  if (imagensCarregadas === totalImagens) {
    iniciaFase();
    loop();
  }
}

// Associar o evento onload para cada imagem
imgAguaviva.onload = imagemCarregada;
imgPeix.onload = imagemCarregada;
imgBolha.onload = imagemCarregada;
cenas.forEach((cena) => {
  const imgCena = new Image();
  imgCena.src = cena;
  imgCena.onload = imagemCarregada;
});

// Funções de jogo
function criaObjetos(tipo, quantidade) {
  let objetos = [];
  for (let i = 0; i < quantidade; i++) {
    const obj = {
      x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
      y: Math.random() * canvas.height,
      size: 30,
      size: tipo === "bolha" ? 80 : 30, // Ajuste para o tamanho das bolhas
      speed: tipo === "bolha" ? Math.random() * 2 + 1 : 0,
      direction: Math.random() < 0.5 ? 1 : -1,
    };
    objetos.push(obj);
  }
  return objetos;
}

function iniciaFase() {
  peixes = criaObjetos("peix", 3);
  bolhas = criaObjetos("bolha", fase + 1);
}

function desenhaImagem(obj, img) {
  if (img.complete) {
    ctx.drawImage(
      img,
      obj.x - obj.size / 2,
      obj.y - obj.size / 2,
      obj.size,
      obj.size
    );
  }
}

function detectaColisao(obj1, obj2) {
  const dist = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
  return dist < obj1.size / 2 + obj2.size / 2 - 10;
}

function atualizaBolhas() {
  bolhas.forEach((bolha) => {
    bolha.y += bolha.speed * bolha.direction;
    if (bolha.y <= 0 || bolha.y >= canvas.height) {
      bolha.direction *= -1;
    }
  });
}

function atualiza() {
  atualizaBolhas();

  peixes = peixes.filter((peix) => {
    if (detectaColisao(aguaviva, peix)) return false;
    return true;
  });

  if (peixes.length === 0) {
    fase++;
    if (fase > cenas.length) {
      terminou = true;
    } else {
      iniciaFase();
    }
  }

  bolhas.forEach((bolha) => {
    if (detectaColisao(aguaviva, bolha)) {
      fase = 1;
      iniciaFase();
    }
  });
}

function desenha() {
  const imgCena = new Image();
  imgCena.src = cenas[fase - 1];
  ctx.drawImage(imgCena, 0, 0, canvas.width, canvas.height);
  desenhaImagem(aguaviva, imgAguaviva);
  peixes.forEach((peix) => desenhaImagem(peix, imgPeix));
  peixes.forEach(peix => peix.size = 60);
  bolhas.forEach((bolha) => desenhaImagem(bolha, imgBolha));
}

canvas.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  aguaviva.x = touch.clientX;
  aguaviva.y = touch.clientY;
});

function loop() {
  if (terminou) {
    telaDeVitoria();
    return;
  }

  atualiza();
  desenha();
  requestAnimationFrame(loop);
}

function telaDeVitoria() {
  // Redireciona para a página final
  window.location.href = "gameover.html";
}

// Inicia o loop do jogo
imgAguaviva.onload = imagemCarregada;
imgPeix.onload = imagemCarregada;
imgBolha.onload = imagemCarregada;
cenas.forEach((cena) => {
  const imgCena = new Image();
  imgCena.src = cena;
  imgCena.onload = imagemCarregada;
});
