export type SeedNutritionalInfo = {
  protein: number;
  fats: number;
  carbohydrates: number;
};

export type SeedProductDefinition = {
  name: string;
  description: string;
  manualKkal: string;
  nutritionalInfo: SeedNutritionalInfo;
  price: string;
  unit: 'kg' | 'piece';
  categorySlugs: string[];
};

type CategoryProductDraft = Omit<SeedProductDefinition, 'categorySlugs'>;

const byCategory = (
  slug: string,
  products: CategoryProductDraft[],
): SeedProductDefinition[] =>
  products.map((product) => ({
    ...product,
    categorySlugs: [slug],
  }));

/**
 * Ассортимент в духе https://cuppcake.ru/ — ПП-десерты без сахара.
 * В каждой категории ≥ 7 уникальных позиций.
 */
export const CATALOG_SEED_PRODUCTS: SeedProductDefinition[] = [
  ...byCategory('pasha', [
    {
      name: 'Царская пасха',
      description:
        'Нежнейшая царская пасха с французской ванилью, кусочками молочного шоколада и грецких орехов, с ягодами вяленой клубники и черники. Можем сделать вариант без добавок.',
      manualKkal: '280',
      nutritionalInfo: { protein: 9, fats: 16, carbohydrates: 22 },
      price: '2200',
      unit: 'piece',
    },
    {
      name: 'Мини Пасхи',
      description:
        'Набор мини-пасок: классическая с ягодами, карамельная с орешками, ягодная с пюре малины и клубники. В шоколадном корпусе с ганашем-пломбир.',
      manualKkal: '190',
      nutritionalInfo: { protein: 6, fats: 11, carbohydrates: 18 },
      price: '450',
      unit: 'piece',
    },
    {
      name: 'Микс Пасхи с муссовыми кроликами',
      description:
        'Набор мини-пасок с муссовыми кроликами клубника-банан.',
      manualKkal: '200',
      nutritionalInfo: { protein: 5, fats: 12, carbohydrates: 19 },
      price: '1500',
      unit: 'piece',
    },
    {
      name: 'Кулич ванильный',
      description:
        'С клубникой, курагой, грецкими орешками и кусочками белого шоколада.',
      manualKkal: '260',
      nutritionalInfo: { protein: 7, fats: 10, carbohydrates: 34 },
      price: '600',
      unit: 'piece',
    },
    {
      name: 'Кулич шоколадный',
      description:
        'С кусочками молочного шоколада, фундуком и черникой.',
      manualKkal: '275',
      nutritionalInfo: { protein: 7, fats: 12, carbohydrates: 32 },
      price: '650',
      unit: 'piece',
    },
    {
      name: 'Кулич творожный',
      description:
        'Творожный кулич с начинкой черника-лимон или шоколадной.',
      manualKkal: '240',
      nutritionalInfo: { protein: 10, fats: 9, carbohydrates: 28 },
      price: '1700',
      unit: 'piece',
    },
    {
      name: 'Набор пасхальные яйца',
      description: 'Порционный пасхальный набор из четырёх шоколадных яиц.',
      manualKkal: '210',
      nutritionalInfo: { protein: 5, fats: 13, carbohydrates: 20 },
      price: '1300',
      unit: 'piece',
    },
    {
      name: 'Пасха карамельно-ореховая',
      description:
        'Пасха с солёной карамелью, дроблёным фундуком и ванильным ганашем.',
      manualKkal: '290',
      nutritionalInfo: { protein: 8, fats: 17, carbohydrates: 24 },
      price: '2400',
      unit: 'piece',
    },
  ]),

  ...byCategory('biskvitnye-torty', [
    {
      name: 'Сникерс',
      description:
        'Шоколадные бисквиты с насыщенным шоколадным кремом и сладко-солёной карамелью с орешками.',
      manualKkal: '320',
      nutritionalInfo: { protein: 8, fats: 18, carbohydrates: 28 },
      price: '2300',
      unit: 'kg',
    },
    {
      name: 'Прага',
      description:
        'Шоколадный бисквит, мега-шоколадный крем с начинкой из сухофруктов и грецких орехов.',
      manualKkal: '300',
      nutritionalInfo: { protein: 6, fats: 15, carbohydrates: 30 },
      price: '2300',
      unit: 'kg',
    },
    {
      name: 'Ферреро Роше',
      description:
        'Ореховый бисквит на фундучном молоке, шоколадный крем и фундучное пралине.',
      manualKkal: '330',
      nutritionalInfo: { protein: 8, fats: 20, carbohydrates: 26 },
      price: '2300',
      unit: 'kg',
    },
    {
      name: 'Молочный ломтик',
      description:
        'Нежный торт в духе классического «Молочного ломтика» — идеален для праздника.',
      manualKkal: '290',
      nutritionalInfo: { protein: 7, fats: 14, carbohydrates: 31 },
      price: '2300',
      unit: 'kg',
    },
    {
      name: 'Банан-шоколад',
      description:
        'Шоколадные бисквиты на банановом молочке, банан в карамели и шоколадный крем.',
      manualKkal: '310',
      nutritionalInfo: { protein: 7, fats: 16, carbohydrates: 29 },
      price: '2300',
      unit: 'kg',
    },
    {
      name: 'Шоколадный медовик с вишней',
      description:
        'Тонкие шоколадные коржи, вишнёвая начинка с ягодой и нежный сметанный крем.',
      manualKkal: '295',
      nutritionalInfo: { protein: 6, fats: 14, carbohydrates: 33 },
      price: '2300',
      unit: 'kg',
    },
    {
      name: 'Груша Бри Фундук',
      description:
        'Ореховый бисквит, фундучное пралине и груша со сливочным кремом с сыром бри.',
      manualKkal: '325',
      nutritionalInfo: { protein: 9, fats: 19, carbohydrates: 25 },
      price: '2300',
      unit: 'kg',
    },
    {
      name: 'Клубника-банан',
      description:
        'Ванильно-банановый бисквит, клубничное конфи, банановая прослойка и крем-чиз.',
      manualKkal: '285',
      nutritionalInfo: { protein: 6, fats: 13, carbohydrates: 32 },
      price: '2300',
      unit: 'kg',
    },
  ]),

  ...byCategory('bento', [
    {
      name: 'Бенто классический',
      description:
        'Тортик-открытка на 1–2 человека: свечка и ложечка в комплекте.',
      manualKkal: '220',
      nutritionalInfo: { protein: 5, fats: 12, carbohydrates: 22 },
      price: '1700',
      unit: 'piece',
    },
    {
      name: 'Веган бенто',
      description:
        'Бенто без лактозы и следов животного происхождения.',
      manualKkal: '210',
      nutritionalInfo: { protein: 4, fats: 11, carbohydrates: 23 },
      price: '1800',
      unit: 'piece',
    },
    {
      name: 'Бенто «Ягода»',
      description: 'Мини-торт с ягодным муссом и свежими ягодами.',
      manualKkal: '180',
      nutritionalInfo: { protein: 4, fats: 9, carbohydrates: 20 },
      price: '1700',
      unit: 'piece',
    },
    {
      name: 'Бенто «Шоколад»',
      description: 'Шоколадный бисквит и плотный шоколадный ганаш.',
      manualKkal: '240',
      nutritionalInfo: { protein: 5, fats: 14, carbohydrates: 21 },
      price: '1700',
      unit: 'piece',
    },
    {
      name: 'Бенто «Карамель»',
      description: 'Солёная карамель, ореховый бисквит и ванильный крем.',
      manualKkal: '250',
      nutritionalInfo: { protein: 5, fats: 15, carbohydrates: 22 },
      price: '1750',
      unit: 'piece',
    },
    {
      name: 'Бенто «Фисташка»',
      description: 'Фисташковый крем и лёгкий ванильный бисквит.',
      manualKkal: '230',
      nutritionalInfo: { protein: 6, fats: 13, carbohydrates: 20 },
      price: '1850',
      unit: 'piece',
    },
    {
      name: 'Бенто «Кокос-малина»',
      description: 'Кокосовый крем и малиновое конфи в мини-формате.',
      manualKkal: '215',
      nutritionalInfo: { protein: 4, fats: 12, carbohydrates: 21 },
      price: '1750',
      unit: 'piece',
    },
  ]),

  ...byCategory('chizkejki', [
    {
      name: 'Классический чизкейк',
      description:
        'Нежная кремовая сырная текстура, украшаем сезонными ягодами.',
      manualKkal: '310',
      nutritionalInfo: { protein: 9, fats: 20, carbohydrates: 22 },
      price: '2000',
      unit: 'kg',
    },
    {
      name: 'Фисташковый чизкейк',
      description:
        'С натуральной фисташковой пастой, дроблёной фисташкой и сублимированной малиной.',
      manualKkal: '320',
      nutritionalInfo: { protein: 10, fats: 21, carbohydrates: 20 },
      price: '2200',
      unit: 'kg',
    },
    {
      name: 'Кокосовый чизкейк',
      description: 'С кокосовой пастой и ароматной кокосовой стружкой.',
      manualKkal: '305',
      nutritionalInfo: { protein: 8, fats: 19, carbohydrates: 23 },
      price: '2000',
      unit: 'kg',
    },
    {
      name: 'Чизкейк Сникерс',
      description:
        'Арахисовый сырный слой, тягучая солёная карамель и шоколад с арахисом.',
      manualKkal: '340',
      nutritionalInfo: { protein: 11, fats: 22, carbohydrates: 24 },
      price: '2300',
      unit: 'kg',
    },
    {
      name: 'Ягодный чизкейк',
      description:
        'Малина, черника или ягодный микс в нежнейшей сырной массе.',
      manualKkal: '295',
      nutritionalInfo: { protein: 8, fats: 18, carbohydrates: 24 },
      price: '2200',
      unit: 'kg',
    },
    {
      name: 'Чизкейк Груша-Дорблю',
      description:
        'Сыр дорблю, кусочки груши и грецкий орех в сырной массе.',
      manualKkal: '315',
      nutritionalInfo: { protein: 10, fats: 20, carbohydrates: 21 },
      price: '2200',
      unit: 'kg',
    },
    {
      name: 'Чизкейк Нью-Йорк',
      description: 'Плотный ванильный чизкейк на песочной основе.',
      manualKkal: '330',
      nutritionalInfo: { protein: 9, fats: 22, carbohydrates: 24 },
      price: '2100',
      unit: 'kg',
    },
  ]),

  ...byCategory('vegan-torty', [
    {
      name: 'Торт Манго-апельсин',
      description:
        'Ванильно-карамельный бисквит, манго-маракуйя и кокосовый крем.',
      manualKkal: '270',
      nutritionalInfo: { protein: 5, fats: 14, carbohydrates: 30 },
      price: '2500',
      unit: 'kg',
    },
    {
      name: 'Торт Шоколад-ананас',
      description:
        'Шоколадный бисквит, ананасовое пюре и нежный шоколадный крем.',
      manualKkal: '280',
      nutritionalInfo: { protein: 5, fats: 15, carbohydrates: 29 },
      price: '2500',
      unit: 'kg',
    },
    {
      name: 'Торт-конструктор',
      description:
        'Выберите бисквит, ягодную начинку и ванильно-кокосовый или шоколадный крем.',
      manualKkal: '275',
      nutritionalInfo: { protein: 5, fats: 14, carbohydrates: 31 },
      price: '2500',
      unit: 'kg',
    },
    {
      name: 'Птичье молоко веган',
      description:
        'Сочный веганский бисквит, мусс на аквафабе и веганский шоколад.',
      manualKkal: '260',
      nutritionalInfo: { protein: 4, fats: 13, carbohydrates: 32 },
      price: '2500',
      unit: 'kg',
    },
    {
      name: 'Raw cake малина-кешью-лайм',
      description:
        'Без термообработки: кешью-крем, малина и лайм сохраняют вкус и пользу.',
      manualKkal: '290',
      nutritionalInfo: { protein: 7, fats: 18, carbohydrates: 22 },
      price: '2500',
      unit: 'kg',
    },
    {
      name: 'Веган тарт Банофи',
      description: 'Карамель, банан и кокосовые сливки в порционном тарте.',
      manualKkal: '255',
      nutritionalInfo: { protein: 4, fats: 14, carbohydrates: 28 },
      price: '350',
      unit: 'piece',
    },
    {
      name: 'Веган шоколад-вишня',
      description:
        'Шоколадный бисквит, вишнёвая начинка и плотный веганский вишнёвый мусс.',
      manualKkal: '265',
      nutritionalInfo: { protein: 5, fats: 13, carbohydrates: 30 },
      price: '2500',
      unit: 'kg',
    },
  ]),

  ...byCategory('vegan-deserty', [
    {
      name: 'Веган сырки',
      description: 'Альтернатива классическим творожным сыркам без молочки.',
      manualKkal: '190',
      nutritionalInfo: { protein: 5, fats: 10, carbohydrates: 18 },
      price: '270',
      unit: 'piece',
    },
    {
      name: 'Веган вишня-шоколад порционный',
      description: 'Шоколадный бисквит, вишня и вишнёвый мусс в порции.',
      manualKkal: '210',
      nutritionalInfo: { protein: 4, fats: 11, carbohydrates: 22 },
      price: '320',
      unit: 'piece',
    },
    {
      name: 'Веган кекс груша-миндаль',
      description:
        'На фруктовом пюре с грушей, миндалём и арахисовой глазурью.',
      manualKkal: '230',
      nutritionalInfo: { protein: 5, fats: 12, carbohydrates: 25 },
      price: '350',
      unit: 'piece',
    },
    {
      name: 'Веган брауни',
      description: 'Плотный шоколадный десерт на какао и тёмном шоколаде.',
      manualKkal: '250',
      nutritionalInfo: { protein: 5, fats: 14, carbohydrates: 26 },
      price: '320',
      unit: 'piece',
    },
    {
      name: 'Веган моти',
      description: 'Рисовое тесто и фруктовая начинка без продуктов животного происхождения.',
      manualKkal: '160',
      nutritionalInfo: { protein: 2, fats: 4, carbohydrates: 30 },
      price: '190',
      unit: 'piece',
    },
    {
      name: 'Веган трайфл',
      description: 'Слои веганского бисквита, ягодного конфи и кокосового крема в стакане.',
      manualKkal: '200',
      nutritionalInfo: { protein: 3, fats: 10, carbohydrates: 24 },
      price: '300',
      unit: 'piece',
    },
    {
      name: 'Веган эклер',
      description: 'Заварной эклер на растительном креме с шоколадной глазурью.',
      manualKkal: '220',
      nutritionalInfo: { protein: 4, fats: 11, carbohydrates: 26 },
      price: '240',
      unit: 'piece',
    },
  ]),

  ...byCategory('svadebnye', [
    {
      name: 'Свадебный классический',
      description:
        'ПП-торт с вкусами, максимально близкими к классике — гости не догадаются.',
      manualKkal: '280',
      nutritionalInfo: { protein: 7, fats: 14, carbohydrates: 30 },
      price: '2500',
      unit: 'kg',
    },
    {
      name: 'Свадебный ягодный',
      description: 'Светлые коржи, ягодные прослойки и аккуратный кремовый декор.',
      manualKkal: '270',
      nutritionalInfo: { protein: 6, fats: 13, carbohydrates: 31 },
      price: '2500',
      unit: 'kg',
    },
    {
      name: 'Свадебный шоколадный',
      description: 'Шоколадные бисквиты и ганаш для торжественного стола.',
      manualKkal: '300',
      nutritionalInfo: { protein: 7, fats: 16, carbohydrates: 28 },
      price: '2600',
      unit: 'kg',
    },
    {
      name: 'Свадебный многоярусный',
      description: 'Два и более ярусов с надёжной конструкцией и индивидуальным декором.',
      manualKkal: '285',
      nutritionalInfo: { protein: 7, fats: 14, carbohydrates: 30 },
      price: '2800',
      unit: 'kg',
    },
    {
      name: 'Свадебный минимализм',
      description: 'Лаконичный белый декор, золотая надпись по желанию.',
      manualKkal: '275',
      nutritionalInfo: { protein: 6, fats: 13, carbohydrates: 29 },
      price: '2500',
      unit: 'kg',
    },
    {
      name: 'Свадебный с живыми цветами',
      description: 'Цветочный декор для выездных церемоний и юбилеев.',
      manualKkal: '275',
      nutritionalInfo: { protein: 6, fats: 13, carbohydrates: 29 },
      price: '2700',
      unit: 'kg',
    },
    {
      name: 'Свадебный веган',
      description: 'Полностью растительный вариант для гостей с ограничениями.',
      manualKkal: '265',
      nutritionalInfo: { protein: 5, fats: 12, carbohydrates: 32 },
      price: '2700',
      unit: 'kg',
    },
  ]),

  ...byCategory('detskie', [
    {
      name: 'Молочный ломтик детский',
      description: 'Любимый детский вкус в ПП-исполнении.',
      manualKkal: '290',
      nutritionalInfo: { protein: 7, fats: 14, carbohydrates: 31 },
      price: '2300',
      unit: 'kg',
    },
    {
      name: 'Клубника-банан детский',
      description: 'Воздушный бисквит и две начинки — для детского праздника.',
      manualKkal: '285',
      nutritionalInfo: { protein: 6, fats: 13, carbohydrates: 32 },
      price: '2300',
      unit: 'kg',
    },
    {
      name: 'Торт Мамуле',
      description: 'Нежное кремовое оформление и золотая надпись «мамуле».',
      manualKkal: '280',
      nutritionalInfo: { protein: 6, fats: 14, carbohydrates: 30 },
      price: '3500',
      unit: 'piece',
    },
    {
      name: 'Торт Бабочка',
      description: 'Парящие бабочки и бусины из воздушного риса.',
      manualKkal: '275',
      nutritionalInfo: { protein: 6, fats: 13, carbohydrates: 30 },
      price: '3500',
      unit: 'piece',
    },
    {
      name: 'Детский торт с фигурками',
      description:
        'Декор шоколадными фигурками, топперами и любимыми героями.',
      manualKkal: '290',
      nutritionalInfo: { protein: 6, fats: 14, carbohydrates: 31 },
      price: '2200',
      unit: 'kg',
    },
    {
      name: 'Радужный детский',
      description: 'Цветные коржи на натуральных красителях и ванильный крем.',
      manualKkal: '295',
      nutritionalInfo: { protein: 6, fats: 13, carbohydrates: 33 },
      price: '2400',
      unit: 'kg',
    },
    {
      name: 'Детский бенто с рисунком',
      description: 'Мини-торт с персональной надписью или рисунком.',
      manualKkal: '220',
      nutritionalInfo: { protein: 5, fats: 12, carbohydrates: 22 },
      price: '1900',
      unit: 'piece',
    },
  ]),

  ...byCategory('kapkejki', [
    {
      name: 'Капкейк ванильный',
      description: 'Воздушный ванильный капкейк с крем-чизом без сахара.',
      manualKkal: '180',
      nutritionalInfo: { protein: 4, fats: 9, carbohydrates: 20 },
      price: '220',
      unit: 'piece',
    },
    {
      name: 'Капкейк шоколадный',
      description: 'Какао-бисквит и шоколадный ганаш.',
      manualKkal: '200',
      nutritionalInfo: { protein: 4, fats: 11, carbohydrates: 21 },
      price: '230',
      unit: 'piece',
    },
    {
      name: 'Капкейк красный бархат',
      description: 'Свекольный бархат и сырный крем.',
      manualKkal: '190',
      nutritionalInfo: { protein: 4, fats: 10, carbohydrates: 20 },
      price: '240',
      unit: 'piece',
    },
    {
      name: 'Капкейк фисташковый',
      description: 'Фисташковая паста в бисквите и креме.',
      manualKkal: '210',
      nutritionalInfo: { protein: 5, fats: 12, carbohydrates: 19 },
      price: '250',
      unit: 'piece',
    },
    {
      name: 'Капкейк ягодный',
      description: 'Ягодное конфи внутри и лёгкий крем сверху.',
      manualKkal: '175',
      nutritionalInfo: { protein: 3, fats: 8, carbohydrates: 22 },
      price: '230',
      unit: 'piece',
    },
    {
      name: 'Капкейк кокосовый',
      description: 'Кокосовая стружка и ванильный крем.',
      manualKkal: '185',
      nutritionalInfo: { protein: 3, fats: 10, carbohydrates: 20 },
      price: '230',
      unit: 'piece',
    },
    {
      name: 'Набор капкейков ассорти',
      description: '6 капкейков разных вкусов в одной коробке.',
      manualKkal: '190',
      nutritionalInfo: { protein: 4, fats: 10, carbohydrates: 20 },
      price: '1300',
      unit: 'piece',
    },
  ]),

  ...byCategory('eklery', [
    {
      name: 'Эклер классический',
      description: 'Любимый заварной десерт в ПП-прочтении.',
      manualKkal: '200',
      nutritionalInfo: { protein: 5, fats: 10, carbohydrates: 22 },
      price: '220',
      unit: 'piece',
    },
    {
      name: 'Эклер шоколадный',
      description: 'Шоколадный крем и тонкая шоколадная глазурь.',
      manualKkal: '220',
      nutritionalInfo: { protein: 5, fats: 12, carbohydrates: 23 },
      price: '240',
      unit: 'piece',
    },
    {
      name: 'Эклер ванильный',
      description: 'Ванильный заварной крем без сахара.',
      manualKkal: '195',
      nutritionalInfo: { protein: 5, fats: 10, carbohydrates: 21 },
      price: '220',
      unit: 'piece',
    },
    {
      name: 'Эклер кофейный',
      description: 'Крем с натуральным эспрессо.',
      manualKkal: '205',
      nutritionalInfo: { protein: 5, fats: 11, carbohydrates: 21 },
      price: '240',
      unit: 'piece',
    },
    {
      name: 'Эклер фисташковый',
      description: 'Фисташковый крем и дроблёные орехи сверху.',
      manualKkal: '230',
      nutritionalInfo: { protein: 6, fats: 13, carbohydrates: 20 },
      price: '260',
      unit: 'piece',
    },
    {
      name: 'Эклер ягодный',
      description: 'Крем с малиновым или клубничным конфи.',
      manualKkal: '190',
      nutritionalInfo: { protein: 4, fats: 9, carbohydrates: 23 },
      price: '240',
      unit: 'piece',
    },
    {
      name: 'Эклер карамельный',
      description: 'Солёная карамель внутри и хрустящий верх.',
      manualKkal: '225',
      nutritionalInfo: { protein: 5, fats: 12, carbohydrates: 24 },
      price: '250',
      unit: 'piece',
    },
  ]),

  ...byCategory('trajfly', [
    {
      name: 'Трайфл классический',
      description:
        'Порционный десерт в стаканчике — удобно взять с собой и попробовать разные вкусы.',
      manualKkal: '210',
      nutritionalInfo: { protein: 5, fats: 10, carbohydrates: 24 },
      price: '280',
      unit: 'piece',
    },
    {
      name: 'Трайфл Сникерс',
      description: 'Шоколад, карамель и орехи слоями.',
      manualKkal: '240',
      nutritionalInfo: { protein: 6, fats: 13, carbohydrates: 24 },
      price: '300',
      unit: 'piece',
    },
    {
      name: 'Трайфл ягодный',
      description: 'Бисквит, ягодное конфи и крем-чиз.',
      manualKkal: '200',
      nutritionalInfo: { protein: 4, fats: 9, carbohydrates: 25 },
      price: '280',
      unit: 'piece',
    },
    {
      name: 'Трайфл фисташка-малина',
      description: 'Фисташковый крем и малиновая прослойка.',
      manualKkal: '220',
      nutritionalInfo: { protein: 5, fats: 12, carbohydrates: 22 },
      price: '320',
      unit: 'piece',
    },
    {
      name: 'Трайфл кокос-манго',
      description: 'Кокосовый крем и манговое пюре.',
      manualKkal: '215',
      nutritionalInfo: { protein: 4, fats: 11, carbohydrates: 24 },
      price: '300',
      unit: 'piece',
    },
    {
      name: 'Трайфл тирамису',
      description: 'Кофейная пропитка и сырный крем без сахара.',
      manualKkal: '225',
      nutritionalInfo: { protein: 6, fats: 12, carbohydrates: 21 },
      price: '300',
      unit: 'piece',
    },
    {
      name: 'Трайфл шоколад-вишня',
      description: 'Шоколадный бисквит и вишнёвое конфи.',
      manualKkal: '230',
      nutritionalInfo: { protein: 5, fats: 12, carbohydrates: 25 },
      price: '300',
      unit: 'piece',
    },
  ]),

  ...byCategory('pirozhnye', [
    {
      name: 'Моти',
      description:
        'Тонкое рисовое тесто и сочные начинки — тает во рту.',
      manualKkal: '160',
      nutritionalInfo: { protein: 2, fats: 4, carbohydrates: 30 },
      price: '190',
      unit: 'piece',
    },
    {
      name: 'Сырок творожный',
      description: 'Нежный творожный сырок в молочной шоколадной глазури.',
      manualKkal: '210',
      nutritionalInfo: { protein: 8, fats: 12, carbohydrates: 16 },
      price: '280',
      unit: 'piece',
    },
    {
      name: 'Эскимо картошка',
      description: 'Шоколадный десерт на палочке в глазури с орешками.',
      manualKkal: '230',
      nutritionalInfo: { protein: 5, fats: 14, carbohydrates: 22 },
      price: '280',
      unit: 'piece',
    },
    {
      name: 'Эскимо тропический чизкейк',
      description: 'Кокосовый мусс и манго-маракуйя на палочке.',
      manualKkal: '200',
      nutritionalInfo: { protein: 4, fats: 11, carbohydrates: 20 },
      price: '280',
      unit: 'piece',
    },
    {
      name: 'Меренговый рулет',
      description:
        'Лёгкая меренга, нежный крем и начинка из ягод или конфи.',
      manualKkal: '250',
      nutritionalInfo: { protein: 6, fats: 10, carbohydrates: 34 },
      price: '2800',
      unit: 'kg',
    },
    {
      name: 'Пирожное картошка',
      description: 'Классика в ПП-версии из шоколадного бисквита.',
      manualKkal: '240',
      nutritionalInfo: { protein: 5, fats: 13, carbohydrates: 25 },
      price: '250',
      unit: 'piece',
    },
    {
      name: 'Пирожное шу',
      description: 'Заварное пирожное с кремом и хрустящей корочкой.',
      manualKkal: '215',
      nutritionalInfo: { protein: 5, fats: 11, carbohydrates: 23 },
      price: '230',
      unit: 'piece',
    },
  ]),

  ...byCategory('mussovye', [
    {
      name: 'Муссовый кролик клубника-банан',
      description: 'Воздушный мусс в форме кролика — пасхальный хит.',
      manualKkal: '180',
      nutritionalInfo: { protein: 4, fats: 9, carbohydrates: 20 },
      price: '350',
      unit: 'piece',
    },
    {
      name: 'Мусс манго-маракуйя',
      description: 'Яркий тропический мусс на лёгкой основе.',
      manualKkal: '170',
      nutritionalInfo: { protein: 3, fats: 8, carbohydrates: 21 },
      price: '320',
      unit: 'piece',
    },
    {
      name: 'Мусс шоколадный',
      description: 'Плотный шоколадный мусс с какао.',
      manualKkal: '220',
      nutritionalInfo: { protein: 5, fats: 14, carbohydrates: 18 },
      price: '320',
      unit: 'piece',
    },
    {
      name: 'Мусс малина-белый шоколад',
      description: 'Кисло-сладкая малина и нежный белый шоколад.',
      manualKkal: '200',
      nutritionalInfo: { protein: 4, fats: 11, carbohydrates: 20 },
      price: '340',
      unit: 'piece',
    },
    {
      name: 'Мусс фисташка',
      description: 'Фисташковый мусс с хрустящим слоем.',
      manualKkal: '230',
      nutritionalInfo: { protein: 6, fats: 14, carbohydrates: 18 },
      price: '360',
      unit: 'piece',
    },
    {
      name: 'Мусс кокос-лайм',
      description: 'Свежий лайм и кокосовый мусс.',
      manualKkal: '175',
      nutritionalInfo: { protein: 3, fats: 10, carbohydrates: 18 },
      price: '330',
      unit: 'piece',
    },
    {
      name: 'Муссовое пирожное «Птичье молоко»',
      description: 'Воздушный мусс на аквафабе и шоколадная глазурь.',
      manualKkal: '210',
      nutritionalInfo: { protein: 4, fats: 11, carbohydrates: 24 },
      price: '300',
      unit: 'piece',
    },
  ]),

  ...byCategory('ppshnye', [
    {
      name: 'ПП Сникерс лайт',
      description: 'Фирменный Сникерс с акцентом на пониженную калорийность.',
      manualKkal: '280',
      nutritionalInfo: { protein: 9, fats: 14, carbohydrates: 26 },
      price: '2300',
      unit: 'kg',
    },
    {
      name: 'ПП Наполеон',
      description: 'Тонкие коржи и заварной крем без сахара.',
      manualKkal: '270',
      nutritionalInfo: { protein: 7, fats: 12, carbohydrates: 30 },
      price: '2200',
      unit: 'kg',
    },
    {
      name: 'ПП Медовик',
      description: 'Медовые коржи на натуральных подсластителях.',
      manualKkal: '275',
      nutritionalInfo: { protein: 6, fats: 12, carbohydrates: 32 },
      price: '2200',
      unit: 'kg',
    },
    {
      name: 'ПП Тирамису',
      description: 'Кофе, сырный крем и какао — без сахара.',
      manualKkal: '260',
      nutritionalInfo: { protein: 8, fats: 13, carbohydrates: 24 },
      price: '2400',
      unit: 'kg',
    },
    {
      name: 'ПП Брауни',
      description: 'Шоколадный брауни с контролируемым КБЖУ.',
      manualKkal: '250',
      nutritionalInfo: { protein: 8, fats: 12, carbohydrates: 25 },
      price: '300',
      unit: 'piece',
    },
    {
      name: 'ПП Чизкейк лайт',
      description: 'Облегчённая сырная масса и тонкая основа.',
      manualKkal: '255',
      nutritionalInfo: { protein: 10, fats: 14, carbohydrates: 20 },
      price: '2000',
      unit: 'kg',
    },
    {
      name: 'ПП Трайфл лайт',
      description: 'Порционный трайфл с прозрачным КБЖУ на порцию.',
      manualKkal: '180',
      nutritionalInfo: { protein: 6, fats: 7, carbohydrates: 20 },
      price: '280',
      unit: 'piece',
    },
  ]),

  ...byCategory('proteinovye', [
    {
      name: 'Протеиновый шоколадный торт',
      description: 'Фитнес-линейка: больше белка, знакомый шоколадный вкус.',
      manualKkal: '240',
      nutritionalInfo: { protein: 18, fats: 8, carbohydrates: 22 },
      price: '2600',
      unit: 'kg',
    },
    {
      name: 'Протеиновый ванильный торт',
      description: 'Высокобелковый ванильный бисквит и крем.',
      manualKkal: '230',
      nutritionalInfo: { protein: 17, fats: 7, carbohydrates: 23 },
      price: '2500',
      unit: 'kg',
    },
    {
      name: 'Протеиновый батончик',
      description: 'Удобный перекус с сывороточным или растительным белком.',
      manualKkal: '180',
      nutritionalInfo: { protein: 15, fats: 6, carbohydrates: 14 },
      price: '220',
      unit: 'piece',
    },
    {
      name: 'Протеиновый чизкейк',
      description: 'Сырная масса с добавлением изолята.',
      manualKkal: '220',
      nutritionalInfo: { protein: 20, fats: 9, carbohydrates: 16 },
      price: '2400',
      unit: 'kg',
    },
    {
      name: 'Протеиновые панкейки',
      description: 'Набор из 4 панкейков с ягодным соусом.',
      manualKkal: '200',
      nutritionalInfo: { protein: 16, fats: 6, carbohydrates: 20 },
      price: '450',
      unit: 'piece',
    },
    {
      name: 'Протеиновый брауни',
      description: 'Плотный шоколадный десерт с повышенным белком.',
      manualKkal: '210',
      nutritionalInfo: { protein: 14, fats: 8, carbohydrates: 18 },
      price: '280',
      unit: 'piece',
    },
    {
      name: 'Протеиновый трайфл',
      description: 'Слои протеинового крема и бисквита в стакане.',
      manualKkal: '190',
      nutritionalInfo: { protein: 16, fats: 6, carbohydrates: 17 },
      price: '320',
      unit: 'piece',
    },
  ]),

  ...byCategory('postnye', [
    {
      name: 'Постный шоколадный торт',
      description: 'Без молока и яиц — для строгого поста.',
      manualKkal: '260',
      nutritionalInfo: { protein: 4, fats: 12, carbohydrates: 34 },
      price: '2300',
      unit: 'kg',
    },
    {
      name: 'Постный морковный торт',
      description: 'Морковь, специи и орехи на растительной основе.',
      manualKkal: '250',
      nutritionalInfo: { protein: 4, fats: 11, carbohydrates: 32 },
      price: '2200',
      unit: 'kg',
    },
    {
      name: 'Постный медовик',
      description: 'Тонкие коржи и постный крем.',
      manualKkal: '255',
      nutritionalInfo: { protein: 3, fats: 10, carbohydrates: 36 },
      price: '2200',
      unit: 'kg',
    },
    {
      name: 'Постный ягодный тарт',
      description: 'Песочная основа и ягодная начинка без животных продуктов.',
      manualKkal: '230',
      nutritionalInfo: { protein: 3, fats: 10, carbohydrates: 30 },
      price: '350',
      unit: 'piece',
    },
    {
      name: 'Постные пряники',
      description: 'Набор из 6 пряников с глазурью.',
      manualKkal: '200',
      nutritionalInfo: { protein: 3, fats: 6, carbohydrates: 35 },
      price: '600',
      unit: 'piece',
    },
    {
      name: 'Постный брауни',
      description: 'Шоколадный брауни на растительном масле.',
      manualKkal: '240',
      nutritionalInfo: { protein: 4, fats: 12, carbohydrates: 28 },
      price: '280',
      unit: 'piece',
    },
    {
      name: 'Постный кокосовый торт',
      description: 'Кокосовое молоко, бисквит и фруктовое конфи.',
      manualKkal: '245',
      nutritionalInfo: { protein: 3, fats: 13, carbohydrates: 30 },
      price: '2400',
      unit: 'kg',
    },
  ]),

  ...byCategory('bez-glyutena', [
    {
      name: 'Безглютеновый шоколадный торт',
      description: 'Мука без глютена, насыщенный шоколадный вкус.',
      manualKkal: '290',
      nutritionalInfo: { protein: 6, fats: 15, carbohydrates: 30 },
      price: '2600',
      unit: 'kg',
    },
    {
      name: 'Безглютеновый чизкейк',
      description: 'Основа из миндальной муки и классическая сырная масса.',
      manualKkal: '310',
      nutritionalInfo: { protein: 9, fats: 21, carbohydrates: 18 },
      price: '2500',
      unit: 'kg',
    },
    {
      name: 'Безглютеновый брауни',
      description: 'Плотный брауни на рисовой и миндальной муке.',
      manualKkal: '260',
      nutritionalInfo: { protein: 6, fats: 14, carbohydrates: 26 },
      price: '320',
      unit: 'piece',
    },
    {
      name: 'Безглютеновый манго-маракуйя',
      description: 'Лёгкий торт с тропической начинкой без глютена.',
      manualKkal: '270',
      nutritionalInfo: { protein: 5, fats: 13, carbohydrates: 29 },
      price: '2600',
      unit: 'kg',
    },
    {
      name: 'Безглютеновые капкейки',
      description: 'Набор из 4 ванильных капкейков без глютена.',
      manualKkal: '190',
      nutritionalInfo: { protein: 4, fats: 10, carbohydrates: 20 },
      price: '900',
      unit: 'piece',
    },
    {
      name: 'Безглютеновый медовик',
      description: 'Коржи на безглютеновой смеси и сметанный крем.',
      manualKkal: '280',
      nutritionalInfo: { protein: 5, fats: 12, carbohydrates: 34 },
      price: '2500',
      unit: 'kg',
    },
    {
      name: 'Безглютеновый трайфл',
      description: 'Порционный десерт полностью без глютена.',
      manualKkal: '200',
      nutritionalInfo: { protein: 4, fats: 9, carbohydrates: 24 },
      price: '300',
      unit: 'piece',
    },
  ]),
];
