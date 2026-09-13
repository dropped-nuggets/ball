/**
 * Nepal's flora and fauna, for the environmental science student.
 *
 * `fact` is the one-liner on the card; `tidbits` are the extras on the
 * species' own page. Each has hand-drawn art in components/NatureArt.tsx.
 *
 * She can add her own species too — those live in the database (see
 * `listSpecies` in lib/store.ts) and are merged with these at render time.
 */
export type Species = {
  id: string;
  name: string;
  local: string;
  latin: string;
  kind: "fauna" | "flora";
  fact: string;
  tidbits: string[];
  status?: string;
  where?: string;
  /** Accent colour token suffix, e.g. "moss" -> --color-seal-moss. */
  seal: string;
};

export const SPECIES: Species[] = [
  {
    id: "monal",
    name: "Himalayan Monal",
    local: "डाँफे · Danphe",
    latin: "Lophophorus impejanus",
    kind: "fauna",
    status: "Least Concern",
    where: "3,000–4,500 m, above the treeline",
    fact: "Nepal's national bird. The male's blue-green isn't pigment at all — it's light interference off microscopic feather layers.",
    tidbits: [
      "Crush the feather and the colour dies with the structure. There is no dye in it to survive.",
      "The female is plain brown and nobody talks about her, though she does all the incubating.",
      "It digs for roots and tubers with its beak, leaving the hillside looking rototilled.",
      "It is the state bird of Uttarakhand too, which Nepal has opinions about.",
      "In winter it comes down to around 2,000 m, so you have seen one closer to home than you think.",
    ],
    seal: "sky",
  },
  {
    id: "redpanda",
    name: "Red Panda",
    local: "हब्रे · Habre",
    latin: "Ailurus fulgens",
    kind: "fauna",
    status: "Endangered",
    where: "Eastern Nepal, 2,200–4,800 m",
    fact: "Has a false thumb — an extended wrist bone — evolved completely separately from the giant panda's.",
    tidbits: [
      "Two unrelated animals, the same bamboo problem, the same solution. Textbook convergent evolution.",
      "It is not a panda. It is the only living member of its entire family, Ailuridae.",
      "It was named 'panda' first. The giant panda is the one that borrowed the name.",
      "It eats bamboo but has a carnivore's gut, so it digests almost none of it and must eat constantly.",
      "Around 500–1,000 are left in Nepal. Fewer than the number of people in a large lecture hall.",
    ],
    seal: "brick",
  },
  {
    id: "laligurans",
    name: "Rhododendron",
    local: "लालीगुराँस · Laligurans",
    latin: "Rhododendron arboreum",
    kind: "flora",
    status: "Least Concern",
    where: "1,500–3,600 m across the hills",
    fact: "Nepal's national flower, and the only rhododendron that grows into a full tree.",
    tidbits: [
      "The petals are made into a juice that genuinely helps with altitude sickness and sore throats.",
      "Nepal has 30-plus rhododendron species. The colour shifts from deep red low down to pale pink and white higher up.",
      "The honey from it can be mildly hallucinogenic — 'mad honey' — because of grayanotoxins in the nectar.",
      "It flowers in March and April, which is why everyone's trekking photos from then look the same.",
      "A mature tree can be over 20 m tall and a couple of centuries old.",
    ],
    seal: "rose",
  },
  {
    id: "snowleopard",
    name: "Snow Leopard",
    local: "हिउँ चितुवा · Hiu Chituwa",
    latin: "Panthera uncia",
    kind: "fauna",
    status: "Vulnerable",
    where: "Himalaya, 3,000–5,500 m",
    fact: "Cannot roar — the throat structure is wrong for it. It chuffs instead.",
    tidbits: [
      "Its tail is nearly as long as its body. It wraps itself in it to sleep, like a scarf.",
      "It can take down prey three times its weight, and leaps close to 15 m across a gully.",
      "Nose passages are oversized to warm freezing air before it reaches the lungs.",
      "Roughly 300–500 live in Nepal, and almost nobody ever sees one. They are called ghosts of the mountains for a reason.",
      "Camera traps do most of the counting now, identifying individuals by rosette patterns like fingerprints.",
    ],
    seal: "dusk",
  },
  {
    id: "rhino",
    name: "One-horned Rhino",
    local: "गैँडा · Gaida",
    latin: "Rhinoceros unicornis",
    kind: "fauna",
    status: "Vulnerable",
    where: "Chitwan, Bardiya, Shuklaphanta",
    fact: "The armour-plated look is just deeply folded skin. No plates involved.",
    tidbits: [
      "Chitwan's population fell under 100 in the 1960s. It is now well over 600 — one of conservation's genuine wins.",
      "The horn is keratin, the same protein as your fingernails. It is not bone and it has no medicinal property.",
      "It is a strong swimmer and will happily cross a river, unlike most large mammals its size.",
      "It can run at about 40 km/h despite weighing over two tonnes.",
      "Nepal has had multiple consecutive years of zero poaching — the anti-poaching model gets studied internationally.",
    ],
    seal: "moss",
  },
  {
    id: "sal",
    name: "Sal Tree",
    local: "साल · Sal",
    latin: "Shorea robusta",
    kind: "flora",
    status: "Least Concern",
    where: "Terai and lower hills, below 1,500 m",
    fact: "The wood is so resin-dense it resists termites for a century.",
    tidbits: [
      "Most of Kathmandu Valley's carved temple struts and ankhi jhyal windows are sal. Including the ones around Pimbahal.",
      "Sal forest is the habitat that makes Chitwan work — rhino, tiger and sloth bear all depend on it.",
      "The Buddha is said to have been born under sal trees at Lumbini, and to have died between two of them.",
      "The resin, sal dhup, is burned as incense in temples across the country.",
      "The seeds have a winged shape and helicopter down, which is why sal regenerates in dense stands.",
    ],
    seal: "marigold",
  },
  {
    id: "yak",
    name: "Yak",
    local: "याक · Yak",
    latin: "Bos grunniens",
    kind: "fauna",
    status: "Domesticated",
    where: "Above 3,000 m, Himalaya",
    fact: "Lungs and heart are oversized for its body, and its blood carries far more haemoglobin than lowland cattle.",
    tidbits: [
      "Below about 3,000 m it overheats. It is one of the few large animals that cannot come down to visit.",
      "Strictly, 'yak' is the male. The female is a nak — and it is nak milk in your butter tea.",
      "The dung is dried and burned as fuel where there are no trees, which is most of where it lives.",
      "A crossbreed with lowland cattle, the dzo, is more useful at middle elevations and is what most treks actually pass.",
      "Its undercoat is finer than cashmere and gets spun into some genuinely expensive wool.",
    ],
    seal: "plum",
  },
  {
    id: "orchid",
    name: "Sungabha Orchid",
    local: "सुनगाभा · Sungabha",
    latin: "Dendrobium densiflorum",
    kind: "flora",
    status: "Protected (CITES)",
    where: "Epiphytic, 1,000–2,000 m",
    fact: "Grows on trees without harming them — it feeds on air and rain, not the host.",
    tidbits: [
      "Nepal has over 400 orchid species, in a country roughly the size of Bangladesh.",
      "Epiphyte, not parasite. The distinction matters and people get it wrong constantly.",
      "Its roots have velamen — a spongy outer layer that grabs moisture straight from humid air.",
      "Orchid seeds are dust-fine and carry no food store, so they only germinate with the right fungus present.",
      "Collection for trade is the main threat, which is why it is CITES-listed. Godavari's orchid house exists partly for this.",
    ],
    seal: "marigold",
  },
];

export const speciesById = (id: string) => SPECIES.find((s) => s.id === id);
