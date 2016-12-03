annotools.prototype.drawMarking = function (ctx) {
  this.removeMouseEvents()
  var started = false
  var pencil = []
  var newpoly = []
  this.newpoly_arr = [];
  this.color_arr = [];
  this.anno_arr = [];
  this.marktype_arr = [];
  this.current_canvasContext = ctx;
  this.mark_type = 'LymPos';

  /*Change button and cursor*/
  jQuery("canvas").css("cursor", "crosshair");
  //jQuery("#drawFreelineButton").css("opacity", 1);
  /**/


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
	console.log(this.mark_type);

    this.color_arr.push(ctx.strokeStyle);
    //ctx.strokeStyle = this.color
    console.log(this.color);
    ctx.lineWidth = 3.0;
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
    this.newpoly_arr.push(newpoly);
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
    //console.log(points);

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
    //console.log(newAnnot)
    var geojsonAnnot = this.convertPencilToGeo(newAnnot)
    geojsonAnnot.object_type = 'marking';
    //console.log(geojsonAnnot);
    //this.promptForAnnotation(geojsonAnnot, 'new', this, ctx)
    this.anno_arr.push(geojsonAnnot);
    this.marktype_arr.push(this.mark_type);
    //this.saveMarking(geojsonAnnot, this.mark_type);

    /* Change button back to inactive*/
    jQuery("canvas").css("cursor", "default");
    jQuery("#drawFreelineButton").removeClass("active");
    //console.log(this.mark_type);

  }.bind(this))
}

annotools.prototype.saveMarking = function (newAnnot, mark_type) {
    var val = {
	'secret': 'mark1',
	'mark_type': mark_type,
	'username': this.username
    }
    console.log(newAnnot);
    newAnnot.properties.annotations = val;
    console.log(newAnnot.properties.annotations.secret);
    this.addnewAnnot(newAnnot);
}


annotools.prototype.markSaveClick = function (event) {
	this.markSave(false, false);
}

annotools.prototype.markSave = function (notification, isSetNormalMode) {
    console.log(this.anno_arr.length);
    for (i = 0; i< this.anno_arr.length; i++)
    {
	this.saveMarking(this.anno_arr[i], this.marktype_arr[i]);
    }
    if (notification == true) {
	alert("Saved markup");
    }
    console.log(this.marktype_arr);

    //jQuery('#markuppanel').hide('slide');
    //this.drawLayer.hide();
    //this.addMouseEvents();
    if (isSetNormalMode == true)
    {
	jQuery('#markuppanel').hide('slide');
	this.drawLayer.hide();
	this.addMouseEvents();
	this.toolBar.setNormalMode();
    }
    else
    {
	this.drawLayer.hide();
	this.drawMarkups();
	//this.toolBar.setNormalMode();
	
    }
}

annotools.prototype.undoStroke = function () {
    console.log('undo stroke');
    console.log(this.newpoly_arr.length);
    this.newpoly_arr.pop();
    this.color_arr.pop();
    this.anno_arr.pop();
    this.marktype_arr.pop();
    console.log(this.color_arr);
    this.reDrawCanvas();
}

annotools.prototype.reDrawCanvas = function () {
    ctx = this.current_canvasContext;
    ctx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
    for (i = 0; i< this.newpoly_arr.length; i++)
    {
	path = this.newpoly_arr[i];
	ctx.beginPath();
	ctx.moveTo(path[0].x, path[0].y);
	ctx.strokeStyle = this.color_arr[i];
	ctx.lineWidth = 3.0;
	ctx.stroke();
	for (iptx = 1; iptx < path.length; iptx++)
	{
	     ctx.lineTo(path[iptx].x, path[iptx].y)
	     ctx.stroke()
	}
    }
}

annotools.prototype.radiobuttonChange = function(event) {
	console.log('rb changed');
	console.log(this.marking_choice);
	var self = this;
        if (event.target.id == 'rb_Moving')
        {
		console.log('rb_Moving mode');

		// Save current
		this.markSave(false, false);

		// Switch to normal mode
		jQuery("canvas").css("cursor", "default");
  		jQuery("#drawRectangleButton").removeClass('active');
  		jQuery("#drawFreelineButton").removeClass('active');
  		jQuery("#drawDotButton").removeClass("active");   // Dot Tool
  		jQuery("#freeLineMarkupButton").removeClass("active");
  		//jQuery("#markuppanel").hide('slide');
  		this.drawLayer.hide()
  		this.addMouseEvents()
        }
        else
        {
		if (this.marking_choice == 'rb_Moving')
		{
			console.log('change to drawing mode');
			this.drawMarkups();
			jQuery("canvas").css("cursor", "crosshair");
        		//jQuery("drawFreelineButton").css("opacity", 1);
        		jQuery("#drawRectangleButton").removeClass("active");
        		jQuery("#drawDotButton").removeClass("active");     // Dot Tool
        		jQuery("#drawFreelineButton").removeClass("active");
        		//jQuery("#freeLineMarkupButton").addClass("active");
        		//jQuery("#markuppanel").show('slide');
		}
        }
	this.marking_choice = event.target.id;
}



