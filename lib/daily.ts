/**
 * Date-seeded daily content, so there's a reason to open the site every day.
 *
 * Everything here is picked by day number rather than at random — the same day
 * always yields the same joke, which keeps server and client in sync and means
 * she can't reroll for a better one. That's the point.
 */

export const UK_JOKES: string[] = [
  "You've been in the UK a week. Blink twice if someone has already said \"you alright?\" and walked off before you answered.",
  "British weather forecast: grey. Tomorrow: grey, but wetter. Weekend outlook: aggressively grey.",
  "They call it a \"jacket potato\" like the potato got dressed up for the occasion. It's a spud in a blazer.",
  "Nepali tea: boiled with milk, ginger, love. British tea: hot water looked at a teabag from across the room.",
  "Somebody will ask if you've had \"a proper curry.\" Smile. Say nothing. You are the curry authority now.",
  "The UK has one hill and they gave it a visitor centre and a gift shop. One hill.",
  "In Nepal you say \"I'm 20 minutes away\" and arrive in an hour. In the UK the bus apologises for being 90 seconds late.",
  "British spice tolerance is a personality trait over there. You will meet a man defeated by black pepper.",
  "They say \"cheers\" for thank you, hello, goodbye, sorry, and to acknowledge a door. It means everything. It means nothing.",
  "Momo costs £9 there. Nine pounds. For momo. Riju, come home immediately.",
  "\"Are you alright?\" is not a question about your wellbeing. It is a greeting. Do not trauma dump. (Do trauma dump. In the diary.)",
  "UK sun appears for 11 minutes in March and the entire country removes its shirt.",
  "A British person will queue for something without knowing what the queue is for. Solidarity first, information later.",
  "They put beans on toast and called it a meal, then looked us in the eye about it.",
  "Nepali aunties: \"You've lost weight, eat more.\" British strangers: silence, forever, in a lift, six inches apart.",
  "\"It's quite far\" in the UK means 40 minutes. Tell them about the walk to school. Watch them reconsider their life.",
  "Every UK flat has one tap for scalding lava and one for glacial melt. Choose your injury.",
  "The word is \"pavement.\" The word is \"queue.\" The word is \"knackered.\" You'll be fluent by November, sorry.",
  "Lalitpur has more temples per street than the UK has hours of winter daylight. Just saying.",
  "They'll mispronounce your name for a year and you'll let them and then one day you WON'T and that day will be glorious.",
];

/** Small prompts for the homesick days. */
export const HOMESICK_CURES: string[] = [
  "Text the group chat something unhinged. No context. Let them figure it out.",
  "Put on the mixtape and let one song be about Pimbahal for three and a half minutes.",
  "Upload the ugliest photo on your camera roll to the album. Immediately. No cropping.",
  "Write one diary line. One. It doesn't have to be good, it has to exist.",
  "Describe a smell from home in the diary. Be unbearably specific about it.",
  "Name three things you can see right now that Nepal-you would find completely absurd.",
  "Open the oldest letter again. It still counts. It will always still count.",
  "Add a song that would make past-you cry. Make it everyone's problem.",
  "Go find water. A pond, a canal, a sad fountain. Pimbahal energy is transferable.",
  "Say one thing out loud in Nepal Bhasa. Doesn't matter what. The tongue remembers.",
  "Cook the thing that makes the kitchen smell like Lalitpur, even if the spices are wrong.",
  "Send someone here a voice note instead of a text. Let them hear the accent drifting.",
];

/** Terminally-online status lines for the header of the daily card. */
export const STATUS_LINES: string[] = [
  "day shift at the homesickness factory",
  "emotionally a Mitski bridge",
  "thinking about momo (ongoing, chronic)",
  "no thoughts, just Pimbahal at golden hour",
  "currently a Frank Ocean interlude",
  "romanticising the bus stop",
  "being normal about the distance (lie)",
  "3am energy at 2pm GMT",
  "Daniel Caesar voice: oh baby",
  "surviving, allegedly, with vibes",
  "the diary knows what you did",
  "one (1) small creature, far from home",
];

/** Days since epoch — changes at local midnight. */
export function dayNumber(date = new Date()): number {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(local.getTime() / 86_400_000);
}

export function pickForDay<T>(list: T[], offset = 0, date?: Date): T {
  return list[(dayNumber(date) + offset) % list.length];
}
