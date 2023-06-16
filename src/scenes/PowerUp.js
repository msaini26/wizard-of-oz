class PowerUp extends Phaser.Scene {
    constructor() {
        super('powerUpScene');
    }

    // preload assets
    preload() {
        this.load.path = '/assets/'; //set loading path

        //loading images that tilemap uses
        this.load.image('terrainImage', './terrain/Terrain.png');
        this.load.image('yellowImage', './tilemaps/Yellow.png');

        //loading tilemap
        this.load.tilemapTiledJSON('YellowBrickJSON', './tilemaps/YellowBrick.json');

        //load player movements
        this.load.image('jumping','./dorothy/png/jump1.png');

        //loading chest images
        this.load.atlas("chest", "./powerups/png/chest.png", "./powerups/json/chest.json");

        // chest character options
        this.load.atlas("friends", "./powerups/png/friends.png", "./powerups/json/friends.json");
        this.load.atlas("monkey", "./powerups/png/monkey.png", "./powerups//json/monkey.json");
        this.load.atlas("lion", "./powerups/png/lion.png", "./powerups/json/lion.json");

        //loading collectable items
        this.load.image('brain', './powerups/png/scarecrow-brain.png');
        this.load.image('heart', './powerups/png/heart.png');
        this.load.image('fire', './powerups/png/fire.png');

    }

    create() {
        //defining constant variables
        this.ACCELERATION = 1000;
        this.DRAG = 900; 
        this.JUMP_VELOCITY = -700;
        this.MAX_JUMPS = 3;
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

        //group of collectable items
        this.itemGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });


        //animation for first chest
        this.anims.create({
            key: 'chest1',
            frameRate: 10,
            frames: this.anims.generateFrameNames("chest", { 
                prefix: 'sprite',
                start: 6, 
                end: 10 }),
            repeat: 0
        });

        //adding in first chest
        this.chest1 = this.physics.add.sprite(200, 250, 'chest', 'sprite1').setScale(4);
        this.chest1.setSize(30, 30); // Change the size of the bounding box.
        this.chest1.setOffset(1, 2); // Change the location of the bounding box.
        this.chest1.body.immovable = true; // don't move chest
        this.chest1.body.allowGravity = false; // don't allow chest to fall

        //only check bottom of chest collision
        this.chest1.body.checkCollision.up = false; 
        this.chest1.body.checkCollision.left = false;
        this.chest1.body.checkCollision.right = false;


        //animation for second chest
        this.anims.create({
            key: 'chest2',
            frameRate: 10,
            frames: this.anims.generateFrameNames("chest", { 
                prefix: 'sprite',
                start: 16, 
                end: 20 }),
            repeat: 0
        });

        //adding in second chest
        this.chest2 = this.physics.add.sprite(350, 250, 'chest', 'sprite11').setScale(4);
        this.chest2.setSize(30, 30);  // Change the size of the bounding box.
        this.chest2.setOffset(1, 2); // Change the location of the bounding box.
        this.chest2.body.immovable = true; // don't move chest
        this.chest2.body.allowGravity = false; // don't allow chest to fall

        //only check bottom of chest collision
        this.chest2.body.checkCollision.up = false; 
        this.chest2.body.checkCollision.left = false;
        this.chest2.body.checkCollision.right = false;


        //animation for third chest
        this.anims.create({
            key: 'chest3',
            frameRate: 10,
            frames: this.anims.generateFrameNames("chest", { 
                prefix: 'sprite',
                start: 26, 
                end: 30 }),
            repeat: 0
        });

        //adding in third chest
        this.chest3 = this.physics.add.sprite(500, 250, 'chest', 'sprite21').setScale(4);
        this.chest3.setSize(30, 30); // Change the size of the bounding box.
        this.chest3.setOffset(1, 2); // Change the location of the bounding box.
        this.chest3.body.immovable = true; // don't move chest
        this.chest3.body.allowGravity = false; // don't let chest fall

        //only check bottom of chest collision
        this.chest3.body.checkCollision.up = false; 
        this.chest3.body.checkCollision.left = false;
        this.chest3.body.checkCollision.right = false;


        //animation for fourth chest
        this.anims.create({
            key: 'chest4',
            frameRate: 15,
            frames: this.anims.generateFrameNames("chest", { 
                prefix: 'sprite',
                start: 36, 
                end: 40 }),
            repeat: 0
        });

        //adding in fourth chest
        this.chest4 = this.physics.add.sprite(650, 250, 'chest', 'sprite31').setScale(4);
        this.chest4.setSize(30, 30); // Change the size of the bounding box.
        this.chest4.setOffset(1, 2); // Change the location of the bounding box.
        this.chest4.body.immovable = true; // don't move chest
        this.chest4.body.allowGravity = false; // don't let chest fall

        //only check bottom of chest collision
        this.chest4.body.checkCollision.up = false; 
        this.chest4.body.checkCollision.left = false;
        this.chest4.body.checkCollision.right = false;

        this.chestPlayed = false; //boolean to keep track that chest only plays animation once


        //creating the power up character
        this.power = this.physics.add.sprite(620, 240, 'friends', 'sprite13').setScale(4);
        this.power.body.immovable = true; 
        this.power.body.allowGravity = false; 

        this.power.visible = false; //keeping character hidden until chest opens

        //animation for tincan character
        this.anims.create({
            key: 'tincan',
            frameRate: 15,
            frames: this.anims.generateFrameNames("friends", { 
                prefix: 'sprite',
                start: 9, 
                end: 16 }),
            repeat: 0
        });

        //creating scarecrow character animation
        this.anims.create({
            key: 'scarecrow',
            frameRate: 15,
            frames: this.anims.generateFrameNames("friends", { 
                prefix: 'sprite',
                start: 73, 
                end: 80 }),
            repeat: 0
        });
        
        //creating monkey character animation
        this.anims.create({
            key: 'monkey',
            frameRate: 3,
            frames: this.anims.generateFrameNames("monkey", { 
                prefix: 'sprite',
                start: 1, 
                end: 4 }),
            repeat: 0
        });

        //creating lion character animation
        this.anims.create({
            key: 'lion',
            frameRate: 10,
            frames: this.anims.generateFrameNames("lion", { 
                prefix: 'lion',
                start: 1, 
                end: 4 }),
            repeat: 0
        });

        this.powerlist = ['tincan', 'lion', 'scarecrow', 'monkey']; //list of all the characters
        this.powerAnim = Phaser.Utils.Array.GetRandom(this.powerlist); //chooses random character from list to pop out of chest
        this.powerFront = 0; //will be used later to assign which frame each character's front faced one is
        this.text = ''; //text to display for each character's introduction
        this.textGoal = ''; //text to display for the player's goal during the level

        //assigning the text to fit each character's description
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

        //setting collision
        this.player.body.setCollideWorldBounds(true); //so player can't exit screen/bounds

        //physics collision
        this.physics.add.collider(this.player, terrainLayer);

        //defining cursor input
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

        //start directions for powerup level
        this.startRules = this.add.text(game.config.width/2, 100, 'You have traveled to the Land of Oz. Hit one of the chests to see which friend you meet!', textConfig).setOrigin(0.5);

        //will be used later to use the right item image based on the random character
        this.imgName = '';
        this.setItemImage(); //calls a function that sets the right item image

        //number of items that will fall from the sky
        this.count = 75;

        //variables used to prevent multiple updates from happening
        this.startFall = false; //so items only fall once
        this.checkStart = false; //only updates once start is initialized
        this.checkNext = false; //only updates once checkNext is initialized
        this.clicked = false; //so player only clicks button once
        this.checkingScore = true; //only displays score once all items have fallen

        this.score = 0; //initializes score = number of items collected

    }

    update() {
        //check if next button is available, if so, update next
        if(this.checkNext){
            this.updateNext();
        }

        //check if start button is available, if so, update start
        if(this.checkStart){
            this.updateStart();
        }

        //checks so chest is only played once
        if(!this.chestPlayed){
            this.updateChest();
        }

        //checks so items only fall once
        if(this.startFall){
            this.addItem(this.imgName);  //keeps adding items until it has reached the count
            this.collidesItem(); //checks if player overlaps with the items
        }

        //checks to make sure score is only displayed once after all items have fallen
        if(this.checkingScore){
            this.displayScore();
        }

        //if left arrow key is pressed
        if(cursors.left.isDown){
            this.player.body.setAccelerationX(-this.ACCELERATION); //make player move left
            this.player.setFlip(true, false); //flip the animation so it faces right
            this.player.anims.play('run', true); //play the walking animation
        } else if(cursors.right.isDown) { //if player presses right arrow key
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
	    }

        //if up arrow key is pressed and we have not reached max jumps yet
        if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
	        this.player.body.velocity.y = this.JUMP_VELOCITY; //set player velocity used to jump
	        this.jumping = true; //set jumping to true
            this.player.setTexture('jumping'); //set image to jumping image
	    } 

        //if player is jumping and up arrow is pressed
        if(this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
	    	this.jumps--; //subtract number of jumps player has left
	    	this.jumping = false; //set jumping to false
	    }
    }

    //method used to check which chest the player collides with and to play the animations
    updateChest() {
        //if player collides with first chest
        this.physics.add.collider(this.player, this.chest1, (player, chest) =>{
            if(!this.chestPlayed){ //if animation hasn't been played yet
                this.startRules.visible = false; //make beginning rules disappear

                //destroy the other chests
                this.chest2.destroy();
                this.chest3.destroy();
                this.chest4.destroy();

                this.time.delayedCall(500, () => { //slight delay call to play animation
                    this.sound.play('chimes'); //play sound
                    chest.anims.play("chest1"); //play animation for chest
                }, null, this);

                chest.on('animationcomplete', () => { //once chest animation is complete
                    this.setAnimation(170); //set character position to where chest is
                    this.setText(); //set the text based on each character
                    chest.body.checkCollision.down = false; //make it so chest is no longer collidable
                });

                this.chestPlayed = true; //set chest play to true
            }
        });

        //if player collides with second chest
        this.physics.add.collider(this.player, this.chest2, (player, chest) =>{
            if(!this.chestPlayed){ //if animation hasn't been played yet
                this.startRules.visible = false; //make beginning rules disappear

                //destroy the other chests
                this.chest1.destroy();
                this.chest3.destroy();
                this.chest4.destroy();

                this.time.delayedCall(500, () => { //slight delay call to play animation
                    this.sound.play('chimes'); //play sound
                    chest.anims.play("chest2"); //play animation for chest
                }, null, this);

                chest.on('animationcomplete', () => { //once chest animation is complete
                    this.setAnimation(320);//set character position to where chest is
                    this.setText(); //set the text based on each character
                    chest.body.checkCollision.down = false; //make it so chest is no longer collidable
                });

                this.chestPlayed = true; //set chest play to true
            }
        });

        //if player collides with third chest
        this.physics.add.collider(this.player, this.chest3, (player, chest) =>{
            if(!this.chestPlayed){ //if animation hasn't been played yet
                this.startRules.visible = false; //make beginning rules disappear

                //destroy the other chests
                this.chest1.destroy();
                this.chest2.destroy();
                this.chest4.destroy();

                this.time.delayedCall(500, () => { //slight delay call to play animation
                    this.sound.play('chimes'); //play sound
                    chest.anims.play("chest3"); //play animation for chest
                }, null, this);

                chest.on('animationcomplete', () => { //once chest animation is complete
                    this.setAnimation(470); //set character position to where chest is
                    this.setText(); //set the text based on each character
                    chest.body.checkCollision.down = false; //make it so chest is no longer collidable
                });

                this.chestPlayed = true; //set chest play to true
            } 
        });

        //if player collides with fourth chest
        this.physics.add.collider(this.player, this.chest4, (player, chest) =>{
            if(!this.chestPlayed){ //if animation hasn't been played yet
                this.startRules.visible = false; //make beginning rules disappear

                //destroy the other chests
                this.chest1.destroy();
                this.chest2.destroy();
                this.chest3.destroy();

                this.time.delayedCall(500, () => { //slight delay call to play animation
                    this.sound.play('chimes'); //play sound
                    chest.anims.play("chest4"); //play animation for chest
                }, null, this);

                chest.on('animationcomplete', () => { //once chest animation is complete
                    this.setAnimation(620); //set character position to where chest is
                    this.setText(); //set the text based on each character
                    chest.body.checkCollision.down = false; //make it so chest is no longer collidable
                });

                this.chestPlayed = true; //set chest play to true
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

    //sets the intro and goal text based on the randomly chosen character
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

        //if the character is the evil monkey, player doesn't get any benefit so they move on to next level
        if(this.powerAnim === 'monkey'){
            this.next = this.add.text(game.config.width/2, 160, 'NEXT', textConfig).setOrigin(0.5);
            this.next.setInteractive();
            this.checkNext = true;
            hasPowerUp = false;
        } else { //otherwise, player continues with powerup scene and collects items
            this.start = this.add.text(game.config.width/2, 160, 'START', textConfig).setOrigin(0.5);
            this.start.setInteractive();
            this.checkStart = true;
        }
    }

    //method that checks if player clicks on start to begin collecting items
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
            //if button hasn't been clicked
            if(!this.clicked){
                this.sound.play('sfx_select'); // play selector sound
                this.clicked = true; //set boolean to true

                //make everything currently on the screen disappear
                this.intro.visible = false;
                this.rules.visible = false;
                this.start.visible = false;
                this.chest1.visible = false;
                this.chest2.visible = false;
                this.chest3.visible = false;
                this.chest4.visible = false;
                this.power.visible = false;

                //start dropping items after 1 second
                this.time.delayedCall(1000, () => {
                    this.item = new Items(this, this.imgName); //creating a new item
                    this.itemGroup.add(this.item); //adding it to group
                    this.startFall = true; //set start fall to true
                }, null, this);
            }

            this.checkStart = false; //set check start to false
            this.start.disableInteractive(); //disable button interaction
        });
    }

    //method that checks if player clicks on next to move on to next scene
    updateNext() {
        //if mouse is hovering text
        this.next.on('pointerover', () => {
            this.next.setTint(0xcf0000); //set tint
        });
        
        //if mouse is not hovering text
        this.next.on('pointerout', () => {
            this.next.clearTint(); //clear tint and revert to original color
        });
        
        //if mouse clicks text
        this.next.on('pointerdown', () => {
            this.next.clearTint();
            //if button hasn't been clicked yet
            if(!this.clicked){
                this.sound.play('sfx_select'); // play selector sound
                this.powerMusic.stop();
                this.clicked = true; //set boolean to true
                this.scene.start('bossBattleScene'); //move to next scene
            }
            this.checkNext = false;

        });
    }

    //setting correct item image based on randomly chosen character
    setItemImage() {
        if(this.powerAnim === 'tincan'){
            this.imgName = 'heart';
        } else if(this.powerAnim === 'scarecrow'){
            this.imgName = 'brain';
        } else if(this.powerAnim === 'lion'){
            this.imgName = 'fire';
        }
    }

    //add items until we have hit counter
    addItem(item) {
        //adds items until we have reached counter and only spawns new items once they have reached a certain height
        while(this.count > 0 && this.item.y > 30 && this.item.newItem){
            this.item = new Items(this, item); //creating new item
            this.itemGroup.add(this.item); //adding to group
            this.count--; //one less item to make
        }
    }

    //checks if player overlaps with items
    collidesItem() {
        //if player and item overlaps
        this.physics.add.overlap(this.player, this.itemGroup, (player, item) =>{
            item.destroy(); //destroy the item
            this.sound.play('collect');  //play the sound
            this.score++; //increase the score
        });
    }

    //method to display score once collection has finished
    displayScore() {
        if(this.count <= 0){ //check if all items have fallen
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
            
            //2 second delay call to display how many items the player has collected
            this.time.delayedCall(2000, () => {
                //adding text for how many items collected
                this.add.text(game.config.width/2, 200, 'You collected a total of       ' + this.imgName + 's', textConfig).setOrigin(0.5);
                textConfig.color = '#e38222';
                textConfig.fontFamily = 'ka1';
                textConfig.fontSize = '30px';
                this.add.text(game.config.width/2 + 150, 200, this.score, textConfig).setOrigin(0.5); //player's score
                this.time.delayedCall(1000, () => { //delayed call to check if player collected enough items to have benefit in next round
                    this.checkScore();
                }, null, this);
            }, null, this);

        }
    }

    //checks if player collected enough items
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

        if(this.score >= 10){ //if player collected at least 10 items, they get benefit
            hasPowerUp = true;
            this.add.text(game.config.width/2, 275, 'Congrats! You collected enough items to have a power up next round.', textConfig).setOrigin(0.5);
        } else { //otherwise, they don't have any help
            hasPowerUp = false;
            this.add.text(game.config.width/2, 275, 'Awww, you didn\'t collect enough items. Move on to the next round with no benefit', textConfig).setOrigin(0.5);
        }

        //setting next button to move on to next scene
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
