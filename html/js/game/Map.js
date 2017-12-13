var CELL_WIDTH = 86,
    CELL_HALF_WIDTH = 43,
    CELL_HEIGHT = 45,
    CELL_HALF_HEIGHT = 22.5,
    MAP_CELLS_WIDTH = 14,
    MAP_CELLS_HEIGHT = 20,
    MAP_CELLS_COUNT = 560;

var Map = {
    grid: $("#grid"),
    createGrid: function () {
        $(grid).add(hover).html('');
        for (var y = 0, bx = screen.width / 0.4096 + CELL_HALF_WIDTH, by = screen.height / 0.4096 + CELL_HALF_HEIGHT; y < by; y += CELL_HALF_HEIGHT) {
            for (var x = 0; x < bx; x += CELL_WIDTH) {
                var pair = y % CELL_HEIGHT,
                    px = x + (pair ? CELL_HALF_WIDTH : 0),
                    points = (px - CELL_HALF_WIDTH) + ',' + y + ' ' + px + ',' + (y - CELL_HALF_HEIGHT) + ' ' + (px + CELL_HALF_WIDTH) + ',' + y + ' ' + px + ',' + (y + CELL_HALF_HEIGHT);
                if (pair) {
                    $(document.createElementNS("http://www.w3.org/2000/svg", 'polygon')).attr('points', points).appendTo(grid);
                }
                $(document.createElementNS("http://www.w3.org/2000/svg", 'polygon')).attr('points', points).data({
                    'x': x / CELL_WIDTH - (pair ? 0 : 1),
                    'y': y / CELL_HALF_HEIGHT - 1
                }).appendTo(hover);
            }
        }
    }
}
