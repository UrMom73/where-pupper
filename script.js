//variables
let char = 0;
let timer;
let giveInput = true;
let inputPlaceholder = true;
let typeSpeed = 40;
let gameText = document.createElement('div');

gameText.id = 'gameText';

//menu popup functions
function openWindow(windowName) {
    document.getElementById(windowName).style.display = 'flex';
};

function exitWindow(windowName) {
    document.getElementById(windowName).style.display = 'none';
};

//audio functions
function audioFunction() {
    let musicFiles = document.getElementById('music').children;
    let sfxFiles = document.getElementById('sfx').children;

    //for music
    if (document.getElementById('musicSelect').value === 'off') {
        for (let i = 0; i < musicFiles.length; i++) {
            musicFiles[i].muted = true;
        };

    } else {
        for (let i = 0; i < musicFiles.length; i++) {
            musicFiles[i].muted = false;
        };
    };
    //for sound effects
    if (document.getElementById('sfxSelect').value === 'off') {
        for (let i = 0; i < sfxFiles.length; i++) {
            sfxFiles[i].muted = true;
        };

    } else {
        for (let i = 0; i < sfxFiles.length; i++) {
            sfxFiles[i].muted = false;
        };
    };
};

//button hover sound effect
let buttons = document.querySelectorAll('button');
for (let i = 0; i < buttons.length; i++) {
    buttons[i].onmouseover = buttonBeep;
};

function buttonBeep() {
    document.getElementById('buttonBeep').play();
    if(!document.getElementById('bg-music').paused) {
        return;

    }else {
        document.getElementById('bg-music').play();
    }
};

//frustrating but for chrome, autoplay doesn't work, so gotta play the music somehow
function buttonClick() {
    if(!document.getElementById('bg-music').paused) {
        return;

    }else {
        document.getElementById('bg-music').play();
    }
};

//start game functions
function transitionMenu() {
    document.querySelector('body').style.animation = '3s menuFadeOut';
    setTimeout(eraseMenu, 3000);
    document.getElementById('howl').play();
};

function eraseMenu() {
    document.querySelector('body').style.backgroundImage = 'none';
    document.querySelector('main').innerHTML = '';
    document.querySelector('main').appendChild(gameText);
    document.getElementById('alarm').play();
    setTimeout(startGame, 3750);
};

function startGame() {
    document.getElementById('alarm').pause();
    textGenerator(`You groan in defiance and hit snooze on your alarm. Pupper will probably wake you up anyway. But as you lie there, something feels off. Confused, you get up and step out into the hallway. The house is unusually quiet. "Pupper?" you call out. "O Pupper! Where art thou Pupper?" But there's no response. Then you see it: lying by the front door is Pupper's favorite toy along with his collar. Next to it is your mama's favorite vase, smashed into pieces! Someone must've kidnapped Pupper! You need to find him and make whoever did this pay. ${listLocation()}`);
};

//text generator takes string parameter, splits into individual characters
function textGenerator(string) {
    gameText.innerHTML += `<div></div>`
    let stringArray = string.split('');
    let numOfHighlights = 0;

    for(let i = 0; i < stringArray.length; i++) {
        if(stringArray[i] === '{') {
            numOfHighlights++;
        };
    };

    for (let i = 0; i < stringArray.length; i++) {
        gameText.lastElementChild.innerHTML += `<span>${stringArray[i]}</span>`;
    };

    //highlights text if important to player's knowledge
    function highlighter() {
        if(numOfHighlights === 0) {
            return;
        }else {
            let spanArray = gameText.lastElementChild.children;
            let highlightStart;
            for(let i = 0; i < spanArray.length; i++) {
                if(spanArray[i].innerHTML === '{') {
                    highlightStart = i;
                    break;
                };
            };
    
            let highlightEnd;
            for(let i = 0; i  < spanArray.length; i++) {
                if(spanArray[i].innerHTML === '}') {
                    highlightEnd = i;
                    break;
                };
            };
    
            for(let i = highlightStart; i < highlightEnd; i++) {
                spanArray[i].classList.add('highlighter');
            };
    
            spanArray[highlightEnd].remove();
            spanArray[highlightStart].remove();
            
            numOfHighlights--;
        };
    
        if(numOfHighlights !== 0) {
            highlighter();
        };
    };

    highlighter();

    document.getElementById('typingSound').play();
    timer = setInterval(onTick, typeSpeed);
    window.scrollTo(0, gameText.scrollHeight);
}

