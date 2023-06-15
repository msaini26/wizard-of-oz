class Items extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, item) {
        super(scene, Phaser.Math.Between(10, game.config.width - 10), -20, item);
        
        this.parentScene = scene;               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this); //add to parent/existng scene
        this.parentScene.physics.add.existing(this); //add to physics system
        this.setScale(2);

        this.newItem = true; //boolean to control item spawning nonstop
    }

    update() {
        //sets boolean to false when items have reached a certain distance
        if(this.newItem && this.y > game.config.height/2 - 200) {
            this.newItem = false; //set to false
        }

        // destroy item if it reaches the bottom of screen
        if(this.y > game.config.height) {
            this.destroy();
        }
    }

}