d3.csv('data/titanicPassengerNew.csv', d3.autoType).then(function(data){

    const canvasHeight = 400;
    const canvasWidth = 400;
    const padding = 60;
    const graphWidth = canvasWidth - padding * 2;
    const graphHeight = canvasHeight - padding * 2;
    let scaleY;

    //Sort class
    data.sort(function(x, y){
        return d3.ascending(x.Pclass, y.Pclass);
    })

    TitlesLegends();

    function drawGraphs(item, Clazzz, titulo) {
        let filter = data.filter(function(d) { return d.Pclass === Clazzz; })
        filter.sort(function (a,b) {
            return d3.ascending(a.Age_bucket, b.Age_bucket);
        })

        let svg = d3.select(item)
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);

        let space_between = graphWidth/9;

        const g = d3.rollup(filter, d => d.length,
            d => d.Pclass, d => d.Age_bucket, d => d.Survived);

        drawAxis(svg, Clazzz, item);

        let barcontainer = svg.append('g').attr("class","barras")

        let age_bucket = barcontainer.selectAll('g')
            .data(g)
            .enter()
            .append('g')
            .attr("class", function (d){
                return "age " + d[0];
            })

        let clazz = age_bucket.selectAll('g')
            .data(function (d) {
                return d[1]
            })
            .enter()
            .append('g')
            .attr("class", function (d){
                return "clazz " + d[0];
            })
            .attr("class", function (d,i) {
                if(i===8) return("NA")
            })
            .attr('transform', (d,i) =>{
                return 'translate('+(space_between*i)+ ',0)';
            })

        let survivers = clazz.selectAll('rect')
            .data(function (d) {
                return d[1]
            })
            .enter()
            .append('rect')
            .attr("class", function (d){
                return "survival " + d[0];
            })
            .attr('transform', 'translate('+34+','+0+')')
            .attr('x', space_between)
            .attr('y', function (d) {
                if(d[0] === "dead") return graphHeight/2+padding;
                else return scaleY(d[1])+padding
            })
            .attr('width', space_between-10)
            .attr('height', d => graphHeight/2-scaleY(d[1]))
            .attr('fill', function (d) {
                if(d[0] === "dead") return "black";
                else return "#76b6c4"
            })

        clazz.selectAll('.NA rect')
            .attr('fill', function (d) {
                if(d[0] === "dead") return "#b9b9b9";
                else return "#bbdbe8"
            })

        //Class
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x","50%")
            .attr("y", "7%")
            .text(titulo)
            .style("font-size", "20px")
            .style("font-weight", "bold")
    }

    drawGraphs('.grid-item:nth-child(2)', "class1", "1st Class");
    drawGraphs('.grid-item:nth-child(3)', "class2", "2nd Class");
    drawGraphs('.grid-item:nth-child(4)', "class3", "3rd Class");

    function drawAxis(svg, Clazzz, item){

        // eixoX
        let xScale = d3.scaleBand()
            .domain(["0 — 10","10 — 20","20 — 30","30 — 40","40 — 50","50 — 60","60 — 70","70 — 80","NA"])
            .range([0, graphWidth])

        let xAxis = d3.axisBottom()
            .scale(xScale)

        svg.append('g')
            .attr('transform', 'translate('+padding + ','+(padding+graphHeight)+')')
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-1.2em")
            .attr("dy", "-.6em")
            .attr("transform", "rotate(-90)");

        // eixoY
        scaleY = d3.scaleLinear()
            .domain([-120, 120])
            .range([graphHeight,0]);

        let yAxis = d3.axisLeft()
            .scale(scaleY)
            .tickSize(-graphWidth);

        svg.append('g')
            .attr('transform', 'translate('+padding + ','+padding+')')
            .attr("class","yaxis")
            .call(yAxis)
            .selectAll("text")
            .attr("dx", "-.5em");

        if(Clazzz === 'class2' || Clazzz === 'class3'){
            d3.select(item)
                .selectAll(".yaxis text")
                .attr("visibility", "hidden")
        }

        d3.selectAll('g')
            .selectAll(".tick line")
            .attr("stroke", "lightgrey")

        d3.selectAll('g')
            .selectAll(".domain")
            .attr("visibility", "hidden");
    }



    function TitlesLegends(){
        //title
        let title = d3.select(".title").append("svg").attr("width", 500).attr("height", 100);
        title.append("text")
            .attr("text-anchor", "start")
            .attr("x","0")
            .attr("y", "82%")
            .attr("margin-left",10)
            .text("Titanic Passengers")
            .style("font-size", "48px")
            .style("font-weight", "bold")

        //subtitle
        let subtitle = d3.select(".subtitle").append("svg").attr("width", 900).attr("height", 100);
        subtitle.append("text")
            .attr("x","0")
            .attr("y", "35%")
            .text("Number of Survivors vs Deaths by Age Bucket and Class")
            .style("font-size", "32px")
        subtitle.append("rect")
            .attr("x",169)
            .attr("y",41)
            .attr("width", 138)
            .attr("height", 7)
            .style("fill", "#76b6c4")
        subtitle.append("rect")
            .attr("x",357)
            .attr("y",41)
            .attr("width", 102)
            .attr("height", 7)
            .style("fill", "black")

        //legend
        let legend = d3.select(".legend").append("svg").attr("width", 200).attr("height", 400);
        legend.append("rect")
            .attr("x",0)
            .attr("y",180)
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", "#76b6c4")
        legend.append("rect")
            .attr("x",0)
            .attr("y",205)
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", "black")
        legend.append("text")
            .attr("x", 20)
            .attr("y", 189)
            .text("Survival")
            .attr("alignment-baseline","middle")
            .style("font-size", "15px")
        legend.append("text")
            .attr("x", 20)
            .attr("y", 214)
            .text("Dead")
            .attr("alignment-baseline","middle")
            .style("font-size", "15px")

        //y-label
        let ylabel = d3.select(".ylabel").append("svg").attr("width", 50).attr("height", 400);
        ylabel.append("text")
            .attr("x",-227)
            .attr("y", 50)
            .text("Survived")
            .attr("transform","rotate(-90)")
            .style("font-size", "14px")
            .style("fill", "#939292");

        //x-label
        let xlabel = d3.select('.xlabel').append("svg").attr("width", "100%").attr("height", 30);
        xlabel.append("text")
            .attr("x","51.5%")
            .attr("y", "90%")
            .text("Age Bucket")
            .style("font-size", "14px")
            .style("fill", "#939292");
    }
});