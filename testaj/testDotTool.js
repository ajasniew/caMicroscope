//tmp values for testing; will be set up dynamically
var tmpWidth   = 400,
    tmpHeight  = 400,
    tileUri    = "https://ajasniew.github.io/images/LUAD_400_Det_ST_ASSG2/TCGA-L9-A444-01Z-00-DX1_appMag_40_241_136.png",
    radius     = 3;   // Change according to the size of the point
    fillColor  = "#ffff00";  //yellow
    hoverColor = "#ff2626";  //red

//dataset
var circleDataset = [];  //an array of circle objects

//setup the svg 
var svgHtmlDot = d3.select("#svgContainer")
        .append("svg:svg")
        .attr("width", tmpWidth)
        .attr("height", tmpHeight)
        .style("cursor", "crosshair");
    
    svgHtmlDot.append("image")
	    .attr("id", "currentImage")
        .attr("xlink:href", tileUri)
	    .on("load", function(d) {                //get image size dynamically
            var currentImage = new Image();
            currentImage.onload = function() {
                d3.select("#currentImage")
                .attr("width", this.width)
                .attr("height", this.height);
        }
        currentImage.src = tileUri;
    });
        

//group circle elements together
var circleGroup = svgHtmlDot.append("g");
    
    //.on(action, fn) syntax for attaching an event listener to a DOM selection
    svgHtmlDot.on("click", function() {
        var coords = d3.mouse(this);
        var xPosition = Math.round(coords[0]);
        var yPosition = Math.round(coords[1]);
        console.log(xPosition + " " + yPosition);
        drawCircle(xPosition, yPosition, radius, fillColor);
    });

//draw circle element
function drawCircle(x, y, size, color) {
    console.log('Drawing circle at', x, y, size);
    var creation = Date.now(); //the number of milliseconds since midnight January 1, 1970
    var svgCircle = circleGroup.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", size)
        .style("fill", fillColor)
        .attr("id", "circle_" + creation)
	    .on("mouseover", function(d) {
  		    d3.select(this).attr("r", radius).style("fill", hoverColor);
			})                  
        .on("mouseout", function(d) {
  		    d3.select(this).attr("r", radius).style("fill", fillColor);
		    })
        .on("contextmenu", function (d, i) {
            d3.event.preventDefault();
           // react on right-clicking;
            removeCircle("circle_" + creation);
            });
	    
	var svgTooltip = svgCircle.append("title")  //tooltip with circle x, y
	    .text(function() {
		    return x + ', ' + y;	  
			});
}

//remove circle element
function removeCircle(id){
   d3.selectAll('g #' + id).remove();
}