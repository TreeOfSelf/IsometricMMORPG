

var isometricVertex = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;

uniform vec2 u_screenSize;
uniform float u_zoom;
uniform float u_resolution;
uniform vec3 u_camera;
uniform vec4 u_blockRotation;
uniform vec2 u_blockSize;

out vec2 v_texcoord;

void main() {


	//float pixelX = ((u_blockRotation[0]*(a_position[0]-u_camera[0]) + u_blockRotation[1]*(a_position[1]-u_camera[1]))*(57.0));
	//float pixelY = ((u_blockRotation[2]*(a_position[0]-u_camera[0]) + u_blockRotation[3]*(a_position[1]-u_camera[1]))*(45.0))-((a_position[2]-u_camera[2])*45.0);

	gl_Position = vec4( 
	(((u_blockRotation[0]*(a_position[0]) + u_blockRotation[1]*(a_position[1]))*(28.0))
	-u_camera[0])*u_resolution*u_zoom/u_screenSize[0],
	(((u_blockRotation[2]*(a_position[0]) + u_blockRotation[3]*(a_position[1]))*(13.5))-((a_position[2]-u_camera[2])*45.0)
	-u_camera[1])*u_resolution*u_zoom/u_screenSize[1],
	0.0,
	0.5);
	gl_Position[2] = (gl_Position[1] + (a_position[2]*100.0))*0.005;
	gl_PointSize = 57.0 * min(1.0,u_zoom);
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
	//outColor = texture(u_sampler, v_texcoord);
	outColor = texture(u_sampler,vec2(gl_PointCoord[0],gl_PointCoord[1]*1.26));
	outColor.a *= step (0.999, outColor.a);
	outColor.a -= step(0.78,gl_PointCoord[1]);
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
		camera : gl.getUniformLocation(isometricProgram,"u_camera"),
		blockRotation : gl.getUniformLocation(isometricProgram,"u_blockRotation"),
	},
}
