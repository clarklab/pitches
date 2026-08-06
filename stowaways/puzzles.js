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
    text: "Uncle Ray’s turn at the samba contest ended in heartbreak, fast. He reeled into a stone planter, flattened the cabbage leaves on the produce table, and fed some lettuce to the judge’s whippet. Everyone agreed it was nice, really, that he had tried at all.",
    keystone: 'BREAKFAST',
    words: ['BREAKFAST', 'BACON', 'TOAST', 'BAGEL', 'OMELET', 'CEREAL'],
    decoys: ['EGGS', 'COFFEE', 'JUICE', 'PORRIDGE', 'MUFFIN', 'SCONE', 'WAFFLE', 'GRITS', 'BREW']
  },

  {
    id: 'weather',
    clue: 'Small talk',
    theme: 'WEATHER',
    reveal: 'Six things the forecast might threaten you with.',
    text: "Nadia had planned a regal entrance. Instead she broke into a sweat; her bouquet was wilting, the best man had ordered a chai latte to the altar, and the organist kept turning the music louder. A brief roster of aisle etiquette had gone out to everyone; the ring bearer had eaten his.",
    keystone: 'WEATHER',
    words: ['WEATHER', 'HAIL', 'SLEET', 'FROST', 'GALE', 'CLOUD'],
    decoys: ['RAIN', 'SNOW', 'STORM', 'THUNDER', 'BREEZE', 'DRIZZLE', 'MIST', 'SHOWER', 'WIND', 'SUN']
  },

  {
    id: 'planets',
    clue: 'The neighbours',
    theme: 'PLANETS',
    reveal: 'Five of them, plus the word for what they are.',
    text: "Rosa turned up at six with a clipboard and no coffee, and found the class near the turnstiles, already sprinting. One boy had slept in his aeroplane T-shirt. “You ran us ragged last year,” she said, “and the grammar school never forgave you.” Nobody had given us a risk assessment.",
    keystone: 'PLANETS',
    words: ['PLANETS', 'MARS', 'VENUS', 'EARTH', 'SATURN', 'URANUS'],
    decoys: ['MERCURY', 'JUPITER', 'NEPTUNE', 'PLUTO', 'MOON', 'COMET', 'ORBIT']
  },

  {
    id: 'dances',
    clue: 'Take the floor',
    theme: 'DANCES',
    reveal: 'Five of them, and the word for a floor full of them.',
    text: "Walt zipped himself into a tartan gown for the wake and would not say why. His refusal, said Maud, was the most honest thing all afternoon. Later the room became a scrum, barging her into the fireplace, where a stuffed falcon gathered dust and ancestral portraits looked away.",
    keystone: 'DANCES',
    words: ['DANCES', 'WALTZ', 'TANGO', 'SALSA', 'RUMBA', 'CONGA'],
    decoys: ['POLKA', 'MAMBO', 'TWIST', 'JIVE', 'BALLET', 'FOXTROT', 'LIMBO', 'SAMBA']
  },

  {
    id: 'orchestra',
    clue: 'In the pit',
    theme: 'ORCHESTRA',
    reveal: 'Five of them, and the thing they add up to.',
    text: "The removal men turned up during the power cut, wearing head torches, trailing mud through the hall and rumbling up and down the stairs. Dad had flu, terrible timing, and a parcel lost somewhere between here and Hull. The sofa was an Olympian ordeal. Mum simply left for her suburban jog.",
    keystone: 'ORCHESTRA',
    words: ['ORCHESTRA', 'DRUM', 'FLUTE', 'CELLO', 'PIANO', 'BANJO'],
    decoys: ['VIOLA', 'VIOLIN', 'HARP', 'TUBA', 'OBOE', 'FIDDLE', 'BRASS', 'STRINGS']
  },

  {
    id: 'spices',
    clue: 'Back of the cupboard',
    theme: 'SPICES',
    reveal: 'Five of them, and the shelf they live on.',
    text: "Dani seemed genuinely surprised that the hospice, somehow, had booked its charity swim in a pond with scum in it. Samba, silly hats and all, blared from the bank while she surfaced in an earthy mess of weed. “Don’t panic, love,” shouted her mother, filming.",
    keystone: 'SPICES',
    words: ['SPICES', 'CUMIN', 'BASIL', 'CLOVE', 'ANISE', 'THYME'],
    decoys: ['PEPPER', 'SUMAC', 'MACE', 'SAGE', 'CHILI', 'NUTMEG', 'SALT', 'HERBS', 'PAPRIKA']
  },

  {
    id: 'metals',
    clue: 'Heavy going',
    theme: 'METALS',
    reveal: 'Five of them, and the word on the tin.',
    text: "Liz, incidentally, gave the museum a bike helmet, also a stale advertisement for a circus that folded decades ago, and would not say where either had come from. Her hair, once auburn, had gone the colour of strong, old tea; the cobras still coiled in the case behind her had gone the same way.",
    keystone: 'METALS',
    words: ['METALS', 'ZINC', 'LEAD', 'IRON', 'GOLD', 'BRASS'],
    decoys: ['SILVER', 'STEEL', 'COPPER', 'TIN', 'NICKEL', 'BRONZE', 'PEWTER', 'ALLOY']
  }

];
