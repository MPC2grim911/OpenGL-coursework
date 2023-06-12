
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;

var rotatedDegrees = 0;

// Create a place to store vertex colors
var vertexColorBuffer;

var mvMatrix = mat4.create();

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


function degToRad(degrees) {
  return degrees * Math.PI / 180;
}


function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  
}

function setupBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
 
  /*
  * TODO: Your code goes here 
  * Edit the triangleVertices mesh definition below.
  * Make it into letters U, C and I.
  * Don't forget to update the buffer parameters below,
  * if you change the number of elements.
  */
  var vertices = [
    -0.51,  0.35,  0.0,//U1
    -0.51, -0.25,  0.0,
    -0.41, 0.35,  0.0,
    -0.51, -0.25,  0.0,//U2
    -0.41, 0.35,  0.0,
    -0.41, -0.25, 0.0,
    -0.51, -0.25,  0.0,//U3
    -0.41, -0.25, 0.0,
    -0.41, -0.35, 0.0,
    -0.41, -0.25, 0.0,//U4
    -0.41, -0.35, 0.0,
    -0.31, -0.35, 0.0,
    -0.41, -0.25, 0.0,//U5
    -0.31, -0.35, 0.0,
    -0.31, -0.25, 0.0,
    -0.31, -0.35, 0.0,//U6
    -0.31, -0.25, 0.0,
    -0.21, -0.25, 0.0,
    -0.32, -0.25, 0.0,//U7
    -0.32, 0.35, 0.0,
    -0.22, 0.35, 0.0,
    -0.32, -0.25, 0.0,//U8
    -0.22, 0.35, 0.0,
    -0.22, -0.25, 0.0,
    -0.15, 0.25, 0.0,//c1
    -0.05, 0.35, 0.0,
    -0.05, 0.25, 0.0,
    -0.15, 0.25, 0.0,//C2 
    -0.05, 0.25, 0.0,  
    -0.05, 0.35, 0.0, 
    -0.15, 0.25, 0.0,//C3
    -0.15, -0.25, 0.0,
    -0.05, 0.25, 0.0,
    -0.15, -0.25, 0.0,//C4
    -0.05, 0.25, 0.0,
    -0.05, -0.25, 0.0,
    -0.15, -0.25, 0.0,//C5
    -0.05, -0.25, 0.0,
    -0.05, -0.35, 0.0,
    -0.05, -0.25, 0.0,//C6
    -0.05, -0.35, 0.0, 
    0.05, -0.35, 0.0,   
    -0.05, -0.25, 0.0,//C7
    0.05, -0.35, 0.0,
    0.05, -0.25, 0.0, 
    0.05, -0.35, 0.0,//C8
    0.05, -0.25, 0.0,  
    0.15, -0.25, 0.0,  
    0.05, -0.25, 0.0, //C9 
    0.15, -0.25, 0.0, 
    0.15, -0.15, 0.0,
    0.05, -0.25, 0.0, //C10
    0.15, -0.15, 0.0,
    0.05, -0.15, 0.0,
    -0.05, 0.35, 0.0,//C11
    -0.05, 0.25, 0.0, 
    0.05, 0.35, 0.0, 
    -0.05, 0.25, 0.0, //C12
    0.05, 0.35, 0.0,   
    0.05, 0.25, 0.0,  
    0.05, 0.35, 0.0, //C13  
    0.05, 0.25, 0.0, 
    0.15, 0.25, 0.0,
    0.05, 0.25, 0.0,//C14 
    0.15, 0.25, 0.0,  
    0.15, 0.15, 0.0,
    0.05, 0.25, 0.0,//C15
    0.05, 0.15, 0.0,
    0.15, 0.15, 0.0,
    0.2, 0.35, 0.0, //I1
    0.2, 0.25, 0.0, 
    0.5, 0.25, 0.0,  
    0.2, 0.35, 0.0, //I2  
    0.5, 0.25, 0.0, 
    0.5, 0.35, 0.0,  
    0.4, 0.25, 0.0,//I3
    0.4, -0.25, 0.0,  
    0.3, 0.25, 0.0,  
    0.3, 0.25, 0.0,//I4 
    0.3, -0.25, 0.0,
    0.4, -0.25, 0.0,  
    0.2, -0.25, 0.0,//I5  
    0.5, -0.25, 0.0,  
    0.5, -0.35, 0.0,
    0.2, -0.25, 0.0,//I6
    0.5, -0.35, 0.0,  
    0.2, -0.35, 0.0,  
  ];
    
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 87; //this
    
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
 /*
  * TODO: Your code goes here 
  * Change and edit the colors here. Assign color for each vertex.
  * Make sure to match the edits you made to the positions above.
  * Don't forget to update the buffer parameters below,
  * if you change the number of elements.
  */
  var colors = [
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 87;  //this
}

function draw() { 
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
  mat4.identity(mvMatrix);
 /*
  * TODO: Your code goes here
  * Transformations can be implemented as modifications to the model view matrix
  * using mat4.scale, mat4.rotate, mat4.translate... 
  * You should implement
  * (1) Properly change the transformtion to keep the letters U, C, and I always
  *     inside the canvas (the letters should always be completely shown)
  * (2) Animate the letters by rotating them. The draw function is called
  *     regularly with fixed time interval, so what you need is to declare a global
  *     variable "rotatedDegrees", and inside draw() function, increase its value
  *     by fixed interval (You may want to keep it between 0-360, so consider using mod %).
  *     And then rotate the scene by rotatedDegrees along z axis. 
  */ 
  //mat4.scale(mvMatrix, mvMatrix, [sx, sy, sz]); // sx means scale x axis using sx, similarly for sy and sz  
  //mat4.translate(mvMatrix, mvMatrix, [tx, ty, tz]); // tx means translate x axis for tx, similarly for ty and tz
  rotatedDegrees += 1;
  mat4.rotateZ(mvMatrix, mvMatrix, degToRad(rotatedDegrees)); // angle_in radian is the rotated angle in radian, a  // utility function to convert degrees into radians is  // provided in the code skeleton, called degToRad() 
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
}

function startup() {
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders(); 
  setupBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}

function tick() {
    requestAnimFrame(tick);
    draw();
    animate();
}
