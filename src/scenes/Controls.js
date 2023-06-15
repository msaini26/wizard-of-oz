class Controls extends Phaser.Scene {
    constructor() {
        super("controlsScene");
    }

    preload(){
        //loading controls background
        this.load.image('controls_background', './assets/background/Gray.png');
    }

    create(){
        // display controls background image
        this.controls_background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'controls_background').setScale(2).setOrigin(0, 0); // place background tile sprite


        //setting play text configuration
        let titleConfig = {
            fontFamily: 'ka1',
            fontSize: '50px',
            color: '#1a3157',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        //adding title text
        this.add.text(game.config.width/2, 75, 'Rules', titleConfig).setOrigin(0.5);

        //sub text configuration
        let subConfig = {
            fontFamily: 'joystix',
            fontSize: '20px',
            color: '#063175',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

         //text configuration
         let textConfig = {
            fontFamily: 'joystix',
            fontSize: '20px',
            color: '#4671b8',
            align: 'left',
            wordWrap: { 
                width: game.config.width - 200
            },
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        //text for controls of game
        this.add.text(50, 150, 'Controls:', subConfig);
        this.add.text(210, 150, 'Use LEFT and RIGHT arrow keys to move. UP arrow to jump (you can jump up to 3 times in a row).', textConfig);

        //text for goals
        this.add.text(110, 250, 'Goal:', subConfig);
        this.add.text(210, 250, 'Travel through the Land of Oz and defeat the Evil Witch through 3 levels.', textConfig);

        //text for guidance on first level and what you are playing as
        this.add.text(50, 350, 'Before you begin:', subConfig);
        textConfig.wordWrap = { width: game.config.width - 150 };
        this.add.text(100, 375, 'You are playing as Dorothy who lives in Kansas. All of a sudden, a tornado occurs!', textConfig);

        textConfig.color = '#de3731';
        this.add.text(100, 450, 'Try and escape the tornado by jumping on different platforms and last for at least 30 seconds.', textConfig);
        
        //adding button to click on to play
        titleConfig.color = '#8756cc';
        titleConfig.fontSize = '40px';
        this.begin = this.add.text(game.config.width - 100, game.config.height - 40, 'PLAY', titleConfig).setOrigin(0.5);
        this.begin.setInteractive(); //set interactive so mouse click works

        //boolean to keep track that sound effect plays once and button clicked once
        this.clicked = false;
    }

    update(){
        //if mouse is hovering text
        this.begin.on('pointerover', () => {
            this.begin.setTint(0x380d75); //set tint to text
        });
        
        //if mouse is not hovering text
        this.begin.on('pointerout', () => {
            this.begin.clearTint(); //clear tint and revert to original
        });
        
        //if mouse clicks on text
        this.begin.on('pointerdown', () => {
            //if sound effect hasn't played yet
            if(!this.clicked){
                this.sound.play('sfx_select'); // play selector sound
                this.clicked = true; //set clicked to true
            }
            introMusic.stop(); //stop playing music

            //move to next scene
            this.scene.start('tornadoScene');

        });
    }
}