//onTick styles individual span characters
function onTick() {
    let array = gameText.lastElementChild.children;
    if (char === array.length) {
        document.getElementById('typingSound').pause();
        document.getElementById('typingSound').currentTime = 0;
        clearInterval(timer);
        char = 0;
        if (giveInput === true) {
            inputGenerator();
        };
    }else {
        let span = array[char];
        span.classList.add('typewriter');
        char++;
    };
};

//skip typewriter effect
gameText.addEventListener('dblclick', function() {
    if(gameText.lastElementChild.tagName === 'INPUT' || gameText.lastElementChild.tagName === 'SPAN') {
        return;

    }else {
        clearInterval(timer);
        let array = gameText.lastElementChild.children;
        while(char < array.length) {
            array[char].classList.add('typewriter');
            char++;
        };
        onTick();
    };
});

//generates input for player
function inputGenerator() {
    // let gameText = document.getElementById('gameText');
    gameText.innerHTML += `<span class="typewriter">&gt;</span> <input type="text">`;
    let input = gameText.lastElementChild;

    if(inputPlaceholder === true) {
        input.setAttribute('placeholder', 'Type here');
        inputPlaceholder = false;
    };

    input.setAttribute('maxlength', '30')

    input.addEventListener('keydown', function (key) {
        if (key.keyCode === 13) {
            masterFunction(input.value);
        };
    });
    window.scrollTo(0, gameText.scrollHeight);
};

//master function, takes input and redirects to other function
function masterFunction(playerResponse) {
    
    gameText.lastElementChild.outerHTML = `<span class="typewriter playerResponse">${playerResponse}</span>`;

    playerResponse = playerResponse.trim().toLowerCase().split(' ');

    let action = playerResponse[0];
    playerResponse.splice(0, 1);

    let object = playerResponse.join(' ');

    if(action === 'help') {
        textGenerator(`There are four basic commands: {search}, {grab}, {ask}, and {inspect}, though there may be more. Instruct what you want to do these actions on, for example {ask lady}. To change audio, use {mute} or {unmute}.`);
    
    }else if(action === 'mute') {
        mute(object);
    
    }else if(action === 'unmute') {
        unmute(object);
    
    }else if(action === 'search') {
        search(object);
    
    }else if(action === 'grab' || action === 'collect' || action === 'take') {
        grab(object);
    
    }else if(action === 'ask' || action === 'interrogate' || action === 'investigate') {
        ask(object);

    }else if(action === 'inspect') {
        inspect(object);
    
    }else if(action === 'inventory' || action === 'backpack') {
        if(player.inventory.length === 0) {
            textGenerator('There is nothing in your inventory.');

        }else {
            textGenerator(`In your inventory: {${player.inventory.join(', ')}}. To use, type {use}.`);
        };
    }else if(action === 'use') {
        use(object);
    
    }else {
        textGenerator('That is not a command I recognize. If need be, type {help}.');
    };
};

//muting while in game
function mute(sound) {
    if(sound === 'music') {
        let musicFiles = document.getElementById('music').children;
        for(let i = 0; i < musicFiles.length; i++) {
            musicFiles[i].muted = true;
        };
        textGenerator('Music has been muted.');
    
    }else if(sound === 'sfx') {
        let sfxFiles = document.getElementById('sfx').children;
        for(let i = 0; i < sfxFiles.length; i++) {
            sfxFiles[i].muted = true;
        };
        textGenerator('Sfx have been muted.');
        
    }else {
        textGenerator(`That's not something you can mute. Make sure you're typing {music} or {sfx} along with the command.`);
    };
};

