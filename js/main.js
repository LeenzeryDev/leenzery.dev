var arrLang = {
  "ru": {
    "Links": "Ссылки",
    "Donate": "Пожертвовать мне",
    "???": "Возможно, здесь будет что-то ещё",
    "desc": getAge("2006/10/12") + " y.o. \n C#, Java разработчик \n пользуюсь Lumia 950 с Windows 10 Mobile \n я говорю/понимаю"
  },
  "uk": {
    "Links": "Посилання",
    "Donate": "Пожертвуй мені",
    "???": "Можливо, тут буде щось інше",
    "desc": getAge("2006/10/12") + " y.o. \n C#, Java розробник \n користуюся Lumia 950 з Windows 10 Mobile \n Я говорю / розумію"
  },
  "en": {
    "Links": "Links",
    "Donate": "Donate to me",
    "???": "Perhaps there will be something else here",
    "desc": getAge("2006/10/12") + " y.o. \n C#, Java Developer \n I use Lumia 950 with Windows 10 Mobile \n I speak / understand"
  }
};
function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}
$(document).ready(function() {
  // The default language is English
  var lang = "en";
  var navLang = navigator.language || navigator.userLanguage;
  if(navLang in arrLang){
    lang = navLang;
  }
  $(".lang").each(function(index, element) {
    $(this).text(arrLang[lang][$(this).attr("key")]);
  });
});

// get/set the selected language
$(".translate").click(function() {
  var lang = $(this).attr("id");
  $(".lang").each(function(index, element) {
    $(this).text(arrLang[lang][$(this).attr("key")]);
  });
});