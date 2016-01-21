/**
 * SimpleLightmapFilter, originally by Oza94
 * http://www.html5gamedevs.com/topic/20027-pixijs-simple-lightmapping/
 * http://codepen.io/Oza94/pen/EPoRxj
 * From tutorial http://www.alcove-games.com/opengl-es-2-tutorials/lightmap-shader-fire-effect-glsl/
 *
 * @class
 * @param texture {number} The texture of your lightmap
 * @param color {Array} The rgba color to use as the ambient color
 * @param resolution {Array} The screen resolution
 *
 * @example
 *  var lightmapTex = new PIXI.RenderTexture(renderer, 800, 600);
 *  // render your lightmap on the render texture
 *  stage.filters = [new SimpleLightmapFilter(lightmapTex, [0.3, 0.3, 0.7, 0.5], [1, 1])];
 */
var PIXI = require('pixi.js');

var fragmentShader = [
    'precision mediump float;',
    'varying vec4 vColor;',
    'varying vec2 vTextureCoord;',
    'uniform sampler2D u_texture;',
    'uniform sampler2D u_lightmap;',
    'uniform vec2 resolution;',
    'uniform vec4 ambientColor;',
    'void main() {',
    '    vec4 diffuseColor = texture2D(u_texture, vTextureCoord);',
    '    vec2 lighCoord = (gl_FragCoord.xy / resolution.xy);',
    '    vec4 light = texture2D(u_lightmap, vTextureCoord);',
    '    vec3 ambient = ambientColor.rgb * ambientColor.a;',
    '    vec3 intensity = ambient + light.rgb;',
    '    vec3 finalColor = diffuseColor.rgb * intensity;',
    '    gl_FragColor = vColor * vec4(finalColor, diffuseColor.a);',
    '}'
].join('\n');

function SimpleLightmapFilter(texture, color, resolution) {
    PIXI.AbstractFilter.call(
        this,
        null,
        fragmentShader,
        {
            u_lightmap: {
                type: 'sampler2D',
                value: texture
            },
            resolution: {
                type: '2f',
                value: new Float32Array(resolution || [1, 1])
            },
            ambientColor: {
                type: '4f',
                value: new Float32Array(color || [0.3, 0.3, 0.7, 0.5])
            }
        });
}

SimpleLightmapFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
SimpleLightmapFilter.prototype.constructor = SimpleLightmapFilter;

Object.defineProperties(SimpleLightmapFilter.prototype, {
    texture: {
        get: function () {
            return this.uniforms.u_lightmap.value;
        },
        set: function (value) {
            this.uniforms.u_lightmap.value = value;
        }
    },
    color: {
        get: function () {
            return this.uniforms.ambientColor.value;
        },
        set: function (value) {
            this.uniforms.ambientColor.value = new Float32Array(value);
        }
    },
    resolution: {
        get: function () {
            return this.uniforms.resolution.value;
        },
        set: function (value) {
            this.uniforms.resolution.value = new Float32Array(value);
        }
    }
});

module.exports = SimpleLightmapFilter;
