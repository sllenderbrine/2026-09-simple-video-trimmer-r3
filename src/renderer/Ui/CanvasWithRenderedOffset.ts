import { createAttributeBuffer, createProgram, createShader, getUniformLocation, getWebGl2Context } from "../../shared/Utility/WebGl2Utility.js";

export class CanvasWithRenderedOffset {
    containerEl: HTMLDivElement;
    canvasEl: HTMLCanvasElement;
    gl: WebGL2RenderingContext;
    vertexShader: WebGLShader;
    fragmentShader: WebGLShader;
    program: WebGLProgram;
    quadVao: WebGLVertexArrayObject;
    quadPositionBuffer: WebGLBuffer;
    quadTexcoordBuffer: WebGLBuffer;
    offsetUniformLocation: WebGLUniformLocation;
    scaleUniformLocation: WebGLUniformLocation;
    textureUniformLocation: WebGLUniformLocation;
    texture: WebGLTexture;
    constructor() {
        this.containerEl = document.createElement("div");
        
        this.canvasEl = document.createElement("canvas");
        this.containerEl.appendChild(this.canvasEl);

        this.gl = getWebGl2Context(this.canvasEl);
        const gl = this.gl;

        this.vertexShader = createShader(gl, gl.VERTEX_SHADER, `#version 300 es
            in vec2 a_position;
            in vec2 a_texcoord;

            uniform vec2 u_scale;
            uniform vec2 u_offset;

            out vec2 v_texcoord;

            void main() {
                vec2 pos = a_position * u_scale + u_offset;
                gl_Position = vec4(pos, 0, 1);
                v_texcoord = a_texcoord;
            }
        `);
        this.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, `#version 300 es
            precision highp float;
            
            in vec2 v_texcoord;

            uniform sampler2D u_texture;

            out vec4 outColor;

            void main() {
                outColor = texture(u_texture, v_texcoord);
            }
        `);

        this.program = createProgram(gl, this.vertexShader, this.fragmentShader);
        gl.useProgram(this.program);

        this.quadVao = gl.createVertexArray();
        this.quadPositionBuffer = createAttributeBuffer(gl, this.program, "a_position", this.quadVao, "vec2");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            1, -1,
            1,  1,
            -1, -1,
            1,  1,
            -1, 1,
        ]), gl.STATIC_DRAW);
        this.quadTexcoordBuffer = createAttributeBuffer(gl, this.program, "a_texcoord", this.quadVao, "vec2");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadTexcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 1,
            1, 1,
            1, 0,
            0, 1,
            1, 0,
            0, 0,
        ]), gl.STATIC_DRAW);
        gl.bindVertexArray(this.quadVao);

        this.offsetUniformLocation = getUniformLocation(gl, this.program, "u_offset");
        this.scaleUniformLocation = getUniformLocation(gl, this.program, "u_scale");
        this.textureUniformLocation = getUniformLocation(gl, this.program, "u_texture");

        this.texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.textureUniformLocation, 0);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    setOffset(x: number, y: number) {
        const gl = this.gl
        gl.uniform2f(this.offsetUniformLocation, x, y);
    }

    setScale(x: number, y: number) {
        const gl = this.gl
        gl.uniform2f(this.scaleUniformLocation, x, y);
    }

    setCanvasSize(x: number, y: number) {
        const gl = this.gl
        this.canvasEl.width = x;
        this.canvasEl.height = y;
        gl.viewport(0, 0, x, y);
    }

    setTexture(source: TexImageSource) {
        const gl = this.gl;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    }

    render() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}