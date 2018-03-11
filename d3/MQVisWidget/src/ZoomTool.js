var ZoomTool ={
    getWheelDelta : function (event) {
        return -event.deltaY * (event.deltaMode ? 120 : 1) / 500;
    },
    wheelToK : function (k,wheelDelta,scaleExtent){
        return Math.max(scaleExtent[0], Math.min(scaleExtent[1], k * Math.pow(2,wheelDelta)))
    },
    translate : function (transform, p0, p1) {
        transform.x = p0[0] - p1[0] * transform.k
        transform.y = p0[1] - p1[1] * transform.k
        return transform
    },
    constrain :function (transform, extent, translateExtent) {
        var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
            dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
            dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
            dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
        return transform.translate(
          dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
          dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
        )
    }
}
window.ZoomTool = ZoomTool
   