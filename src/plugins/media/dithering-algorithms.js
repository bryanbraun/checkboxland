// Dithering algorithms pulled from https://github.com/danielepiccone/ditherjs.

// Default rgb colors for our dithering pallet (see https://github.com/danielepiccone/ditherjs#usage-and-options)
// The first color is "checkbox blue" and the second is white.
const PALLET = [[60, 136, 253], [255, 255, 255]];

export function orderedDither({ uint8data, palette = PALLET, step = 1, h, w }) {
  var d = new Uint8ClampedArray(uint8data);
  var ratio = 3;
  var m = new Array(
    [  1,  9,  3, 11 ],
    [ 13,  5, 15,  7 ],
    [  4, 12,  2, 10 ],
    [ 16,  8, 14,  6 ]
  );

  var r, g, b, a, i, color, approx, tr, tg, tb, dx, dy, di;

  for (var y=0; y<h; y += step) {
    for (var x=0; x<w; x += step) {
      i = (4*x) + (4*y*w);

      // Define bytes
      r = i;
      g = i+1;
      b = i+2;
      a = i+3;

      d[r] += m[x%4][y%4] * ratio;
      d[g] += m[x%4][y%4] * ratio;
      d[b] += m[x%4][y%4] * ratio;

      color = new Array(d[r],d[g],d[b]);
      approx = approximateColor(color, palette);
      tr = approx[0];
      tg = approx[1];
      tb = approx[2];

      // Draw a block
      for (dx=0; dx<step; dx++) {
        for (dy=0; dy<step; dy++) {
          di = i + (4 * dx) + (4 * w * dy);

          // Draw pixel
          d[di] = tr;
          d[di+1] = tg;
          d[di+2] = tb;
        }
      }
    }
  }

  return d;
}

export function atkinsonDither({ uint8data, palette = PALLET, step = 1, h, w }) {
  var d = new Uint8ClampedArray(uint8data);
  var out = new Uint8ClampedArray(uint8data);
  var ratio = 1/8;

  var $i = function(x,y) {
    return (4*x) + (4*y*w);
  };

  var r, g, b, a, q, i, color, approx, tr, tg, tb, dx, dy, di;

  for (var y=0;y<h;y += step) {
    for (var x=0;x<w;x += step) {
      i = (4*x) + (4*y*w);

      // Define bytes
      r = i;
      g = i+1;
      b = i+2;
      a = i+3;

      color = new Array(d[r],d[g],d[b]);
      approx = approximateColor(color, palette);

      q = [];
      q[r] = d[r] - approx[0];
      q[g] = d[g] - approx[1];
      q[b] = d[b] - approx[2];

      // Diffuse the error for three colors
      d[$i(x+step,y) + 0] += ratio * q[r];
      d[$i(x-step,y+step) + 0] += ratio * q[r];
      d[$i(x,y+step) + 0] += ratio * q[r];
      d[$i(x+step,y+step) + 0] += ratio * q[r];
      d[$i(x+(2*step),y) + 0] += ratio * q[r];
      d[$i(x,y+(2*step)) + 0] += ratio * q[r];

      d[$i(x+step,y) + 1] += ratio * q[g];
      d[$i(x-step,y+step) + 1] += ratio * q[g];
      d[$i(x,y+step) + 1] += ratio * q[g];
      d[$i(x+step,y+step) + 1] += ratio * q[g];
      d[$i(x+(2*step),y) + 1] += ratio * q[g];
      d[$i(x,y+(2*step)) + 1] += ratio * q[g];

      d[$i(x+step,y) + 2] += ratio * q[b];
      d[$i(x-step,y+step) + 2] += ratio * q[b];
      d[$i(x,y+step) + 2] += ratio * q[b];
      d[$i(x+step,y+step) + 2] += ratio * q[b];
      d[$i(x+(2*step),y) + 2] += ratio * q[b];
      d[$i(x,y+(2*step)) + 2] += ratio * q[b];

      tr = approx[0];
      tg = approx[1];
      tb = approx[2];

      // Draw a block
      for (dx=0;dx<step;dx++){
        for (dy=0;dy<step;dy++){
          di = i + (4 * dx) + (4 * w * dy);

          // Draw pixel
          out[di] = tr;
          out[di+1] = tg;
          out[di+2] = tb;
        }
      }
    }
  }

  return out;
}

