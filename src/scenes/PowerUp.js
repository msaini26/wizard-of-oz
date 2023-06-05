class PowerUp extends Phaser.Scene {
    constructor() {
        super('powerUpScene');
    }

    // preload assets
    preload() {
        this.load.path = '/assets/'; //set loading path

        this.load.image('terrainImage', 'Terrain.png');
        this.load.image('yellowImage', 'Yellow.png');

        this.load.tilemapTiledJSON('YellowBrickJSON', 'YellowBrick.json');

        // this.load.animation("run", "tornadoScene");
        // this.load.animation("idle", "tornadoScene");
    }

    // create background and game elements
    create() {
        // this.load.animation("run", "tornadoScene");
        // this.load.animation("idle", "tornadoScene");
        this.ACCELERATION = 600;
        this.DRAG = 700; 
        this.JUMP_VELOCITY = -700;
        this.MAX_JUMPS = 3;
        this.SCROLL_SPEED = 4;
        this.physics.world.gravity.y = 3000;
        this.platformSpeed = -200;
        this.platformSpeedMax = -700;


        //creating tilemap
        const map = this.add.tilemap('YellowBrickJSON');

        //adding tileset images
        const terrainTileSet = map.addTilesetImage('Terrain', 'terrainImage');
        const backgroundTileSet = map.addTilesetImage('Yellow', 'yellowImage');

        //creating layers
        const bgLayer = map.createLayer('Background', backgroundTileSet, 0, 0);
        const terrainLayer = map.createLayer('Terrain', terrainTileSet, 0, 0);

        //enable collision
        terrainLayer.setCollisionByProperty({collides: true});

        //spawn location = where player starts
        const playerSpawn = map.findObject('Spawn', obj => obj.name === 'Spawn');

        //creating idle animation (when the player isn't moving)
        // this.idle = this.anims.create({
        //     key: 'idle',
        //     frameRate: 15,
        //     frames: this.anims.generateFrameNames("idle", { 
        //         prefix: 'sprite',
        //         start: 1, 
        //         end: 11 }),
        //     repeat: -1
        // });

        //adding player
        this.player = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, 'idle').setScale(2);

        //setting it so only the bottom of player checks for collision
        this.player.body.checkCollision.up = false; 
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        // this.player.animations.add('run');

        //setting collision
        this.player.body.setCollideWorldBounds(true); //so player can't exit screen/bounds

        //physics collision
        this.physics.add.collider(this.player, terrainLayer);

        //creating walking animation (when player moves left and right)
        // this.walk = this.anims.create({
        //     key: 'run',
        //     frameRate: 15,
        //     frames: this.anims.generateFrameNames("run", { 
        //         prefix: 'sprite',
        //         start: 1, 
        //         end: 12 }),
        //     repeat: -1
        // });

        cursors = this.input.keyboard.createCursorKeys();


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

        this.add.text(game.config.width/2, game.config.height/2, 'power up scene', titleConfig).setOrigin(0.5);
    }

    // updates every frame
    update() {
        //adjusting acceleration, drag, and animation to match player input
        if(cursors.left.isDown) { //if player presses left arrow key
            this.player.body.setAccelerationX(-this.ACCELERATION); //make player move left
            this.player.setFlip(true, false); //flip the animation so it faces left
            this.player.anims.play('run', true); //play the walking animation
        } else if(cursors.right.isDown) { //if player presses right arrow key
            this.player.body.setAccelerationX(this.ACCELERATION); //move player right
            this.player.resetFlip(); //reset animation to face right
            this.player.anims.play('run', true); //play the walking animation
        } else {
            this.player.body.setAccelerationX(0); // set acceleration to 0 so DRAG will take over
            this.player.body.setDragX(this.DRAG); //drag to stop player from moving
            this.player.anims.play('idle', true); //play idle animation
        }

        //check if player is touching any platform
        this.player.onGround = this.player.body.touching.down;

        //if the player is on a platform
	    if(this.player.onGround) {
	    	this.jumps = this.MAX_JUMPS; //set jump count to max
	    	this.jumping = false; //set player to not jumping
	    } else {
            this.player.setTexture('jump'); //if player is not on platform, they are in the air i.e. jumping
	    }

        //if up arrow key is pressed and we have not reached max jumps yet
        if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
	        this.player.body.velocity.y = this.JUMP_VELOCITY; //set player velocity used to jump
	        this.jumping = true; //set jumping to true
	    } 

        //if player is jumping and up arrow is pressed
        if(this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
	    	this.jumps--; //subtract number of jumps player has left
	    	this.jumping = false; //set jumping to false
            // this.sound.play('boing'); //play boing sound effect
	    }

        // move to next scene
        if (this.outsideBounds()) {
            this.scene.start('bossBattleScene');
        }
    }

    outsideBounds() {
        //checks if player has fallen outside bounds of screen
        if(this.player.x > game.config.width - 40){
                return true; //return true if player is outside
        } else{
            return false; //return false if player is inside bounds
        }
    }
}