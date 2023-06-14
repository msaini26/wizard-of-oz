class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    preload(){
        // load background image
        this.load.image('title_background', './assets/background/2.png');

        // load background music
        this.load.audio('background_music', './assets/audio/wizard.mp3');
    }

    create(){

        // background music configurations
        let musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            loop: true,
            delay: 0,
        }

        // create sound instance
        this.music = this.sound.add('background_music', musicConfig);
        this.music.play(musicConfig); // play music with config settings


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
            // wordWrap: {
            //     width: 700
            // },
        }

        //setting play text configuration
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


        //adding text for title
        this.title_text = this.add.text(game.config.width/2, 100, 'Adventures in Oz', titleConfig).setOrigin(0.5);
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
        this.begin = this.add.text(game.config.width/2, game.config.height - 100, 'PLAY', beginConfig).setOrigin(0.5);
        this.begin.setInteractive(); //set interactive so mouse click works

        //boolean to keep track that sound effect plays once
        this.clicked = false;
        
        this.tweens.add({
            targets: this.title_text,
            y: 200,
            ease: 'Bounce.easeOut',
            duration: 2000,
            repeat: -1,
        });

        // this.tweens.add({
        //     targets: this.click_play,
        //     alpha: { from: 1, to: 0.5 },
        //     ease: 'Sine.InOut',
        //     duration: 500,
        //     repeat: -1,
        //     // yoyo: true
        //   });

    }

    update(){


        // if mouse is hovering over text
        this.begin.on('pointerover', function (pointer) {
            this.begin.setTint(0xeb7805); //set tint to text

            // squish text
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
            //if sound effect hasn't played yet
            if(!this.clicked){
                // this.sound.play('chimes'); //play sound
                this.clicked = true; //set clicked to true
            }

            //move to next scene
            this.scene.start('tornadoScene');

        });
    }
}