

var isometricVertex = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;

uniform vec2 u_screenSize;
uniform float u_zoom;
uniform float u_resolution;
uniform vec2 u_camera;

out vec2 v_texcoord;

void main() {

  gl_Position = vec4( (a_position[0]-u_camera[0])*u_resolution*u_zoom/u_screenSize[0],(a_position[1]-u_camera[1])*u_resolution*u_zoom/u_screenSize[1],0.0,0.5);
  v_texcoord = a_texcoord;
}
`;

var isometricFragment = `#version 300 es

precision mediump float;

in vec2 v_texcoord;

uniform sampler2D u_sampler;

out vec4 outColor;

void main() {
	//outColor = vec4(v_texcoord[0],v_texcoord[1],0.2,1.0);
	outColor = texture(u_sampler, v_texcoord);
	outColor.a *= step (0.999, outColor.a);
}
`;

var isometricVertexShader = createShader(gl, gl.VERTEX_SHADER, isometricVertex);
var isometricFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, isometricFragment);
var isometricProgram = createProgram(gl, isometricVertexShader, isometricFragmentShader);

isometricShaderProgram = {
	attributes : {
		position : gl.getAttribLocation(isometricProgram, "a_position"),	
		texture : gl.getAttribLocation(isometricProgram, "a_texcoord"),
	},
	
	uniforms : {
		screenSize : gl.getUniformLocation(isometricProgram, "u_screenSize"),
		sampler : gl.getUniformLocation(isometricProgram, "u_sampler"),
		zoom : gl.getUniformLocation(isometricProgram, "u_zoom"),
		resolution : gl.getUniformLocation(isometricProgram,"u_resolution"),
		camera : gl.getUniformLocation(isometricProgram,"u_camera")
	},
}
