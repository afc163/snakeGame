/**
 * 贪吃蛇 1.0
 * @author afc163
 * @date 2010.9.1
 * @email afcstar@163.com
 * @website http://pianyou.me/
 */
var snakeGame = {
    //value
    DIR: {
        MOVEUP: 1,
        MOVERIGHT: 2,
        MOVEDOWN: 3,
        MOVELEFT: 4
    },
    GRID_SIZE: 10,
    currentScore: 0,
    highestScore: 0,
    liveSnake: null,
    liveApples: [],
    timer: null,
    newNodespos: null,
    twiceKeyDownFlag: false,
    getWin: function () {
        return $AJS.$("win");
    },
    getWinWidth: function () {
        return snakeGame.getWin().offsetWidth / snakeGame.GRID_SIZE;
    },
    getWinHeight: function () {
        return snakeGame.getWin().offsetHeight / snakeGame.GRID_SIZE;
    },

    //object
    node: function (arg) {
        arg = arg || {};
        this.pos = arg.pos || {
            "x": 0,
            "y": 0
        };
        this.width = arg.width || snakeGame.GRID_SIZE;
        this.height = arg.height || snakeGame.GRID_SIZE;
        this.direction = arg.direction || snakeGame.DIR.MOVELEFT;
        //alert(snakeGame.node.prototype.inited);
        //static function
        if (snakeGame.node.prototype.inited !== true) {
            snakeGame.node.prototype.move = function () {
                switch (this.direction) {
                    case snakeGame.DIR.MOVEUP:
                        this.pos.y -= 1;
                        break;
                    case snakeGame.DIR.MOVERIGHT:
                        this.pos.x += 1;
                        break;
                    case snakeGame.DIR.MOVEDOWN:
                        this.pos.y += 1;
                        break;
                    case snakeGame.DIR.MOVELEFT:
                        this.pos.x -= 1;
                        break;
                }
            };
            snakeGame.node.prototype.inited = true;
        }
    },
    snake: function () {
        this.nodes = [];
        this.size = this.nodes.length;
        this.speed = 150;
        this.speedUp = 100;
        this.speedUpWhenSnakeGrowTo = 8;

        this.addNode = function (arg_pos, arg_width, arg_height, arg_direction) {
            this.nodes.push(new snakeGame.node({
                pos: {
                    "x": arg_pos.x,
                    "y": arg_pos.y
                },
                width: arg_width,
                height: arg_height,
                direction: arg_direction
            }));
        };
        this.grownUp = function (initing) {
            var addPos = null;
            lastNode = this.nodes[this.nodes.length - 1];
            if (lastNode == null) throw "function grownUp() error:" + this.nodes.length;

            switch (lastNode.direction) {
                case snakeGame.DIR.MOVEUP:
                    addPos = {
                        "x": lastNode.pos.x,
                        "y": lastNode.pos.y + lastNode.height / snakeGame.GRID_SIZE
                    };
                    break;
                case snakeGame.DIR.MOVERIGHT:
                    addPos = {
                        "x": lastNode.pos.x - lastNode.width / snakeGame.GRID_SIZE,
                        "y": lastNode.pos.y
                    };
                    break;
                case snakeGame.DIR.MOVEDOWN:
                    addPos = {
                        "x": lastNode.pos.x,
                        "y": lastNode.pos.y - lastNode.height / snakeGame.GRID_SIZE
                    };
                    break;
                case snakeGame.DIR.MOVELEFT:
                    addPos = {
                        "x": lastNode.pos.x + lastNode.width / snakeGame.GRID_SIZE,
                        "y": lastNode.pos.y
                    };
                    break;
            }

            //console.info(snakeGame.newNodespos);
            initing = initing || false; //init duration
            if (initing)
                this.addNode(addPos, lastNode.width, lastNode.height, lastNode.direction);
            else
                this.addNode(snakeGame.newNodespos, lastNode.width, lastNode.height, lastNode.direction);
        };
        this.init = function (arg) {
            arg = arg || {};
            this.speed = arg.speed || 150;
            this.speedUp = arg.speedUp || 100;
            var pos = arg.pos || {
                "x": 5,
                "y": 5
            };
            this.speedUpWhenSnakeGrowTo = arg.speedUpWhenSnakeGrowTo || 8;
            var initLength = arg.initLength || 3;

            this.nodes = [];

            snakeGame.newNodespos = pos;
            this.addNode(pos, snakeGame.GRID_SIZE, snakeGame.GRID_SIZE, snakeGame.DIR.MOVEDOWN);
            this.head = this.nodes[0];

            for (var i = 0; i < initLength - 1; i++) {
                this.grownUp(true);
            }
        };
        this.move = function () {
            //record the prev node's pos
            var prevPos = $AJS.cloneObject(this.nodes[0].pos);
            var tempPos = {};
            //console.info(this.nodes[this.nodes.length-1].pos);
            snakeGame.newNodespos = $AJS.cloneObject(this.nodes[this.nodes.length - 1].pos);
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i] == null) return;
                if (i != 0) {
                    tempPos = this.nodes[i].pos;
                    this.nodes[i].pos = prevPos;
                    prevPos = tempPos;
                } else {
                    this.nodes[i].move();
                }
            }
            snakeGame.twiceKeyDownFlag = false;
        };
        this.crash = function () {
            snakeGame.liveSnake = null;
        };
        this.eat = function (obj) {
            snakeGame.currentScore += obj.score;
            this.grownUp();
        };
        this.turn = function (dir) {
            var direction = null;
            switch (dir) {
                case "up":
                    direction = snakeGame.DIR.MOVEUP;
                    break;
                case "right":
                    direction = snakeGame.DIR.MOVERIGHT;
                    break;
                case "down":
                    direction = snakeGame.DIR.MOVEDOWN;
                    break;
                case "left":
                    direction = snakeGame.DIR.MOVELEFT;
                    break;
            }
            direction && (this.head.direction = direction);
        };
    },
    apple: function (arg) {
        arg = arg || {};
        this.pos = arg.pos || {
            "x": 0,
            "y": 0
        };
        this.score = arg.value || 100;
        this.width = arg.width || snakeGame.GRID_SIZE;
        this.height = arg.height || snakeGame.GRID_SIZE;

        this.randomReset = function () {
            this.pos.x = -1;
            this.pos.y = -1;
            var x = Math.round(Math.random() * snakeGame.getWinWidth());
            var y = Math.round(Math.random() * snakeGame.getWinHeight());

            //Avoid duplicate position
            var apples = snakeGame.liveApples;
            var sn = snakeGame.liveSnake;
            for (var i = 0; i < apples.length; i++) {
                if (x == apples[i].pos.x && y == apples[i].pos.y) {
                    arguments.callee.call(this);
                    return;
                }
            }
            for (i = 0; i < sn.nodes.length; i++) {
                if (x == sn.nodes[i].pos.x && y == sn.nodes[i].pos.y) {
                    arguments.callee.call(this);
                    return;
                }
            }
            this.pos.x = x;
            this.pos.y = y;
        }
    },

    //control
    promptScore: function () {
        $AJS.showTip(snakeGame.getWin(), "show-score", snakeGame.currentScore);
    },
    fail: function () {
        snakeGame.liveSnake.crash();
        snakeGame.stop();

        if (snakeGame.currentScore > snakeGame.highestScore) {
            snakeGame.highestScore = snakeGame.currentScore;
        }
        var content = "[GAME OVER.]<br />Your score is <font color='red'>" + snakeGame.currentScore + "</font>.<br />Your highest score is " + snakeGame.highestScore + ".";
        var buttonText = "重新开始";
        $AJS.prompt(snakeGame.getWin(), "fail", content, buttonText, function () {
            snakeGame.start();
        });
        //snakeGame.reset();
    },
    score: function (eatedApple) {
        snakeGame.liveSnake.eat(eatedApple);
        eatedApple.randomReset();
        snakeGame.promptScore();

        //check if need to speed up
        if (snakeGame.liveSnake.nodes.length >= snakeGame.liveSnake.speedUpWhenSnakeGrowTo) {
            snakeGame.go(snakeGame.liveSnake.speedUp);
        }
    },
    check: function () {
        var apples = snakeGame.liveApples;
        var sn = snakeGame.liveSnake;
        var winWidth = snakeGame.getWinWidth();
        var winHeight = snakeGame.getWinHeight();
        return function () {
            //eat apple
            for (var i = 0; i < apples.length; i++) {
                if (sn.nodes[0].pos.x == apples[i].pos.x && sn.nodes[0].pos.y == apples[i].pos.y) {
                    snakeGame.score(apples[i]);
                }
            }
            //fail
            if (sn.nodes[0].pos.x < 0 || sn.nodes[0].pos.x >= winWidth || sn.nodes[0].pos.y < 0 || sn.nodes[0].pos.y >= winHeight) {
                snakeGame.fail();
                return false;
            }
            for (i = 1; i < sn.nodes.length; i++) {
                if (sn.nodes[0].pos.x == sn.nodes[i].pos.x && sn.nodes[0].pos.y == sn.nodes[i].pos.y) {
                    snakeGame.fail();
                    return false;
                }
            }
            return true;
        };
    },
    addKeyControl: function () {
        document.onkeydown = function (e) {
            if (snakeGame.twiceKeyDownFlag == true) return;
            e = e || window.event;
            var sn = snakeGame.liveSnake;
            if (sn == null && e.keyCode != 13) throw "function addKeyControl error: liveSnake is null.";;
            switch (e.keyCode) {
                case 13:
                    snakeGame.start();
                    return;
                case 38:
                    if (sn.head.direction != snakeGame.DIR.MOVEUP && sn.head.direction != snakeGame.DIR.MOVEDOWN)
                        sn.turn("up");
                    break;
                case 40:
                    if (sn.head.direction != snakeGame.DIR.MOVEUP && sn.head.direction != snakeGame.DIR.MOVEDOWN)
                        sn.turn("down");
                    break;
                case 37:
                    if (sn.head.direction != snakeGame.DIR.MOVELEFT && sn.head.direction != snakeGame.DIR.MOVERIGHT)
                        sn.turn("left");
                    break;
                case 39:
                    if (sn.head.direction != snakeGame.DIR.MOVELEFT && sn.head.direction != snakeGame.DIR.MOVERIGHT)
                        sn.turn("right");
                    break;
            }
            snakeGame.twiceKeyDownFlag = true;
        };
    },
    render: function () {
        //console.info("this is render function.");
        var win = snakeGame.getWin();
        var nodes = snakeGame.liveSnake.nodes;
        var apples = snakeGame.liveApples;
        var i = 0;

        return function () {
            var winNodes = $AJS.CLZ("div", "node");
            for (i = 0; i < nodes.length; i++) {
                if (winNodes[i] == null) {
                    var node = $AJS.C("div");
                    node.style.position = "absolute";
                    node.className = "node";
                    node.style.width = nodes[i].width + "px";
                    node.style.height = nodes[i].height + "px";
                    node.style.left = snakeGame.GRID_SIZE * nodes[i].pos.x + "px";
                    node.style.top = snakeGame.GRID_SIZE * nodes[i].pos.y + "px";
                    win.appendChild(node);
                } else {
                    winNodes[i].style.left = snakeGame.GRID_SIZE * nodes[i].pos.x + "px";
                    winNodes[i].style.top = snakeGame.GRID_SIZE * nodes[i].pos.y + "px";
                }
            }

            var winApples = $AJS.CLZ("div", "apple");
            for (i = 0; i < apples.length; i++) {
                if (winApples[i] == null) {
                    var apple = $AJS.C("div");
                    apple.style.position = "absolute";
                    apple.className = "apple";
                    apple.style.width = apples[i].width + "px";
                    apple.style.height = apples[i].height + "px";
                    apple.style.left = snakeGame.GRID_SIZE * apples[i].pos.x + "px";
                    apple.style.top = snakeGame.GRID_SIZE * apples[i].pos.y + "px";
                    win.appendChild(apple);
                } else {
                    winApples[i].style.left = snakeGame.GRID_SIZE * apples[i].pos.x + "px";
                    winApples[i].style.top = snakeGame.GRID_SIZE * apples[i].pos.y + "px";
                }
            }
        };
    },
    go: function (speed) {
        if (snakeGame.liveSnake == null) return;
        snakeGame.stop();
        var checkGame = snakeGame.check();
        var renderGame = snakeGame.render();
        snakeGame.timer = setInterval(function () {
            snakeGame.liveSnake.move();
            setTimeout(function () {
                if (checkGame() == false) return;
                renderGame();
            }, 0);
        }, speed);
    },
    //game setting
    start: function (arg) {
        //arguments accept
        arg = arg || {};
        var snakeInitLength = arg.snakeInitLength || 3;
        var snakeInitSpeed = arg.snakeInitSpeed || 150;
        var snakeSpeedUp = arg.snakeInitSpeed || 100;
        var speedUpWhenSnakeGrowTo = arg.speedUpWhenSnakeGrowTo || 8;
        var appleNum = arg.appleNum || 5;

        snakeGame.reset();
        snakeGame.addKeyControl();

        //snake init
        if (snakeGame.liveSnake == null) {
            var newSnake = new snakeGame.snake();
            newSnake.init({
                initLength: snakeInitLength,
                speed: snakeInitSpeed,
                speedUp: snakeSpeedUp,
                speedUpWhenSnakeGrowTo: speedUpWhenSnakeGrowTo
            });
            snakeGame.liveSnake = newSnake;
        }

        //apples init
        for (var i = 0; i < appleNum; i++) {
            var newApple = new snakeGame.apple();
            newApple.randomReset();
            snakeGame.liveApples.push(newApple);
        }

        //page painting
        snakeGame.render();

        //start moving
        snakeGame.go(newSnake.speed);
    },
    reset: function () {
        snakeGame.stop();
        snakeGame.liveApples = [];
        snakeGame.liveSnake = null;
        snakeGame.currentScore = 0;
        snakeGame.getWin().innerHTML = "<div id='show-score'>0</div><div id='show-hcore'>" + snakeGame.highestScore + "</div>";
    },
    stop: function () {
        if (snakeGame.timer)
            clearInterval(snakeGame.timer);
    }
};
