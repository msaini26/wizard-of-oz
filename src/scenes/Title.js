class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    preload(){
        // load background image
        this.load.image('title_background', './assets/background/2.png');

        // load background music
        this.load.audio('background_music', './assets/audio/wizard.mp3');

        // select key
        this.load.audio('sfx_select', './assets/audio/select.mp3');

        //other level music
        this.load.audio('tornado_music', './assets/audio/cinematic.mp3');
        this.load.audio('powerup_music', './assets/audio/adventure.mp3');
        this.load.audio('battle_music', './assets/audio/risk.mp3');

        //other sound effects
        this.load.audio('chimes', './assets/audio/chimes.mp3');
        this.load.audio('collect', './assets/audio/collect.mp3');
        this.load.audio('lose', './assets/audio/lose.mp3');
        this.load.audio('win', './assets/audio/win.mp3');
        this.load.audio('wind', './assets/audio/wind.mp3');
        this.load.audio('pop', './assets/audio/pop.mp3');


    }

    create(){
        // define credits key
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);


        // background music configurations
        let musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            loop: true,
            delay: 0,
        }

        // create sound instance
        introMusic = this.sound.add('background_music', musicConfig);
        introMusic.play(musicConfig); // play music with config settings


        // place title background
        this.background = this.add.tileSprite(0, 0, 800, 600, 'title_background').setOrigin(0, 0); // place background tile sprite

        //setting title configurations
        let titleConfig = {
            fontFamily: 'adventure',
            fontSize: '150px',
            color: 'white',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
       
        //sub text configuration
        let subConfig = {
            fontFamily: 'joystix',
            fontSize: '30px',
            fontStyle: 'italic',
            color: 'white',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        //adding in created by text
        var name_credits = this.add.text(game.config.width/2, game.config.height - 30, 'By: Mansi Saini & Rebecca Zhao', subConfig).setOrigin(0.5);
       
        //adding in text to see credits
        subConfig.color = '#ad9165';
        this.credits = this.add.text(5, 10, 'Press (C) for Credits', subConfig);

        //adding text for title
        this.title_text = this.add.text(game.config.width/2, 100, 'Adventures in Oz', titleConfig).setOrigin(0.5);

        //instruction text on how to start
        this.click_play = this.add.text(game.config.width/2, 350, 'Click play to continue', subConfig).setOrigin(0.5);
        this.click_play.setInteractive();
        
        //setting play text configuration
        let beginConfig = {
            fontFamily: 'ka1',
            fontSize: '60px',
            color: '#ffbf0f',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        //adding play text
        this.begin = this.add.text(game.config.width/2, game.config.height - 150, 'PLAY', beginConfig).setOrigin(0.5);
        this.begin.setInteractive(); //set interactive so mouse click works

        //boolean to keep track that sound effect plays once and is clicked once
        this.clicked = false;
        
        //adding tweens for title
        this.tweens.add({
            targets: this.title_text,
            y: 200,
            ease: 'Bounce.easeOut',
            duration: 2000,
            repeat: -1,
        });

    }

    update(){
        // credits scene
        if (Phaser.Input.Keyboard.JustDown(keyC)) {
            this.sound.play('sfx_select'); // play selector sound
            this.scene.start('creditsScene'); // begin first level
        }

        // if mouse is hovering over text
        this.begin.on('pointerover', function (pointer) {
            this.begin.setTint(0xeb7805); //set tint to text

            // tweens to squish play text
            this.tweens.add({
              targets: this.begin,
              scaleX: '-=.2',
              scaleY: '-=.2',
              duration: 300,
              ease: 'Power2'
            }, this);
        
         }, this);

         // if mouse is not hovering over text
         this.begin.on('pointerout', function (pointer) {
      
            this.begin.clearTint(); //clear tint and revert to original
            
            //tweens to enlarge play text
            this.tweens.add({
              targets: this.begin,
              scaleX: '+=.2',
              scaleY: '+=.2',
              duration: 400,
              ease: 'Power2'
            }, this);
        
         }, this);
        
        //if mouse clicks on text
        this.begin.on('pointerdown', () => {
            //if sound effect hasn't played yet and hasn't been clicked
            if(!this.clicked){
                this.sound.play('sfx_select'); // play selector sound
                this.clicked = true; //set clicked to true
            }

            // this.scene.stop('titleScene'); //stop title scene

            //move to next scene
            this.scene.start('controlsScene');

        });
    }
}