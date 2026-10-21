
/* ==========================================
   SAVORÉ — ПОЛНЫЙ JAVASCRIPT
   Фильмы, меню, рассадка, бронирование
   ========================================== */

const films = [
  {
    name: 'Рататуй',
    year: '2007',
    tag: 'ПАРИЖСКИЙ ВЕЧЕР',
    price: 4900,
    poster: 'assets/ratatouille.jpg',
    description: 'Париж пахнет свежим хлебом, травами Прованса и мечтами, которые становятся реальностью.',
    menu: [
      ['00:12:00', 'Амюз-буш «Первый аромат Парижа»', 'Воздушный мусс из козьего сыра, виноград и хрустящий багет.'],
      ['00:39:00', 'Крем-суп «Маленький шеф»', 'Нежный крем из запечённых овощей с ароматом тимьяна.'],
      ['01:27:00', 'Рататуй «Воспоминание»', 'Тонкие слои цукини, томатов и баклажана в прованском соусе.'],
      ['01:39:00', 'Десерт «Парижская мечта»', 'Ванильный крем, карамель и ягодное облако.']
    ]
  },
  {
    name: 'Коралина в Стране Кошмаров',
    year: '2009',
    tag: 'ПО ТУ СТОРОНУ ДВЕРИ',
    price: 5400,
    poster: 'assets/coraline.jpg',
    description: 'Откройте потайную дверь в мир необычных вкусов, где каждый курс хранит загадку.',
    menu: [
      ['00:10:00', '«Пуговица»', 'Мини-тарталетка с чёрным кунжутом и сливочным сыром.'],
      ['00:29:00', '«Другой ужин»', 'Тыквенный велюте с дымной паприкой и золотыми сухариками.'],
      ['00:53:00', '«Сад за дверью»', 'Свёкла, ягоды и нежный мусс с неожиданной кислинкой.'],
      ['01:21:00', '«Сладкий секрет»', 'Шоколадная сфера с вишнёвой сердцевиной.']
    ]
  },
  {
    name: 'Шрек 2',
    year: '2004',
    tag: 'КОРОЛЕВСКИЙ ПИР',
    price: 4500,
    poster: 'assets/shrek2.jpg',
    description: 'Добро пожаловать в Тридевятое королевство — здесь даже сказка подаётся с характером.',
    menu: [
      ['00:08:00', '«Болотный привет»', 'Зелёный горошковый крем с мятой и хрустящими чипсами.'],
      ['00:28:00', '«Пир в Далёком-Далёком»', 'Запечённая птица с яблочным соусом и молодым картофелем.'],
      ['00:51:00', '«Зелье счастья»', 'Изумрудный лимонад с лаймом, базиликом и лёгкой пеной.'],
      ['01:15:00', '«Пряничный герой»', 'Пряный бисквит с карамельным кремом.']
    ]
  }
];

// Форматирование стоимости
const rub = number =>
  new Intl.NumberFormat('ru-RU').format(number) + ' ₽';

// ==========================================
// КАРТОЧКИ ФИЛЬМОВ
// ==========================================

const filmRoot = document.querySelector('.films');

