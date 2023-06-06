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

        this.load.atlas("chest", "chest.png", "chest.json");

    }

    // create background and game elements
    create() {
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
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // terrainLayer.renderDebug(debugGraphics, {
        //     tileColor: null,    // color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),    // color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)                // color of colliding face edges
        // });

        //spawn location = where player starts
        const playerSpawn = map.findObject('Spawn', obj => obj.name === 'Spawn');

        //adding player
        this.player = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, 'idle').setScale(2);
        this.player.anims.play('idle', true); 

        //setting collision
        this.player.body.setCollideWorldBounds(true); //so player can't exit screen/bounds

        this.anims.create({
            key: 'chest1',
            frameRate: 10,
            frames: this.anims.generateFrameNames("chest", { 
                prefix: 'sprite',
                start: 6, 
                end: 10 }),
            repeat: 0
        });

        this.chest1 = this.physics.add.sprite(200, 250, 'chest', 'sprite1').setScale(4);
        // this.chest1.anims.play("chest1");
        // Change the size of the bounding box.
        this.chest1.setSize(30, 30);
        // Change the location of the bounding box.
        this.chest1.setOffset(1, 2);
        this.chest1.body.immovable = true; // don't move coin
        this.chest1.body.allowGravity = false; // don't fall coin

        this.chest1.body.checkCollision.up = false; 
        this.chest1.body.checkCollision.left = false;
        this.chest1.body.checkCollision.right = false;



        this.anims.create({
            key: 'chest2',
            frameRate: 10,
            frames: this.anims.generateFrameNames("chest", { 
                prefix: 'sprite',
                start: 16, 
                end: 20 }),
            repeat: 0
        });

        this.chest2 = this.physics.add.sprite(350, 250, 'chest', 'sprite11').setScale(4);
        // this.chest2.anims.play("chest2");
        // Change the size of the bounding box.
        this.chest2.setSize(30, 30);
        // Change the location of the bounding box.
        this.chest2.setOffset(1, 2);
        this.chest2.body.immovable = true; // don't move coin
        this.chest2.body.allowGravity = false; // don't fall coin

        this.chest2.body.checkCollision.up = false; 
        this.chest2.body.checkCollision.left = false;
        this.chest2.body.checkCollision.right = false;



        this.anims.create({
            key: 'chest3',
            frameRate: 10,
            frames: this.anims.generateFrameNames("chest", { 
                prefix: 'sprite',
                start: 26, 
                end: 30 }),
            repeat: 0
        });

        this.chest3 = this.physics.add.sprite(500, 250, 'chest', 'sprite21').setScale(4);
        // this.chest3.anims.play("chest3");
        // Change the size of the bounding box.
        this.chest3.setSize(30, 30);
        // Change the location of the bounding box.
        this.chest3.setOffset(1, 2);
        this.chest3.body.immovable = true; // don't move coin
        this.chest3.body.allowGravity = false; // don't fall coin

        this.chest3.body.checkCollision.up = false; 
        this.chest3.body.checkCollision.left = false;
        this.chest3.body.checkCollision.right = false;



        this.anims.create({
            key: 'chest4',
            frameRate: 15,
            frames: this.anims.generateFrameNames("chest", { 
                prefix: 'sprite',
                start: 36, 
                end: 40 }),
            repeat: 0
        });

        this.chest4 = this.physics.add.sprite(650, 250, 'chest', 'sprite31').setScale(4);
        // this.chest4.anims.play("chest4");
        // Change the size of the bounding box.
        this.chest4.setSize(30, 30);
        // Change the location of the bounding box.
        this.chest4.setOffset(1, 2);
        this.chest4.body.immovable = true; // don't move coin
        this.chest4.body.allowGravity = false; // don't fall coin

        this.chest4.body.checkCollision.up = false; 
        this.chest4.body.checkCollision.left = false;
        this.chest4.body.checkCollision.right = false;

        this.chestPlayed = false;


        //physics collision
        this.physics.add.collider(this.player, terrainLayer);
        // this.physics.add.collider(this.player, this.chest1);

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

        // if(this.p1.x >= (game.config.width - 50)){
        //     console.log("next level");
        // }

        this.updateChest();

        if(cursors.left.isDown){
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


        //if the player is on a platform
	    if(this.player.body.blocked.down) {
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

    updateChest() {
        this.physics.add.collider(this.player, this.chest1, (player, chest) =>{
            if(!this.chestPlayed){
                this.chest2.destroy();
                this.chest3.destroy();
                this.chest4.destroy();

                this.time.delayedCall(500, () => {
                    chest.anims.play("chest1");
                }, null, this);

                this.chestPlayed = true;
            }
        });

        this.physics.add.collider(this.player, this.chest2, (player, chest) =>{
            if(!this.chestPlayed){
                this.chest1.destroy();
                this.chest3.destroy();
                this.chest4.destroy();

                this.time.delayedCall(500, () => {
                    chest.anims.play("chest2");
                }, null, this);

                this.chestPlayed = true;
            }
        });

        this.physics.add.collider(this.player, this.chest3, (player, chest) =>{
            if(!this.chestPlayed){
                this.chest1.destroy();
                this.chest2.destroy();
                this.chest4.destroy();

                this.time.delayedCall(500, () => {
                    chest.anims.play("chest3");
                }, null, this);

                this.chestPlayed = true;
            } 
        });

        this.physics.add.collider(this.player, this.chest4, (player, chest) =>{
            if(!this.chestPlayed){
                this.chest1.destroy();
                this.chest2.destroy();
                this.chest3.destroy();

                this.time.delayedCall(500, () => {
                    chest.anims.play("chest4");
                }, null, this);

                this.chestPlayed = true;
            }
        });
        
    }
}