class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/audio/select.mp3');

        // title screen background
        this.load.image('background', './assets/Background/2.png');
    }

    create() {

        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setScale(1.75).setOrigin(0, 0);

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

         
        this.add.text(TITLE_X, 180, 'Music:', subTitle);
        this.add.text(TEXT_X, 180, 'Life of a Wandering Wizard', subConfig);
        this.add.text(TEXT_X, 200, 'by SergeQuadrado: Pixabay', subConfig);

        this.add.text(TITLE_X, 250, 'Tileset:', subTitle);
        this.add.text(TEXT_X, 250, 'INSERT HERE', subConfig);

        this.add.text(TITLE_X, 300, 'Artwork:', subTitle);
        this.add.text(TEXT_X, 300, '2D Pixel Art Witch Sprites', subConfig);
        this.add.text(TEXT_X, 320, 'by Elthen: Itchio', subConfig);

        this.add.text(TITLE_X, 350, 'Physics:', subTitle);
        this.add.text(TEXT_X, 350, 'Mansi & Rebecca', subConfig);

        this.add.text(TITLE_X, 400, 'Coding:', subTitle);
        this.add.text(TEXT_X, 400, 'Mansi & Rebecca', subConfig);
        
        this.add.text(TITLE_X, 450, 'Fonts:', subTitle);
        this.add.text(TEXT_X, 450, 'Joystix by Raymond Larabie: Dafont', subConfig);

        subConfig.color = '#FFFFFF';
        this.back = this.add.text(30, 30, 'Press ← to go Back', subConfig);
        this.back.setShadow(3, 3, '#424130');

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select'); // play selector sound
            this.scene.start('titleScene'); // begin first level
        }
    }
}