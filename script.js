//variables
let char = 0;
let timer;
let giveInput = true;
let inputPlaceholder = true;
let typeSpeed = 40;
let gameText = document.createElement('div');
gameText.id = 'gameText';

const player = {
    _location: 'house',
    _stamina: 10,
    _visited: ['house'],
    _asked: [],
    _inventory: [],

    //getters and setters
    get location () {
        if(typeof this._location === 'string') {
            return this._location;
        };
        console.log('Error: player.location is an unexpected value');
    },

    set location (val) {
        if(typeof val === 'string') {
            this._location = val;
        }else {
            console.log('Error: player.location must be a string');
        };
    },

    get visited () {
        if(Array.isArray(this._visited)) {
            return this._visited;
        };
        console.log('Error: player.visited is an unexpected value');
    },

    set visited (val) {
        if(typeof val === 'string') {
            this.visited.push(val);
        }else {
            console.log('Error: player.visited contains string only');
        };
    },

    get asked () {
        if(Array.isArray(this._asked)) {
            return this._asked;
        };
        console.log('Error: player.asked is an unexpected value');
    },

    set asked (val) {
        if(typeof val === 'string') {
            this.asked.push(val);
        }else {
            console.log('Error: player.asked contains string only');
        };
    },

    get inv () {
        if(Array.isArray(this._inventory)) {
            return this._inventory;
        };
        console.log('Error: player.inv is an unexpected value');
    },

    get invList () {
        return this.inv.join(', ');
    },

    set inv (val) {
        if(typeof val === 'string') {
            this.inv.push(val);
        }else {
            console.log('Error: player.inv contains string only');
        };
    },

    useStamina (place) {
        let distance = map.calcDist(map.places[player.location].id - map.places[place].id);
        this.stamina -= Math.round(Math.random() * ((distance+1) - (distance-1)) + (distance-1));
    }

};

//location class
class Place {
    constructor(id, objects, people) {
        this._id = id;
        this._objects = objects;
        this._people = people;
    };

    get id () {
        if(typeof this._id === 'number') {
            return this._id;
        };
        console.log('Error: id is an unexpected value');
    };

    get objects () {
        if(Array.isArray(this._objects)) {
            return this._objects;
        };
        console.log('Error: objects is an unexpected value');
    };

    get people () {
        if(Array.isArray(this._people)) {
            return this._people;
        };
        console.log('Error: people is an unexpected value');
    };

    hasObj (obj) {
        return this.objects.includes(obj);
    };

    hasGuy (guy) {
        return this.people.includes(guy);
    };
};

class Person {
    constructor(type, name, mood) {
        this._type = type;
        this._name = name;
        this._mood = mood;
    };

    get type () {
        if(typeof this._type === 'string') {
            return this._type;
        };
        console.log('Error: type is an unexpected value');
    };

    get name () {
        if(typeof this._name === 'string') {
            return this._name;
        };
        console.log('Error: name is an unexpected value');
    };

    get mood () {
        if(typeof this._mood === 'number') {
            return this._mood;
        };
        console.log('Error: mood is an unexpected value');
    };

    changeMood (amount) {
        this.mood += amount;
    };
};

const map = {
    places: {
        house: new Place(0, ['note'], []),
        market: new Place(1, [], [new Person('cabbage man', 'Diego', 7)]),
        park: new Place(-1, [], [new Person('old man', 'Bilal', 5)]),
    },

    calcDist (place1, place2) {
        return Math.abs(place1 - place2);
    },

    get nearby () {
        let locations = [];
        for(let place in this.places) {
            if(this.calcDist(this.places[player.location].id, this.places[place].id) === 1) {
                locations.push(place);
            };
        };
        return locations;
    },

    //consider keeping some places a secret
};

//menu popup functions
function openWindow(windowName) {
    document.getElementById(windowName).style.display = 'flex';
};

function exitWindow(windowName) {
    document.getElementById(windowName).style.display = 'none';
};

//settings
function settings() {
    let musicFiles = document.getElementById('music').children;
    let sfxFiles = document.getElementById('sfx').children;
    let userSpeed = document.getElementById('typeSpeed');

    //for music
    if (document.getElementById('musicSelect').value === 'off') {
        [...musicFiles].forEach(file => file.muted = true);

    } else {
        [...musicFiles].forEach(file => file.muted = false);
    };
    //for sound effects
    if (document.getElementById('sfxSelect').value === 'off') {
        [...sfxFiles].forEach(file => file.muted = true);

    } else {
        [...sfxFiles].forEach(file => file.muted = false);
    };
    //for type speed
    if (!userSpeed.value) {
        userSpeed.value = 40;

    }else if(userSpeed.value < userSpeed.getAttribute('min')) {
        userSpeed.value = userSpeed.getAttribute('min');
        typeSpeed = parseInt(userSpeed.getAttribute('min'));

    }else if(userSpeed.value > userSpeed.getAttribute('max')) {
        userSpeed.value = userSpeed.getAttribute('max');
        typeSpeed = parseInt(userSpeed.getAttribute('max'));

    }else {
        typeSpeed = parseInt(userSpeed.value);
    };
};

//button hover sound effect
[...document.querySelectorAll('button')].forEach(button => button.onmouseover = buttonBeep);

