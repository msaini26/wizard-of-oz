class Item extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, velocity, item) {
        super(scene, Phaser.Math.Between(131, game.config.width - brickHeight/2), game.config.height + 16, item);
        
        this.parentScene = scene;               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this); //add to parent/existng scene
        this.parentScene.physics.add.existing(this); //add to physics system
        this.setVelocityX(velocity); //add velocity to platform to make it slide across screen
        this.setImmovable(); //makes it so platform isn't affected by physics               

        this.newItem = true; //boolean to control barrier spawning nonstop

        this.body.allowGravity = false; //makes it so platform doesn't fall due to gravity

        //sets collision detection to only the top
        this.body.checkCollision.down = false;
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;
    }

    update() {
        //constantly spawns new platforms after the other platforms have reached a certain distance
        if(this.newItem && this.x < game.config.height/2 + 350) {
            this.parentScene.addItem(this.parent, this.velocity);
            this.newItem = false; //make it so the platforms are spawning one at a time
        }

        // destroy paddle if it reaches the left edge of the screen
        if(this.y > this.height) {
            this.destroy();
        }
    }

}