class PowerUp extends Phaser.Scene {
    constructor() {
        super('powerUpScene');
    }

    // preload assets
    preload() {
        this.load.path = '/assets/'; //set loading path

        this.load.image('terrainImage', './terrain/Terrain.png');
        this.load.image('yellowImage', './tilemaps/Yellow.png');

        this.load.tilemapTiledJSON('YellowBrickJSON', './tilemaps/YellowBrick.json');

        //load player movements
        this.load.image("fall", "./player/Fall.png");
        this.load.image("jump", "./player/Jump.png");
        this.load.image('jumping','./dorothy/png/jump1.png');

        // this.load.image('coin', './powerups/png/coin.png');

        // treasure or power up container
        this.load.atlas("chest", "./powerups/png/chest.png", "./powerups/json/chest.json");

        // treasure options
        this.load.atlas("friends", "./powerups/png/friends.png", "./powerups/json/friends.json");
        this.load.atlas("monkey", "./powerups/png/monkey.png", "./powerups//json/monkey.json");
        this.load.atlas("lion", "./powerups/png/lion.png", "./powerups/json/lion.json");

        //collectable items
        // this.load.atlas("heart", "./powerups/png/heart.png", "./powerups/json/heart.json");
        // this.load.atlas("fire", "./powerups/png/fire.png", "./powerups/json/fire.json");
        this.load.image('brain', './powerups/png/brain.png');
        this.load.image('heart', './powerups/png/heart.png');
        this.load.image('fire', './powerups/png/fire.png');

        this.load.audio('powerup_music', './assets/audio/adventure.mp3');

    }

