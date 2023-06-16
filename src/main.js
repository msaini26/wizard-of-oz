/*
Team Members: Mansi Saini & Rebecca Zhao

*****note*****
- you may need to click to another tab and then click back to the game tab for the jump key to process (I don't know how to fix this)


=== LIGHTS ===

✅ +5 The game runs/executes without critical errors or crashes. (Graders will use Chrome, so be sure you game works in that browser.)
    - deployed on vercel and no errors that crash the game

✅ +5 The game includes a title screen, some means to view credits, some means of "completion," and the ability to restart from within the game. (These criteria are judged relative to your specific game, genre, artistic tone, etc.)
    - title screen has a bouncing effect with an emerald green background and gold to represent 
    emerald city, press c to view the credits at the title screen. after the 
    player finishes the game, they can press r to restart the game

✅ +5 The player can learn the game's premise and controls from within the game, whether through a tutorial, instruction screen, or other diegetic means.
    - We included a controls/rules page that shows up after the player clicks play on the title screen. 
    It explains what controls the player will use throughout the game and also tell the player what to do
    for the first scene/level. Once the player moves to other levels, there will be dailogue that guides the
    player in what they should do.

✅ +5 The game is playable to completion by a player of moderate skill. If your game is purposefully difficult and you're concerned that the grader won't be able to evaluate it properly, please provide a "grader mode" or debug menu that will allow us to see everything you've made, along with instructions for how to access that mode.
    - The game should be playable as we both playtested along with some other people. The player must go through
    all three levels no matter what so there isn't a way to ever escape the tornado in the first scene. 

✅ +5 Your project and code are well-structured and organized, including legible comments, appropriate data structures, sensible prefabs, meaningful variable names, logical scene structures, etc. (Nathan's examples are a good baseline.)
    - Our code is commented and explains what each part does.

✅ +5 Your project has a well-maintained and updated GitHub page that shows meaningful contributions, commits, and milestones throughout the course of the project's history.
    - several commits with messages of each finished part. We both contributed equal amounts.

=== CAMERA ===

✅ +10 Your game uses at least five of Phaser's major components (besides Scenes), which may include: physics systems, cameras, particle effects, text objects, the animation manager, the tween manager, timers, tilemaps, pipeline FX, etc. (Please list these components in your main.js file.)
    - Physics Systems: players dynamics - running, jumping, collision detection with chests and enemies, collision detection with tilemap, collision detection for player, etc
    - Text Objects: bouncing text in title screen, directions, credits, fading text
    - Animation: witch walking, witch flying, player running, chest characters, chests, etc
    - Tween Manager: title screen text utilizes tweens (play button and title)
    - Tilemaps: terrain and backgrounds for second and third scene (powerup and battle)
    - Timers: timer before safety platform falls, timer to move from tornado to power up level, timer for power ups falling, etc

✅ +10 Your game has artistic cohesion, i.e. the art, sound, typography, etc. reflect your adaptation's aesthetic goals, your game is legible as a film adaptation, and your assets make sense together.
    - Yes, they all follow a pixel art cute, bright theme; fonts reflect that with the bounce and cute fonts and colors
    - each scene follows the movie in correspondance to beginning, middle, end
    - tornado scene: when dorothy is sucked up into the tornado and brought to land of oz
    - powerup scene: when dorothy meets all her friends (lion, scarecrow, tincan) along the way to find the wizard of oz
    - battle scene: when dorothy tries to defeat the wicked witch

✅ +10 Your game has mechanical cohesion, i.e. the mechanics reflect your adaptation's technical goals, the game controls and performs as expected, and the mechanics are well-implemented.
    - Yes, the player's running, jumping, and witch dynamics all follow the same transitions of mechnical movement.
    - Game controls are also cohesive. Buttons are all in same styled text/font and utilize click to move on. Other keys specify which keys to press.

=== ACTION ===

✅ +5 Your game has that extra bit of polish, creativity, technical prowess, and/or originality that helps it stand out from other games. We use this criteria as a grade "tilt" to reward games that we really enjoyed, that are bold and inventive, that adapt their film thoughtfully, that demonstrate strong technical skills, and/or went beyond the stated objectives of the assignment. Feel free to add a comment to your main.js/Canvas submission if you wish to point out any features that we might miss.
    - tornado that slides across the first scene whenever the player dies or reaches 30 seconds. this is to emulate dorothy being 
    sucked into the tornado and brought to the land of oz. 
    - the chests and characters in the powerup/second scene. We randomized the characters that would pop up based on which chests
    the player hits and made the character do a fun little animation when the chest opens. The powerups also fall from the sky in 
    random locations that the player would then have to try and collect. Each item also corresponds to what the character said as 
    their flaw in the movie. For instance, the scarecrow has no brain so the item the player collects are brains.
    - the witches following the player in the battle scene. The witches chase after the player until the player kills them. Once
    the witch is hit, it melts into a puddle which correlates to how the wicked witch melts in the movie.


*/

'use strict'

let cursors;
const brickWidth = 193; //for platforms in first scene
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
            // debug: true,
            gravity: {
                x: 0,
                y: 0
            },
            tileBias: 30 //helps with tilemap collision
        }
    },

    scene: [Title, Credits, Controls, Tornado, PowerUp, BossBattle, GameOver],
}

let game = new Phaser.Game(config) // create phaser game

// define the keys
let KeyF, keyR, keyLEFT, keyRIGHT, keyUP;

// define credits key
let keyC; 

let introMusic;

let hasPowerUp;

let hasWon;