films.forEach((film, index) => {
  const section = document.createElement('article');
  section.className = 'film';

  section.innerHTML = `
    <div class="poster">
      <img
        src="${film.poster}"
        alt="Постер: ${film.name}"
        loading="lazy"
        onerror="this.onerror=null;this.style.display='none'"
      >
      <span>${String(index + 1).padStart(2, '0')} / 03</span>
    </div>

    <div class="film-info">
      <p class="eyebrow">${film.tag} · ${film.year}</p>
      <h2>${film.name}</h2>
      <p class="description">${film.description}</p>

      <div class="price">
        ${rub(film.price)}
        <small>/ гость · меню включено</small>
      </div>

      <h3>Гастрономический сценарий</h3>
      <p class="hint">
        Таймкоды примерные и используются для демонстрации.
      </p>

      <div class="courses">
        ${film.menu.map((item, i) => `
          <div class="course">
            <span class="time">${item[0]}</span>
            <div>
              <strong>
                ${String(i + 1).padStart(2, '0')} · ${item[1]}
              </strong>
              <p>${item[2]}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <button class="choose" data-id="${index}">
        Выбрать стол ↗
      </button>
    </div>
  `;

  filmRoot.appendChild(section);
});

// ==========================================
// РАССАДКА И БРОНИРОВАНИЕ
// ==========================================

let active = 0;
const chosen = new Set();

const select = document.querySelector('#movieSelect');
const grid = document.querySelector('#seatGrid');

const orderMovie = document.querySelector('#orderMovie');
const orderPrice = document.querySelector('#orderPrice');
const orderSeats = document.querySelector('#orderSeats');
const totalElement = document.querySelector('#total');
const bookButton = document.querySelector('#book');
const message = document.querySelector('#message');

// Положение столов на схеме
const tables = [
  { id: 1, seats: 4, x: 12, y: 24, angle: -30 },
  { id: 2, seats: 2, x: 22, y: 48, angle: -30 },
  { id: 3, seats: 2, x: 34, y: 66, angle: -15 },
  { id: 4, seats: 2, x: 46, y: 76, angle: 0 },
  { id: 5, seats: 2, x: 58, y: 76, angle: 0 },
  { id: 6, seats: 2, x: 70, y: 66, angle: 15 },
  { id: 7, seats: 2, x: 82, y: 48, angle: 30 },
  { id: 8, seats: 4, x: 92, y: 24, angle: 30 }
];

// Стол №3 занят для демонстрации
const occupied = new Set([3]);

// Список фильмов
films.forEach((film, index) => {
  select.add(
    new Option(
      `${film.name} — ${rub(film.price)} / гость`,
      index
    )
  );
});

// Скрываем старую схему экрана, если она есть
const oldScreen = document.querySelector('.seat-panel > .screen');

if (oldScreen) {
  oldScreen.style.display = 'none';
}

// ==========================================
// СОЗДАНИЕ СХЕМЫ ЗАЛА
// ==========================================

function setupMap() {
  grid.className = 'table-map';

  // Основные стили заданы непосредственно,
  // чтобы столы не исчезали из-за старого CSS
  Object.assign(grid.style, {
    position: 'relative',
    display: 'block',
    width: '100%',
    height: '430px',
    minHeight: '430px',
    overflow: 'hidden',
    boxSizing: 'border-box'
  });
}

function createTable(table) {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'restaurant-table';

  const isLarge = table.seats === 4;
  const isPicked = chosen.has(table.id);
  const isBusy = occupied.has(table.id);

  if (isLarge) button.classList.add('large');
  if (isPicked) button.classList.add('picked');
  if (isBusy) button.classList.add('busy');

  const background = isBusy
    ? '#473039'
    : isPicked
      ? '#ead0aa'
      : isLarge
        ? '#47416e'
        : '#24574b';

  const borderColor = isBusy
    ? '#684d55'
    : isPicked
      ? '#fff1d9'
      : isLarge
        ? '#aaa0dd'
        : '#8bbba9';

  Object.assign(button.style, {
    position: 'absolute',
    display: 'flex',
    visibility: 'visible',
    opacity: isBusy ? '0.55' : '1',
    zIndex: '10',
    left: table.x + '%',
    top: table.y + '%',
    transform:
      `translate(-50%, -50%) rotate(${table.angle}deg)`,
    width: isLarge ? '68px' : '65px',
    height: isLarge ? '88px' : '48px',
    padding: '4px',
    boxSizing: 'border-box',
    background: background,
    color: isPicked ? '#21070b' : '#ffffff',
    border: `2px solid ${borderColor}`,
    borderRadius: '9px',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '5px',
    cursor: isBusy ? 'not-allowed' : 'pointer',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    boxShadow: isPicked
      ? '0 0 22px rgba(234,208,170,0.45)'
      : 'none'
  });

  button.innerHTML = `
    <span style="
      display:block;
      font-size:17px;
      font-weight:700;
      line-height:1;
    ">${table.id}</span>
    <small style="
      display:block;
      font-size:9px;
      white-space:nowrap;
    ">${table.seats} места</small>
  `;

  button.title =
    `Стол №${table.id} — ${table.seats} места`;

  button.setAttribute(
    'aria-label',
    `Стол №${table.id}, ${table.seats} места`
  );

  button.setAttribute(
    'aria-pressed',
    String(isPicked)
  );

  button.disabled = isBusy;

  button.addEventListener('click', () => {
    if (chosen.has(table.id)) {
      chosen.delete(table.id);
    } else {
      chosen.add(table.id);
    }

    message.textContent = '';
    render();
  });

  return button;
}

// ==========================================
// ОБНОВЛЕНИЕ СХЕМЫ И СТОИМОСТИ
// ==========================================

function render() {
  const film = films[active];

  orderMovie.textContent = film.name;
  orderPrice.textContent =
    `Стоимость: ${rub(film.price)} / гость`;

  setupMap();

  grid.innerHTML = '';

  // Добавляем столы
  tables.forEach(table => {
    grid.appendChild(createTable(table));
  });

  // Выбранные столы
  const selected = tables.filter(table =>
    chosen.has(table.id)
  );

  // Количество гостей
  const guests = selected.reduce(
    (sum, table) => sum + table.seats,
    0
  );

  // Итоговая стоимость
  const total = guests * film.price;

  orderSeats.textContent = selected.length
    ? `Столы: ${selected.map(t => '№' + t.id).join(', ')} · Гостей: ${guests}`
    : 'Столы не выбраны';

  totalElement.textContent = rub(total);

  bookButton.disabled = selected.length === 0;
}

// ==========================================
// ПЕРЕКЛЮЧЕНИЕ КИНОУЖИНА
// ==========================================

select.addEventListener('change', () => {
  active = Number(select.value);

  chosen.clear();
  message.textContent = '';

  render();
});

// Кнопки под карточками фильмов
document.querySelectorAll('.choose').forEach(button => {
  button.addEventListener('click', () => {
    active = Number(button.dataset.id);

    select.value = String(active);
    chosen.clear();
    message.textContent = '';

    render();

    document.querySelector('#seats').scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// ==========================================
// ДЕМОНСТРАЦИОННОЕ БРОНИРОВАНИЕ
// ==========================================

bookButton.addEventListener('click', () => {
  const selected = tables.filter(table =>
    chosen.has(table.id)
  );

  if (selected.length === 0) return;

  const guests = selected.reduce(
    (sum, table) => sum + table.seats,
    0
  );

  message.textContent =
    `Ваш выбор подтверждён (демо). ` +
    `Киноужин: ${films[active].name}. ` +
    `Столы: ${selected.map(t => '№' + t.id).join(', ')}. ` +
    `Гостей: ${guests}. ` +
    `Итого: ${rub(guests * films[active].price)}. ` +
    `Реальная бронь и оплата не производятся.`;
});

// Первый запуск
render();
