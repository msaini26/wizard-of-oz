class Controls extends Phaser.Scene {
    constructor() {
        super("controlsScene");
    }

    preload(){
        this.load.image('background', './assets/background/Gray.png');
    }

    create(){
        // display title image
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setScale(2).setOrigin(0, 0); // place background tile sprite


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
        this.add.text(game.config.width/2, 75, 'Rules', titleConfig).setOrigin(0.5);

         //title text configuration
         let textConfig = {
            fontFamily: 'joystix',
            fontSize: '20px',
            color: '#e38222',
            align: 'center',
            wordWrap: { 
                width: game.config.width - 100
            },
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        // this.startRules = this.add.text(game.config.width/2, 100, 'Hit one of the chests to see which friend you meet!', textConfig).setOrigin(0.5);

        
    }

    update(){
        
    }
}