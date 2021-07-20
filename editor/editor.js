
let ghostBlock = {
    location:new Vector2(0,0)
}

let fieldSize = 5;

let spawnPointLocation = new Vector2(0,0)

let finishPointLocation = new Vector2(0,1);

function convertLocation(x,y) {
    return new Vector2(Math.floor((x - Statics.canvas.getBoundingClientRect().left) / Statics.shapeSize), Math.floor((y - Statics.canvas.getBoundingClientRect().top) / Statics.shapeSize));
}

function canBePlacedHere(location)
{
    for (let i = 0; i < gameObjects.walls.length; i++) {
        if (gameObjects.walls[i].location.equal(location)) {
            return false;
        }
    }
    for (let i = 0; i < gameObjects.apples.length; i++) {
        if (gameObjects.apples[i].location.equal(location)) {
            return false;
        }
    }
    return true;
}

function generateLevel() {
    let result = {
        size: fieldSize,
        minAppleCount: document.getElementById("minAppleCount").value,
        name: document.getElementById("levelName").value,
        playerSpawn: {
            location: spawnPointLocation
        },
        walls: gameObjects.walls,
        apples: gameObjects.apples,
        finish: {
            location: finishPointLocation
        }
    };

    document.getElementById("levelOutput").innerText = JSON.stringify(result);
}

function load() {
    clearLevelData();

    let req = new XMLHttpRequest();
    req.open("GET", "./../settings.json", false);
    req.send(null);
    let settings = JSON.parse(req.responseText);

    Statics.shapeSize = settings.shapeSize;

    Statics.canvas = document.getElementById("editField");
    Statics.context = Statics.canvas.getContext("2d");

    fieldSize = document.getElementById("levelSize").value;

    Statics.canvas.addEventListener('mousedown', function (e) {
        if(canBePlacedHere(convertLocation(e.x, e.y))) {
            switch (document.getElementById("tool").value) {
                case "wall":
                    gameObjects.walls[gameObjects.walls.length] = new Wall(convertLocation(e.x, e.y));
                    break
                case "apple":
                    gameObjects.apples[gameObjects.apples.length] = new Apple(convertLocation(e.x, e.y));
                    break;
                case "playerStart":
                    spawnPointLocation.set(convertLocation(e.x, e.y));
                    break;
                case "finishPoint":
                    finishPointLocation.set(convertLocation(e.x, e.y))
                    break;
                default:
                    break;
            }
        }
    });

    Statics.canvas.addEventListener('mousemove', function (e) {
        ghostBlock.location.set(convertLocation(e.x, e.y));
        draw();
    });

    window.addEventListener('contextmenu',function (e){});

    Statics.canvas.addEventListener('contextmenu',function (e)
    {
        e.preventDefault();
        for(let i =0;i<gameObjects.walls.length;i++)
        {
            if(gameObjects.walls[i].location.equal(convertLocation(e.x,e.y)))
            {
                gameObjects.walls.splice(i,1);
                return;
            }
        }

        for(let i =0;i<gameObjects.apples.length;i++)
        {
            if(gameObjects.apples[i].location.equal(convertLocation(e.x,e.y)))
            {
                gameObjects.apples.splice(i,1);
                return;
            }
        }
    });
}

function draw() {
    Statics.context.fillStyle = "rgb(29,83,29)"
    Statics.context.fillRect(0, 0, Statics.canvas.width, Statics.canvas.height);
    Drawing.drawGhostBlock(ghostBlock);

    for (let i = 0; i < gameObjects.apples.length; i++) {
        Drawing.drawAppleColor(gameObjects.apples[i]);
    }
    for (let i = 0; i < gameObjects.walls.length; i++) {
        Drawing.drawWallColor(gameObjects.walls[i]);
    }

    Statics.context.fillStyle = 'rgb(0,46,255)';
    Statics.context.fillRect(spawnPointLocation.x * Statics.shapeSize, spawnPointLocation.y * Statics.shapeSize, Statics.shapeSize, Statics.shapeSize);

    Statics.context.fillStyle = 'rgb(255,0,83)';
    Statics.context.fillRect(finishPointLocation.x * Statics.shapeSize, finishPointLocation.y * Statics.shapeSize, Statics.shapeSize, Statics.shapeSize);
}


function resizeCanvas()
{
    Statics.canvas.width = Statics.shapeSize *  fieldSize;
    Statics.canvas.height = Statics.shapeSize *  fieldSize;
}