    // create background and game elements
    create() {
        this.ACCELERATION = 1000;
        this.DRAG = 900; 
        this.JUMP_VELOCITY = -700;
        this.MAX_JUMPS = 3;
        this.SCROLL_SPEED = 4;
        this.physics.world.gravity.y = 3000;
        // this.itemSpeed = 200;
        // this.itemSpeedMax = 700;

        // set music configurations
        let musicConfig = {
            mute: false,
            volume: 1, 
            loop: true, //looping music so it is never ending
            rate: 1,
            delay: 0 
        };

        // set background game music
        this.powerMusic = this.sound.add('powerup_music', musicConfig);
        this.powerMusic.play(musicConfig);

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

        // //adding player
        // this.player = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, 'idle').setScale(2);
        // this.player.anims.play('idle', true); 

        // //setting collision
        // this.player.body.setCollideWorldBounds(true); //so player can't exit screen/bounds

        //keeps track of other colored platforms (different from player color)
        this.itemGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });

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


        this.anims.create({
            key: 'tincan',
            frameRate: 15,
            frames: this.anims.generateFrameNames("friends", { 
                prefix: 'sprite',
                start: 9, 
                end: 16 }),
            repeat: 0
        });

        this.power = this.physics.add.sprite(620, 240, 'friends', 'sprite13').setScale(4);
        this.power.body.immovable = true;
        this.power.body.allowGravity = false; 

        this.power.visible = false;


        this.anims.create({
            key: 'scarecrow',
            frameRate: 15,
            frames: this.anims.generateFrameNames("friends", { 
                prefix: 'sprite',
                start: 73, 
                end: 80 }),
            repeat: 0
        });
        
        this.anims.create({
            key: 'monkey',
            frameRate: 3,
            frames: this.anims.generateFrameNames("monkey", { 
                prefix: 'sprite',
                start: 1, 
                end: 4 }),
            repeat: 0
        });

        this.anims.create({
            key: 'lion',
            frameRate: 10,
            frames: this.anims.generateFrameNames("lion", { 
                prefix: 'lion',
                start: 1, 
                end: 4 }),
            repeat: 0
        });

        this.powerlist = ['tincan', 'lion', 'scarecrow', 'monkey'];
        this.powerAnim = Phaser.Utils.Array.GetRandom(this.powerlist);
        this.powerFront = 0;
        this.text = '';
        this.textGoal = '';

        if(this.powerAnim === 'tincan'){ //no heart
            this.text = 'Hello! I\'m a Tincan with no heart.';
            this.textGoal = 'Help me collect as many hearts as possible to fill my empty can!';
        } else if (this.powerAnim === 'lion'){ //no courage
            this.text = 'Hello! I\'m a Lion with no courage.';
            this.textGoal = 'Help me collect some fire to ignite the courage inside of me!';
        } else if (this.powerAnim === 'scarecrow'){ //no brain
            this.text = 'Hello! I\'m a Scarecrow with no brain.';
            this.textGoal = 'Help me collect as many brains as possible to fill my empty head!';
        } else if (this.powerAnim === 'monkey'){ //evil monkey
            this.text = 'Mwahahaha! I\'m the Evil Monkey. One of the evil witch\'s helper.';
            this.textGoal = 'Too bad so sad. You don\'t get any powerups this time!';
        }

        //adding player
        this.player = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, 'idle').setScale(2);
        // this.player.anims.play('idle', true); 
        // this.player.body.setSize(this.player.width/1.5);  

        //setting collision
        this.player.body.setCollideWorldBounds(true); //so player can't exit screen/bounds

        //physics collision
        this.physics.add.collider(this.player, terrainLayer);
        // this.physics.add.collider(this.player, this.chest1);

        cursors = this.input.keyboard.createCursorKeys();


        //title text configuration
        let textConfig = {
            fontFamily: 'joystix',
            fontSize: '20px',
            color: '#e38222',
            align: 'center',
            wordWrap: { 
                width: game.config.width - 100
            },
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        this.startRules = this.add.text(game.config.width/2, 100, 'You have traveled to the Land of Oz. Hit one of the chests to see which friend you meet!', textConfig).setOrigin(0.5);

        this.imgName = '';
        this.setItemImage();
        // this.item;

        // this.item = new Items(this, this.imgName);
        this.count = 75;
        this.startFall = false;
        this.checkStart = false;
        this.checkNext = false;
        this.clicked = false;
        this.checkingScore = true;

        this.score = 0;

    }

    // updates every frame
    update() {
        if(this.checkNext){
            this.updateNext();
            // console.log('should be clickable');
        }

        if(this.checkStart){
            this.updateStart();
        }

        if(!this.chestPlayed){
            this.updateChest();
        }
        // this.updateChest();
        if(this.startFall){
            this.addItem(this.imgName); 
            this.collidesItem();
        }

        if(this.checkingScore){
            this.displayScore();
        }

        // left arrow key or the 'A' key
        if(cursors.left.isDown){
            this.player.body.setAccelerationX(-this.ACCELERATION); //make player move left
            this.player.setFlip(true, false); //flip the animation so it faces right
            this.player.anims.play('run', true); //play the walking animation
        } else if(cursors.right.isDown) { //if player presses right arrow key or uses the 'D' key
            this.player.body.setAccelerationX(this.ACCELERATION); //move player right
            this.player.resetFlip(); //reset animation to face left
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
            // this.player.setTexture('jumping'); 
            // this.player.anims.play('jump');
            // this.player.setTexture('jump'); //if player is not on platform, they are in the air i.e. jumping
	    }

        //if up arrow key is pressed and we have not reached max jumps yet
        if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
	        this.player.body.velocity.y = this.JUMP_VELOCITY; //set player velocity used to jump
	        this.jumping = true; //set jumping to true
            // this.player.anims.play('jump', true);
            this.player.setTexture('jumping'); 
	    } 

        //if player is jumping and up arrow is pressed
        if(this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
	    	this.jumps--; //subtract number of jumps player has left
	    	this.jumping = false; //set jumping to false
            // this.sound.play('boing'); //play boing sound effect
	    }

    }

    updateChest() {
        this.physics.add.collider(this.player, this.chest1, (player, chest) =>{
            if(!this.chestPlayed){
                this.startRules.visible = false;
                this.chest2.destroy();
                this.chest3.destroy();
                this.chest4.destroy();

                this.time.delayedCall(500, () => {
                    this.sound.play('chimes'); 
                    chest.anims.play("chest1");
                }, null, this);

                chest.on('animationcomplete', () => {
                    this.setAnimation(170);
                    this.setText();
                    chest.body.checkCollision.down = false; 
                });

                this.chestPlayed = true;
            }
        });

        this.physics.add.collider(this.player, this.chest2, (player, chest) =>{
            if(!this.chestPlayed){
                this.startRules.visible = false;
                this.chest1.destroy();
                this.chest3.destroy();
                this.chest4.destroy();

                this.time.delayedCall(500, () => {
                    this.sound.play('chimes'); 
                    chest.anims.play("chest2");
                }, null, this);

                chest.on('animationcomplete', () => {
                    this.setAnimation(320);
                    this.setText();
                    chest.body.checkCollision.down = false; 
                });

                this.chestPlayed = true;
            }
        });

        this.physics.add.collider(this.player, this.chest3, (player, chest) =>{
            if(!this.chestPlayed){
                this.startRules.visible = false;
                this.chest1.destroy();
                this.chest2.destroy();
                this.chest4.destroy();

                this.time.delayedCall(500, () => {
                    this.sound.play('chimes'); 
                    chest.anims.play("chest3");
                }, null, this);

                chest.on('animationcomplete', () => {
                    this.setAnimation(470);
                    this.setText();
                    chest.body.checkCollision.down = false; 
                });

                this.chestPlayed = true;
            } 
        });

        this.physics.add.collider(this.player, this.chest4, (player, chest) =>{
            if(!this.chestPlayed){
                this.startRules.visible = false;
                this.chest1.destroy();
                this.chest2.destroy();
                this.chest3.destroy();

                this.time.delayedCall(500, () => {
                    this.sound.play('chimes'); 
                    chest.anims.play("chest4");
                }, null, this);

                chest.on('animationcomplete', () => {
                    this.setAnimation(620);
                    this.setText();
                    chest.body.checkCollision.down = false; 
                });

                this.chestPlayed = true;
            }
        });
        
    }

    //setting each image so once it spins, it lands on the frame where the player is faced forward
    getPowerFront(){
        if(this.powerAnim === 'tincan'){
            this.powerFront = 4;
        } else if(this.powerAnim === 'scarecrow'){
            this.powerFront = 4;
        } else if(this.powerAnim === 'lion'){
            this.powerFront = 0;
        } else if(this.powerAnim === 'monkey'){
            this.powerFront = 1;
        }
    }

    //plays each character animation and stops at the frame where character is facing forward
    setAnimation(x){
        this.getPowerFront(); //gets the frame number where the character is facing forward
        this.power.x = x; //sets the position of character to the chest that was hit
        this.power.visible = true; //makes the character visible
        this.power.anims.play(this.powerAnim); //plays animation
        this.power.on('animationcomplete', () => { //stops at the frame where character is facing forward
            this.power.anims.pause(this.power.anims.currentAnim.frames[this.powerFront]);
        });
    }

    setText(){
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

        //adding text description of player and goal
        this.intro = this.add.text(game.config.width/2, 50, this.text, textConfig).setOrigin(0.5);
        textConfig.color = '#e38222';
        this.rules = this.add.text(game.config.width/2, 100, this.textGoal, textConfig).setOrigin(0.5);

        textConfig.color = '#f54242';
        textConfig.fontFamily = 'ka1';
        textConfig.fontSize = '30px';
        // this.start = this.add.text(game.config.width/2, 160, 'START', textConfig).setOrigin(0.5);
        // this.start.setInteractive();
        // this.checkStart = true;

        if(this.powerAnim === 'monkey'){
            this.next = this.add.text(game.config.width/2, 160, 'NEXT', textConfig).setOrigin(0.5);
            this.next.setInteractive();
            this.checkNext = true;
        } else {
            this.start = this.add.text(game.config.width/2, 160, 'START', textConfig).setOrigin(0.5);
            this.start.setInteractive();
            this.checkStart = true;
        }
    }

    updateStart() {
        //if mouse is hovering text
        this.start.on('pointerover', () => {
            this.start.setTint(0xcf0000); //set tint
        });
        
        //if mouse is not hovering text
        this.start.on('pointerout', () => {
            this.start.clearTint(); //clear tint and revert to original color
        });
        
        //if mouse clicks text
        this.start.on('pointerdown', () => {
            this.start.clearTint();
            //if sound hasn't played yet
            if(!this.clicked){
                this.sound.play('sfx_select'); // play selector sound
                this.clicked = true; //set boolean to true
                // this.item = new Items(this, this.imgName);
                // this.itemGroup.add(this.item); 
                this.intro.visible = false;
                this.rules.visible = false;
                this.start.visible = false;
                this.chest1.visible = false;
                this.chest2.visible = false;
                this.chest3.visible = false;
                this.chest4.visible = false;
                this.power.visible = false;

                this.time.delayedCall(1000, () => {
                    this.item = new Items(this, this.imgName);
                    this.itemGroup.add(this.item); 
                    this.startFall = true;
                    // this.checkStart = false;
                    // this.start.disableInteractive();
                }, null, this);
            }

            // this.startFall = true;
            this.checkStart = false;
            this.start.disableInteractive();

        });
    }

    updateNext() {
        // console.log('in updateNext');
        //if mouse is hovering text
        this.next.on('pointerover', () => {
            // console.log('hovering over');
            this.next.setTint(0xcf0000); //set tint
        });
        
        //if mouse is not hovering text
        this.next.on('pointerout', () => {
            this.next.clearTint(); //clear tint and revert to original color
        });
        
        //if mouse clicks text
        this.next.on('pointerdown', () => {
            this.next.clearTint();
            //if sound hasn't played yet
            if(!this.clicked){
                this.sound.play('sfx_select'); // play selector sound
                this.powerMusic.stop();
                this.clicked = true; //set boolean to true
                this.scene.start('bossBattleScene');
            }
            this.checkNext = false;

        });
    }

    setItemImage() {
        if(this.powerAnim === 'tincan'){
            this.imgName = 'heart';
        } else if(this.powerAnim === 'scarecrow'){
            this.imgName = 'brain';
        } else if(this.powerAnim === 'lion'){
            this.imgName = 'fire';
        }
    }

    addItem(item) {
        while(this.count > 0 && this.item.y > 30 && this.item.newItem){
            this.item = new Items(this, item);
            this.itemGroup.add(this.item); 
            this.count--;
        }
    }

    collidesItem() {
        this.physics.add.overlap(this.player, this.itemGroup, (player, item) =>{
            item.destroy();
            this.sound.play('collect'); 
            this.score++;
            console.log(this.score);
        });
    }

    displayScore() {
        if(this.count <= 0){
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
            

            this.time.delayedCall(2000, () => {
                //adding text description of player and goal
                this.add.text(game.config.width/2, 200, 'You collected a total of       ' + this.imgName + 's', textConfig).setOrigin(0.5);
                textConfig.color = '#e38222';
                textConfig.fontFamily = 'ka1';
                textConfig.fontSize = '30px';
                this.add.text(game.config.width/2 + 150, 200, this.score, textConfig).setOrigin(0.5);
                this.time.delayedCall(1000, () => {
                    this.checkScore();
                    // this.showScore = false;
                }, null, this);
            }, null, this);

        }
    }

    checkScore() {
        //setting text configuration
        let textConfig = {
            fontFamily: 'joystix',
            fontSize: '20px',
            color: '#e38222',
            align: 'center',
            wordWrap: { 
                width: game.config.width - 100
            },
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        if(this.score >= 10){
            hasPowerUp = true;
            this.add.text(game.config.width/2, 275, 'Congrats! You collected enough items to have a power up next round.', textConfig).setOrigin(0.5);
        } else {
            hasPowerUp = false;
            this.add.text(game.config.width/2, 275, 'Awww, you didn\'t collect enough items. Move on to the next round with no benefit', textConfig).setOrigin(0.5);
        }

        textConfig.fontSize = '30px';
        textConfig.fontFamily = 'ka1';
        textConfig.color = '#f54242';
        this.next = this.add.text(game.config.width - 175, 350, 'NEXT', textConfig);
        this.next.setInteractive();
        this.checkNext = true;
        this.checkingScore = false;
        this.clicked = false;

    }
}
