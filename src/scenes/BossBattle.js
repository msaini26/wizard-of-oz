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
            frameRate: 6,
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

        // boss battle scene text
        this.add.text(game.config.width/2, game.config.height/2, 'boss battle scene', titleConfig).setOrigin(0.5);

        // group of enemies
        this.enemies = this.add.group(); 

        // max num of enemies
        // const MAX_ENEMIES = 3
        // this.time.delayedCall(1000, () => {
        //     for (let i = 0; i < MAX_ENEMIES; i++) {
        //         // witch creation
        //         this.another_witch = this.physics.add.sprite(game.config.width * Math.random(), i, 'another-witch').setScale(2.5);
        //         this.another_witch.body.immovable = true; // prevent witch from falling on collision
        //         this.another_witch.body.allowGravity = false; // prevent witch from falling
        //         this.another_witch.anims.play('witch-flying'); // witch flying animation
        //         this.enemies.add(this.another_witch); // add single witch to group of witches
    
        //     }
        // });

        this.wave_1 = false;
        this.wave_2 = false;
        this.wave_3 = false;
        this.wave_4 = false;

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

        // add wave 1 of enemies
        this.time.delayedCall(13000, () => {
            if (!this.wave_1) {
                this.add_more_enemies();
                this.wave_1 = true;
            }
        });

        // add wave 2 of enemies
        this.time.delayedCall(30000, () => {
            if (!this.wave_2) {
                this.add_more_enemies();
                this.wave_2 = true;
            }
        });

        // add wave 3 of enemies
        this.time.delayedCall(45000, () => {
            if (!this.wave_3) {
                this.add_more_enemies();
                this.wave_3 = true;
            }
        });

        // add wave 4 of enemies
        this.time.delayedCall(60000, () => {
            if (!this.wave_4) {
                this.add_more_enemies();
                this.wave_4 = true;
            }
        });

        
        // check if player collides with the walking witch        
        this.checkWitchCollision();
        this.checkFlyingWitchCollision(); // collision with flying witch
        this.checkAddedWitchesCollision(); // collision with added witches

        // enemy tracking
        this.walking_witch_tracks_player(); 
        this.flying_witch_tracks_player();
        this.another_witch_tracks_player();               
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
            this.physics.moveTo(this.flyingWitch, this.player.x, this.player.y, 50);
        }
    }

    // make sure flying witch moves towards the player
    another_witch_tracks_player() {
        // console.log(this.enemies.children.entries);

        for (let i = 0; i < this.enemies.children.entries.length; i++) {
            // init witch in array of witches
            console.log(this.enemies.children.entries[i]);
            let extra_witch = this.enemies.children.entries[i];
            if (extra_witch != null && !this.playerIsDead) { // make sure witch or player aren't gone
                console.log(extra_witch);
                console.log(this.player);
                this.physics.moveTo(extra_witch, this.player.x, this.player.y, 30); // have enemy track the player
            }
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
                    this.enemies_left -= 1; // remove one enemy
                });
                this.flyingWitchIsDead = true;
            } else {
                this.player.destroy();
                this.playerIsDead = true;
            }

        });
    }

    // checks for collision between extra added witches and player
    // Inputs: witch, player
    // Output: boolean - based on if collided or not
    checkAddedWitchesCollision() {

        // go through array of witches
        for (let i = 0; i < this.enemies.children.entries.length; i++) {
            // init witch in array of witches
            let extra_witch = this.enemies.children.entries[i];
            
            // collision detection for player and witch
            this.physics.add.collider(this.player, extra_witch, (player, witch) =>{
                if(witch.body.touching.up) {  // player kills the witch
                    extra_witch.anims.play('witch-melting'); // make the witch melt
                    this.time.delayedCall(2100, () => {
                        witch.destroy(); // destroy the witch
                    });
                } else { // player killed by enemy
                    this.player.destroy();
                    this.playerIsDead = true;
                }

            });
        }
    }

    // creates more witches to increase difficulty of level over time
    // Inputs: witch group
    // Output: None, just add more witches
    add_more_enemies(witch_group) {
        this.time.delayedCall(1000, () => {
            for (let i = 0; i < 5; i++) {
                // witch creation
                this.another_witch = this.physics.add.sprite(game.config.width * Math.random() + Math.random(), 0, 'another-witch').setScale(2.5);
                this.another_witch.body.immovable = true; // prevent witch from falling on collision
                this.another_witch.body.allowGravity = false; // prevent witch from falling
                this.another_witch.anims.play('witch-flying'); // witch flying animation
                this.enemies.add(this.another_witch); // add single witch to group of witches    
            }
        });
    } 

}