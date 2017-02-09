// Variables
var skeleton; 			// Storing the skeleton data
var positions;  		// Storing the joint positions
var positions_scaled;	// Storing the scaled joint positions
var figureScale = 3;  	// The scaling factor for our visualizations
var h = 250;  			// The height of the visualization
var h2 = 270;
var w = 1200;			// The width of the visualization
var w2 = 300;
var gap = 20; 			// Gap between frames (in pixels)
var skip = 20; 			// number of frames to skip
var frame = 0;			// Animated frame
var colors = ["#ff0000", "#ff4000", "#ff8000", "#ffbf00", "#ffff00", "#bfff00", "#80ff00", "#40ff00", "#00ff00", "#00ff40", "#00ff80", "#00ffbf", "#00ffff", "#00bffff", "#0080ff", "#0040ff", "#0000ff", "#4000ff", "#8000ff", "#bf00ff", "#ff00ff", "#ff00bf", "#ff0080", "#ff0040", 
			  "#ff0000", "#ff4000", "#ff8000", "#ffbf00", "#ffff00", "#bfff00", "#80ff00", "#40ff00", "#00ff00", "#00ff40", "#00ff80", "#00ffbf", "#00ffff", "#00bffff", "#0080ff", "#0040ff", "#0000ff", "#4000ff", "#8000ff", "#bf00ff", "#ff00ff", "#ff00bf", "#ff0080", "#ff0040"];


$("#play").click(function(){ frame = 0; loadAnimation(); });
	  
function loadAnimation(){ setInterval(drawAnimated, 1) };  


// Read the files
$.getJSON("Donnees/Skeleton_BEA.json", function(json1) {
	skeleton = json1;
	$.getJSON("Donnees/BEA1.json", function(json2) {
		positions = json2;
		draw();
	});
});


// Display a succession of frames
function draw() {
	var parent = d3.select("body").select("#container");
	
	var svg = parent.append("svg")
		.attr("width", w)
		.attr("height", h)
		.attr("overflow","scroll")
		.style("display","inline-block");

	// Scale the data
	positions_scaled = positions.map(function(f, j) {
		return f.map(function(d, i) {
			return {
				x: (d.x + 50) * figureScale,
				y: -1 * d.y * figureScale + h - 10,
				z: d.z * figureScale
			};
		});
	});

	headJoint = 7;               

	// Joints
   svg.selectAll("g")
		.data(positions_scaled.filter(function(d, i) {
			return i % skip == 0;
		}))                    
		.enter()
		.append("g")
		.attr("transform",function(d,i) {
					return "translate("+(i*gap)+",0)";
		})
		.selectAll("circle.joints")
			.data(function(d,i) {return d})
			.enter()
			.append("circle")
			.attr("fill-opacity","0.95")
			.attr("cx", function(d) {
				return d.x;
			}).attr("cy", function(d) {
				return d.y;
			}).attr("r", function(d, i) {
			if (i == headJoint)
				return 5;
			else
				return 2;
			}).attr("fill", function(d, i) {
				return colors[i];
			});
	
	// Bones
	svg.selectAll("g2")
		.data(positions_scaled.filter(function(d, i) {
			return i % skip == 0;
		})) 
		.enter()
		.append("g")
		.attr("transform",function(d,i) {
			return "translate("+(i*gap)+",0)";
		})
		.selectAll("line.bones")
			.data(skeleton)
			.enter()
			.append("line")
			.attr("stroke-opacity","0.95")
			.attr("stroke", "grey")
			.attr("stroke-width", 1)
			.attr("x1", 0).attr("x2", 0)
			.attr("x1", function(d, j, k) {
				return positions_scaled[k * skip][d[0]].x;
			})
			.attr("x2", function(d, j, k) {
				return positions_scaled[k * skip][d[1]].x;
			})
			.attr("y1", function(d, j, k) {
				return positions_scaled[k * skip][d[0]].y;
			})
			.attr("y2", function(d, j, k) {
				return positions_scaled[k * skip][d[1]].y;
			});
}

// Display the animation
function drawAnimated(){
	var parent = d3.select("body").select("#container2");
	
	frame+=2;
	
	parent.select("svg").remove();
	var svg = parent.append("svg")
		.attr("width", w2)
		.attr("height", h2)
		.attr("overflow","scroll")
		.style("display","inline-block");

	// Scale the data
	positions_scaled = positions.map(function(f, j) {
		return f.map(function(d, i) {
			return {
				x: (d.x + 50) * figureScale,
				y: -1 * d.y * figureScale + h - 10,
				z: d.z * figureScale
			};
		});
	});
	
	// Choose the frame to draw
	currentFrame = positions_scaled[frame];

	headJoint = 7;

	// Joints
	svg.selectAll("circle.joints" + frame)
		.data(currentFrame)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return d.x;
		}).attr("cy", function(d) {
			return d.y;
		}).attr("r", function(d, i) {
			if (i == headJoint )
				return 5;
			else
				return 2;
		}).attr("fill", function(d, i) {
			return '#555555';
		});	
	
	// Bones
	svg.selectAll("line.bones" + frame)
		.data(skeleton)
		.enter()
		.append("line")
		.attr("stroke", "#555555")
		.attr("stroke-width",1)
		.attr("x1",0).attr("x2",0)
		.attr("x1", function(d, j) {
			return currentFrame[d[0]].x;
		})
		.attr("x2", function(d, j) {
			return currentFrame[d[1]].x;
		})
		.attr("y1", function(d, j) {
			return currentFrame[d[0]].y;
		})
		.attr("y2", function(d, j) {
			return currentFrame[d[1]].y;
		});  
}
