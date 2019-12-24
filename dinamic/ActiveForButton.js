var btn_OK = document.querySelector(".btn_OK");
var btn_Help = document.querySelector(".btn_Help");
var btn_Last = document.querySelector(".btn_Last");
var btn_Next = document.querySelector(".btn_Next"),
    form = document.querySelector(".form");
container = document.querySelector(".container");
bodyr = document.querySelector("body");
var HelloForm = document.querySelector("#helloForm");
var HelpText = document.querySelector("#help_text");
var HelpForm = document.querySelector("#helpForm");


var TEXT = ['Данная программа была создана для получения зачета по дисциплине Открытые Системы', '1', '2', '3'];
var i = 0;


var btnOk = function () {
    form.style.display = "none";
    container.style.display = "none";
    bodyr.classList.remove('body_background');
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