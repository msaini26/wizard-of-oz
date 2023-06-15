class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/audio/select.mp3');

        // title screen background
        this.load.image('credits_background', './assets/Background/2.png');
    }

    create() {

        this.credit_background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'credits_background').setScale(1.75).setOrigin(0, 0);

        let titleConfig = {
            fontFamily: 'joystix', // set font
            fontSize: '50px',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            }
        };

         // show menu text
         var title = this.add.text(game.config.width/2, 100, 'Credits', titleConfig).setOrigin(0.5);
         title.setShadow(4, 4, '#424130');

         let subConfig = {
            fontFamily: 'joystix',
            fontSize: '20px',
            color: 'white',
            align: 'center',
            // wordWrap: { 
            //     width: 500
            // },
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            }
        };

        let subTitle = {
            fontFamily: 'joystix',
            fontSize: '20px',
            color: 'white',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            }
        };

        const TITLE_X = 60;
        const TEXT_X = 200;

         
        this.add.text(TITLE_X, 150, 'Music:', subTitle);
        this.add.text(TEXT_X, 150, 'Life of a Wandering Wizard', subConfig);
        this.add.text(TEXT_X, 175, 'by SergeQuadrado: Pixabay', subConfig);

        this.add.text(TITLE_X, 225, 'Tileset:', subTitle);
        this.add.text(TEXT_X, 225, 'https://pixelfrog-assets.itch-', subConfig);
        this.add.text(TEXT_X, 250, '.io/pixel-adventure-1', subConfig);

        this.add.text(TITLE_X, 300, 'Artwork:', subTitle);
        this.add.text(TEXT_X, 300, '2D Pixel Art Witch Sprites', subConfig);
        this.add.text(TEXT_X, 325, 'by Elthen: Itchio', subConfig);

        this.add.text(TITLE_X, 375, 'Physics:', subTitle);
        this.add.text(TEXT_X, 375, 'Mansi & Rebecca', subConfig);

        this.add.text(TITLE_X, 425, 'Coding:', subTitle);
        this.add.text(TEXT_X, 425, 'Mansi & Rebecca', subConfig);
        
        this.add.text(TITLE_X, 475, 'Fonts:', subTitle);
        this.add.text(TEXT_X, 475, 'Joystix by Raymond Larabie: Dafont', subConfig);

        this.add.text(TITLE_X, 525, 'Player:', subTitle);
        this.add.text(TEXT_X, 525, 'https://legnops.itch.io/-', subConfig);
        this.add.text(TEXT_X, 550, 'red-hood-character', subConfig);

        subConfig.color = '#FFFFFF';
        this.back = this.add.text(30, 30, 'Press ← to go Back', subConfig);
        this.back.setShadow(3, 3, '#424130');

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select'); // play selector sound
            this.scene.stop('creditsScene');
            this.scene.start('titleScene'); // begin first level
            introMusic.stop();
        }
    }
}