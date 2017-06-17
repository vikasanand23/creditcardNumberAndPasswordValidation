var creditcards = {
    list: [{
            brand: 'MasterCard',
            image: 'images/master-card.png',
            verification: '^5[1-5][0-9]',
            separation: '^([0-9]{4})([0-9]{4})?([0-9]{4})?([0-9]{4})?$',
            hidden: '**** **** **** [0-9][0-9][0-9][0-9]',
            accepted: true,
            length: 16
        },
        {
            brand: 'Visa',
            image: 'images/visa-card.png',
            verification: '^4[0-9]',
            separation: '^([0-9]{4})([0-9]{4})?([0-9]{4})?([0-9]{4})?$',
            hidden: '**** **** **** [0-9][0-9][0-9][0-9]',
            accepted: true,
            length: 16
        },
        {
            brand: 'American Express',
            image: 'images/american-express.png',
            verification: '^3[47][0-9]',
            separation: '^([0-9]{4})([0-9]{6})?(?:([0-9]{6})([0-9]{5}))?$',
            hidden: '**** ****** *[0-9][0-9][0-9][0-9]',
            accepted: true,
            length: 15
        }
    ],
    active: null
};

$('input[name="creditcard"]').keydown(function(e) {

    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }

    var card = $(this).val().replace(/[^0-9]/g, ''),
        trim = $.trim($(this).val().slice(0, -1));

    for (var i = 0; i < creditcards.list.length; i++) {

        if (card.match(new RegExp(creditcards.list[i].verification))) {
            creditcards.active = i;
            //document.getElementById("visaLogo").style.display = "inline-block";
            if ($(this).next('img').length == 0) {
                $(this).next('small').remove();
                $(this).after('<img src="' + creditcards.list[i].image + '" alt="' + creditcards.list[i].brand + '" style="position:absolute;" />');
                //document.getElementById("visaLogo").style.display = "inline-block";
            }

            if (!creditcards.list[i].accepted && $(this).nextAll('small').length == 0) {
                $(this).next('img').after('<small>' + 'Creditcard Not Accepted' + '</small>');
            }
            break;
        }
    }
    //Show Invalid Card
    if (creditcards.active == null && card.length > 4 && $(this).nextAll('small').length == 0) {
        $(this).after('<small style="margin-left:5px; color:#F00;">' + 'Invalid Credit Card' + '</small>');
        //document.getElementById("errorMessage").style.display = "block";
        //document.getElementById("errorMessage").innerText = "Please enter the matching values";
    }

    key = creditcards.active !== null ? creditcards.active : 1;

    if (e.keyCode == 8 && trim != $(this).val().slice(0, -1)) {
        $(this).val(trim);
        e.preventDefault();
        return;
    }

    if (card.length >= creditcards.list[key].length && $.inArray(e.keyCode, [37, 38, 39, 40, 46, 8, 9, 27, 13, 110, 190]) === -1 && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        return;
    }
    if (new RegExp(creditcards.list[key].separation).exec(card) && e.keyCode >= 48 && e.keyCode <= 57) {
        $(this).val($(this).val() + ' ');
    }
    return;
});

//On Key up Ensure Card is Validated
$('input[name="creditcard"]').keyup(function(e) {
    var card = $(this).val().replace(/[^0-9]/, '');
    if (creditcards.active !== null && !card.match(new RegExp(creditcards.list[creditcards.active].verification))) {
        $(this).nextAll('small').remove();
        $(this).next('img').remove();
        //document.getElementById("visaLogo").style.display = "none";
        creditcards.active = null;
    } else
    if (card.length < 4) {
        $(this).next('small').remove();
        //document.getElementById("errorMessage").style.display = "none";
    }
});

