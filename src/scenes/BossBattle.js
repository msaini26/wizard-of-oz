class BossBattle extends Phaser.Scene {
    constructor() {
        super('bossBattleScene');
    }

    // preload assets
    preload() {
        this.load.path = '/assets/'; //set loading path

        this.load.image('terrainImage', 'terrain/Terrain.png');
        this.load.image('purpleImage', 'tilemaps/Purple.png');

        this.load.tilemapTiledJSON('battleJSON', 'tilemaps/BattleField.json');

         // load texture atlas
         this.load.atlas('witch', 'enemy/witch.png', 'enemy/witch.json'); // import witch walking texture atlas

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

        //setting collision
        this.player.body.setCollideWorldBounds(true); //so player can't exit screen/bounds

        //physics collision
        this.physics.add.collider(this.player, terrainLayer);

        // witch moving animation
        this.anims.create({
            key: 'witch-moving',
            frameRate: 6,
            frames: this.anims.generateFrameNames("witch", { 
                prefix: 'sprite',
                start: 5, 
                end: 8 }),
            repeat: -1
        });

        // witch melting; after witch is killed 
        this.anims.create({
            key: 'witch-melting',
            frameRate: 5,
            frames: this.anims.generateFrameNames("witch", { 
                prefix: 'sprite',
                start: 30, 
                end: 38 }),
        });

        // flying witch 
        this.anims.create({
            key: 'witch-flying',
            frameRate: 5,
            frames: this.anims.generateFrameNames("witch", { 
                prefix: 'sprite',
                start: 39, 
                end: 42 }),
            repeat: -1,
        });

        // create witch animation
        this.witch = this.physics.add.sprite(350, 505, 'witch').setScale(2.5);
        this.witch.body.immovable = true; 
        this.witch.body.allowGravity = false;

        this.witch.anims.play('witch-moving');
        this.isDead = false; // boolean flag for witch

        this.playerIsDead = false; // boolean flag for player

        cursors = this.input.keyboard.createCursorKeys(); // define cursors for keys

        // create flying witch animation
        this.flyingWitch = this.physics.add.sprite(800, 0, 'witch').setScale(2.5);
        this.flyingWitch.body.immovable = true; 
        this.flyingWitch.body.allowGravity = false;
        this.flyingWitch.anims.play('witch-flying'); // witch flying animation
        this.flyingWitchIsDead = false; // boolean flag for flying witch


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
        if(this.playerIsDead){
            this.scene.start('gameOverScene');
        }

        if(!this.playerIsDead){
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
        }
        
        // check if player collides with the walking witch        
        this.checkWitchCollision();
        this.checkFlyingWitchCollision(); // collision with flying witch

        // enemy tracking
        this.walking_witch_tracks_player(); 
        this.flying_witch_tracks_player();
               
    }

    // make sure walking witch moves towards the player
    walking_witch_tracks_player() {
        if(!this.isDead && !this.playerIsDead) {
            this.physics.moveTo(this.witch, this.player.x, this.witch.y, 50);
        }
    }

     // make sure flying witch moves towards the player
     flying_witch_tracks_player() {
        if(!this.flyingWitchIsDead && !this.playerIsDead) {
            this.physics.moveTo(this.flyingWitch, this.player.x, this.player.y, 30);
        }
    }

    // checks for collision between walking witch and player
    // Inputs: witch, player
    // Output: boolean - based on if collided or not
    checkWitchCollision() {
        this.physics.add.collider(this.player, this.witch, (player, witch) =>{
            if(witch.body.touching.up) {  // player kills the witch
                this.witch.anims.play('witch-melting'); // make the witch melt
                this.time.delayedCall(2100, () => {
                    witch.destroy(); // destroy the witch
                });
                this.isDead = true;
            } else {
                // console.log('player should die');
                this.player.destroy();
                this.playerIsDead = true;
            }

        });
    }

    // checks for collision between flying witch and player
    // Inputs: witch, player
    // Output: boolean - based on if collided or not
    checkFlyingWitchCollision() {
        this.physics.add.collider(this.player, this.flyingWitch, (player, witch) =>{
            if(witch.body.touching.up) {  // player kills the witch
                this.flyingWitch.anims.play('witch-melting'); // make the witch melt
                this.time.delayedCall(2100, () => {
                    witch.destroy(); // destroy the witch
                });
                this.flyingWitchIsDead = true;
            } else {
                this.player.destroy();
                this.playerIsDead = true;
            }

        });
    }

  

}