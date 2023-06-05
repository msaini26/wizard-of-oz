class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    // preload assets
    preload() {
        // game elements
        this.load.image('tornado', './assets/tornado.gif');
        this.load.image('background', './assets/background.png');

        // tilemap
        this.load.tilemapTiledJSON('tornadoJSON', 'tornado.json');
    }

    // create background and game elements
    create() {
        this.physics.world.gravity.y = 3000;

        // create tilemap
        const map = this.add.tilemap('tornandoJSON');

        // adding tileset images
        const platformTileSet = map.addTilesetImage('platform', 'platformImage');
        const backgroundTileSet = map.addTilesetImage('background', 'backgroundImage');

        // creating layers
        const backgroundLayer = map.createLayer('background', backgroundTileSet, 0, 0);
        const platformLayer = map.createLayer('platform', platformTileSet, 0, 0);
    }

    // updates every frame
    update() {
        
    }
}