var btn_OK = document.querySelector(".btn_OK");
var btn_Help = document.querySelector(".btn_Help");
var btn_Last = document.querySelector(".btn_Last");
var btn_Next = document.querySelector(".btn_Next"),
    form = document.querySelector(".form");
container = document.querySelector(".container");
var blure = document.querySelector(".blur");
bodyr = document.querySelector("body");
var HelloForm = document.querySelector("#helloForm");
var HelpText = document.querySelector("#help_text");
var HelpForm = document.querySelector("#helpForm");
var DearFends = document.querySelector("#dearFends");


var TEXT = ['Данная программа была создана для получения зачета по дисциплине Открытые Системы',
    'К сожалению, в пилотной версии нужен аккаунт для подгрузки важных слове на карте Argis',
    'В данном приложении сосредаточены главные интересные обьекты Тимирязевской академии',
    'Так же в данном приложении работает построение маршрутов между обьектами, геолокация, смена карт и т.д.',
    'Данный набор важных и интересных обьектов любой пользователь может изменить путем добавления и редактирования точек на карте',
    'Иными словами, данной приложение - общедоступный банк интересных мест академии, по мнению пользователей данного приложения - студентов',
    'Данный сервис - путеводитель для молодых тимирязевцев, которые не знают всех просторов академии',
    'Данный сервис - это канал передачи опыта от старших курсов маладшим',
    'Приятного использования'];
var i = 0;


var btnOk = function () {
    form.style.display = "none";
    container.style.display = "none";
    bodyr.classList.remove('body_background');
    blure.style.filter = 'blur(0px)'
};

btn_OK.addEventListener("click", () => {
    btnOk()
});

btn_Help.addEventListener("click", () => {
    HelpText.textContent = TEXT[0];
    HelloForm.style.display = "none";
    bodyr.classList.remove('body_background');
    HelpForm.style.display = "initial";
});

btn_Last.addEventListener("click", () => {
    if (TEXT[i - 1] != null) {
        HelpText.textContent = TEXT[i - 1];
        i--;
    }

});

btn_Next.addEventListener("click", () => {
    if (TEXT[i + 1] != null) {
        HelpText.textContent = TEXT[i + 1];
        i++;
    } else {
        btnOk();
    }
});