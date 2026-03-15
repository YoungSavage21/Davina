const clickSound = new Audio('sounds/click.mp3');
clickSound.preload = 'auto';

document.addEventListener('click', () => {
    // clone for instant playback
    const sound = clickSound.cloneNode();
    sound.play();
});

function login() {
    const user = $("#username").val().toLowerCase();
    const pass = $("#password").val();

    if (user === "davinaensu" && pass === "GilangGanteng64") {

        $(".login-wrapper").animate({ opacity: 0 }, 500);

        setTimeout(() => {
            $(".left").css("transform", "translateX(-100%)");
            $(".right").css("transform", "translateX(100%)");
        }, 500);

        setTimeout(() => {
            $("#story").css("display", "block");
            $(".login-wrapper").remove();
        }, 2000);

    } else {
        $("#error").text("That's not the secret word Davina 🙂");
    }
}



// TRIGGER ANIMATION WHEN LOADED AND INIT FULLPAGE

new fullpage('#fullpage', {
    navigation: true,
    navigationPosition: 'right',
    autoScrolling: true,
    scrollOverflow: false,

    afterLoad: function (origin, destination, direction) {

        const elements = $(destination.item).find('.hidden-start');

        elements.each(function () {
            const anim = $(this).data('anim');
            $(this).removeClass('hidden-start').addClass(anim);
        });

        if (destination.anchor === "message-1") {
            playMessages();
            setTimeout(function () {
                fullpage_api.moveSectionDown();
            }, 11000);
        }

        if (destination.anchor === "reasons") {
            const rows = $('#card-container .row');
            let delay = 0; // total delay for cascading rows
            rows.each(function () {
                const anim = $(this).data('anim');           // get row animation
                const cards = $(this).find('.card');         // get cards in this row

                cards.each(function (index) {
                    setTimeout(() => {
                        $(this).addClass(anim);              // add slide-left / slide-up
                    }, delay + index * 100);                 // stagger 250ms per card
                });

                delay += cards.length * 100 + 150;          // add gap before next row
            });
        }
    }
});

// NEXT BUTTON

$(document).on("click", ".next-btn", function () {
    fullpage_api.moveSectionDown();
});

// FIRST SECTION
$("#hi").on("click", function () {
    const text = $("#welcome");
    text.text("Hi Bubbyyy :)");

    // create multiple hearts
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * $(window).width();
        const y = $(window).height() - 100 + Math.random() * 50;
        setTimeout(() => createHeart(x, y), i * 50);
    }

    setTimeout(() => {
        fullpage_api.moveSectionDown();
    }, 2000);
});

$("#bye").on("click", function () {
    $("#welcome").text("Alahmak... Stecu Kali Bah 😒");

    setTimeout(() => {
        window.location.href = "https://google.com";
    }, 1000);
});

function createHeart(x, y, emoji) {
    emoji = emoji ? emoji : "♥️";

    const heart = $("<div>" + emoji + "</div>").css({
        position: "absolute",
        left: x + "px",
        top: y + "px",
        fontSize: "16px",
        opacity: 0.8,
        pointerEvents: "none",
        animation: "floatUp 2s forwards"
    });

    $(".section.active .heart-container").append(heart);
    console.log("Current container:", container);

    setTimeout(() => heart.remove(), 2000);
}

// SECOND SECTION

$(".emoji").on("click", function () {

    const text = $(".section.active h1");
    hContainer = $("#heart-container-2");

    const messages = {
        e0: "Seneng karena apa tuh kalo boleh tau? 😏",
        e1: "Aww senyum kamu manis banget 🤭",
        e2: "Apalah... senyum dikit kek 🙄",
        e3: "Kenapa kamu sedih bubbyyy? 🥺 ",
        e4: "Nangis habis nonton apa kamu? 😫",
        e5: "Kamu masih marah sama aku ya 😔",
        e6: "Pasti asam lambung karena ga makan 😠"
    };

    for (let i = 0; i < 20; i++) {
        const emoji = $(this).text();
        const x = Math.random() * $(window).width();
        const y = $(window).height() - 100 + Math.random() * 50;
        setTimeout(() => createHeart(x, y, emoji), i * 50);
    }

    const id = $(this).attr("id");

    text.text(messages[id]);

    // fade out other emojis
    $(".emoji").not(this).fadeTo(200, 0);

    setTimeout(function () {
        fullpage_api.moveSectionDown();
    }, 2000);

});

// SECTION 3


let btnNo = $("#l1");
let btnYes = $("#l0");
let container = $(".btn-area");

let locked = false;
let chaseMode = false;
let escapeCount = 0;

function lockButtons() {

    if (locked) return;

    let noPos = btnNo.position();
    let yesPos = btnYes.position();

    btnNo.css({
        position: "absolute",
        left: noPos.left,
        top: noPos.top
    });

    btnYes.css({
        position: "absolute",
        left: yesPos.left,
        top: yesPos.top
    });

    locked = true;
}

