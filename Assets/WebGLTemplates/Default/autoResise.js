// undefined
// from https://webglfundamentals.org/webgl/webgl-resize-canvas-hd-dpi.html

  "use strict";

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // lookup uniforms
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer to put three 2d clip space points in
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(now) {
    now *= 0.001; // convert to seconds

    resize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)

    // Set Geometry.
    var radius = Math.sqrt(gl.canvas.width * gl.canvas.width + gl.canvas.height * gl.canvas.height) * 0.5;
    var angle = now;
    var x = Math.cos(angle) * radius;
    var y = Math.sin(angle) * radius;
    var centerX = gl.canvas.width  / 2;
    var centerY = gl.canvas.height / 2;
    setGeometry(gl, centerX + x, centerY + y, centerX - x, centerY - y);

    // Compute the matrices
    var projectionMatrix = m3.projection(gl.canvas.width, gl.canvas.height);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, projectionMatrix);

    // Draw in red
    gl.uniform4fv(colorLocation, [1, 0, 0, 1]);

    // Draw the geometry.
    var primitiveType = gl.LINES;
    var offset = 0;
    var count = 2;
    gl.drawArrays(primitiveType, offset, count);

    requestAnimationFrame(drawScene);
  }

  function resize(canvas) {
    var realToCSSPixels = window.devicePixelRatio;

    // Lookup the size the browser is displaying the canvas in CSS pixels
    // and compute a size needed to make our drawingbuffer match it in
    // device pixels.
    var displayWidth  = Math.floor(canvas.clientWidth  * realToCSSPixels);
    var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

    // Check if the canvas is not the same size.
    if (canvas.width  !== displayWidth ||
        canvas.height !== displayHeight) {

      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
  }
}

// Fill the buffer with a line
function setGeometry(gl, x1, y1, x2, y2) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          x1, y1,
          x2, y2]),
      gl.STATIC_DRAW);
}

main();

