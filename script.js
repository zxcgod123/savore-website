
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

// Форматирование цен
const rub = n =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

// Создание карточек фильмов
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
        onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('poster-fallback')"
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
        Таймкоды примерные, для демонстрации.
        Не синхронизированы с конкретной версией фильма.
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

// Настройки бронирования
let active = 0;
let chosen = new Set();

const select = document.querySelector('#movieSelect');
const grid = document.querySelector('#seatGrid');

// Расположение столов полукругом
const tables = [
  { id: 1, seats: 4, x: 12, y: 22, angle: -30 },
  { id: 2, seats: 2, x: 23, y: 51, angle: -42 },
  { id: 3, seats: 2, x: 35, y: 69, angle: -20 },
  { id: 4, seats: 2, x: 46, y: 77, angle: -5 },
  { id: 5, seats: 2, x: 57, y: 77, angle: 5 },
  { id: 6, seats: 2, x: 69, y: 69, angle: 20 },
  { id: 7, seats: 2, x: 81, y: 51, angle: 42 },
  { id: 8, seats: 4, x: 92, y: 22, angle: 30 }
];

// Демонстрационно занятые столы
const occupied = new Set([3]);

films.forEach((film, index) => {
  select.add(
    new Option(
      `${film.name} — ${rub(film.price)} / гость`,
      index
    )
  );
});

// Отрисовка рассадки и заказа
function render() {
  const film = films[active];

  document.querySelector('#orderMovie').textContent =
    film.name;

  document.querySelector('#orderPrice').textContent =
    `Стоимость: ${rub(film.price)} / гость`;

  grid.innerHTML = '';
  grid.className = 'table-map';

  tables.forEach(table => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'restaurant-table';

    if (table.seats === 4) {
      button.classList.add('large');
    }

    if (chosen.has(table.id)) {
      button.classList.add('picked');
    }

    if (occupied.has(table.id)) {
      button.classList.add('busy');
    }

    button.style.left = table.x + '%';
    button.style.top = table.y + '%';

    button.style.transform =
      `translate(-50%, -50%) rotate(${table.angle}deg)`;

    button.innerHTML = `
      <span>${table.id}</span>
      <small>${table.seats} места</small>
    `;

    button.title =
      `Стол №${table.id}, ${table.seats} места`;

    button.setAttribute(
      'aria-label',
      `Стол №${table.id}, ${table.seats} места`
    );

    button.setAttribute(
      'aria-pressed',
      chosen.has(table.id)
    );

    button.disabled = occupied.has(table.id);

    button.onclick = () => {
      if (chosen.has(table.id)) {
        chosen.delete(table.id);
      } else {
        chosen.add(table.id);
      }

      render();
    };

    grid.appendChild(button);
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

  // Общая стоимость
  const total = guests * film.price;

  document.querySelector('#orderSeats').textContent =
    selected.length
      ? `Столы: ${selected.map(t => '№' + t.id).join(', ')} · ${guests} гостей`
      : 'Столы не выбраны';

  document.querySelector('#total').textContent =
    rub(total);

  document.querySelector('#book').disabled =
    selected.length === 0;
}

// Переключение фильма
select.onchange = () => {
  active = Number(select.value);
  chosen.clear();

  document.querySelector('#message').textContent = '';

  render();
};

// Кнопки выбора стола под фильмами
document.querySelectorAll('.choose').forEach(button => {
  button.onclick = () => {
    active = Number(button.dataset.id);
    select.value = active;

    chosen.clear();

    document.querySelector('#message').textContent = '';

    render();

    document.querySelector('#seats').scrollIntoView({
      behavior: 'smooth'
    });
  };
});

// Демонстрационное подтверждение бронирования
document.querySelector('#book').onclick = () => {
  const selected = tables.filter(table =>
    chosen.has(table.id)
  );

  const guests = selected.reduce(
    (sum, table) => sum + table.seats,
    0
  );

  document.querySelector('#message').textContent =
    `Демо-бронирование оформлено: ${films[active].name}. ` +
    `Столы: ${selected.map(t => '№' + t.id).join(', ')}. ` +
    `Количество гостей: ${guests}. ` +
    `Это учебный проект, реальная бронь не производится.`;
};

// Первый запуск
render();