function updateMessage() {

    if (escapeCount === 100) {
        $(".section.active h1").text("Yakin ga lucu? 🤨");
    }

    if (escapeCount === 300) {
        $(".section.active h1").text("Kata aku mending stop deh... 😤");
    }

    if (escapeCount === 600) {
        $(".section.active h1").text("KAMU NGAPAIN SIII");
    }

}

function moveNoButton() {

    escapeCount++;
    updateMessage();

    let maxX = container.width() - btnNo.outerWidth();
    let maxY = container.height() - btnNo.outerHeight();

    let randomX, randomY;
    let safe = false;

    let yesLeft = btnYes.position().left;
    let yesTop = btnYes.position().top;
    let yesRight = yesLeft + btnYes.outerWidth();
    let yesBottom = yesTop + btnYes.outerHeight();

    while (!safe) {

        randomX = Math.random() * maxX;
        randomY = Math.random() * maxY;

        let noRight = randomX + btnNo.outerWidth();
        let noBottom = randomY + btnNo.outerHeight();

        let overlap =
            !(noRight < yesLeft ||
                randomX > yesRight ||
                noBottom < yesTop ||
                randomY > yesBottom);

        if (!overlap) safe = true;
    }

    btnNo.stop().animate({
        left: randomX,
        top: randomY
    }, 250);
}

// FIRST hover trigger
btnNo.on("mouseenter", function () {

    lockButtons();
    moveNoButton();
    chaseMode = true;

});

// chase behavior
container.on("mousemove", function (e) {

    if (!chaseMode) return;

    let btnOffset = btnNo.offset();

    let centerX = btnOffset.left + btnNo.outerWidth() / 2;
    let centerY = btnOffset.top + btnNo.outerHeight() / 2;

    let dist = Math.hypot(e.pageX - centerX, e.pageY - centerY);

    if (dist < 150) {
        moveNoButton();
    }

});

// IF USER MANAGES TO CLICK IT
btnNo.on("click", function () {
    $(".section.active h1").text("Buset niat banget... tapi anjay 😏");
    btnNo.remove()

    for (let i = 0; i < 20; i++) {
        const x = Math.random() * $(window).width();
        const y = $(window).height() - 100 + Math.random() * 50;
        setTimeout(() => createHeart(x, y, "👏"), i * 50);
    }
});

btnYes.on("click", function () {
    $(".section.active h1").text("Memang Bulu Ketek 😏");
    setTimeout(function () {
        fullpage_api.moveSectionDown();
    }, 2000);

});


// Section 4

$("#emoji-pray").click(function () {
    $(".emoji-wrapper").toggleClass("emoji-active");
    $(".section.active h1").text("WLEEE");
    setTimeout(function () {
        fullpage_api.moveSectionDown();
    }, 2000);
});

// Section 5

function playMessages() {

    let messages = $("#apology-section .message");
    let i = 0;

    function nextMessage() {
        if (i >= messages.length) return;
        let current = $(messages[i]);
        current.addClass("show");
        setTimeout(function () {
            if (i === messages.length - 1) {
                for (let j = 0; j < 20; j++) {
                    const x = Math.random() * $(window).width();
                    const y = $(window).height() - 100 + Math.random() * 50;
                    setTimeout(() => createHeart(x, y), j * 50);
                }
            }
            current.removeClass("show");

            setTimeout(function () {

                i++;
                nextMessage();

            }, 700);
        }, 2000);
    }
    nextMessage();
}

// Section 6

$(".card").click(function () {
    $(this).toggleClass("flipped");
});

// Section 7

let compliments = [
    "cute", "adorable", "beautiful", "precious", "charming", "a cutie patootie 😙", "my favorite person", "too pretty",
    "kinda funny (but I'm funnier 😏)", "perfect", "nice", "a good girl", "hard working", "very very cute", "a lovely girl",
    "so pretty, but Leonins are cute too", "stylish", "a cutie", "lovely", "a proud girlfriend 😎", 
    "so sweet, knowing that you love me", "stunning", "gorgeous", "breathtaking", "kinda scary when angry 😰", "my favorite girl",
    "my favorite person", "my everything", "my partner in crime", "my nana", "jago main ML (tapi jagoan aku 😏)", "a heart thief",
    "too pretty for this world", "a villain 😈", "a green flag", "my weakness", "my sunshine", "my comfort", "my everything 🎶",
    "my home", "my peace", "my safe place", "a little scary", "dramatic but cute", "my cute problem", "chaotic but cute", "the best part of my day",
    "someone I can't replace", "someone special", "someone irreplaceable"
];

let clickCount = 0;
let lastIndex = -1;

$("#what-btn").click(function () {

    let randomIndex;

    // prevent same word twice
    do {
        randomIndex = Math.floor(Math.random() * compliments.length);
    } while (randomIndex === lastIndex);

    lastIndex = randomIndex;

    let word = compliments[randomIndex];

    let target = $("#compliment-word");

    target.removeClass("pop");
    target.text(word);

    // trigger animation
    void target[0].offsetWidth;
    target.addClass("pop");

    clickCount++;

    if (clickCount >= 3) {
        $("#next-btn").prop("disabled", false);
    }

});
