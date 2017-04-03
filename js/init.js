// Variables
var scene, camera, controls, renderer;


// WebGL Detector
if (!Detector.webgl) {
    alert("Pour pouvoir utiliser cet outil, merci de bien vouloir utiliser un navigateur compatible avec WebGL");
}
else
{
    init();
    loadModel();
    animate();
}


// Initialise la scene, la camera et le canvas
function init() {
    // Create the Scene
    scene = new THREE.Scene();
    scene.add( new THREE.GridHelper( 10, 10 ) );

    // Set the Camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 0, 5 );

    // Add Camera Controls
    controls = new THREE.OrbitControls( camera );
    controls.minDistance = 1;
    controls.maxDistance = 100;

    // Set the Renderer
    renderer = new THREE.WebGLRenderer( { canvas: canvas } );
    canvasResize();
    renderer.setClearColor (0xe6e6e6, 1);
    document.body.appendChild( renderer.domElement );
    
    // Events
    window.addEventListener( 'resize', canvasResize, false );
}


function loadModel(){
    // Cube
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    
    /*
    // Lines
    var material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    geometry.vertices.push(new THREE.Vector3(10, 0, 0));

    var line = new THREE.Line(geometry, material);

    scene.add(line);
    */
}


// Rendering loop
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}


function canvasResize() {
  renderer.setSize( window.innerWidth * 0.95, window.innerHeight * 0.95 );
}
