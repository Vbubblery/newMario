mario.mapView = {
    render: function(map, xView, yView) {
        this.clean(map);
        // the position, shear one block from the image 'image/png'
        var sx, sy;
        //width and height of the block
        var sWidth, sHeight;
        //the position of the block in the canvas.
        var dx, dy;
        //the width and height of block in the canvas.
        var dWidth, dHeight;
        //the size of block equal the size of canvas.
        //means we shear a block from the image, and size of block exactly equal the size of canvas
        sWidth = map.ctx.canvas.width;
        sHeight = map.ctx.canvas.height;

        sx = xView;
        sy = yView;
        // if the block is smaller than canvas
        // we should change the size of block
        if (map.image.wdith - sx < sWidth) {
            sWidth = map.image.width - sx;
        }
        if (map.image.height - sy < sHeight) {
            sHeight = map.image.height - sy;
        }
        //location on canvas to draw the block.
        dx = 0;
        dy = 0;
        //match the destination with source.
        dWidth = sWidth;
        dHeight = sHeight;
        map.ctx.drawImage(map.image, sx, sy, sWidth, 700, dx, dy, dWidth, 700);
    },
    clean: function(map) {
        map.ctx.clearRect(0, 0, map.ctx.canvas.width, map.ctx.canvas.height);
    }
}
mario.personView = {
    render: function(player, xView, yView) {
        var context = player.ctx.canvas.context;
        this.clean(player);
        var img = new Image();
        img.src = player.src;
        if (player.isMoveDirRight) {
            if (player.speedX != 0)
                player.ctx.drawImage(img, 50, 0, 50, 60, ~~((player.x - player.width / 2) - xView), ~~((player.y - player.height / 2) - yView), 50, 60);
            else
                player.ctx.drawImage(img, 0, 0, 50, 60, ~~((player.x - player.width / 2) - xView), ~~((player.y - player.height / 2) - yView), 50, 60);

        } else {
            if (player.speedX != 0)
                player.ctx.drawImage(img, 50, 60, 50, 60, ~~((player.x - player.width / 2) - xView), ~~((player.y - player.height / 2) - yView), 50, 60);
            else
                player.ctx.drawImage(img, 0, 60, 50, 60, ~~((player.x - player.width / 2) - xView), ~~((player.y - player.height / 2) - yView), 50, 60);
        }
        player.obj = [];
        mario.water.forEach(item => {
            var result = impact(mario.personController.person[0], item);
            if (result) {
                player.working = false;
            }
        });
    },
    clean: function(player) {
        player.ctx.clearRect(0, 0, player.ctx.canvas.width, player.ctx.canvas.height);
    }
}
