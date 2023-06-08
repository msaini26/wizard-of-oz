class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    preload(){

    }

    create(){
        //setting title configurations
        let titleConfig = {
            fontFamily: 'ka1',
            fontSize: '60px',
            color: '#b5b5b5',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            // wordWrap: {
            //     width: 700
            // },
        }

        //adding text for title
        var text = this.add.text(game.config.width/2, 150, 'The Wizard of Oz', titleConfig).setOrigin(0.5);

        //setting play text configuration
        let beginConfig = {
            fontFamily: 'joystix',
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
    }

    update(){
        //if mouse is hovering text
        this.begin.on('pointerover', () => {
            this.begin.setTint(0xeb7805); //set tint to text
        });
        
        //if mouse is not hovering text
        this.begin.on('pointerout', () => {
            this.begin.clearTint(); //clear tint and revert to original
        });
        
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