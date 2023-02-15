'use strict'; // Строгий режим

const log = console.log;
import gl from './animation.js'; // Импортируем переменную gl из animation.js
import yandexCode from './yandex.js'; // Скрипт Яндекс Метрики в формате Base64
import base64Decode from './base64Decode.js'; // Декодер Base64
const inputSearch = document.getElementById('search-title'); // Получить поле ввода
const playerBtn = document.getElementById('search'); // Кнопка поиска
const playerForm = document.querySelector('#player'); // Форма плеера
const posterLink = 'https://owlov.ru/img/poster0.webp'; // Cсылка на постер
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

// Через 5 секунд после загрузки HTML декодируем base64 и встраиваем в HTML
window.onload = function () {
  setTimeout(() => {
    const yandexScript = document.createElement('script');
    const decodedCode = base64Decode(yandexCode.encodedCode);
    yandexScript.innerHTML = decodedCode;
    document.getElementsByTagName('head')[0].appendChild(yandexScript);
  }, 5000);
};

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
  console.clear();
  playerForm.src = bazonLink + keyId;
  log('Bazon id kinopoisk:', keyId);
}
function createPlayerVideocdn() {
  console.clear();
  playerForm.src = pvideocdnLink + keyId + '&poster=' + posterLink;
  log('Videocdn id kinopoisk:', keyId);
}
