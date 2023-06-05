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

        //load player movements
        this.load.image("fall", "./player/Fall.png");
        this.load.image("jump", "./player/Jump.png");

        this.load.image('coin', 'coin.png');

        //load each atlas for player animations
        // this.load.atlas("run", "./player/run.png", "./player/run.json");
        // this.load.atlas("hit", "./player/hit.png", "./player/hit.json");
        // this.load.atlas("idle", "./player/idle.png", "./player/idle.json");
        // this.load.atlas("wallJump", "./player/wallJump.png", "./player/wallJump.json");
        // this.load.atlas("doubleJump", "./player/doubleJump.png", "./player/doubleJump.json");

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

        // define a render debug so we can see the tilemap's collision bounds
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        terrainLayer.renderDebug(debugGraphics, {
            tileColor: null,    // color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),    // color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)                // color of colliding face edges
        });

        //spawn location = where player starts
        const playerSpawn = map.findObject('Spawn', obj => obj.name === 'Spawn');

        //creating idle animation (when the player isn't moving)
        // this.anims.remove('idle');
        // this.anims.create({
        //     key: 'idle',
        //     frameRate: 15,
        //     frames: this.anims.generateFrameNames("idle", { 
        //         prefix: 'sprite',
        //         start: 1, 
        //         end: 11 }),
        //     repeat: -1
        // });

        //adding player
        this.p1 = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, 'idle').setScale(2);
        this.p1.anims.play('idle', true); 

        //setting it so only the bottom of player checks for collision
        this.p1.body.checkCollision.up = false; 
        this.p1.body.checkCollision.left = false;
        this.p1.body.checkCollision.right = false;

        // this.player.animations.add('run');

        //setting collision
        this.p1.body.setCollideWorldBounds(true); //so player can't exit screen/bounds

        //physics collision
        this.physics.add.collider(this.p1, terrainLayer);

        let line = this.add.line(200, 150,100,100,500,100,0xff0000);

        // create coins group
        this.coin_one = this.physics.add.sprite(line.x, line.y + 100, 'coin'); // create coin
        this.coin_one.body.immovable = true; // don't move coin
        this.coin_one.body.allowGravity = false; // don't fall coin

        this.coin_two = this.physics.add.sprite(line.x + 150, line.y + 100, 'coin'); // create coin
        this.coin_two.body.immovable = true; // don't move coin
        this.coin_two.body.allowGravity = false; // don't fall coin
        
        this.coin_three = this.physics.add.sprite(line.x + 300, line.y + 100, 'coin'); // create coin
        this.coin_three.body.immovable = true; // don't move coin
        this.coin_three.body.allowGravity = false; // don't fall coin

        // Phaser.Actions.PlaceOnLine(this.coins, line);
        line.alpha = 0; // hide coin line

        this.p1.body.onOverlap = true;
        this.physics.add.overlap(this.p1, this.coin_one); // collision between coin and player
        this.physics.add.overlap(this.p1, this.coin_two); // collision between coin and player
        this.physics.add.overlap(this.p1, this.coin_three); // collision between coin and player


        this.physics.world.on('overlap', (player, coin_one) => {
            coin_one.destroy();
            // this.p1Score += 1;
        });

        this.physics.world.on('overlap', (player, coin_two) => {
            coin_two.destroy();
            // this.p1Score += 1;
        });

        this.physics.world.on('overlap', (player, coin_three) => {
            coin_three.destroy();
            // this.p1Score += 1;
        });


        // this.anims.remove('run');
        //creating walking animation (when player moves left and right)
        // this.anims.create({
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

        // this.add.text(game.config.width/2, game.config.height/2, 'power up scene', titleConfig).setOrigin(0.5);
    }

    // updates every frame
    update() {

        if(this.p1.x >= (game.config.width - 50)){
            console.log("next level");
        }


        if(cursors.left.isDown){
            this.p1.body.setAccelerationX(-this.ACCELERATION); //make player move left
            this.p1.setFlip(true, false); //flip the animation so it faces left
            this.p1.anims.play('run', true); //play the walking animation
        } else if(cursors.right.isDown) { //if player presses right arrow key
            this.p1.body.setAccelerationX(this.ACCELERATION); //move player right
            this.p1.resetFlip(); //reset animation to face right
            this.p1.anims.play('run', true); //play the walking animation
        } else {
            this.p1.body.setAccelerationX(0); // set acceleration to 0 so DRAG will take over
            this.p1.body.setDragX(this.DRAG); //drag to stop player from moving
            this.p1.anims.play('idle', true); //play idle animation
        }


        //if the player is on a platform
	    if(this.p1.body.blocked.down) {
	    	this.jumps = this.MAX_JUMPS; //set jump count to max
	    	this.jumping = false; //set player to not jumping
	    } else {
            this.p1.setTexture('jump'); //if player is not on platform, they are in the air i.e. jumping
	    }

        //if up arrow key is pressed and we have not reached max jumps yet
        if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
	        this.p1.body.velocity.y = this.JUMP_VELOCITY; //set player velocity used to jump
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