//unmute while in game
function unmute(sound) {
    if(sound === 'music') {
        let musicFiles = document.getElementById('music').children;
        for(let i = 0; i < musicFiles.length; i++) {
            musicFiles[i].muted = false;
        };
        textGenerator('Music has been unmuted.');
        
    }else if(sound === 'sfx') {
        let sfxFiles = document.getElementById('sfx').children;
        for(let i = 0; i < sfxFiles.length; i++) {
            sfxFiles[i].muted = false;
        };
        textGenerator('Sfx have been unmuted.');
        
    }else {
        textGenerator(`That's not something you can unmute. Make sure you're typing {music} or {sfx} along with the command.`);
    };
};

//list available locations
function listLocation() {
    let nearbyLocations = [];
    for(const placeName in places) {
        if(Math.abs(places[placeName].location - player.location) === 1) {
            nearbyLocations.push(placeName);
        };
    }

    return `Places nearby: {${nearbyLocations.join(', ')}}.`;

};

//list available objects
function listObjects(location) {
    if(places[location].objects.length > 0) {
        return `In this area, you see {${places[location].objects.join(', ')}}.`;

    }else {
        return '';

    };
};

const peopleList = ['vender'];

//search function, player moves to other areas if nearby
function search(place) {
    if(place.trim().length === 0) {
        textGenerator('Clarify which place you want to search.');
    
    //if inputted location doesn't exist or isn't nearby
    }else if(places.exists(place) === false || Math.abs(places[place].location - player.location) > 1) {
        textGenerator(`You look around for "${place}" but can't see it anywhere. ${listLocation()}`);
    
    }else if(place === 'house') {


    }else if(place === player.previousLocation) {
        textGenerator(`You're already in that location. ${listLocation()}`);

    }else if(place === 'market') {
        player.location = 1;
        if(player.placesVisited.includes('market') === false) {
            player.placesVisited.push('market');
            if(player.previousLocation === 'house') {
                textGenerator(`You exit the house and make your way to the market. There, you see hundreds of people buying and selling goods. As you walk along the narrow path between the vending stalls, you notice a vender selling fruit. ${listObjects('market')} ${listLocation()}`);

            }

        }else if(player.placesVisited.includes('market') === true) {
            if(player.previousLocation === 'house') {
                textGenerator(`You exit the house and make your way to the market. You see the fruit vender doing business as usual. ${listObjects('market')}`);

            }
        }
        player.previousLocation = 'market';

    }else if(place === 'park') {
        textGenerator('Still in development!');

    }
};

//grab function, player equips objects if nearby
function grab(object) {
    textGenerator('Still in development!');
};

//ask function, player asks people for clues if nearby 
function ask(person) {
    if(person.trim().length === 0) {
        textGenerator('Clarify who you want to ask.');

    }else if(peopleList.includes(person) === false || places[player.previousLocation].people !== person) {
        textGenerator(`You look around for "${person}" but can't see them anywhere.`);

    }
};

//inspect function, player inspects objects for clues if nearby
function inspect(object) {
    textGenerator('Still in development!');
}

//use function, player uses objects in inventory
function use(object) {
    textGenerator('Still in development!');
}

//objects
const player = {
    inventory: [],
    placesVisited: [],
    peopleAsked: [],
    location: 0,
    previousLocation: 'house'
};

const places = {
    house: {
        location: 0,
        objects: []
    },

    market: {
        location: 1,
        objects: [],
        people: 'vendor'
    },

    park: {
        location: -1,
        objects: []
    },

    metro: {
        location: -2,
        objects: []
    },

    exists(place) {
        if(this[place] === undefined) {
            return false;
        }else {
            return true;
        };
    },


}