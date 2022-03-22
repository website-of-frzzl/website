function getRawData(username){
    return JSON.parse($.ajax({type: "GET",
     url: `https://cors-anywhere.herokuapp.com/https://www.duolingo.com/2017-06-30/users?username=${username}`, 
     headers: {"Origin" : "https://frzzl.uk/duolingo/flags"},
     async: false
    }).responseText).users[0];
}

let data = null
function load() {
    let url = new URL(window.location.href);
    if (!url.searchParams.get("username")){
        data = getRawData("HelpfulDuo");
    } else {
        data = getRawData(url.searchParams.get("username"));
    }
    visualise(listCourses())
    console.log(data)
}

function reload(){
    window.location.href = "https://frzzl.uk/duolingo/flags?username=" + $("#username").val();
}

let level_boundaries = [0, 60, 120, 200, 300, 450, 750, 1125, 1650, 2250, 3000, 3900, 4900, 6900, 7500, 9000, 10500, 12000, 13500, 15000, 17000, 19000, 22500, 26000, 30000];
let list_courses = ["en", "es", "fr", "de", "ja", "it", "ko", "zh", "ru", "pt", "tr", "nl-NL", "sv", "ga", "el", "he", "pl", "no-BO", "vi", "da", "hv", "ro", "sw", "eo", "hu", "cy", "uk", "tlh", "cs", "hi", "id", "hw", "nv", "ar", "ca", "th", "gn", "ambassador", "duolingo", "troubleshooting", "teachers", "la", "gd", "fi", "yi", "ht", "tl", "mi"];
let courses_lookup = {'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'ja': 'Japanese', 'it': 'Italian', 'ko': 'Korean', 'zh': 'Chinese', 'ru': 'Russian', 'pt': 'Portuguese', 'tr': 'Turkish', 'nl-NL': 'Dutch', 'sv': 'Swedish', 'ga': 'Irish', 'el': 'Greek', 'he': 'Hebrew', 'pl': 'Polish', 'no-BO': 'Norwegian', 'vi': 'Vietnamese', 'da': 'Danish', 'hv': 'High Valyrian', 'ro': 'Romanian', 'sw': 'Swedish', 'eo': 'Esperanto', 'hu': 'Hungarian', 'cy': 'Welsh', 'uk': 'Ukrainian', 'kl': 'Klingon', 'cs': 'Czech', 'hi': 'Hindi', 'id': 'Indonesian', 'hw': 'Hawaiian', 'nv': 'Navajo', 'ar': 'Arabic', 'ca': 'Catalan', 'th': 'Thai', 'gn': 'Guarani', 'ambassador': 'Ambassador', 'duolingo': 'Duolingo', 'troubleshooting': 'Troubleshooting', 'teachers': 'Teachers', 'la': 'Latin', 'gd': 'Scots Gaelic', 'fi': 'Finnish', 'yi': 'Yiddish', 'ht': 'Haitian Creole', 'tl': 'Tagalog', 'mi': 'Maori', "zh-HK": "Cantonese"}
let otherflags = {"zh-HK": "./assets/cantonese.png"}

function listCourses(){
    let courses = [];
    let languages = []
    for (let i = 0; i<data.courses.length; i++){
        if (data.courses[i].xp >= 60 && !languages.includes(data.courses[i].learningLanguage)){
            courses.push([data.courses[i].learningLanguage,data.courses[i].xp, courses_lookup[data.courses[i].fromLanguage], data.courses[i].xp, data.courses[i].title]);
            languages.push(data.courses[i].learningLanguage);
        }
    }
    let level = () => {
        let _courses = courses
        for (let i = 0; i < courses.length; i++){
            let level = 0;
            for (let j=0; j < level_boundaries.length; j++){
                let xp = courses[i][1];
                if (xp > level_boundaries[j]){
                    level++
                }
            }
            _courses[i][1] = level
        }
        return _courses;
    };
    courses = level(courses).sort((a, b) => b[1] - a[1]);
    return courses
}

function visualise(courses /* id, level, fromlang, xp, title*/) {
    // Profile Link + Plus Icon
    let name = $(`<span><a id="name" class="text" href='https://duolingo.com/profile/${data.name}'>${data.username}</a></span>`);
    let plus = () => {
        if (data.hasPlus) {
            return $(`<span id="plus" class="text" >plus</span>`)
        }
    };
    $("#flags").append(name, plus());

    //Flags
    for (let i = 0; i < courses.length; i++){

        // Create flag
        let flag = $(`
        <li><span class="flagwrap">
        <span id="cur" ></span> <!-- flag -->
        </span>
        <span class="text">${courses[i][1]}</span></li>`);

        // Add flag
        $("#flags").append(flag);

        // Set flag
        let getflag = (id) => {
            if (!list_courses.includes(id)) {
                return 38;
            } else {
                return list_courses.indexOf(id);
            }
        };

        let title = `${courses[i][4]} (${courses[i][0]}) from ${courses[i][2]} | ${courses[i][3]}xp`;
        $("#cur").prop("title", title);
        $("#cur").parent().nextAll().prop("title", title);
        if (list_courses.includes(courses[i][0])) {
            $("#cur").css("background-position", `0px -${66 * getflag(courses[i][0])}px`);
        } else {
            $("#cur").addClass("flag");
            $("#cur").css("background-image", `url('${otherflags[courses[i][0]]}')`)
        }

        $("#cur").removeAttr('id');

    };

    //PFP
    $("#pfp").attr('src', `https:${data.picture}/large`);

    //Streak
    if (data.streak > 0) {
        let streak = $(`
        <li><span class="flagwrap">
        <span id="streak" ></span>
        </span>
        <span class="text">${data.streak}</span></li>`);
        $("#flags").append(streak);

        let title = () => {
            for (let i = 0; i < data.streak + 100; i += 100){
                if (i > data.streak) {
                    return ( i - data.streak)
                }
            }
        }
        $("#streak").prop("title", `${title()} days till next milestone`);
        $("#streak").parent().nextAll().prop("title", `${title()} Days till Next Milestone`);
    }

    $("#comment > p").text("We had a good run, but now we say goodbye.");

    // INPUT

}

load()
