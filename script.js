
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

const rub = n =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

// Создание карточек фильмов
const filmRoot = document.querySelector('.films');

films.forEach((f, i) => {
  const section = document.createElement('article');
  section.className = 'film';

  section.innerHTML = `
    <div class="poster">
      <img
        src="${f.poster}"
        alt="Постер: ${f.name}"
        loading="lazy"
        onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('poster-fallback')"
      >
      <span>${String(i + 1).padStart(2, '0')} / 03</span>
    </div>

    <div class="film-info">
      <p class="eyebrow">${f.tag} · ${f.year}</p>
      <h2>${f.name}</h2>
      <p class="description">${f.description}</p>

      <div class="price">
        ${rub(f.price)}
        <small>/ гость · меню включено</small>
      </div>

      <h3>Гастрономический сценарий</h3>

      <p class="hint">
        Таймкоды примерные, для демонстрации.
        Не синхронизированы с конкретной версией фильма.
      </p>

      <div class="courses">
        ${f.menu.map((m, j) => `
          <div class="course">
            <span class="time">${m[0]}</span>
            <div>
              <strong>
                ${String(j + 1).padStart(2, '0')} · ${m[1]}
              </strong>
              <p>${m[2]}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <button class="choose" data-id="${i}">
        Выбрать места ↗
      </button>
    </div>
  `;

  filmRoot.appendChild(section);
});

// Система выбора мест
let active = 0;
let chosen = new Set();

const select = document.querySelector('#movieSelect');

films.forEach((f, i) => {
  select.add(new Option(`${f.name} — ${rub(f.price)}`, i));
});

const grid = document.querySelector('#seatGrid');

const occupied = new Set([
  'A3',
  'B6',
  'C2',
  'D7'
]);

function render() {
  const f = films[active];

  document.querySelector('#orderMovie').textContent = f.name;

  document.querySelector('#orderPrice').textContent =
    'Стоимость: ' + rub(f.price) + ' / гость';

  grid.innerHTML = '';

  for (let r = 0; r < 4; r++) {
    const row = document.createElement('div');
    row.className = 'seat-row';

    const label = document.createElement('span');
    label.textContent = 'ABCD'[r];
    row.append(label);

    for (let c = 1; c <= 8; c++) {
      const id = 'ABCD'[r] + c;

      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = c;
      b.title = 'Место ' + id;
      b.setAttribute('aria-label', 'Место ' + id);

      b.className =
        'seat ' +
        (occupied.has(id)
          ? 'busy'
          : chosen.has(id)
            ? 'picked'
            : '');

      b.disabled = occupied.has(id);
      b.setAttribute('aria-pressed', chosen.has(id));

      b.onclick = () => {
        chosen.has(id)
          ? chosen.delete(id)
          : chosen.add(id);

        render();
      };

      row.append(b);
    }

    grid.append(row);
  }

  document.querySelector('#orderSeats').textContent =
    chosen.size
      ? 'Места: ' + [...chosen].sort().join(', ')
      : 'Места не выбраны';

  document.querySelector('#total').textContent =
    rub(chosen.size * f.price);

  document.querySelector('#book').disabled = !chosen.size;
}

// Переключение фильма
select.onchange = () => {
  active = Number(select.value);
  chosen.clear();

  document.querySelector('#message').textContent = '';

  render();
};

// Кнопки выбора мест под фильмами
document.querySelectorAll('.choose').forEach(b => {
  b.onclick = () => {
    active = Number(b.dataset.id);
    select.value = active;

    chosen.clear();
    document.querySelector('#message').textContent = '';

    render();

    document.querySelector('#seats').scrollIntoView({
      behavior: 'smooth'
    });
  };
});

// Демонстрационное бронирование
document.querySelector('#book').onclick = () => {
  document.querySelector('#message').textContent =
    `Демо-бронирование оформлено: ${films[active].name}, ` +
    `места ${[...chosen].sort().join(', ')}. ` +
    `Это учебный пример, места не резервируются.`;
};

// Первый запуск
render();
