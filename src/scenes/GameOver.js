class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }
    
    preload(){

        // background tilemap
        this.load.image('terrainImage', 'terrain/Terrain.png');
        this.load.image('purpleImage', 'tilemaps/Purple.png');
        this.load.tilemapTiledJSON('battleJSON', 'tilemaps/BattleField.json');

        // select key
        this.load.audio('sfx_select', './assets/audio/select.mp3');

    }

    create(){

         // define credits key
         keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);


        //creating tilemap
        const map = this.add.tilemap('battleJSON');

        //adding tileset images
        const backgroundTileSet = map.addTilesetImage('Purple', 'purpleImage');

        //creating layers
        const bgLayer = map.createLayer('Background', backgroundTileSet, 0, 0);


        //title text configuration
        let titleConfig = {
            fontFamily: 'ka1',
            fontSize: '45px',
            fontStyle: 'bold',
            color: '#7a5f46',
            // align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        if(hasWon){
            this.add.text(game.config.width/2, game.config.height/2, 'You Won!', titleConfig).setOrigin(0.5);
        } else {
            this.add.text(game.config.width/2, game.config.height/2, 'game over', titleConfig).setOrigin(0.5);
        }

        // this.add.text(game.config.width/2, game.config.height/2, 'game over', titleConfig).setOrigin(0.5);
        titleConfig.fontFamily = 'joystix';
        this.add.text(game.config.width/2, game.config.height/3, 'There is no place like home...', titleConfig).setOrigin(0.5).setScale(0.5);


         //setting play text configuration
         let subConfig = {
            fontFamily: 'joystix',
            fontSize: '30px',
            fontStyle: 'italic',
            color: '#070f59',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        // name credits
        // var name_credits = this.add.text(game.config.width/2, game.config.height - 30, 'By: Mansi Saini & Rebecca Zhao', subConfig).setOrigin(0.5);
        // this.credits = this.add.text(20, 40, 'Press (C) for Credits', subConfig);


        // play again
        this.playAgain = this.add.text(game.config.width/2, game.config.height - 100, 'Press (R) to Restart', subConfig).setOrigin(0.5);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);    }

    update(){
        // credits scene
        // if (Phaser.Input.Keyboard.JustDown(keyC)) {
        //     this.sound.play('sfx_select'); // play selector sound
        //     this.scene.start('creditsScene'); // begin first level
        // }

        // restart the game
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select'); // play selector sound
            this.scene.start('tornadoScene'); // begin first level
        }
    }
}