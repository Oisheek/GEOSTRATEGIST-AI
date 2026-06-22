function assignRegion(
  title = "",
  description = ""
) {

  const text =
    `${title} ${description}`.toLowerCase();

  const mappings = {

    "North America": [
      "usa",
      "united states",
      "america",
      "canada",
      "mexico",
      "washington",
      "new york",
      "texas",
    ],

    "South America": [
      "brazil",
      "argentina",
      "chile",
      "colombia",
      "venezuela",
      "peru",
      "ecuador",
      "bolivia",
    ],

    Europe: [
      "ukraine",
      "ukrainian",
      "russia",
      "russian",
      "europe",
      "germany",
      "france",
      "uk",
      "britain",
      "england",
      "poland",
      "italy",
      "nato",
      "moscow",
      "kyiv",
      "brussels",
    ],

    Africa: [
      "sudan",
      "ethiopia",
      "nigeria",
      "africa",
      "congo",
      "somalia",
      "libya",
      "chad",
      "uganda",
      "kenya",
      "cameroon",
      "central african republic",
    ],

    "Middle East": [
      "israel",
      "iran",
      "israeli",
      "iranian",
      "gaza",
      "palestine",
      "syria",
      "iraq",
      "yemen",
      "saudi",
      "saudi arabia",
      "lebanon",
      "hamas",
      "hezbollah",
      "tehran",
      "hormuz",
      "oman",
      "qatar",
      "uae",
    ],

    "South Asia": [
      "india",
      "pakistan",
      "bangladesh",
      "sri lanka",
      "nepal",
      "afghanistan",
      "maldives",
      "bhutan",
    ],

    "East Asia": [
      "china",
      "taiwan",
      "japan",
      "north korea",
      "south korea",
      "korea",
      "beijing",
      "tokyo",
      "seoul",
      "chinese",
      "taiwanese",
      "japanese",
      "korean",
    ],

    Oceania: [
      "australia",
      "new zealand",
      "oceania",
      "melbourne",
      "sydney",
      "auckland",
    ],
  };

  let bestRegion = "Global";
  let maxScore = 0;

  for (
    const [region, keywords]
    of Object.entries(mappings)
  ) {

    let score = 0;

    keywords.forEach(
      (keyword) => {

        if (
          text.includes(
            keyword.toLowerCase()
          )
        ) {
          score++;
        }

      }
    );

    if (score > maxScore) {

      maxScore = score;
      bestRegion = region;

    }

  }

  return bestRegion;

}

module.exports = assignRegion;