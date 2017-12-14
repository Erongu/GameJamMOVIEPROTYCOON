var CELL_WIDTH = 86,
    CELL_HALF_WIDTH = 43,
    CELL_HEIGHT = 45,
    CELL_HALF_HEIGHT = 22.5;
    MAP_CELLS_WIDTH = 22,
    MAP_CELLS_HEIGHT = 22;


var Map = {
    Id: 1,
    cellPos: [],
    grid: $("#grid"),
    interval: null,
    mainPlayerSprite: {
        currentAnimation:{},
        cell: {},
        preload: function () {
            this.setAnimation('idle');
        },
        update: function () {
            let canvas = Map.getCanvasByLayer(1);
            let context = canvas.getContext('2d');

            if(this.cell.id == null) {
                this.cell.id = 403;
                this.cell.x = $("#cell_403").attr('x');
                this.cell.y = $("#cell_403").attr('y');
            }

            if(this.currentAnimation == null || !this.currentAnimation.started)
                return;

            context.clearRect(this.cell.x, this.cell.y, this.currentAnimation.width, this.currentAnimation.height);

            context.drawImage(
                this.currentAnimation.image,
                this.currentAnimation.shift,
                0,
                this.currentAnimation.width,
                this.currentAnimation.height,
                this.cell.x,
                this.cell.y,
                this.currentAnimation.width,
                this.currentAnimation.height);

            this.currentAnimation.shift += this.currentAnimation.width + 1;

            if (this.currentAnimation.currentFrame == this.currentAnimation.totalFrames) {
                this.currentAnimation.shift = 0;
                this.currentAnimation.currentFrame = 0;
            }

            this.currentAnimation.currentFrame++;

            Map.update();
        },
        setAnimation: function (anim) {
            switch(anim){
                case "idle":
                    this.currentAnimation.image = new Image();
                    this.currentAnimation.image.src = "assets/player/idle_animation.png";

                    this.currentAnimation.image.onload = function() {
                        Map.mainPlayerSprite.currentAnimation = {
                            image: this,
                            started: true,
                            width: 47,
                            height: 86,
                            totalFrames: 3,
                            currentFrame : 0,
                            shift: 0,
                            speed: 500
                        };
                    };
                    break;
                case "walk":
                    this.currentAnimation.image = new Image();
                    this.currentAnimation.image.src = "assets/player/walk_animation.png";

                    this.currentAnimation.image.onload = function() {
                        Map.mainPlayerSprite.currentAnimation = {
                            image: this,
                            started: true,
                            width: 47,
                            height: 88,
                            totalFrames: 7,
                            currentFrame : 0,
                            shift: 0,
                            speed: 100
                        };
                    };
                    break;
            }
        }
    },
    initCellPos: function() {
        for (var x = 0; x < 1200; x++) {
            var cellX = ((x % MAP_CELLS_WIDTH) + MAP_CELLS_WIDTH) % MAP_CELLS_WIDTH,
                cellY = Math.floor(x / MAP_CELLS_WIDTH);
            this.cellPos[x] = {
                x: $(window).width() + cellX * CELL_WIDTH + ((cellY % 2) ? CELL_HALF_WIDTH : 0) + CELL_HALF_WIDTH,
                y: cellY * CELL_HALF_HEIGHT + CELL_HALF_HEIGHT
            };
        }
    },
    createGrid: function () {
        $(grid).html('');
        let id = 0;
        for (var y = 0, bx = screen.width / 0.4096 + CELL_HALF_WIDTH, by = screen.height / 0.4096 + CELL_HALF_HEIGHT; y < by; y += CELL_HALF_HEIGHT) {
            for (var x = 0; x < bx; x += CELL_WIDTH) {
                var pair = y % CELL_HEIGHT,
                    px = x + (pair ? CELL_HALF_WIDTH : 0),
                    points = (px - CELL_HALF_WIDTH) + ',' + y + ' ' + px + ',' + (y - CELL_HALF_HEIGHT) + ' ' + (px + CELL_HALF_WIDTH) + ',' + y + ' ' + px + ',' + (y + CELL_HALF_HEIGHT);
                $(document.createElementNS("http://www.w3.org/2000/svg", 'polygon')).attr('points', points).attr('id', 'cell_' + id++).attr('x', x).attr('y',y).data({
                    'x': x / CELL_WIDTH - (pair ? 0 : 1),
                    'y': y / CELL_HALF_HEIGHT - 1
                }).appendTo(grid);
            }
        }
    },
    showGrid: function () {
      // $("#grid").css("display", "block");
    },
    coordsToCell: function (x, y) {
        return x + y * MAP_CELLS_WIDTH;
    },
    cellToCoords:function (cellId) {
        return {x: cellId % MAP_CELLS_WIDTH, y: Math.floor(cellId / MAP_CELLS_WIDTH)};
    },
    polygonToPosition: function(data) {
        var cellX = data.x - 29 + $(window).width() + 1, cellY = data.y, mapX = 0, mapY = 0;
        for (; cellX < 0; cellX += MAP_CELLS_WIDTH, mapX--)
            ;
        for (; cellX >= MAP_CELLS_WIDTH; cellX -= MAP_CELLS_WIDTH, mapX++)
            ;
        for (; cellY < 0; cellY += 2 * MAP_CELLS_HEIGHT, mapY--)
            ;
        for (; cellY >= 2 * MAP_CELLS_HEIGHT; cellY -= 2 * MAP_CELLS_HEIGHT, mapY++)
            ;
        return {cellX: cellX, cellY: cellY, mapX: mapX, mapY: mapY, cellId: this.coordsToCell(cellX, cellY)};
    },
    createMap:function () {
        //layer sol / background
        this.createCanvas().attr({
            'id': 'canvas_0',
            'width': screen.width,
            'height': $(window).height()
        }).css({
            'left': 0 + 'px',
            'top': 0 + 'px'
        }).appendTo($("#ground"));

        //layer personnages
        this.createCanvas().attr({
            'id': 'canvas_1',
            'width': screen.width,
            'height': $(window).height()
        }).css({
            'left': 0 + 'px',
            'top': 0 + 'px'
        }).appendTo($("#sprites"));

        //layer meuble
        this.createCanvas().attr({
            'id': 'canvas_2',
            'width': screen.width,
            'height': $(window).height()
        }).css({
            'left': 0 + 'px',
            'top': 0 + 'px'
        }).appendTo($("#decors"));

        this.update();
    },
    loadMap: function () {
        this.mainPlayerSprite.preload();

        var _this = this;

        let img = new Image();
        img.src = getBackgroundPath(this.Id);

        img.onload = function() {
            let canvas = _this.getCanvasByLayer(0);
            let context = canvas.getContext('2d');

            context.drawImage(this, 250, 100);

            console.log("Insert background");

            _this.loadPlayer();
        }

    },
    loadPlayer: function () {
        /*var _this = this;

        let img = new Image();
        img.src = getPlayerPath();

        img.onload = function() {
            let canvas = _this.getCanvasByLayer(1);
            let context = canvas.getContext('2d');

            var cell = $("#cell_403");

            context.drawImage(this, cell.attr('x'), cell.attr('y'));

            console.log(cell);
        }*/
    },
    createCanvas: function () {
        return $(document.createElement('canvas'));
    },
    getCanvasByLayer: function (layerId) {
        return document.getElementById('canvas_' + layerId);
    },
    update: function () {
        var speed = 500;

        if(Map.mainPlayerSprite.currentAnimation != null && Map.mainPlayerSprite.currentAnimation.started){
            speed = Map.mainPlayerSprite.currentAnimation.speed;
        }

        clearInterval(this.interval);
        this.interval = setInterval(this.realUpdate, speed);
    },
    realUpdate: function () {
        Map.mainPlayerSprite.update();
    }
}
