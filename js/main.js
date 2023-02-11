'use strict'; // Строгий режим

const log = console.log;
const inputSearch = document.getElementById('search-title'); // Получить поле ввода
const playerBtn = document.getElementById('search'); // Кнопка поиска
const playerForm = document.querySelector('#player'); // Форма плеера
const posterLink = 'https://youowl.ru/kinopoisk/img/poster0.webp'; // Cсылка на постер
let keyId; // Глобальная переменная для значения 'keyId' из localStorage
const bazonLink = 'https://v1674220552.bazon.site/kp/'; // Cсылка для bazon.cc которая будет встроена в iframe
const pvideocdnLink = 'https://13.annacdn.cc/agAMhXIKvZvI?kp_id='; // Cсылка для videocdn.tv которая будет встроена в iframe

// Слушаем нажатие клавиши Enter
inputSearch.addEventListener('keydown', event => {
  if (event.code === 'Enter') {
    localStorage.clear(); // Очищаем локальное хранилище localStorage
    const inputValue = inputSearch.value; // Получить значение input.value
    localStorage.setItem('keyId', inputValue); // Установить входное значение input.value как элемент в localStorage
    keyId = localStorage.getItem('keyId'); // Получить значение 'keyId' из localStorage
    inputSearch.value = ''; // Очистить поле ввода input.value
    return sendRequest(keyId); // Вернуть значение 'keyId' в функцию 'sendRequest()'
  }
});

// Слушаем нажатие на кнопку поиска
playerBtn.addEventListener('click', () => {
  localStorage.clear(); // Очищаем локальное хранилище localStorage
  const inputValue = inputSearch.value; // Получить значение input.value
  localStorage.setItem('keyId', inputValue); // Установить входное значение input.value как элемент в localStorage
  keyId = localStorage.getItem('keyId'); // Получить значение 'keyId' из localStorage, затем присваиваем к глобальной переменной keyId
  inputSearch.value = ''; // Очищаем значение input.value
  return sendRequest(keyId); // Вернуть значение 'keyId' в функцию 'sendRequest()'
});
// 4365427  1166515

// Отправляю GET запрос на сервер.
async function sendRequest() {
  try {
    // Увеличиваем скорость анимации canvas в начале GET запроса
    let speed = 3;
    let interval = setInterval(() => {
      speed++;
      gl.speed = speed;
      if (speed >= 30) {
        clearInterval(interval);
      }
    }, 100);

    const response = await fetch('https://1226713-cd78704.webtm.ru/search?k_id=' + keyId);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    // Уменьшаем скорость анимации canvas после получения ответа от сервера
    clearInterval(interval);
    speed = 30;
    interval = setInterval(() => {
      speed--;
      gl.speed = speed;
      if (speed <= 3) {
        clearInterval(interval);
      }
    }, 100);

    if (data.result === 'bazon') {
      return createPlayerBazon(); // Если фильм есть на bazon, выполняем функцию createPlayerBazon()
    } else if (data.result === 'videocdn') {
      return createPlayerVideocdn(); // Если фильма нет на bazon, выполняем функцию createPlayerVideocdn()
    } else {
      throw new Error('Unexpected result value: ' + data.result);
    }
  } catch (error) {
    console.error(error);
  }
}

function createPlayerBazon() {
  playerForm.src = bazonLink + keyId;
  playerForm.setAttribute('url', posterLink);
  log('Bazon id kinopoisk:', keyId);
}
function createPlayerVideocdn() {
  playerForm.src = pvideocdnLink + keyId + '&poster=' + posterLink;
  log('Videocdn id kinopoisk:', keyId);
}

//#1pur ==================================================================================
// canvas
let gl = {
  width: 480,
  height: 240,
  scrollY: 0,
  speed: 3, // min 3 max 100
  alpha: 1, // max 1 min 0
  rgb: ['87,171,255', '242,224,136', '255,189,122', '122,235,141', '166,148,255', '245,249,252'],
  rid: 0,
  init() {
    gl.width = window.innerWidth;
    gl.height = window.innerHeight;
    gl.scrollY = window.scrollY;
  },
};

gl.canvas = document.querySelector('canvas');
gl.ctx = gl.canvas.getContext('2d');
gl.main = main;
gl.init();
gl.main();

window.addEventListener('resize', function () {
  gl.init();
  gl.main();
});
window.addEventListener('scroll', function () {
  gl.init();
});

function main() {
  function rndw() {
    return Math.random() * width - width / 2;
  }
  function rndh() {
    return Math.random() * height - height / 2;
  }
  function ball() {
    let rw = rndw(),
      rh = rndh(),
      w1 = Math.random() * width,
      w0 = w1,
      i = gl.rgb.length - 1;
    let c = Math.random() < 0.75 ? gl.rgb[i] : gl.rgb[Math.floor(Math.random() * i)];

    return {
      update() {
        w1 -= gl.width > 480 ? gl.speed * (gl.width / 1440) : 3;
        if (w1 < 1) (rw = rndw()), (rh = rndh()), (w1 = width), (w0 = w1);
      },
      render() {
        ctx.lineWidth = 24 * (1 - w1 / width);
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(' + c + ',' + Math.min(gl.alpha, 1 - w1 / width) + ')';
        ctx.beginPath();
        ctx.moveTo((width * rw) / w0, (height * rh) / w0);
        ctx.lineTo((width * rw) / w1, (height * rh) / w1);
        ctx.stroke();
        w0 = w1;
      },
    };
  }
  function loop() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);

    for (let b of balls) {
      b.update();
      b.render();
    }
    gl.rid = window.requestAnimationFrame(loop);
  }

  gl.rid = window.cancelAnimationFrame(gl.rid);

  let { width, height, canvas, ctx } = gl;

  let dpr = window.devicePixelRatio;
  if (dpr > 1) {
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width *= dpr;
    canvas.height = height *= dpr;
    ctx.scale(dpr, dpr);
  } else {
    canvas.width = width;
    canvas.height = height;
  }

  let balls = [];
  for (let i = 0; i < 800; i++) balls.push(ball());

  loop();
}
