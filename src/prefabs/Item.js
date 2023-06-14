class Items extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, item) {
        super(scene, Phaser.Math.Between(10, game.config.width - 10), -20, item);
        
        this.parentScene = scene;               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this); //add to parent/existng scene
        this.parentScene.physics.add.existing(this); //add to physics system
        // this.setVelocityY(velocity); //add velocity to platform to make it slide across screen
        // this.setImmovable(); //makes it so platform isn't affected by physics    
        this.setScale(1.5);

        this.newItem = true; //boolean to control barrier spawning nonstop
        this.hitHeight = false;
        // this.maxItems = num;

        // this.body.allowGravity = true; //makes it so platform doesn't fall due to gravity

        //sets collision detection to only the top
        // this.body.checkCollision.down = false;
        // this.body.checkCollision.left = false;
        // this.body.checkCollision.right = false;

        // console.log('im in item');
    }

    update() {
        //constantly spawns new platforms after the other platforms have reached a certain distance
        if(this.newItem && this.y > game.config.height/2 - 200) {
            // console.log(this.y);
            // this.parentScene.addItem(this.parent, this.velocity);
            this.newItem = false; //make it so the platforms are spawning one at a time
        }
        // if(this.y > game.config.height/2 - 200){
        //     console.log('im in height');
        //     this.hitHeight = true;
        // }

        // destroy paddle if it reaches the left edge of the screen
        if(this.y > game.config.height) {
            // console.log(this.height);
            this.destroy();
        }
    }

}