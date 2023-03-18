'use strict'; // Строгий режим

const log = console.log;
import gl from './animation.js'; // Импортируем переменную gl из animation.js
const inputSearch = document.getElementById('search-title'); // Получить поле ввода
const playerBtn = document.getElementById('search'); // Кнопка поиска
const playerForm = document.querySelector('#player'); // Форма плеера
const posterLink = 'https://owlov.ru/img/poster0.webp'; // Cсылка на постер
let keyId; // Глобальная переменная для значения 'keyId' из localStorage
const bazonLink = 'https://v1674220552.bazon.site/kp/'; // Cсылка для bazon.cc которая будет встроена в iframe
const pvideocdnLink = 'https://13.annacdn.cc/agAMhXIKvZvI?kp_id='; // Cсылка для videocdn.tv которая будет встроена в iframe
// const kodikLinkd = 'https://kodik.cc/find-player?kinopoiskID=880618'; // Формируется при получении ответа от сервера в виде объекта

// Слушаем нажатие клавиши Enter
inputSearch.addEventListener('keydown', event => {
  if (event.code === 'Enter') {
    event.preventDefault(); // Отменить отправку данных формы
    const inputValue = inputSearch.value; // Получить значение input.value
    // Проверяем, что значение поля ввода не пустое
    if (inputValue) {
      // Очищаем локальное хранилище localStorage.
      // Перебираем все ключи в localStorage и проверяет каждый ключ на наличие подстроки 'keyId'. Если ключ содержит эту подстроку, он удаляется из localStorage.
      for (let key in localStorage) {
        if (key.includes('keyId')) {
          localStorage.removeItem(key);
        }
      }
      const buttons = document.querySelectorAll('.seasonBtn'); // Поиск всех кнопок
      buttons.forEach(button => button.remove()); // Удаление всех кнопок
      playerForm.src = ''; // Очищаем форму плеера
      localStorage.setItem('keyId', inputValue); // Установить входное значение input.value как элемент в localStorage
      keyId = localStorage.getItem('keyId'); // Получить значение 'keyId' из localStorage
      inputSearch.value = ''; // Очистить поле ввода input.value
      return sendRequest(keyId); // Вернуть значение 'keyId' в функцию 'sendRequest()'
    }
  }
});

// Слушаем нажатие на кнопку поиска
playerBtn.addEventListener('click', () => {
  const inputValue = inputSearch.value; // Получить значение input.value
  // Проверяем, что значение поля ввода не пустое
  if (inputValue) {
    // Очищаем локальное хранилище localStorage.
    // Перебираем все ключи в localStorage и проверяет каждый ключ на наличие подстроки 'keyId'. Если ключ содержит эту подстроку, он удаляется из localStorage.
    for (let key in localStorage) {
      if (key.includes('keyId')) {
        localStorage.removeItem(key);
      }
    }
    const buttons = document.querySelectorAll('.seasonBtn'); // Поиск всех кнопок
    buttons.forEach(button => button.remove()); // Удаление всех кнопок
    playerForm.src = ''; // Очищаем форму плеера
    localStorage.setItem('keyId', inputValue); // Установить входное значение input.value как элемент в localStorage
    keyId = localStorage.getItem('keyId'); // Получить значение 'keyId' из localStorage, затем присваиваем к глобальной переменной keyId
    inputSearch.value = ''; // Очищаем значение input.value
    return sendRequest(keyId); // Вернуть значение 'keyId' в функцию 'sendRequest()'
  }
});
// 4365427  1166515  880618

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
    } else if (typeof data.result === 'object') {
      // log('Response from server:', data);
      return createPlayerKodik(data.result); // Выполняем функцию createPlayerKodik() и передаем ей URL
    } else if (data.result === 'videocdn') {
      return createPlayerVideocdn(); // Если фильма нет на bazon, выполняем функцию createPlayerVideocdn()
    } else {
      throw new Error('Unexpected result value: ' + data.result);
    }
  } catch (error) {
    console.error(error);
  }
}

// Функция создания плеера Kodik с кнопками на сезоны
// Если ключей только один, то мы берем единственное значение из объекта и устанавливаем его в playerForm.src.
// Если ключей несколько, то мы создаем кнопки для каждого сезона, устанавливаем им текст и добавляем обработчик клика, который устанавливает соответствующую ссылку на сезон в playerForm.src.
function createPlayerKodik(data) {
  const playerBox = document.querySelector('.player-box'); // Найти контейнер плеера
  const buttonWidth = 100; // Ширина кнопки
  const distanceBetweenButtons = 10; // Расстояние между кнопками

  // Если есть только одна ссылка на сезон, то загрузить этот сезон
  if (Object.keys(data).length === 1) {
    const seasonUrl = Object.values(data)[0];
    playerForm.src = seasonUrl;
    log('Kodik id kinopoisk:', keyId);
  } else {
    const seasonLinks = Object.entries(data); // Преобразование объекта ссылок на сезоны в массив пар [ключ, значение]
    let leftPosition = 10; // Переменная для расчета позиции по горизонтали
    for (let i = 0; i < seasonLinks.length; i++) {
      const seasonNumber = seasonLinks[i][0]; // Номер сезона
      const seasonUrl = seasonLinks[i][1]; // Ссылка на сезон
      if (seasonNumber === '0') {
        continue; // Если ключ "0", пропустить итерацию цикла
      }
      const button = document.createElement('button'); // Создание кнопки
      button.innerText = `Сезон ${seasonNumber}`; // Установка текста на кнопке
      button.classList.add('seasonBtn'); // Добавление класса на кнопку
      button.style.position = 'absolute'; // Установка позиции кнопки
      button.style.top = `12px`; // Установка позиции кнопки
      button.style.left = `${leftPosition}px`; // Установка позиции кнопки
      button.style.width = `${buttonWidth}px`; // Установка ширины кнопки
      button.addEventListener('click', () => {
        // Добавление обработчика событий на кнопку
        playerForm.src = seasonUrl; // Установка ссылки на сезон
        log('Kodik id kinopoisk:', keyId);
        const buttons = document.querySelectorAll('.seasonBtn'); // Поиск всех кнопок
        buttons.forEach(button => button.remove()); // Удаление всех кнопок
      });
      playerBox.appendChild(button); // Добавление кнопки в контейнер плеера
      leftPosition += buttonWidth + distanceBetweenButtons; // Расчет позиции следующей кнопки
    }
  }
}

function createPlayerBazon() {
  console.clear();
  playerForm.src = bazonLink + keyId;
  log('Bazon id kinopoisk:', keyId);
}
function createPlayerVideocdn() {
  console.clear();
  playerForm.src = pvideocdnLink + keyId + '&poster=' + posterLink + '?domain=owlov.ru';
  log('Videocdn id kinopoisk:', keyId);
}
