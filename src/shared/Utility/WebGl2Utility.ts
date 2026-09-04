export type WebGl2UtilityAttributeType = "vec2" | "vec3" | "vec4" | "ivec2" | "ivec3" | "ivec4";

export function createShader(gl: WebGL2RenderingContext, type: GLenum, source: string) {
    const shader = gl.createShader(type);
    if(!shader) {
        throw new Error("Failed to create shader: " + gl.getError());
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success)
        return shader;
    const msg = "Failed to compile shader: " + gl.getError() + " \n " + gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(msg);
}

export function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success)
        return program;
    const msg = "Failed to link program: " + gl.getError() + " \n " + gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(msg);
}

export function getWebGl2Context(canvas: HTMLCanvasElement, options?: WebGLContextAttributes) {
    const gl = canvas.getContext("webgl2", options);
    if(!gl)
        throw new Error("Webgl2 is not supported!");
    return gl;
}

export function getUniformLocation(gl: WebGL2RenderingContext, program: WebGLProgram, name: string) {
    const uniformLocation = gl.getUniformLocation(program, name);
    if(!uniformLocation)
        throw new Error("Failed to get uniform location \"" + name + "\" " + gl.getError());
    return uniformLocation;
}

export function vertexAttribPointer(
    gl: WebGL2RenderingContext,
    location: number,
    attributeType: WebGl2UtilityAttributeType,
    normalized: boolean = false,
    stride: number = 0,
    offset: number = 0
) {
    switch(attributeType) {
        case "vec2":
            gl.vertexAttribPointer(location, 2, gl.FLOAT, normalized, stride, offset);
            break;
        case "vec3":
            gl.vertexAttribPointer(location, 3, gl.FLOAT, normalized, stride, offset);
            break;
        case "vec4":
            gl.vertexAttribPointer(location, 4, gl.FLOAT, normalized, stride, offset);
            break;
        case "ivec2":
            gl.vertexAttribIPointer(location, 2, gl.INT, stride, offset);
            break;
        case "ivec3":
            gl.vertexAttribIPointer(location, 3, gl.INT, stride, offset);
            break;
        case "ivec4":
            gl.vertexAttribIPointer(location, 4, gl.INT, stride, offset);
            break;
    }
}

export function createAttributeBuffer(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    bufferName: string,
    vao: WebGLVertexArrayObject,
    attributeType: WebGl2UtilityAttributeType
) {
    gl.bindVertexArray(vao);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const attribLocation = gl.getAttribLocation(program, bufferName);

    gl.enableVertexAttribArray(attribLocation);
    vertexAttribPointer(gl, attribLocation, attributeType);
    
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return buffer;
}