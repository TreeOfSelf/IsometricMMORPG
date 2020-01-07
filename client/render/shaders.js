

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
uniform float u_pixelSize;
uniform float u_pixelOffset;
uniform float u_pixelDepthOffset;
uniform float u_soundWave;
uniform float u_viewUp;


out vec2 v_texcoord;
out float v_colorChange;

void main() {


	gl_Position = vec4(0.0,0.0,0.0,0.5);
	gl_Position.xy=  u_pixelMatrix* (a_position.xy-u_camera.xy) / u_screenSize;
	gl_Position.y+=((-a_position[2]-u_camera[2]-u_pixelOffset)*17.0*u_resolution*u_zoom)/u_screenSize[1];
	
	//gl_Position[2] = ((gl_Position[1]*1.5) +(a_position[2]/u_screenSize[1]*25.6+u_pixelDepthOffset*0.033))*0.001; //33
	
	gl_Position[2] = (gl_Position[1]*5.0*u_screenSize[1] + a_position[2]*100.0 + u_pixelDepthOffset*110.0)/u_zoom*0.000001;
	
	gl_Position.y+=((u_soundWave*sin((a_position[0]+u_camera[1]+u_soundWave*2.0)*0.1)*sin((a_position[1]+u_camera[1]+u_soundWave*2.0)*0.1))*3.0*u_resolution*u_zoom)/u_screenSize[1];
	//Size based on zoom 
	gl_PointSize = u_pixelSize * min(1.0,u_zoom);
	v_texcoord = a_texcoord;
	v_colorChange = abs(-a_position[2]-u_camera[2]+1.0)*0.05;
	
	if(a_position[2] < -u_camera[2]-1.0-u_viewUp){
		v_colorChange=5000.0;
	}
	
	
}
`;

var isometricFragment = `#version 300 es

precision highp float;

in vec2 v_texcoord;
in float v_colorChange;

uniform sampler2D u_sampler;
uniform vec2 u_textureResolution;
uniform float u_doStep;
uniform float u_alphaLimit;
uniform float u_step;

out vec4 outColor;

void main() {
	outColor = vec4(mix(texture(u_sampler,vec2((gl_PointCoord[0]*u_textureResolution[0] + v_texcoord[0]),gl_PointCoord[1]*u_textureResolution[1] +v_texcoord[1])).rgb,vec4(0.0,0.0,0.0,1.0).rgb,v_colorChange),texture(u_sampler,vec2((gl_PointCoord[0]*u_textureResolution[0] + v_texcoord[0]),gl_PointCoord[1]*u_textureResolution[1] +v_texcoord[1])).a);
	//This fixes the fuzzy alpha and makes the texture not a square
	//outColor.a =  outColor.a * step(0.999, outColor.a) - step(0.78,gl_PointCoord[1]);	
	outColor.a -=  step(0.78,gl_PointCoord[1])*u_step;
	//Sadly I can not think of a way around this if check

	if(outColor.a<u_alphaLimit || v_colorChange>=1.0 ){
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
		pixelSize : gl.getUniformLocation(isometricProgram,"u_pixelSize"),
		textureResolution : gl.getUniformLocation(isometricProgram,"u_textureResolution"),
		pixelOffset : gl.getUniformLocation(isometricProgram,"u_pixelOffset"),
		pixelDepthOffset : gl.getUniformLocation(isometricProgram,"u_pixelDepthOffset"),
		alphaLimit : gl.getUniformLocation(isometricProgram,"u_alphaLimit"),
		step : gl.getUniformLocation(isometricProgram,"u_step"),
		soundWave : gl.getUniformLocation(isometricProgram,'u_soundWave'),
		viewUp : gl.getUniformLocation(isometricProgram,'u_viewUp'),

	},
}



