class BossBattle extends Phaser.Scene {
    constructor() {
        super('bossBattleScene');
    }

    // preload assets
    preload() {
        this.load.path = '/assets/'; //set loading path

        //load images used in tilemap
        this.load.image('terrainImage', 'terrain/Terrain.png');
        this.load.image('purpleImage', 'tilemaps/Purple.png');

        //loading tilemap
        this.load.tilemapTiledJSON('battleJSON', 'tilemaps/BattleField.json');

         // load texture atlas
         this.load.atlas('witch', 'enemy/witch.png', 'enemy/witch.json'); // import witch walking texture atlas

         //load jumping image
         this.load.image('jumping','./dorothy/png/jump1.png');

    }

    create() {
        //defining constants for physics
        this.ACCELERATION = 600;
        this.DRAG = 700; 
        this.JUMP_VELOCITY = -700;
        this.SCROLL_SPEED = 4;
        this.physics.world.gravity.y = 3000;

        // set music configurations
        let musicConfig = {
            mute: false,
            volume: 1, 
            loop: true, //looping music so it is never ending
            rate: 1,
            delay: 0 
        };

        // set background game music
        this.battleMusic = this.sound.add('battle_music', musicConfig);
        this.battleMusic.play(musicConfig);

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

        //setting text configuration
        let textConfig = {
            fontFamily: 'joystix',
            fontSize: '20px',
            color: '#7a5f46',
            align: 'center',
            wordWrap: { 
                width: game.config.width - 100
            },
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        //directions for boss level
        this.boss_directions = this.add.text(game.config.width/2, 50, "Destroy the wicked witch of the west by jumping on top of them so you can go back home to Kansas!!", textConfig).setOrigin(0.5);
        
        //check if player collected enough powerups from previous round to receive benefits
        textConfig.color = '#070f59';
        if(hasPowerUp){ //if they have enough
            this.MAX_JUMPS = 5; //set max jumps to 5
            this.add.text(game.config.width/2, 150, "You now have a max of 5 jumps because you collected enough items!", textConfig).setOrigin(0.5);
        } else{ //otherwise set max jumps to 3 (default)
            this.MAX_JUMPS = 3;
            this.add.text(game.config.width/2, 150, "You only have a max of 3 jumps because you didn't collect enough items :(", textConfig).setOrigin(0.5);
        }

        // witch melting animation; after witch is killed 
        this.anims.create({
            key: 'witch-melting',
            frameRate: 6,
            frames: this.anims.generateFrameNames("witch", { 
                prefix: 'sprite',
                start: 30, 
                end: 38 }),
        });

        // flying witch animation
        this.anims.create({
            key: 'witch-flying',
            frameRate: 5,
            frames: this.anims.generateFrameNames("witch", { 
                prefix: 'sprite',
                start: 39, 
                end: 42 }),
            repeat: -1,
        });

        //boolean used to keep track of small delay before witches come in
        this.isWaiting = true;

        //creating small delay when scene starts so player can read instructions before witches appear
        this.time.delayedCall(5000, () => {
            // create witch animation and sprite
            this.witch = this.physics.add.sprite(game.config.width, 505, 'witch').setScale(2.5);
            this.witch.body.immovable = true; 
            this.witch.body.allowGravity = false;

            this.witch.anims.play('witch-moving'); //play witch animation
            this.isDead = false; // boolean flag for witch to keep track if it's dead or not

            // create flying witch animation and sprite
            this.flyingWitch = this.physics.add.sprite(800, 0, 'witch').setScale(2.5);
            this.flyingWitch.body.immovable = true; 
            this.flyingWitch.body.allowGravity = false;
            this.flyingWitch.anims.play('witch-flying'); // witch flying animation
            this.flyingWitchIsDead = false; // boolean flag for flying witch death

            //set is waiting to false to let witches start coming in
            this.isWaiting = false;
        }, null, this);

        this.playerIsDead = false; // boolean flag for player death

        cursors = this.input.keyboard.createCursorKeys(); // define cursors for keys

        // group of enemies
        this.enemies = this.add.group(); 

        //boolean for each wave of enemies
        this.wave_1 = false;
        this.wave_2 = false;
        this.wave_3 = false;
        // this.wave_4 = false;

        //check if the additional enemies are dead
        this.enemiesAddedDead = false;

    }

    // updates every frame
    update() {
        //if player died
        if(this.playerIsDead){ 
            hasWon = false; //they didn't win
            this.battleMusic.stop(); //stop music
            this.scene.start('gameOverScene'); //go to game over scene
        }

        //if all enemies are dead
        if(this.enemiesAddedDead && this.flyingWitchIsDead && this.isDead){
            hasWon = true; //player won
            this.battleMusic.stop(); //stop music
            this.scene.start('gameOverScene');// move to game over scene
        }

        //check if player is not dead
        if(!this.playerIsDead){
            if(cursors.left.isDown){ //if key left is pressed
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
    
            //if the player is on platform
            if(this.player.body.blocked.down) {
                this.jumps = this.MAX_JUMPS; //set jump count to max
                this.jumping = false; //set player to not jumping
            } 
    
            //if up arrow key is pressed and we have not reached max jumps yet
            if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
                this.player.body.velocity.y = this.JUMP_VELOCITY; //set player velocity used to jump
                this.jumping = true; //set jumping to true
                this.player.setTexture('jumping'); //set jumping image
            } 
    
            //if player is jumping and up arrow is pressed
            if(this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
                this.jumps--; //subtract number of jumps player has left
                this.jumping = false; //set jumping to false
            }
        }

        // add wave 1 of enemies
        this.time.delayedCall(18000, () => {
            if (!this.wave_1) {
                this.add_more_enemies();
                this.wave_1 = true;
            }
        });

        // add wave 2 of enemies
        this.time.delayedCall(35000, () => {
            if (!this.wave_2) {
                this.add_more_enemies();
                this.wave_2 = true;
            }
        });

        // add wave 3 of enemies
        this.time.delayedCall(50000, () => {
            if (!this.wave_3) {
                this.add_more_enemies();
                this.wave_3 = true;
            }
        });

        // // add wave 4 of enemies
        // this.time.delayedCall(65000, () => {
        //     if (!this.wave_4) {
        //         this.add_more_enemies();
        //         this.wave_4 = true;
        //     }
        // });

        //if we are not waiting anymore which means there are witches present, we can check for collision and tracking
        if(!this.isWaiting){      
            this.checkWitchCollision(); // check if player collides with the walking witch  
            this.checkFlyingWitchCollision(); // collision with flying witch
            this.checkAddedWitchesCollision(); // collision with added witches

            // enemy tracking
            this.walking_witch_tracks_player(); 
            this.flying_witch_tracks_player();
            this.another_witch_tracks_player();   
        }            
    }

    // make sure walking witch moves towards the player
    walking_witch_tracks_player() {
        if(!this.isDead && !this.playerIsDead) { //make sure player or witch isn't dead before tracking
            this.physics.moveTo(this.witch, this.player.x, this.witch.y, 50);
        }
    }

     // make sure flying witch moves towards the player
     flying_witch_tracks_player() {
        if(!this.flyingWitchIsDead && !this.playerIsDead) { //make sure player or witch isn't dead before tracking
            this.physics.moveTo(this.flyingWitch, this.player.x, this.player.y, 50);
        }
    }

    // make sure additional flying witch moves towards the player
    another_witch_tracks_player() {
        for (let i = 0; i < this.enemies.children.entries.length; i++) { //loop through group of enemies
            let extra_witch = this.enemies.children.entries[i]; //get each witch in group enemies
            if (extra_witch != null && !this.playerIsDead) { // make sure witch or player aren't gone
                this.physics.moveTo(extra_witch, this.player.x, this.player.y, 30); // have enemy track the player
            }
        }
    }

    // checks for collision between walking witch and player
    checkWitchCollision() {
        this.physics.add.collider(this.player, this.witch, (player, witch) =>{
            if(witch.body.touching.up) {  // player kills the witch
                this.witch.anims.play('witch-melting'); // make the witch melt

                //set all collision sides to false so player can't collide with witch anymore
                witch.body.checkCollision.down = false; 
                witch.body.checkCollision.up = false; 
                witch.body.checkCollision.left = false; 
                witch.body.checkCollision.right = false; 

                this.sound.play('pop'); //play sound

                this.time.delayedCall(2100, () => { //slight delay to wait for animation to finish before destroying
                    witch.destroy(); // destroy the witch
                });

                this.isDead = true; //set boolean to true because witch is dead
            } else {
                //otherwise, that means player did not kill witch but collided with them so player dies
                this.player.destroy(); //destroy player
                this.playerIsDead = true; //set boolean to true
            }

        });
    }

    // checks for collision between flying witch and player
    checkFlyingWitchCollision() {
        this.physics.add.collider(this.player, this.flyingWitch, (player, witch) =>{
            if(witch.body.touching.up) {  // player kills the witch
                this.flyingWitch.anims.play('witch-melting'); // make the witch melt

                //set all collision sides to false so player can't collide with witch anymore
                witch.body.checkCollision.down = false; 
                witch.body.checkCollision.up = false; 
                witch.body.checkCollision.left = false; 
                witch.body.checkCollision.right = false; 

                this.sound.play('pop'); //play sound

                this.time.delayedCall(2100, () => { //slight delay to wait for animation to finish before destroying
                    witch.destroy(); // destroy the witch
                    this.enemies_left -= 1; // remove one enemy
                });
                 
                this.flyingWitchIsDead = true; //set boolean to true because witch is dead
            } else {
                //otherwise, that means player did not kill witch but collided with them so player dies
                this.player.destroy(); //destroy player
                this.playerIsDead = true; //set boolean to true
            }

        });
    }

    // checks for collision between extra added witches and player
    checkAddedWitchesCollision() {
        // go through array of witches
        for (let i = 0; i < this.enemies.children.entries.length; i++) {
            //get one of the witches
            let extra_witch = this.enemies.children.entries[i];
            
            // collision detection for player and witch
            this.physics.add.collider(this.player, extra_witch, (player, witch) =>{
                if(witch.body.touching.up) {  // player kills the witch
                    extra_witch.anims.play('witch-melting'); // make the witch melt

                    //set all collision sides to false so player can't collide with witch anymore
                    witch.body.checkCollision.down = false; 
                    witch.body.checkCollision.up = false; 
                    witch.body.checkCollision.left = false; 
                    witch.body.checkCollision.right = false; 

                    this.sound.play('pop'); //play sound

                    this.time.delayedCall(2100, () => { //slight delay to wait for animation to finish before destroying
                        witch.destroy(); // destroy the witch
                        if(this.enemies.children.entries.length === 0){ //if there are no children left therefore all enemies are dead
                            this.enemiesAddedDead = true; //set boolean to true
                        }
                    });
                } else { // player killed by enemy
                    this.player.destroy();
                    this.playerIsDead = true;
                }

            });
        }
    }

    // creates more witches to increase difficulty of level over time
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