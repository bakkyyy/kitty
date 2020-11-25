// PIXI.utils.sayHello();
let app = new PIXI.Application({
    width: window.screen.width,
    height: window.screen.height,
    antialias: true,
    transparent: true,
    resolution: 1,
    view: document.getElementById("canvas")
});
const catFrames = [
    "assets/move/move-one.png",
    "assets/move/move-two.png",

    // ...
];

PIXI.loader
    .add("my-little-cat.png").add(catFrames)
    .load(setup);

let cat, state;



function setup() {
    let resources = PIXI.loader.resources;
    //cat = new PIXI.Sprite(PIXI.loader.resources["my-little-cat.png"].texture);
    cat = new PIXI.AnimatedSprite.fromFrames(catFrames);

    cat.animationSpeed = 0.1;

    app.stage.addChild(cat);

    cat.position.x = 500;
    cat.position.y = 300;

    cat.height = 100;
    cat.width = 60;

    cat.vx = 0;
    cat.vy = 0;

    cat.anchor.x = 0.5;
    cat.anchor.y = 0.5;

    catSpeed = 4;

    let left = keyboard("ArrowLeft"),

        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown");

    left.press = () => {
        cat.vx = -catSpeed;
        cat.rotation = -1.5708;
        cat.play();
    };

    left.release = () => {
        if (!right.isDown) {
            cat.vx = 0;
        }
    };


    //Up
    up.press = () => {
        cat.vy = -catSpeed;
        cat.rotation = 0;
        cat.play();
    };
    up.release = () => {
        if (!down.isDown) {
            cat.vy = 0;
        }
    };

    //Right
    right.press = () => {
        cat.vx = catSpeed;
        cat.rotation = 1.5708;
        cat.play();
    };
    right.release = () => {
        if (!left.isDown) {
            cat.vx = 0;
        }
    };
    //Down
    down.press = () => {
        cat.vy = catSpeed;
        cat.rotation = 3.14159;
        cat.play();
    };
    down.release = () => {
        if (!up.isDown) {
            cat.vy = 0;

        }
    };

    app.stage.addChild(cat)
    //Set the game state
    state = play;

    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));
}

document.addEventListener('keydown', function(event) {
    if (event.keydown) {
        cat.stop()
    }
});

function gameLoop(delta) {

    //Update the current game state:

    state(delta);
}

function play(delta) {

    //Use the cat's velocity to make it move
    cat.x += cat.vx;
    cat.y += cat.vy
}


function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}