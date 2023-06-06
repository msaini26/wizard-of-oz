class BossBattle extends Phaser.Scene {
    constructor() {
        super('bossBattleScene');
    }

    // preload assets
    preload() {
        this.load.path = '/assets/'; //set loading path

        this.load.image('terrainImage', 'Terrain.png');
        this.load.image('purpleImage', 'Purple.png');

        this.load.tilemapTiledJSON('battleJSON', 'BattleField.json');

         // load spritesheet
        //  this.load.spritesheet('witch-walking', './walking.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
         this.load.atlas('witch-walking', 'witch.png', 'sprites.json'); // import witch walking texture atlas

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
        const map = this.add.tilemap('battleJSON');

        //adding tileset images
        const terrainTileSet = map.addTilesetImage('Terrain', 'terrainImage');
        const backgroundTileSet = map.addTilesetImage('Purple', 'purpleImage');

        //creating layers
        const bgLayer = map.createLayer('Background', backgroundTileSet, 0, 0);
        const terrainLayer = map.createLayer('Terrain', terrainTileSet, 0, 0);

        //enable collision
        terrainLayer.setCollisionByProperty({collides: true});

        //spawn location = where player starts
        const playerSpawn = map.findObject('Spawn', obj => obj.name === 'Spawn');

        //adding player
        this.player = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, 'idle').setScale(2);

        //setting it so only the bottom of player checks for collision
        this.player.body.checkCollision.up = false; 
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        //setting collision
        this.player.body.setCollideWorldBounds(true); //so player can't exit screen/bounds

        //physics collision
        this.physics.add.collider(this.player, terrainLayer);

        this.anims.create({
            key: 'witch-moving',
            frameRate: 6,
            frames: this.anims.generateFrameNames("witch-walking", { 
                prefix: 'sprite',
                start: 5, 
                end: 8 }),
            repeat: -1
        });

        this.witch = this.physics.add.sprite(350, 520, 'witch').setScale(2.5);
        this.witch.body.allowGravity = false;

        this.witch.play('witch-moving');


       
        // this.p1.body.setAccelerationX(-this.ACCELERATION); //make player move left
        // this.p1.setFlip(true, false); //flip the animation so it faces left

        // if (this.witch.body.velocity) { 
        //     this.avocado.body.setVelocityX(-this.VELOCITY); // move character left
        //     this.avocado.setFlip(true, false); // flip animation when moving left
        //     this.avocado.anims.play('jump', true); // play jump animation
        // } else if (cursors.right.isDown) { 
        //     this.avocado.body.setVelocityX(this.VELOCITY); // move character right
        //     this.avocado.resetFlip(); // flip avocado back to where it was
        //     this.avocado.anims.play('jump', true); // play jump animation
        // }

        // this.player.body.onOverlap = true;

        // player runs into the witch
        // this.physics.add.overlap(this.player, this.witch); // collision between witch and player
    
        // this.physics.world.on('overlap', (player, witch) => {
        //     witch.destroy();
        //     // TODO: insert witch melting animation
        // }); 


        
        this.witch_one = this.physics.add.sprite(550, 520, 'witch').setScale(2.5);
        this.witch_one.body.allowGravity = false;

        this.witch_one.play('witch-moving');

        this.player.body.onOverlap = true;
        this.physics.add.overlap(this.player, this.witch_one); // collision between witch and player
    
        this.physics.world.on('overlap', (player, witch_one) => {
            witch_one.destroy();
            // TODO: insert witch melting animation
        });

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

        this.add.text(game.config.width/2, game.config.height/2, 'boss battle scene', titleConfig).setOrigin(0.5);
    }

    // updates every frame
    update() {
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

        // this.physics.world.on('overlap', (player, witch) => {
        //     witch.destroy();
        //     // this.enemy_tracks_player().stop();
        //     // TODO: insert witch melting animation
        // });   
        
        
        // enemy follows player
        this.enemy_tracks_player();
               
    }

    // make sure enemy moves towards the player
    enemy_tracks_player() {
        this.physics.moveToObject(this.witch, this.player, 50);
    }
}