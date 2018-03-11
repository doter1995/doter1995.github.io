function D3Map(config){
    var DataSet = config.dataSet?config.dataSet:[];
    var Node = config.node?config.node:document.body;
    var Width = config.width?config.width:window.innerWidth-20; //创建地图的高度
    var Height = config.height?config.height:window.innerHeight-20; //创建地图的宽度
    var active = config.active?config.active:0; //当前活动点。匹配d.id
    var json = config.json?config.json:""; //中国地图json文件路径
    var onChange = config.onChange?config.onChange:function(){};//地图点击事件修改活动点回调
    var mapColor = config.mapColor?config.mapColor:["#2E2D57"];  //地图各省份的颜色
    var nodeColor = config.nodeColor?config.nodeColor:['#35A8F9','#0f0'];//0 正常色 1动态色
    var nodeR = config.nodeR?config.nodeR:[3,5]; //0 正常 1动态
    var mapCenter = config.mapCenter?config.mapCenter:[107, 35]; //地图中心点(坐标)
    var mapScale = config.mapScale?config.mapScale:700;
    //注意这个值可能需要在实际环境中做匹配，其参数默认值是匹配世界地图，所以必须给定参数，用于匹配中国地图

    var t=d3.interval(function(){},100); //动画定时器
    //开始
    console.log(Node);
    var svg = d3.select(Node)
        .append('svg')
        .attr('width',Width)
        .attr('height',Height);
    var mapG = svg.append('g').attr('class','map');
    var pointG = svg.append('g').attr('class','point');
    var x = 0, y = 0; //设置旋转角度
    var projection = d3.geoMercator()
        .center(mapCenter)
        .scale(mapScale)
        .translate([Width/2, Height/2]);
    var path = d3.geoPath(projection);
    if(!json){
        console.error("请配置地图json文件");
        return null;
    }
    d3.json(json, function (error, dataSet) {
        if (error) throw error;
        console.log(dataSet.features);
        mapG.selectAll("path")
            .data(dataSet.features)
            .enter()
            .append('path')
            .attr("class", 'pathLine')
            .attr("d", path)
            .attr('stroke','#333')
            .attr('stroke-width',2)
            .attr('fill',function(d,i){
                return mapColor[0]
            })
        });
    //绘制坐标点
    var points = pointG.selectAll('g.node')
        .data(DataSet)
        .enter()
        .append('g')
        .each(function(d,i){
            d['xy'] = projection([d.latlng[1],d.latlng[0]])
         })
        .attr('class',function(d,i){
            return d.id==active?"active":'inactive'
        });
        
    points.append('circle')
        .attr('r',nodeR[0])
        .attr('cx',function(d,i){
            return d.xy[0]
        })
        .attr('cy',function(d,i){
            return d.xy[1]
        })
        .attr('fill',function(d,i){
           return d.id==active?"#0f0":nodeColor[0]
        })
        .attr('class',function(d,i){
            return d.id==active?"active":'inactive'
        })
        .on('click',function(d,i){
            active = d.id;
            updateActive();
            onChange(d)
        });
    //动点动画
    var opacity=0.1;
    var arc = d3.arc();
    function timer(elapsed) {
        opacity+=0.1;
        opacity%=1;
        var activeNode=pointG.select('g.active');
        activeNode.selectAll('path').attr("d",function(d){
            var inner = (1+d.index+opacity)*nodeR[1]+2;
           return arc({
            innerRadius: inner,
            outerRadius: inner+nodeR[1]-1,
            startAngle: 0,
            endAngle: Math.PI * 2})
        }).attr('stroke',nodeColor[1]).attr('fill','none')
        .attr('opacity',function(d){return 1-d.index})
    }

    //
    this.update = function(config){
        if(config.active!=undefined){
            active = config.active;
            updateActive()
        }
    };

    //更新动态点
    function updateActive(){
        t.stop();
        //限移除之前的环
        pointG.select('g.active').selectAll('path').remove();

        //重置状态
        pointG.selectAll('g')
            .attr('class','inactive')
            .selectAll('circle').attr('r',5).attr('opacity',1)
            .attr('fill',nodeColor[0]);
        //更新active状态
        points.filter(function(d){
            return active == d.id
        }).attr('class','active').select('circle').attr('fill',nodeColor[1]).attr('r',nodeR[1]);
        pointG.select('g.active').selectAll('path')
            .data(function(d){
                return [{index:0,data:d},{index:1,data:d},{index:2,data:d}]
            })
            .enter()
            .append('path')
            .attr('class','node_active')
            .attr('transform',function(d){
                return 'translate('+d.data.xy[0]+','+d.data.xy[1]+')'
            });
        t = d3.interval(timer,100)
    }

}