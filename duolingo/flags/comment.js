console.log(
  "Hey! Thanks for checking out my code! If you need to get in touch: I'm at lefrzzl@gmail.com"
);
function getRawData(username) {
  return JSON.parse(
    $.ajax({
      type: "GET",
      url: `https://api.codetabs.com/v1/proxy/?quest=https://www.duolingo.com/2017-06-30/users?username=${username}`,
      headers: {},
      async: false,
    }).responseText
  ).users[0];
}

let data;

function load() {
  let url = new URL(window.location.href);
  if (!url.searchParams.get("username")) {
    data = getRawData("Luis");
  } else {
    data = getRawData(url.searchParams.get("username"));
  }
  visualise(listCourses());
}

function reload() {
  window.location.href =
    "https://frzzl.uk/duolingo/flags?username=" + $("#username").val();
}

// References 
const level_boundaries = [
  0, 60, 120, 200, 300, 450, 750, 1125, 1650, 2250, 3000, 3900, 4900, 6000,
  7500, 9000, 10500, 12000, 13500, 15000, 17000, 19000, 22500, 26000, 30000,
];
const courses_lookup = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  it: "Italian",
  ko: "Korean",
  zh: "Chinese",
  ru: "Russian",
  pt: "Portuguese",
  tr: "Turkish",
  "nl-NL": "Dutch",
  sv: "Swedish",
  ga: "Irish",
  el: "Greek",
  he: "Hebrew",
  pl: "Polish",
  "no-BO": "Norwegian",
  vi: "Vietnamese",
  da: "Danish",
  hv: "High Valyrian",
  ro: "Romanian",
  sw: "Swedish",
  eo: "Esperanto",
  hu: "Hungarian",
  cy: "Welsh",
  uk: "Ukrainian",
  tlh: "Klingon",
  cs: "Czech",
  hi: "Hindi",
  id: "Indonesian",
  hw: "Hawaiian",
  nv: "Navajo",
  ar: "Arabic",
  ca: "Catalan",
  th: "Thai",
  gn: "Guarani",
  ambassador: "Ambassador",
  duolingo: "Duolingo",
  troubleshooting: "Troubleshooting",
  teachers: "Teachers",
  la: "Latin",
  gd: "Scots Gaelic",
  fi: "Finnish",
  yi: "Yiddish",
  ht: "Haitian Creole",
  tl: "Tagalog",
  mi: "Maori",
  zu: "Zulu",
};
const otherflags = { "zh-HK": "./assets/cantonese.png" };

function listCourses() {
  let level = (xp) => {
    let level = 0;
    for (let i = 0; i < level_boundaries.length; i++) {
      if (xp > level_boundaries[i]) {
        level++;
      }
    }
    return level;
  };
  let courses = [];
  let languages = [];
  for (let i = 0; i < data.courses.length; i++) {
    let course = data.courses[i];
    course.level = level(course.xp);
    course.fromLanguage = courses_lookup[course.id.split("_")[2].toLowerCase()];
    if (course.xp >= 60 && !languages.includes(course.learningLanguage)) {
      courses.push(course);
      languages.push(course.learningLanguage);
    }
  }
  courses.sort((a, b) => b.xp - a.xp);
  return courses;
}

function flag(info) {
  let nextLevel =
    info.level == 25 ? "0" : level_boundaries[info.level] - info.xp;
  let title = `${info.title} (${info.learningLanguage}) from ${info.fromLanguage} | ${info.xp}xp | ${nextLevel}xp to next level`;

  let backgroundPosition = (id) => {
    if (Object.keys(courses_lookup).includes(id)) {
      return `0px -${66 * Object.keys(courses_lookup).indexOf(id)}px`;
    } else {
      return "0px -2508px";
    }
  };

  let customFlag = Object.keys(otherflags).includes(info.learningLanguage)
    ? "flag"
    : null;

  let element = $(`
    <li>
        <span class="flagwrap">
            <span id="${info.learningLanguage}" 
            title="${title}" 
            style="background-position: ${backgroundPosition(
              info.learningLanguage
            )}" 
            class="${customFlag}"></span>
        </span>
    <span class="text" title="${title}">${info.level}</span></li>`);

  $("#flags").append(element);
} 

function visualise(courses) {
  // Profile Link + Plus Icon
  let name = $(
    `<span><a id="name" class="text" href='https://duolingo.com/profile/${data.name}'>${data.username}</a></span>`
  );
  let plus = data.hasPlus ? $(`<span id="plus" class="text" >plus</span>`) : "";
  $("#flags").append(name, plus);

  //PFP
  $("#pfp").attr("src", `https:${data.picture}/large`);

  //Flags

  for (let i = 0; i < courses.length; i++) {
    flag(courses[i]);
  }

  //Streak
  let title = () => {
    for (let i = 0; i < data.streak + 100; i += 100) {
      if (i > data.streak) {
        return i - data.streak;
      }
    }
  };

  let streak =
    data.streak > 0
      ? $(`
    <li>
        <span class="flagwrap">
            <span id="streak" title="${title()}"></span>
        </span>
        <span class="text" title="${title()}">${data.streak}</span>
    </li>`)
      : "";
  $("#flags").append(streak);

  $("#comment > p").text("All good things must come to an end...");
}

load();
