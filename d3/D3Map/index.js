var d3Map
window.onload = function(){


    var dataSet= [
        {
            id:1,
            title:'西安项目',
            latlng:[34.284102, 108.929673],//google地图坐标(百度地图坐标是有偏移的)
            'text':'正在不断发展中'
        },
        {
            id:2,
            title:'北京项目',
            latlng:[39.873406, 116.328331],
            'text':'正在不断发展中'
        },
        {
            id:3,
            title:'深圳项目',
             latlng:[22.540409, 114.054267],
            'text':'正在不断发展中'
        },
        {
            id:4,
            title:'杭州项目',
             latlng:[30.292383, 120.140163],
            'text':'正在不断发展中'
        },
        {
            id:5,
            title:'太原项目',
             latlng:[37.852404, 112.554556],
            'text':'正在不断发展中'
        }
    ]
    d3Map = new D3Map({
        json:'./data/china.json',
        dataSet:dataSet,
        node:document.getElementById('root'),
        active:1
    });
    d3Map.update({active:2})

}