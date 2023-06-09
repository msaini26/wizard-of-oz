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

    scene: [Title, Tornado, PowerUp, BossBattle, GameOver, Play],
}

let game = new Phaser.Game(config) // create phaser game

// define the keys
let KeyF, keyR, KeyLEFT, keyRIGHT, keyUP;
