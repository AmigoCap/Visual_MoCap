var scene, camera, controls, renderer;  // THREE.js objects
var positions = [], skeleton = [];      // Data read from updated files
var points = [], bones = [];            // Meshes' lists (for updating) 
var frame = 1, step = 1, play = false;  // Variables used for the player


// WebGL detector
if (Detector.webgl) {
    // Run
    init();
    
    // Events
    $("#csvPath").change(readPoints);
    $("#skePath").change(readSkeleton);
    $("#playBtn").click(function(){ play = !play; });
    $("#progressBar").change(function(){ frame = parseInt($(this).val(), 10); });
} else {
    alert("Pour pouvoir utiliser cet outil, merci de bien vouloir utiliser un navigateur compatible avec WebGL");
}


// Resize the canvas
function canvasResize() {
    renderer.setSize(window.innerWidth * 0.98, window.innerHeight - 68);
}


// Initialize the scene, the camera & the canvas
function init() {
    // Create the Scene
    scene = new THREE.Scene(); 

    // Set the Camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(5000, 3000, 0);

    // Add Camera Controls
    controls = new THREE.OrbitControls(camera, canvas);
    controls.minDistance = 1;
    controls.maxDistance = 10000;

    // Set the Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    canvasResize();
    renderer.setClearColor (0xf2f2f2, 1);
    document.body.appendChild(renderer.domElement);
    
    // Events
    window.addEventListener('resize', canvasResize, false);
}


// Open & read a .csv file
function readPoints(evt) {
    // Reinitialization
    frame = 1;
    $("#progressBar").val(frame);
    positions = [], points = [];
    var file = evt.target.files[0];
    
    // Clear the scene
    while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
    }
    
    // Grid
    scene.add( new THREE.GridHelper( 5000, 10 ) );
    
    // Read the .csv file
    if(file) {      
        var reader = new FileReader();
        reader.onload = function(event) {
            lines = event.target.result.split('\n');
            for(var i = 5; i < lines.length; i++) {
                line = lines[i].split(',');
                positions[line[0]] = [];
                for(var j = 2; j < line.length; j += 3) {
                    positions[line[0]].push({x: parseFloat(line[j]), y: parseFloat(line[j+2]), z: parseFloat(line[j+1])});
                }
            }
             
            // Initialize the progressBar
            $("#progressBar").attr('max', positions.length - 1)

            // Spheres
            for(var i = 0; i < positions[1].length; i++) {
                var geometry = new THREE.SphereGeometry(20);
                var material = new THREE.MeshBasicMaterial({color: 0x666666})
                var sphere = new THREE.Mesh(geometry, material);
                points.push(sphere);
                scene.add(sphere);
            }

            // Run the animation
            animate();
        };
        reader.readAsText(file);        
    } else {
        alert("Failed to open file !");
    }
}


// Open & read a .ske file
function readSkeleton(evt) {
    // Skeleton reinitialization
    skeleton = [];
    var file = evt.target.files[0];
    
    if(positions.length != 0) {
        // Read the .csv file
        if(file) {          
            var reader = new FileReader();
            reader.onload = function(event) {
                skeleton = JSON.parse(event.target.result);

                // Lines
                for(var i = 0; i < skeleton.length; i++) {       
                    var geometry = new THREE.CylinderGeometry(10, 10, 1);
                    var material = new THREE.MeshBasicMaterial({color: 0x999999});
                    var cylinder = new THREE.Mesh(geometry, material);
                    bones.push(cylinder);
                    scene.add(cylinder); 
                }
            };         
            reader.readAsText(file);
        } else {
            alert("Failed to open file !");
        }
    } else {
        alert("Please, load the points first");
    }
}


// Rendering loop
function animate() {
    // Points update
    for(var i = 0; i < points.length; i ++) {
        points[i].position.set(positions[frame][i].x, positions[frame][i].y, positions[frame][i].z);
    }

    // Bones update
    for(var i = 0; i < bones.length; i ++) {
        var p1 = new THREE.Vector3(positions[frame][skeleton[i][0]].x, positions[frame][skeleton[i][0]].y, positions[frame][skeleton[i][0]].z);
        var p2 = new THREE.Vector3(positions[frame][skeleton[i][1]].x, positions[frame][skeleton[i][1]].y, positions[frame][skeleton[i][1]].z);
        var pos = new THREE.Vector3().addVectors(p1, p2).divideScalar(2);
        var vec = new THREE.Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
        var haut = vec.length();
        
        bones[i].scale.y = haut;
        bones[i].quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec.clone().normalize());
        bones[i].position.set(pos.x, pos.y, pos.z);
    }

    // Next frame
    if(play) {
        if(frame + step < positions.length) {
            frame += step;
            $("#progressBar").val(frame);
        }    
    }
       
    // Render & animate the canvas
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
