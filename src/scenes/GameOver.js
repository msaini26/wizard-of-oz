class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }
    
    preload(){

    }

    create(){

        //title text configuration
        let titleConfig = {
            fontFamily: 'Helvetica Neue',
            fontSize: '45px',
            fontStyle: 'bold',
            color: '#ffa8db',
            // align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/2, 'game over', titleConfig).setOrigin(0.5);

        // TODO: define left or right arrow keys to restart the game
        // TODO: define c key to move to credits
    }

    update(){

    }
}