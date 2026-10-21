
/* SAVORÉ — полный script.js */

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

const rub = number =>
  new Intl.NumberFormat('ru-RU').format(number) + ' ₽';

/* Карточки фильмов */

const filmRoot = document.querySelector('.films');

films.forEach((film, index) => {
  const article = document.createElement('article');
  article.className = 'film';

  article.innerHTML = `
    <div class="poster">
      <img src="${film.poster}"
           alt="Постер фильма ${film.name}"
           loading="lazy">
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
        Таймкоды примерные, для демонстрации.
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

  filmRoot.appendChild(article);
});

/* Бронирование */

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

const NS = 'http://www.w3.org/2000/svg';

/*
  Координаты рассчитаны под образец 988 × 590.
  Внутри SVG используется система 1000 × 590.
*/

const tables = [
  { id: 1, seats: 4, x: 155, y: 267, angle: 61 },
  { id: 2, seats: 2, x: 230, y: 357, angle: 43 },
  { id: 3, seats: 2, x: 328, y: 421, angle: 22 },
  { id: 4, seats: 2, x: 441, y: 457, angle: 5 },
  { id: 5, seats: 2, x: 559, y: 457, angle: -5 },
  { id: 6, seats: 2, x: 672, y: 421, angle: -22 },
  { id: 7, seats: 2, x: 770, y: 357, angle: -43 },
  { id: 8, seats: 4, x: 845, y: 267, angle: -61 }
];

// Все столы свободны, как на образце.
const occupied = new Set();

films.forEach((film, index) => {
  select.add(
    new Option(
      `${film.name} — ${rub(film.price)} / гость`,
      index
    )
  );
});

function makeSvg(tag, attributes = {}) {
  const element = document.createElementNS(NS, tag);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });

  return element;
}

function createTable(table) {
  const large = table.seats === 4;
  const picked = chosen.has(table.id);
  const busy = occupied.has(table.id);

  const group = makeSvg('g', {
    class:
      'svg-table' +
      (large ? ' svg-table-large' : '') +
      (picked ? ' is-picked' : '') +
      (busy ? ' is-busy' : ''),
    transform:
      `translate(${table.x} ${table.y}) rotate(${table.angle})`,
    role: 'button',
    tabindex: busy ? -1 : 0,
    'aria-label': `Стол №${table.id}, ${table.seats} места`,
    'aria-pressed': picked
  });

  const width = large ? 112 : 70;
  const height = large ? 38 : 43;

  group.appendChild(
    makeSvg('rect', {
      class: 'svg-table-body',
      x: -width / 2,
      y: -height / 2,
      width,
      height,
      rx: 6
    })
  );

  const number = makeSvg('text', {
    class: 'svg-table-number',
    x: 0,
    y: 6,
    'text-anchor': 'middle'
  });

  number.textContent = table.id;
  group.appendChild(number);

  /*
    Стулья добавляются в координатах самого стола.
    У четырёхместных столов — четыре кружка сбоку.
    У двухместных — два кружка снизу.
  */

  if (large) {
    [-36, -12, 12, 36].forEach(offset => {
      group.appendChild(
        makeSvg('circle', {
          class: 'svg-chair',
          cx: -width / 2 - 19,
          cy: offset,
          r: 10
        })
      );
    });
  } else {
    [-15, 15].forEach(offset => {
      group.appendChild(
        makeSvg('circle', {
          class: 'svg-chair',
          cx: offset,
          cy: height / 2 + 15,
          r: 10
        })
      );
    });
  }

  function toggle() {
    if (busy) return;

    if (chosen.has(table.id)) {
      chosen.delete(table.id);
    } else {
      chosen.add(table.id);
    }

    message.textContent = '';
    render();
  }

  if (!busy) {
    group.addEventListener('click', toggle);

    group.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  }

  return group;
}

function buildHall() {
  const svg = makeSvg('svg', {
    class: 'savore-hall-svg',
    viewBox: '0 0 1000 590',
    preserveAspectRatio: 'xMidYMid meet',
    role: 'group',
    'aria-label': 'Схема столов SAVORÉ'
  });

  svg.appendChild(
    makeSvg('path', {
      class: 'svg-arc',
      d: 'M 155 300 C 255 525, 745 525, 845 300'
    })
  );

  tables.forEach(table => {
    svg.appendChild(createTable(table));
  });

  return svg;
}

function render() {
  const film = films[active];

  orderMovie.textContent = film.name;
  orderPrice.textContent =
    `Стоимость: ${rub(film.price)} / гость`;

  grid.className = 'table-map svg-table-map';
  grid.replaceChildren(buildHall());

  const selected = tables.filter(table =>
    chosen.has(table.id)
  );

  const guests = selected.reduce(
    (sum, table) => sum + table.seats,
    0
  );

  orderSeats.textContent = selected.length
    ? `Столы: ${selected.map(t => '№' + t.id).join(', ')} · Гостей: ${guests}`
    : 'Столы не выбраны';

  totalElement.textContent =
    rub(guests * film.price);

  bookButton.disabled = selected.length === 0;
}

select.addEventListener('change', () => {
  active = Number(select.value);
  chosen.clear();
  message.textContent = '';
  render();
});

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

bookButton.addEventListener('click', () => {
  const selected = tables.filter(table =>
    chosen.has(table.id)
  );

  if (!selected.length) return;

  const guests = selected.reduce(
    (sum, table) => sum + table.seats,
    0
  );

  message.textContent =
    `Выбор подтверждён (демо). ` +
    `Киноужин: ${films[active].name}. ` +
    `Столы: ${selected.map(t => '№' + t.id).join(', ')}. ` +
    `Гостей: ${guests}. ` +
    `Итого: ${rub(guests * films[active].price)}. ` +
    `Реальная бронь и оплата не производятся.`;
});

render();