$('input[name="creditcard"]').on('paste', function(e) {
    var el = this;
    setTimeout(function() {
        var card = $(el).val().replace(/[^0-9]/g, '');
        $(el).val(card);
        var e = jQuery.Event('keydown', {
            which: 37,
            keyCode: 37
        });
        $(el).trigger(e).promise().done(function(e) {
            key = creditcards.active !== null ? creditcards.active : 1;
            card.substr(0, creditcards.list[key].length);
            var separation = new RegExp(creditcards.list[key].separation).exec(card),
                storage = '';
            while (!separation && card.length > 1) {
                storage = card.charAt(card.length - 1);
                card = card.slice(0, -1);
                separation = new RegExp(creditcards.list[key].separation).exec(card);
            }
            //If there was a Separation
            if (separation) {
                var separated = [];
                for (var i = 0; i < separation.length; i++) {
                    if (typeof separation[i] != 'undefined') separated.push(separation[i]);
                }
                var string = separated.slice(1).join(' ') + (storage != '' ? ' ' + storage : '')
                $(el).val(string)
            }
        });
    }, 0);
});

function CheckPasswordStrength(password) {
    //    var password = document.getElementById("password");
    var password = document.querySelector('.password');
    var helperText = {
        charLength: document.querySelector('.helper-text .minCharacter'),
        lowercase: document.querySelector('.helper-text .lowerCharacter'),
        uppercase: document.querySelector('.helper-text .upperCharacter'),
        numChar: document.querySelector('.helper-text .numCharacter'),
        puncChar: document.querySelector('.helper-text .puncCharacter')
    };
    var count = Object.keys(helperText).length;
    //console.log(helperText);
    var pattern = {
        charLength: function() {
            if (password.value.length >= 6) {
                return true;
            }
        },
        lowercase: function() {
            var regex = /^(?=.*[a-z]).+$/; // Lowercase character pattern
            if (regex.test(password.value)) {
                return true;
            }
        },
        uppercase: function() {
            var regex = /^(?=.*[A-Z]).+$/; // Uppercase character pattern
           if (regex.test(password.value)) {
                return true;
            }
        },
        numChar: function() {
            var regex = /^(?=.*[0-9]).+$/; // numChar character or number pattern
            if (regex.test(password.value)) {
                return true;
            }
        },
        puncChar: function() {
            var regex = /^(?=.*[!@#$%^&*()_]).+$/; // numChar character or number pattern
            if (regex.test(password.value)) {
                return true;
            }
        }
    };
    //console.log(pattern.name.'valid');
    password.addEventListener('keyup', function() {
        patternTest(pattern.charLength(), helperText.charLength);
        patternTest(pattern.lowercase(), helperText.lowercase);
        patternTest(pattern.uppercase(), helperText.uppercase);
        patternTest(pattern.numChar(), helperText.numChar);
        patternTest(pattern.puncChar(), helperText.puncChar);
        if (hasClass(helperText.charLength, 'valid') &&
            hasClass(helperText.lowercase, 'valid') &&
            hasClass(helperText.uppercase, 'valid') &&
            hasClass(helperText.numChar, 'valid') &&
            hasClass(helperText.puncChar, 'valid')
        ) {
            //console.log("dfgdfhghfghf "+'valid'.length);
            addClass(password.parentElement, 'valid');
        } else {
            //console.log("qqqqqqqqqqqqqqq "+'valid'.length);
            removeClass(password.parentElement, 'valid');
        }
    });

    function patternTest(pattern, response) {
        if (pattern) {
            addClass(response, 'valid');
            //console.log(addClass);
        } else {
            removeClass(response, 'valid');
        }
    }

    console.log(pattern);
    function addClass(el, className) {
        if (el.classList) {
            //console.log(el.classList);
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    function removeClass(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    function hasClass(el, className) {
        if (el.classList) {
            console.log(el.classList.length);
            if (el.classList.length === 1) {
                document.getElementById("password_text").innerText = "Bad Password";
                document.getElementById("password_strength").style.backgroundColor = "#1fd34a";
                document.getElementById("password_strength").style.width = "20%";
                document.getElementById("error-nwl").style.display = "block";
                //document.getElementById("errorMessage").style.color = "#1fd34a";
            } else if (el.classList.length === 2) {
                document.getElementById("password_text").innerText = "Strong Password";
                document.getElementById("password_strength").style.backgroundColor = "#1fd34a";
                document.getElementById("password_strength").style.width = "100%";
                document.getElementById("error-nwl").style.display = "none";
                //document.getElementById("errorMessage").style.color = "#1fd34a";
            }
            return el.classList.contains(className);
        } else {
            new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    }
}