annotools.prototype.break_drawings = function(nativepoints) {
    patch_size = 0.001;
    coordinate_set = [];
    nativeX_set = [];
    nativeY_set = [];
    nativeW_set = [];
    nativeH_set = [];

    if (nativepoints.length == 0)
        return [coordinate_set, nativeX_set, nativeY_set, nativeW_set, nativeH_set];

    x_old = nativepoints[0][0];
    y_old = nativepoints[0][1];
    for (k = 0; k < nativepoints.length; k++) {
        x = nativepoints[k][0];
        y = nativepoints[k][1];

        len = Math.sqrt((x-x_old)*(x-x_old) + (y-y_old)*(y-y_old));
        divn = len / patch_size;
        if ((divn < 1) && (k != nativepoints.length - 1)) {
            continue;
        }
        dir_x = (x-x_old) / len;
        dir_y = (y-y_old) / len;
        coor = [];
        for (ps = 0; ps <= divn; ps++) {
            coor.push([x_old + dir_x * ps, y_old + dir_y * ps]);
        }
        coor.push([x, y]);
        coordinate_set.push(coor);
        nativeX_set.push(coor[0][0]);
        nativeY_set.push(coor[0][1]);
        nativeW_set.push(coor[divn+2][0]-coor[0][0]);
        nativeH_set.push(coor[divn+2][1]-coor[0][1]);

        x_old = x;
        y_old = y;
    }
    return [coordinate_set, nativeX_set, nativeY_set, nativeW_set, nativeH_set];
}


annotools.prototype.calculateIntersect = function() {
    var marking_sample_rate = 1;
    var center_dis = 1.25;
    var annotations = this.annotations;

    var labels = [];
    var label_dates = [];
    var id = [];
    var cx = [];
    var cy = [];

    if (annotations == null) {
        return labels;
    }

    // get heatmap patch centers
    for (var i = 0; i < annotations.length; i++) {
        var annotation = annotations[i];
        labels.push(0);
        label_dates.push(0);
        if (annotation.object_type == 'heatmap_multiple') {
            var nativepoints = annotation.geometry.coordinates[0];
            id.push(i);
            cx.push((nativepoints[0][0] + nativepoints[2][0])/2.0);
            cy.push((nativepoints[0][1] + nativepoints[2][1])/2.0);
            half_patch_size = (Math.abs(nativepoints[0][0] - nativepoints[1][0]) + Math.abs(nativepoints[0][1] - nativepoints[1][1])) / 2.0;
        }
    }


    var dis = center_dis * half_patch_size;

    // traverse markings
    for (var i = 0; i < annotations.length; i++) {
        var annotation = annotations[i];
        //var date = Date.parse(annotation.date.$date);
	var date = this.getDate(annotation);

        if (annotation.object_type != 'marking') {
            continue;
        }
        if (!annotation.properties.annotations.hasOwnProperty('username')) {
            continue;
        }
        if (annotation.properties.annotations.username != this.username) {
            continue;
        }

        if (annotation.properties.annotations.mark_type == 'LymPos') {
            label = 1;
        } else if (annotation.properties.annotations.mark_type == 'LymNeg') {
            label = -1;
        } else {
            continue;
        }
        var nativepoints = annotation.geometry.coordinates[0];
        for (var k = 0; k < nativepoints.length; k+=marking_sample_rate) {
            x = nativepoints[k][0];
            y = nativepoints[k][1];
            for (var xy_i = 0; xy_i < cx.length; xy_i++) {
                if ((Math.abs(cx[xy_i] - x) <= dis) && (Math.abs(cy[xy_i] - y) <= dis)) {
                    if (date > label_dates[id[xy_i]]) {
                        label_dates[id[xy_i]] = date;
                        labels[id[xy_i]] = label;
                    }
                }
            }
        }
    }

    return labels;
}

annotools.prototype.getDate = function(annotation)
{
	if (typeof annotation.date != "undefined")
	{
		return annotation.date;
	}
	else
	{
		if (typeof annotation.date.$date != "undefined")
		{
			return Date.parse(annotation.date.$date);
		}
	}
	return null;
}
