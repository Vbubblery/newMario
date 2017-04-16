mario.initialize = function() {
    mario.brick = [];
    mario.water = [];
    mario.canvasController.initialize();
    mario.inputController.initialize();
    mario.mapController.initialize(mario.canvasController.ctxs[1].canvas, () => {
        mario.mapController.map = new Map(mario.canvasController.ctxs[1], mario.mapController.resource.length * 70, 700, mario.mapController.resource, mario.mapController.texture);
        mario.mapController.map.generate();
        var camera = new Camera(0, 0, mario.canvasController.ctxs[1].canvas.width, mario.canvasController.ctxs[1].canvas.height, mario.mapController.resource.length * 70, 700);
        mario.personController.person = new Array();
        mario.personController.initPerson(camera);
        mario.animation(camera);
    });
}
// inputController
mario.inputController = {
    pressed: new Array(),

    initialize: function() {
        var self = this;
        document.onkeydown = function(event) {
            self.keyDownEvent(event);
        }
        document.onkeyup = function(event) {
            self.KeyUpEvent(event);
        }
    },

    isKeyDown: function(key) {
        if (this.pressed[key] != null)
            return this.pressed[key];
        return false;
    },

    keyDownEvent: function(event) {
        this.pressed[event.keyCode] = true;
        this.preventScrolling(event);
    },

    KeyUpEvent: function(event) {
        this.pressed[event.keyCode] = false;
        this.preventScrolling(event);
    },

    preventScrolling: function(event) {
        // 37: left, 38: up, 39: right, 40: down
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            event.preventDefault();
        }
    }
};
//canvasController
mario.canvasController = {
    ctxs: {},
    initialize: function() {
        this.ctxs[0] = document.getElementById('canvas0')
            .getContext('2d');
        this.ctxs[1] = document.getElementById('canvas1')
            .getContext('2d');
        this.ctxs[2] = document.getElementById('canvas2')
            .getContext('2d');
    },
    cleanAllCanvas: function() {
        this.ctxs[0].clearRect(0, 0, this.width, this.height);
        this.ctxs[1].clearRect(0, 0, this.width, this.height);
        this.ctxs[2].clearRect(0, 0, this.width, this.height);
    }
};
//mapController
mario.mapController = {
    initialize: function(canvas, callback) {
        this.canvas = canvas;
        this.retrieveMapData(callback);
    },
    retrieveMapData: function(callback) {
        var xml = new XMLHttpRequest();
        xml.withCredentials = false;
        xml.addEventListener("readystatechange", function(ev) {
            if (xml.status == 200 && xml.readyState == 4) {
                var obj = JSON.parse(xml.responseText);
                mario.mapController.resource = obj.map;
                mario.mapController.texture = obj.texture;
                callback();
            }
        });
        xml.open('get', mario.url + 'mario/json/' + mario.level, true);
        xml.send();
    }
};
mario.personController = {
    person: new Array(),
    initPerson: function(camera) {
        this.person.push(new Person(110, 0, 50, 60, mario.canvasController.ctxs[2], mario.url + 'img/' + 'o_player.png'));
        camera.follow(mario.personController.person[0], mario.canvasController.ctxs[2].canvas.width / 2, mario.canvasController.ctxs[2].canvas.height / 2);
    },
    update: function(worldWidth, worldHeight) {
        mario.brick.forEach(item => {
            var result = impact(mario.personController.person[0], item);
            if (result) {
                this.person[0].obj.push(item);
            }
        });
        if (mario.inputController.isKeyDown(mario.keys.Right)) {
            this.person[0].speedX >= 3 ? this.person[0].speedX = 3 : this.person[0].speedX += 0.1;
        } else if (mario.inputController.isKeyDown(mario.keys.Left)) {
            this.person[0].speedX <= -3 ? this.person[0].speedX = -3 : this.person[0].speedX -= 0.1;
        } else {
            // unpressed the keys, keeps moving a litte bit.
            if (this.person[0].speedX > 0) {
                this.person[0].speedX -= 0.1;
                if (this.person[0].speedX < 0) this.person[0].speedX = 0;
            } else if (this.person[0].speedX < 0) {
                this.person[0].speedX += 0.1;
                if (this.person[0].speedX > 0) this.person[0].speedX = 0;
            }
        }
        if (mario.inputController.isKeyDown(mario.keys.Down)) {
            this.person[0].speedY > 3 ? this.person[0].speedY = 3 : this.person[0].speedY += 0.1;
        } else if (mario.inputController.isKeyDown(mario.keys.Up)) {
            if (this.person[0].speedY > 0) this.person[0].speedY = 0;
            this.person[0].speedY < -3 ? this.person[0].speedY = -3 : this.person[0].speedY -= 1;
        } else {
            this.person[0].speedY > 4 ? this.person[0].speedY = 4 : this.person[0].speedY += 1;
        }
        if (mario.inputController.isKeyDown(90)) {
            this.person[0].speedX *= 1.5;
        }
        this.move(worldWidth, worldHeight, this.person[0].speedX, this.person[0].speedY);
    },
    move: function(worldWidth, worldHeight, sx, sy) {
        if (this.person[0].obj.length) {
            if (this.person[0].speedY > 0)
                this.person[0].speedY = 0;
        }
        if (this.person[0].obj.length == 3) {
            if (this.person[0].speedX != 0) {
                this.person[0].speedX = 0;
            }
            //get the 2 same block
            if (this.person[0].obj[0].x == this.person[0].obj[1].x) {
                this.person[0].obj.del(2);
            } else if (this.person[0].obj[1].x == this.person[0].obj[2].x) {
                this.person[0].obj.del(0);
            } else {
                this.person[0].obj.del(1);
            }
            var py1 = this.person[0].obj[0].y > this.person[0].obj[1].y ? this.person[0].obj[0].y + this.person[0].obj[0].height : this.person[0].obj[1].y + this.person[0].obj[1].height;
            //top
            var py2 = this.person[0].obj[0].y < this.person[0].obj[1].y ? this.person[0].obj[0].y : this.person[0].obj[1].y;
            if (this.person[0].y > py2 && this.person[0].y < py1) {
                if (sx >= 0 && this.person[0].x - this.person[0].width / 2 - this.person[0].obj[0].x - this.person[0].obj[0].width + 10 > 0) {
                    this.person[0].speedX = sx;
                }
                if (sx <= 0 && this.person[0].x - this.person[0].width / 2 < this.person[0].obj[0].x) {
                    this.person[0].speedX = sx;
                }
            }
            this.person[0].obj = [];
        }
        if (this.person[0].obj.length == 2) {
            //bot
            var py1 = this.person[0].obj[0].y > this.person[0].obj[1].y ? this.person[0].obj[0].y + this.person[0].obj[0].height : this.person[0].obj[1].y + this.person[0].obj[1].height;
            //top
            var py2 = this.person[0].obj[0].y < this.person[0].obj[1].y ? this.person[0].obj[0].y : this.person[0].obj[1].y;
            if (this.person[0].y > py2 && this.person[0].y < py1) {
                this.person[0].speedX = 0;
                this.person[0].speedY = sy;
                if (sx >= 0 && this.person[0].x - 25 - this.person[0].obj[0].x - this.person[0].obj[0].width + 10 > 0) {
                    this.person[0].speedX = sx;
                }
                if (sx <= 0 && this.person[0].x - 25 < this.person[0].obj[0].x)
                    this.person[0].speedX = sx;
            }
        }
        if (this.person[0].obj.length == 1) {
            if (this.person[0].y + this.person[0].height / 2 > this.person[0].obj[0].y + 5) {
                this.person[0].speedX = 0;
                this.person[0].speedY = sy;
            }
        }
        this.person[0].x += this.person[0].speedX;
        if (this.person[0].speedX > 0) this.person[0].isMoveDirRight = true;
        if (this.person[0].speedX < 0) this.person[0].isMoveDirRight = false;
        this.person[0].y += this.person[0].speedY;
        // in case the problem of outstanding the left of world.
        if (this.person[0].x - this.person[0].width / 2 < 0) {
            this.person[0].x = this.person[0].width / 2;
        }
        if (this.person[0].y - this.person[0].height / 2 < 0) {
            this.person[0].y = this.person[0].height / 2;
        }
        // in case the problem of outstanding the Right of world.
        if (this.person[0].x + this.person[0].width / 2 > worldWidth) {
            this.person[0].x = worldWidth - this.person[0].width / 2;
        }
        if (this.person[0].y + this.person[0].height / 2 > worldHeight) {
            this.y = worldHeight - this.person[0].height / 2;
        }
    }
};
var second_since = Date.now();
var second = 0;
var second_fps = 0;
var fps = 60;
mario.animation = function(camera) {
    var globalID;
    var self = this;
    if (second > 1000) {
        second_since = Date.now();
        second = 0;

        console.log(second_fps);

        second_fps = 0;
    } else {
        second = Date.now() - second_since;
        ++second_fps;
    }
    camera.update();
    mario.mapView.render(mario.mapController.map, camera.xView, camera.yView);
    mario.personController.update(mario.mapController.map.width, 700);
    mario.personView.render(mario.personController.person[0], camera.xView, camera.yView);
    setTimeout(function() {
        globalID = requestAnimationFrame(() => {
            self.animation(camera)
        });
        if (!mario.personController.person[0].working) {
            cancelAnimationFrame(globalID);
            mario.initialize();
        }
        if (camera.xView == (camera.worldRect.right - camera.wView)) {
            switch (mario.level) {
                case 1:
                    mario.level = 2;
                    break;
                case 2:
                    mario.level = 3;
                    break;
                case 3:
                    mario.level = 1;
                    break;
                default:
            }
            cancelAnimationFrame(globalID);
            mario.initialize();
        }
    }, 1000 / (fps + 6));
};
