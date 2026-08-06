/* ============================================================
   CHAINS — daily compound-word golf
   Hand-curated link dictionary + hand-authored rounds.

   LINKS[a] = "b c d"  means  a→b, a→c, a→d are legal plays:
   each forms a closed compound (FIRE+HOUSE) or a very common
   open two-word phrase (BOAT RACE) in that order.

   Seeded from shared/compounds.raw.json, then hand-curated line
   by line: every morphological accident (pen+chant, star+ter,
   cat+alan, tea+cher, sun+ken, hat+red) was deleted, and several
   hundred open phrases the derived file could not know about
   were hand-added. Run `node verify.js` to re-check the holes.
   ============================================================ */
(function (g) {
  'use strict';

  const RAW = {
    /* --- A --- */
    air: 'craft plane port line field bag time way space force raid mail show drop lift strip brake borne head bed gun tight',
    all: 'star time clear out round',
    animal: 'kingdom shelter rights',
    arm: 'chair band pit rest wrestle hole',
    attack: 'dog',
    away: 'day game team',

    /* --- B --- */
    back: 'pack yard bone ground drop fire hand lash log stage stroke up water door seat road street pain garden flip board bench stop track',
    bag: 'pipe lady lunch',
    ball: 'park room game boy point player pit',
    band: 'wagon stand width leader aid mate member practice',
    bar: 'tender stool code tab fight man maid keeper',
    base: 'ball line camp coat',
    bath: 'room tub house towel mat time robe water salt',
    beat: 'box down',
    bed: 'room time side rock spread bug sheet frame head post pan rest linen',
    bee: 'hive sting keeper line',
    beer: 'garden belly mat can bottle glass',
    bell: 'boy tower hop',
    belt: 'buckle loop way',
    bench: 'mark press warmer',
    bill: 'board fold',
    bird: 'house bath cage seed song watcher brain feeder table',
    black: 'bird board mail out smith berry belt hole list jack market eye box top ice tie sheep magic',
    block: 'buster head party',
    blue: 'bird berry print bell grass jay collar moon whale chip jeans book bottle',
    board: 'walk room game member',
    boat: 'house man race ride show yard load hook',
    bolt: 'cutter hole on',
    book: 'shelf store worm mark case keeper end club shop bag seller',
    boot: 'strap camp lace',
    bow: 'tie string man',
    bowl: 'game',
    box: 'car office wood spring set room',
    boy: 'friend hood band scout',
    brain: 'storm wash child wave power cell freeze dead',
    bread: 'winner crumb board bin knife basket stick roll',
    break: 'fast down out through water away point room dance',
    breeze: 'block',
    bridge: 'club',
    brush: 'stroke fire work',
    bull: 'dog ring fight pen horn',
    bullet: 'point proof train hole',
    burger: 'bar joint',
    burn: 'out mark',
    bus: 'stop driver lane route ticket station pass fare',
    butter: 'fly milk scotch cup knife dish cream',

    /* --- C --- */
    cake: 'walk shop mix stand tin',
    call: 'back out sign center centre girl box',
    camp: 'fire ground site bed counselor',
    can: 'opener',
    candle: 'stick light wax wick',
    candy: 'floss cane bar store shop',
    car: 'port park wash seat door key keys pool crash ride alarm horn bomb chase boot',
    card: 'board game table shark trick holder key',
    care: 'taker package giver home free',
    carpet: 'bag burn',
    case: 'study work load file law',
    cast: 'away iron off net',
    cat: 'walk fish nip food flap nap burglar call suit lady litter eye',
    cell: 'phone block mate wall',
    chain: 'saw mail link reaction gang smoker store',
    chair: 'man lift person leg',
    change: 'over room up',
    cheese: 'burger cake board cloth grater',
    chest: 'nut pain hair freezer',
    chip: 'shop board pan',
    chocolate: 'bar cake chip box milk',
    class: 'room mate act war',
    clear: 'cut water',
    cloth: 'line',
    clothes: 'line horse pin peg',
    cloud: 'burst cover nine computing storage',
    club: 'house sandwich night foot',
    coat: 'rack hanger check tail closet pocket',
    cob: 'web',
    code: 'word name book red',
    corn: 'field bread starch flake cob dog maze flour syrup',
    country: 'side club music road house man',
    course: 'work',
    court: 'room house yard case order martial jester side',
    crash: 'course test landing pad helmet site',
    cream: 'cheese puff soda pie',
    cross: 'word roads fire bow walk over bar check wind town country hair piece road',
    cup: 'cake board holder final',
    cut: 'back throat off out down price away',
    cycle: 'path lane race',

    /* --- D --- */
    day: 'light break dream time care job trip off',
    dead: 'line lock end weight beat bolt pan wood heat',
    deck: 'chair hand house',
    desk: 'top job lamp chair work',
    dog: 'house fight food collar walker show park days sled tag wood bowl leg',
    door: 'bell step way knob man mat frame handle hinge stop key prize',
    down: 'hill town fall load pour side stairs stream time turn beat grade play river wind size',
    dream: 'land team catcher house job boat world state',
    drill: 'bit sergeant',
    drive: 'way through time',
    drop: 'out kick box down off zone cloth',
    drum: 'stick beat roll kit line major',
    dust: 'bin pan storm cloud bunny jacket cover sheet',

    /* --- E --- */
    end: 'game zone point line note user',
    engine: 'room driver',
    eye: 'ball brow lash lid sight witness drop patch shadow contact glasses liner sore piece opener',

    /* --- F --- */
    farm: 'house land yard hand animal worker',
    fast: 'food lane track ball forward',
    father: 'land figure',
    field: 'trip work day goal house guide test hand mouse',
    fight: 'club song',
    fire: 'man fly place house wood arm ball bird wall storm power works work truck drill alarm escape engine station hydrant light fighter pit door hose cracker',
    fish: 'bowl tank net hook food market cake finger pond stick monger eye farm',
    fist: 'fight bump full',
    flag: 'ship pole stone day football bearer',
    flash: 'light back bulb card flood point mob drive',
    flight: 'path deck attendant plan time',
    flood: 'light gate plain water wall',
    floor: 'board plan lamp mat space show',
    flower: 'bed pot shop girl power',
    fly: 'over wheel paper swatter ball fishing by trap',
    food: 'chain court bank truck fight poisoning stamp processor web',
    foot: 'ball path print step note hill hold bridge wear rest stool locker soldier work',
    force: 'field',
    fox: 'hole hunt glove trot',
    frame: 'work rate up',
    free: 'dom way fall lance style hand kick time will range throw',
    freeze: 'frame dry',
    friend: 'ship zone request',
    front: 'door line man page yard runner seat room desk',

    /* --- G --- */
    game: 'play show night plan changer over keeper board',
    garden: 'party gnome shed hose path center centre gate variety',
    gate: 'way keeper crasher post',
    girl: 'friend band scout power',
    glass: 'house ware door eye ceiling blower',
    glove: 'box compartment puppet',
    goal: 'keeper post line kick mouth',
    gold: 'fish mine smith rush medal dust leaf digger bar standard',
    grass: 'hopper land roots court seed',
    green: 'house light grocer field room thumb belt tea screen',
    grid: 'lock iron',
    ground: 'work water floor rules zero hog beef crew breaking',
    guard: 'dog rail house duty',
    gun: 'fight fire man powder shot boat point barrel dog smoke metal slinger',

    /* --- H --- */
    hair: 'brush cut line pin style do band dryer net spray piece dresser',
    half: 'time back way moon pipe',
    hall: 'way mark pass monitor',
    hand: 'bag book cuff gun made shake stand writing rail out set ball brake held print luggage towel soap',
    handle: 'bar',
    hat: 'trick box stand rack band pin',
    head: 'ache band light line master phones quarters stone way wind board count dress hunter room rest set stand start teacher first gear lock strong case land',
    heart: 'beat break burn land attack ache throb felt strings rate',
    heat: 'wave sink map proof stroke lamp shield',
    hive: 'mind',
    hold: 'up out over all',
    hole: 'punch saw',
    home: 'work land town made sick owner page room run coming stead body grown movie base cook school',
    honey: 'comb moon bee pot dew trap',
    horse: 'back shoe man power play race rider hair fly box',
    hot: 'dog line spot house head plate rod',
    hour: 'glass hand',
    house: 'hold work wife keeper boat fly plant party cat key guest call mate music rules arrest',

    /* --- I --- */
    ice: 'berg box cream cube age skate rink breaker pick cap hockey cold water house',
    iron: 'work clad man age fist will',

    /* --- J --- */
    jacket: 'pocket potato',
    job: 'seeker center centre title lot description market share hunt',

    /* --- K --- */
    key: 'board hole note stone word chain ring card pad',
    kick: 'off back stand start boxing drum',
    king: 'dom fisher pin size crab maker',
    kit: 'bag',
    knife: 'edge block point',

    /* --- L --- */
    ladder: 'rung',
    lamp: 'post shade light oil',
    land: 'mark slide lord line fill scape owner mass lady mine fall grab bridge',
    law: 'suit maker school firm man breaker court',
    leaf: 'blower litter',
    level: 'crossing headed',
    life: 'boat guard line style time span jacket raft cycle saver story coach force long work',
    lift: 'off',
    light: 'house weight bulb switch year show',
    line: 'man backer up dance drive judge cook',
    lion: 'tamer heart cub',
    lock: 'smith down box jaw out up',
    lunch: 'box time break money lady room counter',

    /* --- M --- */
    machine: 'gun shop tool wash learning',
    magic: 'wand trick carpet show marker',
    mail: 'box man order room bag carrier slot',
    man: 'hole kind hunt power hood cave made servant',
    map: 'maker reading',
    mark: 'down up sman',
    market: 'place square stall share day garden',
    mason: 'jar',
    master: 'piece mind key plan class bedroom stroke work',
    match: 'box stick point day maker',
    meal: 'time plan deal ticket worm',
    milk: 'shake man tooth float bottle carton jug chocolate maid weed',
    mill: 'stone pond wheel worker house',
    mind: 'set game reader map control',
    mine: 'field shaft worker cart',
    money: 'bag box maker order market belt man pit',
    moon: 'light beam shine walk rise stone landing rock dust',
    mouth: 'piece wash guard organ',
    movie: 'theater star night house',
    music: 'box hall video stand sheet teacher',

    /* --- N --- */
    name: 'plate tag sake',
    net: 'work ball worth',
    news: 'paper room letter cast stand flash reel feed desk anchor',
    night: 'mare club fall life time gown cap light owl shift sky watch school vision',
    note: 'book pad paper taker',
    number: 'plate line cruncher',
    nut: 'shell cracker case meg job butter',

    /* --- O --- */
    off: 'shore side spring set day beat hand road season shoot ramp limits',
    office: 'block worker party chair space',
    oil: 'field rig well spill paint slick tanker change drum lamp can',
    order: 'form',
    out: 'house law fit look burst cast come doors door field let line post put reach side skirts back break cry grow number run source bound board weigh rage',

    /* --- P --- */
    pack: 'horse animal ice rat leader mule',
    pad: 'lock',
    page: 'turner boy break',
    paint: 'brush ball job work pot can',
    pan: 'cake handle fry',
    paper: 'back work clip cut trail mill plane towel weight boy route thin',
    park: 'land way bench ranger',
    pass: 'port word key',
    path: 'way finder',
    phone: 'book call box line number case bill',
    piece: 'meal work',
    pick: 'up axe pocket',
    pipe: 'line dream organ cleaner bomb',
    place: 'mat setting name holder card',
    plain: 'clothes',
    plane: 'crash',
    plant: 'pot food life stand',
    plate: 'glass',
    play: 'ground house mate off time wright boy room date pen list book park',
    pocket: 'book knife watch money size',
    pod: 'cast',
    point: 'blank guard man',
    pole: 'vault star position cat',
    pool: 'side table hall party room boy',
    port: 'hole wine',
    post: 'man card box code office script war game',
    pot: 'luck hole plant roast belly pie holder shot',
    power: 'house play point cut line plant tool nap grid boat lift station wash',
    press: 'release conference box up',
    price: 'tag list war check cut',
    print: 'maker shop run out',
    punch: 'line bowl card bag drunk',

    /* --- Q --- */
    queen: 'bee size',

    /* --- R --- */
    race: 'car horse track course way day',
    rail: 'road way car line yard track pass',
    rain: 'bow coat fall forest drop storm water check cloud dance gauge boot',
    range: 'finder',
    rat: 'race trap run',
    record: 'player label shop store breaker',
    road: 'block side way house map trip rage works sign runner show test kill',
    rock: 'band star climbing bottom face garden pool salt slide',
    roll: 'call out over top',
    room: 'mate service key',
    root: 'beer canal cause vegetable',
    rule: 'book breaker',
    run: 'way down away off time around',
    runner: 'up',
    rush: 'hour job',

    /* --- S --- */
    salt: 'water shaker mine flat lick cellar marsh',
    sandwich: 'board shop',
    saw: 'mill dust blade horse tooth',
    school: 'boy house teacher work yard bus day bag run master girl book trip uniform',
    screen: 'play shot door saver writer test time',
    sea: 'food shore side weed gull port man plane shell horse water bed level salt breeze sick lion floor wall front captain',
    search: 'light party engine warrant',
    season: 'ticket',
    seed: 'bed pod money cake',
    set: 'back piece up list point square',
    shake: 'down up',
    sheep: 'dog skin farm shearing',
    sheet: 'music metal rock',
    shelf: 'life space',
    shell: 'fish shock suit game',
    ship: 'wreck yard mate builder load shape',
    shirt: 'tail sleeve pocket front',
    shock: 'wave absorber treatment jock therapy',
    shoe: 'lace maker box horn shop store polish string size rack',
    shop: 'keeper lifter window front floor talk',
    shore: 'line bird break',
    shot: 'gun put glass clock',
    show: 'down case room time man girl business stopper off reel',
    side: 'walk line kick show car step bar board burns street dish effect door road note table',
    sign: 'post board language writer',
    signal: 'box fire',
    silk: 'worm screen road',
    silver: 'ware fish screen lining spoon bullet medal smith',
    sink: 'hole',
    skin: 'care deep tone head tight graft',
    slide: 'show rule',
    smoke: 'screen stack alarm signal house detector ring bomb',
    snow: 'ball man flake storm fall drift plow shoe board day globe bank angel mobile suit tire cone',
    sock: 'puppet drawer',
    song: 'book bird writer sheet',
    space: 'ship craft station man suit walk bar age time race',
    spill: 'over way',
    spin: 'off doctor cycle class',
    spoon: 'feed',
    spray: 'can paint gun tan',
    spring: 'board time roll clean water break',
    square: 'dance meal root foot one',
    stand: 'point still off out by up in',
    star: 'fish light dust gazer sign player struck dom ship',
    start: 'line up point',
    station: 'wagon master house',
    step: 'ladder father mother son daughter child stool brother sister',
    stick: 'figure man shift insect',
    stone: 'wall work mason age cold fruit',
    stop: 'light watch sign over gap',
    store: 'front house room keeper card',
    storm: 'cloud drain front surge chaser door trooper',
    straw: 'berry man hat poll bale',
    stroke: 'play',
    suit: 'case jacket',
    summer: 'time house camp school job break',
    sun: 'light set rise shine flower burn glasses day dial down beam spot fish roof screen stroke hat tan deck block',

    /* --- T --- */
    table: 'top cloth tennis lamp manners saw talk leg salt spoon',
    tag: 'line team along',
    tail: 'gate back wind light spin bone coat pipe',
    tan: 'line',
    tank: 'top engine',
    tea: 'pot spoon cup bag time party leaf room towel kettle house shop break cake',
    team: 'mate work player spirit captain',
    test: 'tube drive flight run case paper pilot match',
    throw: 'back away down',
    ticket: 'office booth holder stub machine',
    tie: 'breaker pin clip',
    time: 'table line keeper piece zone bomb machine out share travel frame card capsule lapse limit sheet',
    tool: 'box kit shed belt bar',
    tooth: 'brush paste pick fairy ache decay',
    top: 'soil hat dog coat secret side spin gear',
    towel: 'rack rail',
    town: 'house hall square center centre crier',
    track: 'record suit pad day',
    train: 'station track wreck ride driver set yard',
    trap: 'door',
    trick: 'shot question',
    trip: 'wire',
    truck: 'driver stop load bed',
    tube: 'station map sock',
    turn: 'over table out pike around coat key signal stile',

    /* --- U --- */
    up: 'side town stairs stream hill root grade right set take beat stage load lift keep land turn',

    /* --- W --- */
    walk: 'way out over',
    wall: 'paper flower clock art chart socket',
    war: 'head fare horse lord path ship time zone paint cry game chest',
    ware: 'house',
    wash: 'cloth room out basin board bag day',
    watch: 'dog man tower word list',
    water: 'fall melon proof front way color shed line mark bottle park gun main tower wheel works side tight bed fowl pistol slide cooler lily',
    wave: 'length form pool',
    way: 'side out point ward',
    web: 'site page cam master',
    weed: 'killer whacker',
    weight: 'lift room loss lifter training',
    well: 'being spring water head',
    wheel: 'chair barrow house base nut spin',
    white: 'wash board house water out noise lie bread collar fish',
    wind: 'mill shield screen surf chime farm pipe fall break storm tunnel sock power',
    wine: 'glass bar cellar list rack bottle',
    wire: 'cutter frame tap brush',
    winter: 'time coat sports break green',
    wood: 'work land pecker shed pile chip cut block burner wind smoke',
    word: 'play search count game processor smith',
    work: 'shop house man out place load bench book force day week station boots ethic horse sheet space top',
    worm: 'hole',

    /* --- Y --- */
    yard: 'stick sale work arm'
  };

  /* expand to {first: Set(second)} */
  const LINKS = Object.create(null);
  for (const k in RAW) LINKS[k] = RAW[k].split(' ');

  /* ---- the daily rounds: 6 × 3 holes ------------------------------------
     `best` is the TRUE shortest path through LINKS (BFS-proved by verify.js).
     `par`  is what a good player shoots.  par = best + 1 on a normal hole,
            so finding the tightest line is a BIRDIE, and par = best + 2 on
            the round's closing "long" hole, where the tightest line is an
            EAGLE.  Max strokes = par + 3.                                */
  const ROUNDS = [
    { name: 'Opening Round', holes: [
      { start: 'STAR',   target: 'WORK',    best: 3, par: 4 },
      { start: 'SNOW',   target: 'GROUND',  best: 4, par: 5 },
      { start: 'FIRE',   target: 'CAR',     best: 4, par: 6, long: true }
    ]},
    { name: 'The Turn', holes: [
      { start: 'MOON',   target: 'PARTY',   best: 3, par: 4 },
      { start: 'RAIN',   target: 'CRACKER', best: 4, par: 5 },
      { start: 'BOOK',   target: 'TIME',    best: 3, par: 5, long: true }
    ]},
    { name: 'Seaside Links', holes: [
      { start: 'SEA',    target: 'BAND',    best: 3, par: 4 },
      { start: 'DAY',    target: 'MUSIC',   best: 3, par: 4 },
      { start: 'SUN',    target: 'ALARM',   best: 4, par: 6, long: true }
    ]},
    { name: 'Windward', holes: [
      { start: 'HORSE',  target: 'LIGHT',   best: 3, par: 4 },
      { start: 'ICE',    target: 'DOOR',    best: 3, par: 4 },
      { start: 'GOLD',   target: 'STOP',    best: 4, par: 6, long: true }
    ]},
    { name: 'Long Course', holes: [
      { start: 'BUTTER', target: 'ROOM',    best: 3, par: 4 },
      { start: 'NIGHT',  target: 'SMOKE',   best: 4, par: 5 },
      { start: 'SILVER', target: 'CLUB',    best: 4, par: 6, long: true }
    ]},
    { name: 'Championship', holes: [
      { start: 'GREEN',  target: 'WALK',    best: 3, par: 4 },
      { start: 'WHITE',  target: 'DRILL',   best: 4, par: 5 },
      { start: 'FOOT',   target: 'CAR',     best: 4, par: 6, long: true }
    ]}
  ];

  g.CHAINS_LINKS = LINKS;
  g.CHAINS_ROUNDS = ROUNDS;
})(typeof window !== 'undefined' ? window : globalThis);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LINKS: (typeof window !== 'undefined' ? window : globalThis).CHAINS_LINKS,
    ROUNDS: (typeof window !== 'undefined' ? window : globalThis).CHAINS_ROUNDS
  };
}
