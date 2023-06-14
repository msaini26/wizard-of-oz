class Tornado extends Phaser.Scene {
    constructor() {
        super('tornadoScene');
    }

    preload() {
        //setting a load path
        this.load.path = 'assets/';

        //load player movements
        this.load.image("fall", "./player/Fall.png");
        this.load.image("jump", "./player/Jump.png");

        //load each atlas for player animations
        this.load.atlas("run", "./player/run.png", "./player/run.json");
        this.load.atlas("hit", "./player/hit.png", "./player/hit.json");
        this.load.atlas("idle", "./player/idle.png", "./player/idle.json");
        this.load.atlas("wallJump", "./player/wallJump.png", "./player/wallJump.json");
        this.load.atlas("doubleJump", "./player/doubleJump.png", "./player/doubleJump.json");

        //loading background
        this.load.image('background','./background/background2.png');

        this.load.image("brick", "./terrain/brick.png");
        
        // load in tornado animation
        this.load.atlas("tornado", './transitions/tornado.png', './transitions/json/tornado.json');
    }

    create() {
        //setting variables to track speed of platforms and jump/walk speed
        this.ACCELERATION = 600;
        this.DRAG = 700; 
        this.JUMP_VELOCITY = -700;
        this.MAX_JUMPS = 3;
        this.SCROLL_SPEED = 4;
        this.physics.world.gravity.y = 3000;
        this.platformSpeed = -200;
        this.platformSpeedMax = -700;

        // define W,A,S,D keys for moving
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        //adding background tile
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0);


        //keeps track of other colored platforms (different from player color)
        this.platformGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });


        //keeps track of which platforms player has already landed on so we don't add points multiple times
        this.platformLanded = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });

        //delay by 1 second and then have the platforms start spawning in
        this.time.delayedCall(1000, () => { 
            this.addPlatform(); 
        });

        //creating the starting platform that the player begins on
        this.startGround = this.physics.add.sprite(-10, game.config.height - 75, 'brick').setOrigin(0);
        this.startGround.body.immovable = true; //set it so ground isn't affected by physics
        this.startGround.body.allowGravity = false; //set it so the ground doesn't fall 

        // delay by 5 seconds and then destroy starting platform
        this.time.delayedCall(5000, () => { 
            this.startGround.destroy();
        });

        //creating idle animation (when the player isn't moving)
        this.anims.create({
            key: 'idle',
            frameRate: 15,
            frames: this.anims.generateFrameNames("idle", { 
                prefix: 'sprite',
                start: 1, 
                end: 11 }),
            repeat: -1
        });

        //creating physics player
        this.player = this.physics.add.sprite(75, game.config.height/2 - 30, 'idle').setScale(2);
        //setting it so only the bottom of player checks for collision
        this.player.body.checkCollision.up = false; 
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        //initializing the score of player
        this.score = 0;

        //creating walking animation (when player moves left and right)
        this.anims.create({
            key: 'run',
            frameRate: 15,
            frames: this.anims.generateFrameNames("run", { 
                prefix: 'sprite',
                start: 1, 
                end: 12 }),
            repeat: -1
        });

        //creating event to increase speed as the player plays (increasing difficulty)
        this.difficultyTimer = this.time.addEvent({
            delay: 5000,
            callback: this.increaseSpeed,
            callbackScope: this,
            loop: true
        });


        //used to keep track of player input
        cursors = this.input.keyboard.createCursorKeys();

        //check collision of player and the starting platform
        this.physics.add.collider(this.player, this.startGround);

        //creating tornado animation (after player finishes the level)
        this.anims.create({
            key: 'spinning-tornado',
            frameRate: 3,
            frames: this.anims.generateFrameNames("tornado", { 
                prefix: 'sprite',
                start: 1, 
                end: 4 }),
            repeat: -1
        });


        // create tornado sprite
        this.tornado = this.add.sprite(350, 700, 'tornado');

        // begin spinning tornado animation
        this.time.delayedCall(29000, () => {
            this.tornado.anims.play('spinning-tornado');
        });

        // manual animation to scale the tornado to take over screen
        for (let i = 1; i < 6; i++) {
            let time = 29000 + (i * 150); // scale each interval
            this.time.delayedCall(time, () => {
                this.tornado.scale += 1; // make tornado bigger
                this.tornado.y -= 50;

                
            });
        };

        // after tornado moves up, move it right
        this.time.delayedCall(29000, () => {
            for (let x = 1; x < 5; x++) {
                    this.tornado.x += 25;
            }
        });

        this.time.delayedCall(30000, () => {
            this.scene.start('powerUpScene');
        }, null, this);

    }

    update(){

        if(this.outsideBounds()){
            // this.blobBackgroundMusic.stop(); //stop the background music
            this.time.delayedCall(1000, () => { this.scene.start('powerUpScene'); }); //delay start of game over scene by 1 second
        }

        //scrolling background
        this.background.tilePositionX += 2;

        this.updateScore();

        //adjusting acceleration, drag, and animation to match player input
        if(cursors.left.isDown || Phaser.Input.Keyboard.JustDown(keyA)) { //if player presses left arrow key or A key
            this.player.body.setAccelerationX(-this.ACCELERATION); //make player move left
            this.player.setFlip(true, false); //flip the animation so it faces left
            this.player.anims.play('run', true); //play the walking animation
        } else if(cursors.right.isDown || Phaser.Input.Keyboard.JustDown(keyD)) { //if player presses right arrow key or D key
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
        if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150) || Phaser.Input.Keyboard.DownDuration(keyW, 150)) {
	        this.player.body.velocity.y = this.JUMP_VELOCITY; //set player velocity used to jump
	        this.jumping = true; //set jumping to true
	    } 

        //if player is jumping and up arrow is pressed
        if(this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up) || Phaser.Input.Keyboard.UpDuration(keyW)) {
	    	this.jumps--; //subtract number of jumps player has left
	    	this.jumping = false; //set jumping to false
            // this.sound.play('boing'); //play boing sound effect
	    }
    }

    addPlatform() {
        //randomize speed of platforms
        let speedVariance =  Phaser.Math.Between(0, 50);

        this.platform = new Platform(this, this.platformSpeed - speedVariance);
        this.platformGroup.add(this.platform);

    }

    increaseSpeed() {
        //increase speed of platforms to make it increasingly harder to play
        if(this.platformSpeed >= this.platformSpeedMax){ //increase speed of platforms until it reaches max
            this.platformSpeed -= 80; 
        }
    }

    updateScore() {
        //checks if the player collides with a different colored platform
        this.physics.add.collider(this.player, this.platformGroup, (player, platform) =>{
            //if the player hasn't collided with this platform yet
            if(!this.platformLanded.contains(platform)) {
                this.platformLanded.add(platform); //add it to the already landed platforms group
            }
        });
    }

    outsideBounds() {
        //checks if player has fallen outside bounds of screen
        if(this.player.y > game.config.height + 130){
                this.jumps = -1; //restrict player from jumping after falling out of bounds
	    	    this.jumping = false; //set jumping to false
                return true; //return true if player is outside
        } else{
            return false; //return false if player is inside bounds
        }
    }
}