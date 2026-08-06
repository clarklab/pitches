/* ============================================================
   STOWAWAYS — puzzle data
   Six themed words hide inside each passage. Spaces and
   punctuation do not exist for the purposes of hiding, so every
   hidden word straddles at least one gap between real words.

   `keystone` is the longest hidden word and names the theme.
   `decoys` is authoring metadata: same-theme words that must NOT
   accidentally appear in the passage (verify.js warns on them).
   ============================================================ */
window.STOWAWAY_PUZZLES = [

  {
    id: 'breakfast',
    clue: 'First things first',
    theme: 'BREAKFAST',
    reveal: 'Six things you might eat before nine in the morning.',
    text: "Uncle Ray entered the samba contest and it ended in heartbreak, fast. He tripped into a stone trough, flattened the cabbage leaves on the produce table, and fed some lettuce to the judge's whippet. Everyone agreed it was nice, really, that he had tried at all.",
    keystone: 'BREAKFAST',
    words: ['BREAKFAST', 'BACON', 'TOAST', 'BAGEL', 'OMELET', 'CEREAL'],
    decoys: ['EGGS', 'COFFEE', 'JUICE', 'PORRIDGE', 'MUFFIN', 'SCONE', 'WAFFLE', 'GRITS', 'BREW']
  },

  {
    id: 'weather',
    clue: 'Small talk',
    theme: 'WEATHER',
    reveal: 'Six things the forecast might threaten you with.',
    text: "Nadia broke into a sweat; her bouquet was already wilting, the best man had ordered a chai latte to the altar, and the organist kept turning the music louder. Halfway down the aisle, Ethel's dog Alec bolted for the cake and came back wearing an afro studded with buttercream.",
    keystone: 'WEATHER',
    words: ['WEATHER', 'HAIL', 'SLEET', 'FROST', 'GALE', 'CLOUD'],
    decoys: ['RAIN', 'SNOW', 'STORM', 'THUNDER', 'BREEZE', 'DRIZZLE', 'MIST', 'SHOWER', 'WIND', 'SUN']
  },

  {
    id: 'planets',
    clue: 'The neighbours',
    theme: 'PLANETS',
    reveal: 'Five of them, plus the word for what they are.',
    text: "Marisol is Honduran, usually unflappable, and she had been camped near the gate since dawn. Elsa turned up clutching a paper plane, tsar of the departure lounge, and asked whether the grammar school had given us any hope of boarding before Tuesday.",
    keystone: 'PLANETS',
    words: ['PLANETS', 'MARS', 'VENUS', 'EARTH', 'SATURN', 'URANUS'],
    decoys: ['MERCURY', 'JUPITER', 'NEPTUNE', 'PLUTO', 'MOON', 'COMET', 'ORBIT']
  },

  {
    id: 'dances',
    clue: 'Take the floor',
    theme: 'DANCES',
    reveal: 'Five of them, and the word for what they are.',
    text: "Walt zipped himself into a tartan gown and, with his usual nasal sarcasm, declared the buffet a disgrace and ancestral standards dead. Ten minutes later the room was a scrum, barging Aunt Maud into the fireplace, where a stuffed falcon gasped its second death.",
    keystone: 'DANCES',
    words: ['DANCES', 'WALTZ', 'TANGO', 'SALSA', 'RUMBA', 'CONGA'],
    decoys: ['POLKA', 'MAMBO', 'TWIST', 'JIVE', 'BALLET', 'FOXTROT', 'LIMBO', 'SAMBA']
  },

  {
    id: 'orchestra',
    clue: 'In the pit',
    theme: 'ORCHESTRA',
    reveal: 'Five of them, and the thing they add up to.',
    text: "The removal men arrived with head torches, trailing mud through the hall, and rumbled up and down the stairs for twenty minutes. Dad had flu, terrible timing, one parcel lost already; the sofa was an Olympian ordeal; and Mum simply left for her suburban jog.",
    keystone: 'ORCHESTRA',
    words: ['ORCHESTRA', 'DRUM', 'FLUTE', 'CELLO', 'PIANO', 'BANJO'],
    decoys: ['VIOLA', 'VIOLIN', 'HARP', 'TUBA', 'OBOE', 'FIDDLE', 'BRASS', 'STRINGS']
  },

  {
    id: 'spices',
    clue: 'Back of the cupboard',
    theme: 'SPICES',
    reveal: 'Five of them, and the shelf they live on.',
    text: "Dani seemed genuinely surprised that the hospice, somehow, had booked its charity swim in the one pond with scum in it. The samba, silly hats and all, played on from the bank while she surfaced in an earthy mess of weed, and her mother filmed the whole classic love-in on a flip phone.",
    keystone: 'SPICES',
    words: ['SPICES', 'CUMIN', 'BASIL', 'CLOVE', 'ANISE', 'THYME'],
    decoys: ['PEPPER', 'SUMAC', 'MACE', 'SAGE', 'CHILI', 'NUTMEG', 'SALT', 'HERBS', 'PAPRIKA']
  },

  {
    id: 'metals',
    clue: 'Heavy going',
    theme: 'METALS',
    reveal: 'Five of them, and the word on the tin.',
    text: "Liz included her old bike helmet, also a stale advertisement for a circus that folded decades ago, in the museum's new wing of found objects. Her hair, once auburn, now matched the big old plaster zebras standing guard by the door.",
    keystone: 'METALS',
    words: ['METALS', 'ZINC', 'LEAD', 'IRON', 'GOLD', 'BRASS'],
    decoys: ['SILVER', 'STEEL', 'COPPER', 'TIN', 'NICKEL', 'BRONZE', 'PEWTER', 'ALLOY']
  }

];
