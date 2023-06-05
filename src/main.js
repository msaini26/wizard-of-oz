'use strict'

let cursors;
const brickWidth = 193;
const brickHeight = 23;

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },

    scene: [Tornado, PowerUp,Play],
}

let game = new Phaser.Game(config) // create phaser game

// define the keys
let KeyF, keyR, KeyLEFT, keyRIGHT, keyUP;

// border UI size
// let borderUISize = game.config.height / 15; //set UI height
// let borderPadding = borderUISize / 3; // set padding around the game frame