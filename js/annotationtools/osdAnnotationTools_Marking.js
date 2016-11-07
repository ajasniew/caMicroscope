annotools.prototype.drawMarking = function (ctx) {
  this.removeMouseEvents()
  var started = false
  var pencil = []
  var newpoly = []
  var anno_arr = [];

  /*Change button and cursor*/
  jQuery("canvas").css("cursor", "crosshair");
  //jQuery("#drawFreelineButton").css("opacity", 1);
  /**/

  jQuery('#btn_savemark').click();
  btn_savemark_var = document.getElementById('btn_savemark');
  btn_savemark_var.addEventListener('click', this.barMouseDown.bind(this), false);

  this.drawCanvas.addEvent('mousedown', function (e) {
    started = true
    pencil = [];
    newpoly = [];
    var startPoint = OpenSeadragon.getMousePosition(e.event)
    var relativeStartPoint = startPoint.minus(OpenSeadragon.getElementOffset(viewer.canvas))
    newpoly.push({
      'x': relativeStartPoint.x,
      'y': relativeStartPoint.y
    })
    ctx.beginPath()
    ctx.moveTo(relativeStartPoint.x, relativeStartPoint.y)

    // Check what radio box is checked
    if (jQuery("#LymPos").is(':checked'))
    {
	ctx.strokeStyle = 'red';
	this.mark_type = 'LymPos';
    }

    if (jQuery("#LymNeg").is(':checked'))
    {
        ctx.strokeStyle = 'blue';
	this.mark_type = 'LymNeg';
    }

    if (jQuery("#TumorPos").is(':checked'))
    {
        ctx.strokeStyle = 'orange';
        this.mark_type = 'TumorPos';
    }

    if (jQuery("#TumorNeg").is(':checked'))
    {
        ctx.strokeStyle = 'lime';
        this.mark_type = 'TumorNeg';
    }

    //ctx.strokeStyle = this.color
    console.log(this.color);
    ctx.stroke()
  }.bind(this))

  this.drawCanvas.addEvent('mousemove', function (e) {
    var newPoint = OpenSeadragon.getMousePosition(e.event)
    var newRelativePoint = newPoint.minus(OpenSeadragon.getElementOffset(viewer.canvas))
    if (started) {
      newpoly.push({
        'x': newRelativePoint.x,
        'y': newRelativePoint.y
      })

      ctx.lineTo(newRelativePoint.x, newRelativePoint.y)
      ctx.stroke()
    }
  })

  this.drawCanvas.addEvent('mouseup', function (e) {
    started = false
    pencil = [];		// Added to process one poly at a time
    pencil.push(newpoly)
    newpoly = []
    numpoint = 0
    var x,y,w,h
    x = pencil[0][0].x
    y = pencil[0][0].y

    var maxdistance = 0
    var points = ''
    var endRelativeMousePosition
    for (var i = 0; i < pencil.length; i++) {
      newpoly = pencil[i]
      for (j = 0; j < newpoly.length - 1; j++) {
        points += newpoly[j].x + ',' + newpoly[j].y + ' '
        if (((newpoly[j].x - x) * (newpoly[j].x - x) + (newpoly[j].y - y) * (newpoly[j].y - y)) > maxdistance) {
          maxdistance = ((newpoly[j].x - x) * (newpoly[j].x - x) + (newpoly[j].y - y) * (newpoly[j].y - y))
          var endMousePosition = new OpenSeadragon.Point(newpoly[j].x, newpoly[j].y)
          endRelativeMousePosition = endMousePosition.minus(OpenSeadragon.getElementOffset(viewer.canvas))
        }
      }

      console.log(points);
      points = points.slice(0, -1)
      console.log(points);
      points += ';'
    }
    points = points.slice(0, -1)
    console.log(points);

    var newAnnot = {
      x: x,
      y: y,
      w: w,
      h: h,
      type: 'pencil_mark',
      points: points,
      color: this.color,
      loc: []
    }

    var globalNumbers = JSON.parse(this.convertFromNative(newAnnot, endRelativeMousePosition))
    newAnnot.x = globalNumbers.nativeX
    newAnnot.y = globalNumbers.nativeY
    newAnnot.w = globalNumbers.nativeW
    newAnnot.h = globalNumbers.nativeH
    newAnnot.points = globalNumbers.points
    var loc = []
    loc[0] = parseFloat(newAnnot.x)
    loc[1] = parseFloat(newAnnot.y)
    newAnnot.loc = loc
    console.log(newAnnot)
    var geojsonAnnot = this.convertPencilToGeo(newAnnot)
    geojsonAnnot.object_type = 'marking';
    //console.log(geojsonAnnot);
    //this.promptForAnnotation(geojsonAnnot, 'new', this, ctx)
    anno_arr.push(geojsonAnnot);
    this.saveMarking(geojsonAnnot, this.mark_type);

    /* Change button back to inactive*/
    jQuery("canvas").css("cursor", "default");
    jQuery("#drawFreelineButton").removeClass("active");
    console.log(this.mark_type);

  }.bind(this))
}

annotools.prototype.saveMarking = function (newAnnot, mark_type) {
    var val = {
	'secret': 'mark1',
	'mark_type': mark_type
    }
    newAnnot.properties.annotations = val;
    console.log(newAnnot.properties.annotations.secret);
    this.addnewAnnot(newAnnot);
}



