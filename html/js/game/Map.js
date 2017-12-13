var CELL_WIDTH = 86,
    CELL_HALF_WIDTH = 43,
    CELL_HEIGHT = 45,
    CELL_HALF_HEIGHT = 22.5;
    MAP_CELLS_WIDTH = 22,
    MAP_CELLS_HEIGHT = 22;


var Map = {
    cellPos: [],
    grid: $("#grid"),
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
        for (var y = 0, bx = screen.width / 0.4096 + CELL_HALF_WIDTH, by = screen.height / 0.4096 + CELL_HALF_HEIGHT; y < by; y += CELL_HALF_HEIGHT) {
            for (var x = 0; x < bx; x += CELL_WIDTH) {
                var pair = y % CELL_HEIGHT,
                    px = x + (pair ? CELL_HALF_WIDTH : 0),
                    points = (px - CELL_HALF_WIDTH) + ',' + y + ' ' + px + ',' + (y - CELL_HALF_HEIGHT) + ' ' + (px + CELL_HALF_WIDTH) + ',' + y + ' ' + px + ',' + (y + CELL_HALF_HEIGHT);
                $(document.createElementNS("http://www.w3.org/2000/svg", 'polygon')).attr('points', points).data({
                    'x': x / CELL_WIDTH - (pair ? 0 : 1),
                    'y': y / CELL_HALF_HEIGHT - 1
                }).appendTo(grid);
            }
        }
    },
    showGrid: function () {
        $("#grid").css("display", "block");
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
            'height': screen.height
        }).css({
            'left': 0 + 'px',
            'top': 0 + 'px'
        }).appendTo($("#ground"));

        //layer personnages
        this.createCanvas().attr({
            'id': 'canvas_1',
            'width': screen.width,
            'height': screen.height
        }).css({
            'left': 0 + 'px',
            'top': 0 + 'px'
        }).appendTo($("#sprites"));

        //layer meuble
        this.createCanvas().attr({
            'id': 'canvas_2',
            'width': screen.width,
            'height': screen.height
        }).css({
            'left': 0 + 'px',
            'top': 0 + 'px'
        }).appendTo($("#decors"));
    },
    loadMap: function () {

    },
    createCanvas: function () {
        return $(document.createElement('canvas'));
    },
    getCanvasByLayer: function (layerId) {
        return $('#canvas_' + layerId);
    }
}
