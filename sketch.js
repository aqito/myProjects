/*

The Game Project 5 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlumeting;

var game_score;
var flagpole;
var lives;
var platforms;
var enemies;

function setup()
{
    createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 4;
    
    startGame();
}

function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    mountains = 
    {
        pos_X: [-100, 500, 800, 1200, 1500], 
        pos_Y: floorPos_y
    }; 

    clouds = 
        {
            pos_X: [0, 400, 800],
            pos_Y: [100, 250, 50],
            size: 1
        };

    trees = 
        {
            pos_X: [51, 234, 641, 981, 1024, 1324],
            pos_Y: floorPos_y + 50
        };

    collectable =  
    [
        {pos_X: -300, pos_Y: 0, size: 1.0, isFound: false},
        {pos_X: 400, pos_Y: 0, size: 1.0, isFound: false},
        {pos_X: 800, pos_Y: 0, size: 1.0, isFound: false},
        {pos_X: 1200, pos_Y: 0, size: 1.0, isFound: false}
    ];

    canyon =    
    [
        {pos_X: 250, width: 1.0},
        {pos_X: 800, width: 1.0},
        {pos_X: 1200, width: 1.0}
    ];

    //initialise gamescore
    game_score = 0;

    flagpole = 
    {
        x_pos: 1800,
        isReached: false
    }
    
    //initialise lives
    lives -= 1;
    
    platforms = [];
    
    platforms.push(createPlatform(400, floorPos_y - 100, 150));
    platforms.push(createPlatform(500 , floorPos_y - 180, 80));
    platforms.push(createPlatform(800, floorPos_y - 100, 150));
    
    enemies = [];
    
    enemies.push(new Enemy(0, floorPos_y, 100));
    enemies.push(new Enemy(700, floorPos_y, 100));
    enemies.push(new Enemy(1400, floorPos_y, 200));
}

function draw()
{
    // fill the sky blue
	background(100, 155, 255); 

	noStroke();
    // draw some green ground
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); 
    
    push()
    translate(scrollPos,0)
    
	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();
    
	// Draw trees.
    drawTrees();

	// Draw canyons.
    for(var i = 0; i < canyon.length; i++)
        {
            drawCanyon(canyon[i]);
            checkCanyon(canyon[i]);
        }
    
	// Draw collectable items.
    for(var i = 0; i < collectable.length; i++)
    {  
        if(collectable[i].isFound == false)
        {
                drawCollectable(collectable[i]);
                checkCollectable(collectable[i]);
        }
    }
    
    //draw flagpole
    renderFlagpole();
    
    //check if flagpole is reached
    if(flagpole.isReached == false && gameChar_y < floorPos_y)
    {
        checkFlagpole();
    }
    
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    //draw enemy
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].update();
        enemies[i].draw();
        if(enemies[i].isContact(gameChar_world_x, gameChar_y))
        {
            startGame();
            break;
        }
    }
    
    pop()
    
	// Draw game character.
	drawGameChar();
    
    //Text for score and lives
    fill(255);
    text("Score: " + game_score, 20, 20);
    text("Lives " + lives, 20, 40);
    
    //Draw life tokens
    drawLife();
    
    if(lives < 1)
    {
        textSize = 100;
        fill(255);
        text("Game over. Press space to continue",
             width / 2, height / 2);
        return
    }
    
    if(flagpole.isReached)
    {
        textSize = 100;
        fill(255);
        text("Level complete. Press space to continue",
             width / 2, height / 2);
        return
    }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
    

	}

	// Logic to make the game character rise and fall.
    //makes char jump
    
    //makes char jump
    if(isFalling)
    {
        gameChar_y = gameChar_y - 100;
    }
    
    //makes char fall
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true
            )
            {
                isContact = true;
                break;
            }
            if(isContact == false)
            {
                gameChar_y += 2;
                isFalling = true;
            }
            else
            {
                isFalling = false;
            }
        }
    }
    
    // if char is on floor pos falling = false
    else(gameChar_y == floorPos_y)
    {
        isFalling = false;
    }
    
    if(gameChar_y >= height && lives > 0)
        {
            startGame();
        }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	console.log("press" + keyCode);
	console.log("press" + key);

    //move left
    if(keyCode == 37)
    {
        isLeft = true;
    }
    //move right
    if(keyCode == 39)
    {
        isRight = true;
    }
    //jump
    if(keyCode == 32)
    {
        isFalling = true;
    }
    
    if(flagpole.isReached && key == ' ')
    {
        nextLevel();
        return
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return
    }

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    
    //stops left movement
    if(keyCode == 37)
    {
        isLeft = false;
    }
    //stops right movement
    if(keyCode == 39)
    {
        isRight = false;
    }
    //stops jump
    if(keyCode == 32)
    {
        isFalling = false;
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
        // add your jumping-left code
        fill(255);
        stroke(0);
        //body
        fill(119,136,153)
        ellipse(gameChar_x, gameChar_y - 30, 20, 30);
        //head
        fill(255);
        ellipse(gameChar_x, gameChar_y - 50, 15, 15);
        //arm
        fill(255);
        triangle(
                gameChar_x - 1, 
                gameChar_y - 40,
                gameChar_x - 1,
                gameChar_y - 24,
                gameChar_x - 18,
                gameChar_y - 40);
        //boosters
        fill(135,206,250);
        quad(
            gameChar_x - 3, gameChar_y - 17,
            gameChar_x + 3, gameChar_y - 17,
            gameChar_x + 8, gameChar_y - 7,
            gameChar_x - 7, gameChar_y - 7);

	}
	else if(isRight && isFalling)
	{
        // add your jumping-right code
        fill(255);
        stroke(0);
        //head
        ellipse(gameChar_x, gameChar_y - 50, 15, 15);
        //body
        fill(119,136,153)
        ellipse(gameChar_x, gameChar_y - 30, 20, 30);
        //arm
        fill(255);
        triangle(gameChar_x - 1,
                 gameChar_y - 40,
                 gameChar_x - 1,
                 gameChar_y - 24,
                 gameChar_x + 18,
                 gameChar_y - 40);
        //boosters
        fill(135,206,250);
        quad(gameChar_x - 3, gameChar_y - 17,
        gameChar_x + 3, gameChar_y - 17,
        gameChar_x + 8, gameChar_y - 7,
        gameChar_x - 7, gameChar_y - 7);
	}
	else if(isLeft)
	{
        // add your walking left code
        fill(255);
        stroke(0);
        //head
        ellipse(gameChar_x, gameChar_y - 50, 15,15);
        //body
        fill(119,136,153)
        ellipse(gameChar_x, gameChar_y - 20, 10, 40);
        //arm
        fill(255);
        triangle(gameChar_x - 1,gameChar_y - 30,gameChar_x - 1,gameChar_y - 14,gameChar_x - 18,gameChar_y - 30);

    }
    else if(isRight)
    {
            // add your walking right code
        fill(255);
        stroke(0);
        //head
        ellipse(gameChar_x, gameChar_y - 50, 15,15);
        //body
        fill(119,136,153)
        ellipse(gameChar_x, gameChar_y - 20, 10, 40);
        //arm
        fill(255);
        triangle(gameChar_x - 1,gameChar_y - 30,gameChar_x - 1,gameChar_y - 14,gameChar_x + 18,gameChar_y - 30);
	}
	else if(isFalling || isPlumeting)
	{
        // add your jumping facing forwards code
        fill(255);
        stroke(0);
        //head
        fill(255);
        ellipse(gameChar_x, gameChar_y - 50, 15, 15);
        //eyes
        ellipse(gameChar_x + 3, gameChar_y - 52 , 3, 3);
        ellipse(gameChar_x - 3, gameChar_y - 52, 3, 3);
        //smile        
        fill(255);
        beginShape();
        curveVertex(gameChar_x -4, gameChar_y - 49);
        curveVertex(gameChar_x -1,  gameChar_y - 46);
        curveVertex(gameChar_x + 1,  gameChar_y - 46);
        curveVertex(gameChar_x + 4,  gameChar_y - 49);
        endShape();
        //leftArm
        fill(135,206,250);
        beginShape();
        vertex(gameChar_x - 10, gameChar_y - 27);
        vertex(gameChar_x - 16, gameChar_y - 4);
        vertex(gameChar_x - 10, gameChar_y - 11);
        endShape();
        //rightArm
        beginShape();
        vertex(gameChar_x + 10, gameChar_y - 27);
        vertex(gameChar_x + 15, gameChar_y - 4);
        vertex(gameChar_x + 8, gameChar_y - 9);
        endShape();   
        //body
        fill(119,136,153)
        ellipse(gameChar_x, gameChar_y - 20, 20, 40);
	}
	else
	{
        // add your standing front facing code
        fill(255);
        stroke(0);
        //head
        fill(255);
        ellipse(gameChar_x, gameChar_y - 35, 15, 15);
        //eyes
        ellipse(gameChar_x + 3, gameChar_y - 37 , 3, 3);
        ellipse(gameChar_x - 3, gameChar_y - 37, 3, 3);
        //smile        
        ellipse(gameChar_x, gameChar_y -33, 5, 3);  
        //body
        fill(119,136,153)
        ellipse(gameChar_x, gameChar_y - 15, 20, 30);  
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.pos_X.length ; i++)
        {
            fill(255);
            ellipse(clouds.pos_X[i],
                    clouds.pos_Y[i],
                    100, 100);
            ellipse(clouds.pos_X[i] + 50,
                    clouds.pos_Y[i],
                    75, 75);
            ellipse(clouds.pos_X[i] - 50,
                    clouds.pos_Y[i],
                    75, 75);
            ellipse(clouds.pos_X[i] + 100,
                    clouds.pos_Y[i],
                    100, 100);
            ellipse(clouds.pos_X[i] + 150,
                    clouds.pos_Y[i], 75, 75);
            ellipse(clouds.pos_X[i] - 50,
                    clouds.pos_Y[i], 75, 75); 
        }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.pos_X.length; i++)
        {
            fill(105,105,105);
            triangle(mountains.pos_X[i] - 50,
                     mountains.pos_Y,
                     mountains.pos_X[i] + 125,
                     mountains.pos_Y - 450,
                     mountains.pos_X[i] + 300,
                     mountains.pos_Y);

            triangle(mountains.pos_X[i] - 100,
                 mountains.pos_Y,
                 mountains.pos_X[i],
                 mountains.pos_Y - 300,
                 mountains.pos_X[i] + 100,
                 mountains.pos_Y); 
        }
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees.pos_X.length; i++)
        {
            //trunk
            fill(139,69,19)
            rect(trees.pos_X[i] - 25,
                 trees.pos_Y - 150,
                 25,100);
            //leaves
            fill(0,128,0);
            triangle(
                (trees.pos_X[i] - 75),
                (trees.pos_Y - 150),
                (trees.pos_X[i]),
                (trees.pos_Y - 300),
                (trees.pos_X[i] +75),
                (trees.pos_Y - 150));
            fill(255,255,0);
            ellipse(trees.pos_X[i] - 10,
                    trees.pos_Y - 250,
                    10,10);
            ellipse(trees.pos_X[i],
                    trees.pos_Y - 200,
                    10,10);
            ellipse(trees.pos_X[i] + 15,
                    trees.pos_Y - 225,
                    10,10);
            ellipse(trees.pos_X[i] - 25,
                    trees.pos_Y - 230,
                    10,10);
        }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(0,0,205);
    quad
    (((t_canyon.pos_X) + 50) * t_canyon.width,
    600,
    ((t_canyon.pos_X) + 200) * t_canyon.width,
    600,
    ((t_canyon.pos_X) + 170 * t_canyon.width),
    floorPos_y,
    ((t_canyon.pos_X) + 70) * t_canyon.width,
    floorPos_y);
    
    fill(0,191,255);
    quad(
    ((t_canyon.pos_X) + 68) * t_canyon.width,
    600,
    ((t_canyon.pos_X) + 180) * t_canyon.width,
    600,
    ((t_canyon.pos_X) + 160) * t_canyon.width,
    floorPos_y,
    ((t_canyon.pos_X) + 80) * t_canyon.width,
    floorPos_y);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
        if(gameChar_y >= floorPos_y)
    {
        if( gameChar_world_x > t_canyon.pos_X + 70
           &&
            gameChar_world_x < t_canyon.pos_X + 170)
        {
            isPlumeting = true;
            gameChar_y += 8;
        }
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(0);
    rect(
    (t_collectable.pos_X + 400) * t_collectable.size,
    (t_collectable.pos_Y + 332) * t_collectable.size,
    (100) * t_collectable.size,
    (100) * t_collectable.size
    );
    
    fill(255,255,0);
    rect(
    (t_collectable.pos_X + 400) * t_collectable.size,
    (t_collectable.pos_Y + 332) * t_collectable.size,
    (100) * t_collectable.size,
    (15) * t_collectable.size
    );
    
    fill(255);
    ellipse(
    (t_collectable.pos_X + 450) * t_collectable.size,
    (t_collectable.pos_Y + 372) * t_collectable.size,
    15 * t_collectable.size,
    15 * t_collectable.size);
    
    fill(255);
    triangle(
    (t_collectable.pos_X + 450) * t_collectable.size,
    (t_collectable.pos_Y + 372) * t_collectable.size,
    (t_collectable.pos_X + 435) * t_collectable.size,
    (t_collectable.pos_Y + 395) * t_collectable.size,
    (t_collectable.pos_X + 465) * t_collectable.size,
    (t_collectable.pos_Y + 395) * t_collectable.size);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    var d = dist(t_collectable.pos_X + 450,
            floorPos_y,
            gameChar_world_x,
            gameChar_y);
    //if distance is less than 100 collectable is found
    if(d < 100)
        {
            t_collectable.isFound = true;
            game_score += 50;
        }


}

function renderFlagpole()
{
    push();
    stroke(0);
    strokeWeight(10);
    line(flagpole.x_pos, floorPos_y, 
         flagpole.x_pos, floorPos_y - 200);
    
    if(flagpole.isReached)
        {
            strokeWeight(3);
            fill(0, 255, 0);
            rect(flagpole.x_pos, floorPos_y - 200, 50, 50);
        }
    else
        {   strokeWeight(3);
            fill(255, 0, 0);
            rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
        }
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos)
    
    if(d < 50)
        {
            flagpole.isReached = true;
        }
}

function drawLife()
{
    for(var i = 0; i < lives; i ++)
    {
        fill(128, 0, 0);
        ellipse(30 + i * 30 , 60, 20, 20);
    }
}

function createPlatform(x, y, length)
{
    var p = {x: x, y: y, length: length, draw: 
             function()
            {
                fill(255, 255, 0);
                stroke(0);
                rect(this.x, this.y, this.length, 20);
            },
             checkContact: function(gc_x, gc_y)
             {
                 //checks if char is in contact with platform
                 if(gc_x > this.x && gc_x < this.x + this.length)
                 {
                     var d = this.y - gc_y;
                     if(d >= 0 && d < 5)
                     {
                         return true;
                     }
                 }
                 else return false;
             }
    }
    return p;
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    this.draw = function()
    {
        fill(0);
        ellipse(this.current_x, this.y - 25, 50);
        fill(255);
        ellipse(this.current_x - 5, this.y - 25, 5);
        ellipse(this.current_x + 5, this.y - 25, 5);
        stroke(255);
        line(
            this.current_x - 15,
            this.y - 35,
            this.current_x - 5,
            this.y -30
        );
        line(
            this.current_x + 15,
            this.y - 35,
            this.current_x + 5,
            this.y -30
        );
    }
    
    this.update = function()
    {
        this.current_x += this.incr;
        
        if(this.current_x < this.x)
        {
            this.incr = 1;
        }
        else if(this.current_x > this.x + this.range)
        {
            this.incr = -1;
        }
    
    this.isContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.current_x, this.y);
        
        if(d < 25)
        {
            return true;
        }
        
        return false;
    }
    }
}