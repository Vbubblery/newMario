var mario = {};
mario.url = "https://newmario.herokuapp.com/";
Array.prototype.del = function(i) {
    this.splice(i, 1);
};
mario.level = null;
mario.keys = {
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40
};

function loadImageAsync(url) {
    return new Promise(function(resolve, reject) {
        var image = new Image();
        image.crossOrigin = '*';
        image.onload = function() {
            resolve(image);
        };
        image.onerror = function() {
            reject(new Error('Could not load image at ' + url));
        };
        image.src = url;
    });
}

function impact(obj, dobj) {
    var o = {
        x: obj.x - obj.width / 2,
        y: obj.y - obj.height / 2,
        w: obj.width,
        h: obj.height
    }
    var d = {
        x: dobj.x,
        y: dobj.y,
        w: dobj.width,
        h: dobj.height,
    }
    var px, py;
    //Get the X who is bigger.
    px = o.x <= d.x ? d.x : o.x;
    //Get the Y who is bigger.
    py = o.y <= d.y ? d.y : o.y;
    if (px >= o.x && px <= o.x + o.w && py >= o.y && py <= o.y + o.h && px >= d.x && px <= d.x + d.w && py >= d.y && py <= d.y + d.h) {
        return true;
    } else {
        return false;
    }
}