export function errorDiffusionDither({ uint8data, palette = PALLET, step = 1, h, w }) {
  var d = new Uint8ClampedArray(uint8data);
  var out = new Uint8ClampedArray(uint8data);
  var ratio = 1/16;

  var $i = function(x,y) {
    return (4*x) + (4*y*w);
  };

  var r, g, b, a, q, i, color, approx, tr, tg, tb, dx, dy, di;

  for (var y=0;y<h;y += step) {
    for (var x=0;x<w;x += step) {
      i = (4*x) + (4*y*w);

      // Define bytes
      r = i;
      g = i+1;
      b = i+2;
      a = i+3;

      color = new Array(d[r],d[g],d[b]);
      approx = approximateColor(color, palette);

      q = [];
      q[r] = d[r] - approx[0];
      q[g] = d[g] - approx[1];
      q[b] = d[b] - approx[2];

      // Diffuse the error
      d[$i(x+step,y)] =  d[$i(x+step,y)] + 7 * ratio * q[r];
      d[$i(x-step,y+1)] =  d[$i(x-1,y+step)] + 3 * ratio * q[r];
      d[$i(x,y+step)] =  d[$i(x,y+step)] + 5 * ratio * q[r];
      d[$i(x+step,y+step)] =  d[$i(x+1,y+step)] + 1 * ratio * q[r];

      d[$i(x+step,y)+1] =  d[$i(x+step,y)+1] + 7 * ratio * q[g];
      d[$i(x-step,y+step)+1] =  d[$i(x-step,y+step)+1] + 3 * ratio * q[g];
      d[$i(x,y+step)+1] =  d[$i(x,y+step)+1] + 5 * ratio * q[g];
      d[$i(x+step,y+step)+1] =  d[$i(x+step,y+step)+1] + 1 * ratio * q[g];

      d[$i(x+step,y)+2] =  d[$i(x+step,y)+2] + 7 * ratio * q[b];
      d[$i(x-step,y+step)+2] =  d[$i(x-step,y+step)+2] + 3 * ratio * q[b];
      d[$i(x,y+step)+2] =  d[$i(x,y+step)+2] + 5 * ratio * q[b];
      d[$i(x+step,y+step)+2] =  d[$i(x+step,y+step)+2] + 1 * ratio * q[b];

      // Color
      tr = approx[0];
      tg = approx[1];
      tb = approx[2];

      // Draw a block
      for (dx=0;dx<step;dx++){
        for (dy=0;dy<step;dy++){
          di = i + (4 * dx) + (4 * w * dy);

          // Draw pixel
          out[di] = tr;
          out[di+1] = tg;
          out[di+2] = tb;
        }
      }
    }
  }

  return out;
}


// Color distance helpers, which are referenced in several of the algorithms.
function approximateColor(color, palette) {
  function colorDistance(a, b) {
    return Math.sqrt(
      Math.pow( ((a[0]) - (b[0])), 2 ) +
      Math.pow( ((a[1]) - (b[1])), 2 ) +
      Math.pow( ((a[2]) - (b[2])), 2 )
    );
  };

  function findIndex(fun, arg, list, min) {
    if (list.length == 2) {
      if (fun(arg,min) <= fun(arg,list[1])) {
        return min;
      } else {
        return list[1];
      }
    } else {
      var tl = list.slice(1);
      if (fun(arg,min) <= fun(arg,list[1])) {
        min = min;
      } else {
        min = list[1];
      }
      return findIndex(fun,arg,tl,min);
    }
  };

  var foundColor = findIndex(colorDistance, color, palette, palette[0]);

  return foundColor;
};
