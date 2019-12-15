

var isometricVertex = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;

uniform vec2 u_screenSize;
uniform float u_zoom;
uniform float u_resolution;
uniform vec3 u_camera;
uniform vec4 u_blockRotation;
uniform vec2 u_blockSize;
uniform mat2 u_pixelMatrix;

out vec2 v_texcoord;

void main() {


	gl_Position = vec4(0.0,0.0,0.0,0.5);
	gl_Position.xy=  u_pixelMatrix* (a_position.xy-u_camera.xy) / u_screenSize;  ;
	gl_Position.y-=(a_position[2]*14.5)/u_screenSize[1];
	gl_Position[2] = (gl_Position[1] + a_position[2]*100.0)*0.001;
	//Size based on zoom 
	gl_PointSize = 57.0 * min(1.0,u_zoom);
	v_texcoord = a_texcoord;
}
`;

var isometricFragment = `#version 300 es

precision lowp float;

in vec2 v_texcoord;

uniform sampler2D u_sampler;

out vec4 outColor;

void main() {
	outColor = texture(u_sampler,vec2((gl_PointCoord[0]*0.32 + v_texcoord[0]),gl_PointCoord[1]*1.26));
	//This fixes the fuzzy alpha and makes the texture not a square
	//outColor.a =  outColor.a * step(0.999, outColor.a) - step(0.78,gl_PointCoord[1]);	
	outColor.a -=  step(0.78,gl_PointCoord[1]);
	
	//Sadly I can not think of a way around this if check
	if(outColor.a<1.0){
		discard;
	}
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
		pixelMatrix : gl.getUniformLocation(isometricProgram,"u_pixelMatrix"),
	},
}



