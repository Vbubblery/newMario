class Map {
    constructor(ctx, width, height, resource, textures) {
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.textures = textures;
        this.resource = resource;
        this.image = new Image();
    };
    generate() {
        var p1 = loadImageAsync(mario.url + 'img/' + this.textures[1]);
        var p2 = loadImageAsync(mario.url + 'img/' + this.textures[2]);
        var p3 = loadImageAsync(mario.url + 'img/' + this.textures[3]);
        var p5 = loadImageAsync(mario.url + 'img/' + this.textures[5]);
        var context = document.createElement("canvas")
            .getContext("2d");
        context.canvas.width = this.width;
        context.canvas.height = this.height;
        var rows = ~~(this.width / 70);
        var cols = ~~(this.height / 70);
        Promise.all([p1, p2, p3, p5])
            .then(imgs => {
                for (let x = 0, i = 0; i < rows; x += 70, i++) {
                    var y = 630;
                    this.resource[i].forEach(item => {
                        switch (item) {
                            case 1:
                                context.drawImage(imgs[0], x, y, imgs[0].width, imgs[0].height);
                                mario.brick.push(new Brick(x, y, imgs[0].width, imgs[0].height));
                                break;
                            case 2:
                                context.drawImage(imgs[1], x, y, imgs[1].width, imgs[1].height);
                                mario.brick.push(new Brick(x, y, imgs[1].width, imgs[1].height));
                                break;
                            case 3:
                                context.drawImage(imgs[2], x, y, imgs[2].width, imgs[2].height);
                                mario.brick.push(new Brick(x, y, imgs[2].width, imgs[2].height / 2));
                                break;
                            case 5:
                                context.drawImage(imgs[3], x, y, imgs[3].width, imgs[3].height);
                                mario.water.push(new Water(x, y, imgs[3].width, imgs[3].height));
                                break;
                            default:
                        }
                        y -= 70;
                    });
                }
                this.image.src = context.canvas.toDataURL("image/png");
            });
    };
}

class BaseObject {
    constructor(x, y, width, height, ctx, src) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.ctx = ctx;
        this.src = src;
    }
};

class Person extends BaseObject {
    constructor(x, y, width, height, ctx, src, g) {
        super(x, y, width, height, ctx, src);
        this.speedX = 0;
        this.speedY = 0;
        this.isMoveDirRight = true;
        this.obj = [];
        this.working = true;
    }
};

class Brick {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
};

class Water extends Brick {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }
}

class Rectangle {
    constructor(left, top, width, height) {
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    };
    setRect(left, top, /*optional*/ width, /*optional*/ height) {
        this.left = left;
        this.top = top;
        this.width = width || this.width;
        this.height = height || this.height
        this.right = (this.left + this.width);
        this.bottom = (this.top + this.height);
    };
    within(r) {
        return (r.left <= this.left &&
            r.right >= this.right &&
            r.top <= this.top &&
            r.bottom >= this.bottom);
    };
};

class Camera {
    // worldWidth -> the width of the image(img/png) that we generate
    // worldHeight -> the height of the image(img/png) that we generate
    constructor(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight) {
        // Postion of camera, this is the point of left-top
        this.xView = xView || 0;
        this.yView = yView || 0;
        // the dead postion move the camera.
        this.xDeadZone = 0;
        this.yDeadZone = 0;
        // viewport dimensions
        this.wView = canvasWidth;
        this.hView = canvasHeight;
        //the player for now.
        this.followed = null;
        // rectangle that represents the viewport
        this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView);
        // rectangle that represents the world's boundary (room's boundary)
        this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight);
    };
    follow(gameObject, xDeadZone, yDeadZone) {
        this.followed = gameObject;
        this.xDeadZone = xDeadZone;
        this.yDeadZone = yDeadZone;
    };
    update() {
        // keep following the player (or other desired object)
        if (this.followed != null) {
            if (this.followed.x - this.xView + this.xDeadZone > this.wView)
                this.xView = this.followed.x - (this.wView - this.xDeadZone);
            else if (this.followed.x - this.xDeadZone < this.xView)
                this.xView = this.followed.x - this.xDeadZone;
        }

        // update viewportRect
        this.viewportRect.setRect(this.xView, this.yView);

        // don't let camera leaves the world's boundary
        if (!this.viewportRect.within(this.worldRect)) {
            if (this.viewportRect.left < this.worldRect.left)
                this.xView = this.worldRect.left;
            if (this.viewportRect.top < this.worldRect.top)
                this.yView = this.worldRect.top;
            if (this.viewportRect.right > this.worldRect.right)
                this.xView = this.worldRect.right - this.wView;
            if (this.viewportRect.bottom > this.worldRect.bottom)
                this.yView = this.worldRect.bottom - this.hView;
        }
    }
};