function buttonBeep() {
    document.getElementById('buttonBeep').play();
    if(!document.getElementById('bg-music').paused) {
        return;
    };
    document.getElementById('bg-music').play();
};

//frustrating but for chrome, autoplay doesn't work, so gotta play the music somehow
function buttonClick() {
    if(!document.getElementById('bg-music').paused) {
        return;
    };

    document.getElementById('bg-music').play();
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
    textGenerator(`You groan in defiance and hit snooze on your alarm. Pupper will probably wake you up anyway. But as you lie there, something feels off. Confused, you get up and step out into the hallway. The house is unusually quiet. "Pupper?" you call out. "O Pupper! Where art thou Pupper?" But there's no response. Then you see it: lying by the front door is Pupper's favorite toy along with his collar. Next to it is your mama's favorite vase, smashed into pieces! Someone must've kidnapped Pupper! You need to find him and make whoever did this pay.`);
};

//text generator takes string parameter, splits into individual characters
function textGenerator(string) {
    let div = document.createElement('div');
    gameText.appendChild(div);

    let stringArray = string.split('');
    let numOfHighlights = 0;

    stringArray.forEach(elem => {
        if(elem === '{') {
            numOfHighlights++;
        };

        let span = document.createElement('span');
        span.innerHTML = elem;

        div.appendChild(span);
    });

    //highlights text if important to player's knowledge
    function highlighter() {
        if(numOfHighlights === 0) {
            return;
        };

        let spanArray = gameText.lastElementChild.children;
        let highlightStart = [...spanArray].findIndex(elem => elem.innerHTML === '{');
        let highlightEnd = [...spanArray].findIndex(elem => elem.innerHTML === '}');
    
        for(let i = highlightStart; i < highlightEnd; i++) {
            spanArray[i].classList.add('highlighter');
        };
    
        spanArray[highlightEnd].remove();
        spanArray[highlightStart].remove();
            
        numOfHighlights--;
        
        highlighter();
    };

    if(numOfHighlights > 0) {
        highlighter();
    }

    document.getElementById('typingSound').play();
    timer = setInterval(onTick, typeSpeed);
    window.scrollTo(0, gameText.scrollHeight);
};

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
    };

    clearInterval(timer);
    let array = gameText.lastElementChild.children;
    while(char < array.length) {
        array[char].classList.add('typewriter');
        char++;
    };
    onTick();
});

//generates input for player
function inputGenerator() {
    gameText.innerHTML += `<span class="typewriter">&gt;</span> <input type="text">`;
    let input = gameText.lastElementChild;

    if(inputPlaceholder === true) {
        input.setAttribute('placeholder', 'Type here');
        inputPlaceholder = false;
    };

    input.setAttribute('maxlength', '30');
    input.focus();

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
    
    let action = playerResponse.shift();

    let object = playerResponse.join(' ');

    if(action === 'help') {
        textGenerator(`There are four basic commands: {search}, {grab}, {ask}, and {inspect}, though there may be more. Instruct what you want to do these actions on, for example {ask lady}. To change audio, use {mute} or {unmute}.`);
    
    }else if(action === 'mute') {
        mute(object);
    
    }else if(action === 'unmute') {
        unmute(object);
    
    }else if(action === 'search' || action === 'investigate') {
        search(object);
    
    }else if(action === 'grab' || action === 'collect' || action === 'take') {
        grab(object);
    
    }else if(action === 'ask' || action === 'interrogate' || action === 'investigate') {
        ask(object);

    }else if(action === 'inspect') {
        inspect(object);
    
    }else if(action === 'inventory' || action === 'backpack') {
        textGenerator('Undergoing construction');

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
        [...musicFiles].forEach(file => file.muted = true);
        textGenerator('Music has been muted.');
    
    }else if(sound === 'sfx') {
        let sfxFiles = document.getElementById('sfx').children;
        [...sfxFiles].forEach(file => file.muted = true);
        textGenerator('Sfx have been muted.');
        
    }else {
        textGenerator(`That's not something you can mute. Make sure you're typing {music} or {sfx} along with the command.`);
    };
};

//unmute while in game
function unmute(sound) {
    if(sound === 'music') {
        let musicFiles = document.getElementById('music').children;
        [...musicFiles].forEach(file => file.muted = false);
        textGenerator('Music has been unmuted.');
        
    }else if(sound === 'sfx') {
        let sfxFiles = document.getElementById('sfx').children;
        [...sfxFiles].forEach(file => file.muted = false);
        textGenerator('Sfx have been unmuted.');
        
    }else {
        textGenerator(`That's not something you can unmute. Make sure you're typing {music} or {sfx} along with the command.`);
    };
};


//search function, player moves to other areas if nearby
function search(place) {
    if(place.trim().length === 0) {
        textGenerator('Clarify which place you want to search.');
    
    }else {
        textGenerator('In development');
    };
};

//grab function, player equips objects if nearby
function grab(object) {
    textGenerator('Still in development!');
};

//ask function, player asks people for clues if nearby 
function ask(person) {
    if(person.trim().length === 0) {
        textGenerator('Clarify who you want to ask.');

    }else {
        textGenerator('Still in development!');
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