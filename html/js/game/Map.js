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
    objects: [],
    updateObject: false,
    mainPlayerSprite: {
        currentAnimation:{},
        cell: {},
        preload: function () {
            this.setAnimation('idle');
        },
        update: function () {
            let canvas = Map.getCanvasByLayer(1);
            let context = canvas.getContext('2d');

            this.cell = Map.getCellData(403);

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
        if(DEBUG) {
            $("#grid").show();
        }
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

        //this.loadGfx();
        this.loadGfxHtml();
    },
    loadGfxHtml: function () {
        var _this = this;

        Tiles.forEach(function(elem){
            let path = getTilePath(elem.gfx_id);
            let cell = _this.getCellData(elem.cell_id);

            let image = new Image();
            image.src = path;

            image.onload = function () {
                let svg = $("#interactives");

                var svgimg = document.createElementNS("http://www.w3.org/2000/svg", "image");
                svgimg.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', path);

                svgimg.setAttribute("id", 'object_' + elem.uid);

                if(!elem.reverse) {
                    svgimg.setAttribute("x", cell.x - elem.offset.x);
                }else{
                    svgimg.setAttribute("x", -(cell.x) - elem.offset.x);
                }
                svgimg.setAttribute("y", cell.y - elem.offset.y);

                svgimg.setAttribute("width", this.width);
                svgimg.setAttribute("height", this.height);

                svg.append(svgimg);

                var newTile = $("#object_" + elem.uid)
                newTile.addClass("tile");

                if(elem.reverse){
                    newTile.addClass("reverseTile");
                }

                newTile.on('click', function () {
                    switch($(this).attr('id')){
                        case "object_0":
                            $("#makefilm_popup").show();
                            GameObject.currentFilm = {};
                            playCustomSound("whoosh");
                            //playDialog("super");
                            _this.removeObject(1);
                            break;
                    }
                });

            };

        });

        $("#interactives").show();
    },
    loadGfx: function () {
        var gfx_requested = 0;
        var gfx_loaded = 0;
        var _this = this;

        Tiles.forEach(function (element) {
            let img = new Image();
            img.src = getTilePath(element.gfx_id);

            gfx_requested++;

            img.onload = function() {
                gfx_loaded++;

                var tileElement = {
                    image: this,
                    elm: element
                };

                _this.objects.push(tileElement);
                console.log("Image loaded "  + gfx_loaded);

                if(gfx_requested == gfx_loaded){
                    console.log("All image loaded");
                    _this.updateObject = true;
                }
            };

        });
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
    getCellData: function (id) {
        return {
            id: id,
            x: $("#cell_" + id).attr('x'),
            y: $("#cell_" + id).attr('y')
         };
    },
    update: function () {
        var speed = 500;

        if(Map.mainPlayerSprite.currentAnimation != null && Map.mainPlayerSprite.currentAnimation.started){
            speed = Map.mainPlayerSprite.currentAnimation.speed;
        }

        clearInterval(this.interval);
        this.interval = setInterval(this.realUpdate, speed);
        //setInterval(this.updateObjects, 100);
    },
    realUpdate: function () {
        Map.mainPlayerSprite.update();
    },
    updateObjects: function () {
        if(Map.updateObject){
            Map.objects.forEach(function (elm) {
                let canvas = Map.getCanvasByLayer(2);
                let context = canvas.getContext('2d');


                let cell = Map.getCellData(elm.elm.cell_id);

                console.log(cell.x - elm.image.width);


                if(elm.elm.reverse){
                    context.save();
                    context.scale(-1, 1);
                    context.drawImage(elm.image, -(cell.x) - elm.elm.offset.x, cell.y - elm.elm.offset.y);
                    context.restore();
                }
                else {
                    context.drawImage(elm.image, cell.x - elm.elm.offset.x, cell.y - elm.elm.offset.y);
                }

                console.log("Drawing image " + elm.image);
            });
        }
    },
    removeObject: function (id) {
        $("#object_" + id).remove();
    }
}
