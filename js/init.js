// Variables
var scene, camera, controls, renderer;
var positions = [], points = [];
var frame = 1, step = 1;

// WebGL detector
if (!Detector.webgl) {
    alert("Pour pouvoir utiliser cet outil, merci de bien vouloir utiliser un navigateur compatible avec WebGL");
}
else
{
    init();
    //loadModel();
    //animate();
    
    $("#filePath").change(openFile);
}


// Initialize the scene, the camera & the canvas
function init() {
    // Create the Scene
    scene = new THREE.Scene(); 

    // Set the Camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 0, 3000 );

    // Add Camera Controls
    controls = new THREE.OrbitControls( camera );
    controls.minDistance = 1;
    controls.maxDistance = 10000;

    // Set the Renderer
    renderer = new THREE.WebGLRenderer( { canvas: canvas } );
    canvasResize();
    renderer.setClearColor (0xe6e6e6, 1);
    document.body.appendChild( renderer.domElement );
    
    // Events
    window.addEventListener( 'resize', canvasResize, false );
}


// Load the scene elements
function loadModel(){   
    // Reset
    frame = 1;
    points = [];
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
    
    // Grid
    scene.add( new THREE.GridHelper( 5000, 10 ) );

    // Color
    var material = new THREE.MeshBasicMaterial({color: 0x888888});

    // Meshes
    for(var i = 0; i < positions[1].length; i ++) {
        var geometry = new THREE.SphereGeometry(20, 32, 32);
        var sphere = new THREE.Mesh(geometry, material);
        points.push(sphere);
        scene.add(sphere);
    }
}


// Rendering loop
function animate() {
    // Points update
    for(var i = 0; i < points.length; i ++) {
        points[i].position.set(positions[frame][i].x, positions[frame][i].z, positions[frame][i].y);
    }
    
    // Next frame
    if(frame + step < positions.length) {
        frame += step;
    }
   
    // Render & animate the canvas
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}


// Resize the canvas
function canvasResize() {
  renderer.setSize( window.innerWidth * 0.95, window.innerHeight * 0.92 );
}


// Open & read a .csv file
function openFile(evt) {

    positions = [];
    var file = evt.target.files[0];
    
    if(file) {
        var reader = new FileReader();
        
        reader.onload = function(event) {
            lines = event.target.result.split('\n');
            for(var i = 5; i < lines.length; i++) {
                line = lines[i].split(',');
                positions[line[0]] = [];
                for(var j = 2; j < line.length; j += 3) {
                    positions[line[0]].push({x: line[j], y: line[j+1], z: line[j+2]});
                }
            }
            
            loadModel();
            animate();
        };
        
        reader.readAsText(file);    
    } else {
        alert("Failed to open file !");
    }
}
