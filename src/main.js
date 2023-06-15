/*
Team Members: Mansi Saini & Rebecca Zhao

=== LIGHTS ===

✅ +5 The game runs/executes without critical errors or crashes. (Graders will use Chrome, so be sure you game works in that browser.)
    - deployed on vercel and no errors that crash the game

✅ +5 The game includes a title screen, some means to view credits, some means of "completion," and the ability to restart from within the game. (These criteria are judged relative to your specific game, genre, artistic tone, etc.)
    - title screen has a bouncing effect with an emerald green background and gold to represent 
    emerald city, press c to view the credits at the title screen or end of the game. after the 
    player finishes the game, they can press r to restart the game

✅ +5 The player can learn the game's premise and controls from within the game, whether through a tutorial, instruction screen, or other diegetic means.
    - the player will realize that in the first level, they must jump from platform to platform 
    because the first platform (their safety net) will disappear after 5 seconds, so they better
    start moving. There are also directions to guide the player. In addition, in the power up, 
    the player will see the chests and learn that they need to hit one of them, which will 
    reveal their power up. The power up then has directions accordingly that will help them 
    for the boss level, defeating the witches. In the boss level, there are clear direcions 
    that tell the player to destroy the witches.

✅ +5 The game is playable to completion by a player of moderate skill. If your game is purposefully difficult and you're concerned that the grader won't be able to evaluate it properly, please provide a "grader mode" or debug menu that will allow us to see everything you've made, along with instructions for how to access that mode.
    - should be. We playtested the game a lot to make sure we fit this section because 
    everyone has a different level

✅ +5 Your project and code are well-structured and organized, including legible comments, appropriate data structures, sensible prefabs, meaningful variable names, logical scene structures, etc. (Nathan's examples are a good baseline.)
    - should be. at our code check, our TA mentioned that our code was well commented and organized

✅ +5 Your project has a well-maintained and updated GitHub page that shows meaningful contributions, commits, and milestones throughout the course of the project's history.
    - believe me, plentyyyy of commits - and plentttyyy of merge conflicts (don't worry they are resolved now)

=== CAMERA ===

✅ +10 Your game uses at least five of Phaser's major components (besides Scenes), which may include: physics systems, cameras, particle effects, text objects, the animation manager, the tween manager, timers, tilemaps, pipeline FX, etc. (Please list these components in your main.js file.)
    - Physics Systems: players dynamics - running, jumping, collision detection with chests and enemies, collision detection with tilemap, collision detection for player, etc
    - Text Objects: bouncing text in title screen, directions, credits, fading text
    - Animation: witch walking, witch flying, monkey flying, player running, etc
    - Tween Manager: Fading text in the tornado level
    - Timers: timer before safety platform falls, timer to move from tornado to power up level, timer for power ups falling, etc
    - Tilemaps: all the terrains and backgrounds in the game

✅ +10 Your game has artistic cohesion, i.e. the art, sound, typography, etc. reflect your adaptation's aesthetic goals, your game is legible as a film adaptation, and your assets make sense together.
    - Yes, they all follow a pixel art cute, bright theme; fonts reflect that with the bounce and cute fonts and colors

✅ +10 Your game has mechanical cohesion, i.e. the mechanics reflect your adaptation's technical goals, the game controls and performs as expected, and the mechanics are well-implemented.
    - Yes, the player's running, jumping, and witch dynamics all follow the same transitions of mechnical movement.

=== ACTION ===

✅ +5 Your game has that extra bit of polish, creativity, technical prowess, and/or originality that helps it stand out from other games. We use this criteria as a grade "tilt" to reward games that we really enjoyed, that are bold and inventive, that adapt their film thoughtfully, that demonstrate strong technical skills, and/or went beyond the stated objectives of the assignment. Feel free to add a comment to your main.js/Canvas submission if you wish to point out any features that we might miss.
    - hidden easter egg tornado that only happens if you are good enough in the first level with the jumping platforms


*/

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
            },
            tileBias: 30 //helps with tilemap collision
        }
    },

    scene: [Title, Credits, Controls, Tornado, PowerUp, BossBattle, GameOver, Play],
}

let game = new Phaser.Game(config) // create phaser game

// define the keys
let KeyF, keyR, keyLEFT, keyRIGHT, keyUP;

// define w,a,s,d keys
let keyW, keyA, keyS, keyD;

// define credits key
let keyC; 

let introMusic;

let hasPowerUp;
