'use strict';
var __extends = this && this.__extends || function() {
  var n = function(e, u) {
    n = Object.setPrototypeOf || {__proto__:[]} instanceof Array && function(d, a) {
      d.__proto__ = a;
    } || function(d, a) {
      for (var c in a) {
        Object.prototype.hasOwnProperty.call(a, c) && (d[c] = a[c]);
      }
    };
    return n(e, u);
  };
  return function(e, u) {
    function d() {
      this.constructor = e;
    }
    if (typeof u !== "function" && u !== null) {
      throw new TypeError("Class extends value " + String(u) + " is not a constructor or null");
    }
    n(e, u);
    e.prototype = u === null ? Object.create(u) : (d.prototype = u.prototype, new d());
  };
}(), spine;
(function(n) {
  var e = function() {
    function k(f, g, l) {
      if (f == null) {
        throw Error("name cannot be null.");
      }
      if (g == null) {
        throw Error("timelines cannot be null.");
      }
      this.name = f;
      this.timelines = g;
      this.timelineIds = [];
      for (f = 0; f < g.length; f++) {
        this.timelineIds[g[f].getPropertyId()] = !0;
      }
      this.duration = l;
    }
    k.prototype.hasTimeline = function(f) {
      return this.timelineIds[f] == 1;
    };
    k.prototype.apply = function(f, g, l, p, q, r, w, t) {
      if (f == null) {
        throw Error("skeleton cannot be null.");
      }
      p && this.duration != 0 && (l %= this.duration, g > 0 && (g %= this.duration));
      p = this.timelines;
      for (var v = 0, x = p.length; v < x; v++) {
        p[v].apply(f, g, l, q, r, w, t);
      }
    };
    k.binarySearch = function(f, g, l) {
      l === void 0 && (l = 1);
      var p = 0, q = f.length / l - 2;
      if (q == 0) {
        return l;
      }
      for (var r = q >>> 1;;) {
        f[(r + 1) * l] <= g ? p = r + 1 : q = r;
        if (p == q) {
          return (p + 1) * l;
        }
        r = p + q >>> 1;
      }
    };
    k.linearSearch = function(f, g, l) {
      for (var p = 0, q = f.length - l; p <= q; p += l) {
        if (f[p] > g) {
          return p;
        }
      }
      return -1;
    };
    return k;
  }();
  n.Animation = e;
  var u;
  (function(k) {
    k[k.setup = 0] = "setup";
    k[k.first = 1] = "first";
    k[k.replace = 2] = "replace";
    k[k.add = 3] = "add";
  })(u = n.MixBlend || (n.MixBlend = {}));
  var d;
  (function(k) {
    k[k.mixIn = 0] = "mixIn";
    k[k.mixOut = 1] = "mixOut";
  })(d = n.MixDirection || (n.MixDirection = {}));
  var a;
  (function(k) {
    k[k.rotate = 0] = "rotate";
    k[k.translate = 1] = "translate";
    k[k.scale = 2] = "scale";
    k[k.shear = 3] = "shear";
    k[k.attachment = 4] = "attachment";
    k[k.color = 5] = "color";
    k[k.deform = 6] = "deform";
    k[k.event = 7] = "event";
    k[k.drawOrder = 8] = "drawOrder";
    k[k.ikConstraint = 9] = "ikConstraint";
    k[k.transformConstraint = 10] = "transformConstraint";
    k[k.pathConstraintPosition = 11] = "pathConstraintPosition";
    k[k.pathConstraintSpacing = 12] = "pathConstraintSpacing";
    k[k.pathConstraintMix = 13] = "pathConstraintMix";
    k[k.twoColor = 14] = "twoColor";
  })(a = n.TimelineType || (n.TimelineType = {}));
  var c = function() {
    function k(f) {
      if (f <= 0) {
        throw Error("frameCount must be > 0: " + f);
      }
      this.curves = n.Utils.newFloatArray((f - 1) * k.BEZIER_SIZE);
    }
    k.prototype.getFrameCount = function() {
      return this.curves.length / k.BEZIER_SIZE + 1;
    };
    k.prototype.setLinear = function(f) {
      this.curves[f * k.BEZIER_SIZE] = k.LINEAR;
    };
    k.prototype.setStepped = function(f) {
      this.curves[f * k.BEZIER_SIZE] = k.STEPPED;
    };
    k.prototype.getCurveType = function(f) {
      f *= k.BEZIER_SIZE;
      if (f == this.curves.length) {
        return k.LINEAR;
      }
      f = this.curves[f];
      return f == k.LINEAR ? k.LINEAR : f == k.STEPPED ? k.STEPPED : k.BEZIER;
    };
    k.prototype.setCurve = function(f, g, l, p, q) {
      var r = (-g * 2 + p) * 0.03, w = (-l * 2 + q) * 0.03;
      p = ((g - p) * 3 + 1) * 0.006;
      q = ((l - q) * 3 + 1) * 0.006;
      var t = r * 2 + p, v = w * 2 + q;
      g = g * 0.3 + r + p * 0.16666667;
      l = l * 0.3 + w + q * 0.16666667;
      f *= k.BEZIER_SIZE;
      w = this.curves;
      w[f++] = k.BEZIER;
      r = g;
      for (var x = l, z = f + k.BEZIER_SIZE - 1; f < z; f += 2) {
        w[f] = r, w[f + 1] = x, g += t, l += v, t += p, v += q, r += g, x += l;
      }
    };
    k.prototype.getCurvePercent = function(f, g) {
      g = n.MathUtils.clamp(g, 0, 1);
      var l = this.curves;
      f *= k.BEZIER_SIZE;
      var p = l[f];
      if (p == k.LINEAR) {
        return g;
      }
      if (p == k.STEPPED) {
        return 0;
      }
      f++;
      p = 0;
      for (var q = f, r = f + k.BEZIER_SIZE - 1; f < r; f += 2) {
        if (p = l[f], p >= g) {
          return f == q ? r = q = 0 : (q = l[f - 2], r = l[f - 1]), r + (l[f + 1] - r) * (g - q) / (p - q);
        }
      }
      l = l[f - 1];
      return l + (1 - l) * (g - p) / (1 - p);
    };
    k.LINEAR = 0;
    k.STEPPED = 1;
    k.BEZIER = 2;
    k.BEZIER_SIZE = 19;
    return k;
  }();
  n.CurveTimeline = c;
  var b = function(k) {
    function f(g) {
      var l = k.call(this, g) || this;
      l.frames = n.Utils.newFloatArray(g << 1);
      return l;
    }
    __extends(f, k);
    f.prototype.getPropertyId = function() {
      return (a.rotate << 24) + this.boneIndex;
    };
    f.prototype.setFrame = function(g, l, p) {
      g <<= 1;
      this.frames[g] = l;
      this.frames[g + f.ROTATION] = p;
    };
    f.prototype.apply = function(g, l, p, q, r, w, t) {
      l = this.frames;
      g = g.bones[this.boneIndex];
      if (g.active) {
        if (p < l[0]) {
          switch(w) {
            case u.setup:
              g.rotation = g.data.rotation;
              break;
            case u.first:
              w = g.data.rotation - g.rotation, g.rotation += (w - (16384 - (16384.499999999996 - w / 360 | 0)) * 360) * r;
          }
        } else {
          if (p >= l[l.length - f.ENTRIES]) {
            switch(p = l[l.length + f.PREV_ROTATION], w) {
              case u.setup:
                g.rotation = g.data.rotation + p * r;
                break;
              case u.first:
              case u.replace:
                p += g.data.rotation - g.rotation, p -= (16384 - (16384.499999999996 - p / 360 | 0)) * 360;
              case u.add:
                g.rotation += p * r;
            }
          } else {
            t = e.binarySearch(l, p, f.ENTRIES);
            q = l[t + f.PREV_ROTATION];
            var v = l[t];
            p = this.getCurvePercent((t >> 1) - 1, 1 - (p - v) / (l[t + f.PREV_TIME] - v));
            l = l[t + f.ROTATION] - q;
            l = q + (l - (16384 - (16384.499999999996 - l / 360 | 0)) * 360) * p;
            switch(w) {
              case u.setup:
                g.rotation = g.data.rotation + (l - (16384 - (16384.499999999996 - l / 360 | 0)) * 360) * r;
                break;
              case u.first:
              case u.replace:
                l += g.data.rotation - g.rotation;
              case u.add:
                g.rotation += (l - (16384 - (16384.499999999996 - l / 360 | 0)) * 360) * r;
            }
          }
        }
      }
    };
    f.ENTRIES = 2;
    f.PREV_TIME = -2;
    f.PREV_ROTATION = -1;
    f.ROTATION = 1;
    return f;
  }(c);
  n.RotateTimeline = b;
  b = function(k) {
    function f(g) {
      var l = k.call(this, g) || this;
      l.frames = n.Utils.newFloatArray(g * f.ENTRIES);
      return l;
    }
    __extends(f, k);
    f.prototype.getPropertyId = function() {
      return (a.translate << 24) + this.boneIndex;
    };
    f.prototype.setFrame = function(g, l, p, q) {
      g *= f.ENTRIES;
      this.frames[g] = l;
      this.frames[g + f.X] = p;
      this.frames[g + f.Y] = q;
    };
    f.prototype.apply = function(g, l, p, q, r, w, t) {
      l = this.frames;
      g = g.bones[this.boneIndex];
      if (g.active) {
        if (p < l[0]) {
          switch(w) {
            case u.setup:
              g.x = g.data.x;
              g.y = g.data.y;
              break;
            case u.first:
              g.x += (g.data.x - g.x) * r, g.y += (g.data.y - g.y) * r;
          }
        } else {
          if (p >= l[l.length - f.ENTRIES]) {
            q = l[l.length + f.PREV_X], t = l[l.length + f.PREV_Y];
          } else {
            var v = e.binarySearch(l, p, f.ENTRIES);
            q = l[v + f.PREV_X];
            t = l[v + f.PREV_Y];
            var x = l[v];
            p = this.getCurvePercent(v / f.ENTRIES - 1, 1 - (p - x) / (l[v + f.PREV_TIME] - x));
            q += (l[v + f.X] - q) * p;
            t += (l[v + f.Y] - t) * p;
          }
          switch(w) {
            case u.setup:
              g.x = g.data.x + q * r;
              g.y = g.data.y + t * r;
              break;
            case u.first:
            case u.replace:
              g.x += (g.data.x + q - g.x) * r;
              g.y += (g.data.y + t - g.y) * r;
              break;
            case u.add:
              g.x += q * r, g.y += t * r;
          }
        }
      }
    };
    f.ENTRIES = 3;
    f.PREV_TIME = -3;
    f.PREV_X = -2;
    f.PREV_Y = -1;
    f.X = 1;
    f.Y = 2;
    return f;
  }(c);
  n.TranslateTimeline = b;
  var h = function(k) {
    function f(g) {
      return k.call(this, g) || this;
    }
    __extends(f, k);
    f.prototype.getPropertyId = function() {
      return (a.scale << 24) + this.boneIndex;
    };
    f.prototype.apply = function(g, l, p, q, r, w, t) {
      var v = this.frames;
      g = g.bones[this.boneIndex];
      if (g.active) {
        if (p < v[0]) {
          switch(w) {
            case u.setup:
              g.scaleX = g.data.scaleX;
              g.scaleY = g.data.scaleY;
              break;
            case u.first:
              g.scaleX += (g.data.scaleX - g.scaleX) * r, g.scaleY += (g.data.scaleY - g.scaleY) * r;
          }
        } else {
          if (p >= v[v.length - f.ENTRIES]) {
            l = v[v.length + f.PREV_X] * g.data.scaleX, q = v[v.length + f.PREV_Y] * g.data.scaleY;
          } else {
            var x = e.binarySearch(v, p, f.ENTRIES);
            l = v[x + f.PREV_X];
            q = v[x + f.PREV_Y];
            var z = v[x];
            p = this.getCurvePercent(x / f.ENTRIES - 1, 1 - (p - z) / (v[x + f.PREV_TIME] - z));
            l = (l + (v[x + f.X] - l) * p) * g.data.scaleX;
            q = (q + (v[x + f.Y] - q) * p) * g.data.scaleY;
          }
          if (r == 1) {
            w == u.add ? (g.scaleX += l - g.data.scaleX, g.scaleY += q - g.data.scaleY) : (g.scaleX = l, g.scaleY = q);
          } else {
            if (t == d.mixOut) {
              switch(w) {
                case u.setup:
                  w = g.data.scaleX;
                  t = g.data.scaleY;
                  g.scaleX = w + (Math.abs(l) * n.MathUtils.signum(w) - w) * r;
                  g.scaleY = t + (Math.abs(q) * n.MathUtils.signum(t) - t) * r;
                  break;
                case u.first:
                case u.replace:
                  w = g.scaleX;
                  t = g.scaleY;
                  g.scaleX = w + (Math.abs(l) * n.MathUtils.signum(w) - w) * r;
                  g.scaleY = t + (Math.abs(q) * n.MathUtils.signum(t) - t) * r;
                  break;
                case u.add:
                  w = g.scaleX, t = g.scaleY, g.scaleX = w + (Math.abs(l) * n.MathUtils.signum(w) - g.data.scaleX) * r, g.scaleY = t + (Math.abs(q) * n.MathUtils.signum(t) - g.data.scaleY) * r;
              }
            } else {
              switch(w) {
                case u.setup:
                  w = Math.abs(g.data.scaleX) * n.MathUtils.signum(l);
                  t = Math.abs(g.data.scaleY) * n.MathUtils.signum(q);
                  g.scaleX = w + (l - w) * r;
                  g.scaleY = t + (q - t) * r;
                  break;
                case u.first:
                case u.replace:
                  w = Math.abs(g.scaleX) * n.MathUtils.signum(l);
                  t = Math.abs(g.scaleY) * n.MathUtils.signum(q);
                  g.scaleX = w + (l - w) * r;
                  g.scaleY = t + (q - t) * r;
                  break;
                case u.add:
                  w = n.MathUtils.signum(l), t = n.MathUtils.signum(q), g.scaleX = Math.abs(g.scaleX) * w + (l - Math.abs(g.data.scaleX) * w) * r, g.scaleY = Math.abs(g.scaleY) * t + (q - Math.abs(g.data.scaleY) * t) * r;
              }
            }
          }
        }
      }
    };
    return f;
  }(b);
  n.ScaleTimeline = h;
  b = function(k) {
    function f(g) {
      return k.call(this, g) || this;
    }
    __extends(f, k);
    f.prototype.getPropertyId = function() {
      return (a.shear << 24) + this.boneIndex;
    };
    f.prototype.apply = function(g, l, p, q, r, w, t) {
      l = this.frames;
      g = g.bones[this.boneIndex];
      if (g.active) {
        if (p < l[0]) {
          switch(w) {
            case u.setup:
              g.shearX = g.data.shearX;
              g.shearY = g.data.shearY;
              break;
            case u.first:
              g.shearX += (g.data.shearX - g.shearX) * r, g.shearY += (g.data.shearY - g.shearY) * r;
          }
        } else {
          if (p >= l[l.length - f.ENTRIES]) {
            q = l[l.length + f.PREV_X], t = l[l.length + f.PREV_Y];
          } else {
            var v = e.binarySearch(l, p, f.ENTRIES);
            q = l[v + f.PREV_X];
            t = l[v + f.PREV_Y];
            var x = l[v];
            p = this.getCurvePercent(v / f.ENTRIES - 1, 1 - (p - x) / (l[v + f.PREV_TIME] - x));
            q += (l[v + f.X] - q) * p;
            t += (l[v + f.Y] - t) * p;
          }
          switch(w) {
            case u.setup:
              g.shearX = g.data.shearX + q * r;
              g.shearY = g.data.shearY + t * r;
              break;
            case u.first:
            case u.replace:
              g.shearX += (g.data.shearX + q - g.shearX) * r;
              g.shearY += (g.data.shearY + t - g.shearY) * r;
              break;
            case u.add:
              g.shearX += q * r, g.shearY += t * r;
          }
        }
      }
    };
    return f;
  }(b);
  n.ShearTimeline = b;
  b = function(k) {
    function f(g) {
      var l = k.call(this, g) || this;
      l.frames = n.Utils.newFloatArray(g * f.ENTRIES);
      return l;
    }
    __extends(f, k);
    f.prototype.getPropertyId = function() {
      return (a.color << 24) + this.slotIndex;
    };
    f.prototype.setFrame = function(g, l, p, q, r, w) {
      g *= f.ENTRIES;
      this.frames[g] = l;
      this.frames[g + f.R] = p;
      this.frames[g + f.G] = q;
      this.frames[g + f.B] = r;
      this.frames[g + f.A] = w;
    };
    f.prototype.apply = function(g, l, p, q, r, w, t) {
      g = g.slots[this.slotIndex];
      if (g.bone.active) {
        var v = this.frames;
        if (p < v[0]) {
          switch(w) {
            case u.setup:
              g.color.setFromColor(g.data.color);
              break;
            case u.first:
              p = g.color, w = g.data.color, p.add((w.r - p.r) * r, (w.g - p.g) * r, (w.b - p.b) * r, (w.a - p.a) * r);
          }
        } else {
          if (p >= v[v.length - f.ENTRIES]) {
            p = v.length;
            l = v[p + f.PREV_R];
            q = v[p + f.PREV_G];
            t = v[p + f.PREV_B];
            var x = v[p + f.PREV_A];
          } else {
            var z = e.binarySearch(v, p, f.ENTRIES);
            l = v[z + f.PREV_R];
            q = v[z + f.PREV_G];
            t = v[z + f.PREV_B];
            x = v[z + f.PREV_A];
            var y = v[z];
            p = this.getCurvePercent(z / f.ENTRIES - 1, 1 - (p - y) / (v[z + f.PREV_TIME] - y));
            l += (v[z + f.R] - l) * p;
            q += (v[z + f.G] - q) * p;
            t += (v[z + f.B] - t) * p;
            x += (v[z + f.A] - x) * p;
          }
          r == 1 ? g.color.set(l, q, t, x) : (p = g.color, w == u.setup && p.setFromColor(g.data.color), p.add((l - p.r) * r, (q - p.g) * r, (t - p.b) * r, (x - p.a) * r));
        }
      }
    };
    f.ENTRIES = 5;
    f.PREV_TIME = -5;
    f.PREV_R = -4;
    f.PREV_G = -3;
    f.PREV_B = -2;
    f.PREV_A = -1;
    f.R = 1;
    f.G = 2;
    f.B = 3;
    f.A = 4;
    return f;
  }(c);
  n.ColorTimeline = b;
  b = function(k) {
    function f(g) {
      var l = k.call(this, g) || this;
      l.frames = n.Utils.newFloatArray(g * f.ENTRIES);
      return l;
    }
    __extends(f, k);
    f.prototype.getPropertyId = function() {
      return (a.twoColor << 24) + this.slotIndex;
    };
    f.prototype.setFrame = function(g, l, p, q, r, w, t, v, x) {
      g *= f.ENTRIES;
      this.frames[g] = l;
      this.frames[g + f.R] = p;
      this.frames[g + f.G] = q;
      this.frames[g + f.B] = r;
      this.frames[g + f.A] = w;
      this.frames[g + f.R2] = t;
      this.frames[g + f.G2] = v;
      this.frames[g + f.B2] = x;
    };
    f.prototype.apply = function(g, l, p, q, r, w, t) {
      g = g.slots[this.slotIndex];
      if (g.bone.active) {
        var v = this.frames;
        if (p < v[0]) {
          switch(w) {
            case u.setup:
              g.color.setFromColor(g.data.color);
              g.darkColor.setFromColor(g.data.darkColor);
              break;
            case u.first:
              p = g.color, v = g.darkColor, w = g.data.color, g = g.data.darkColor, p.add((w.r - p.r) * r, (w.g - p.g) * r, (w.b - p.b) * r, (w.a - p.a) * r), v.add((g.r - v.r) * r, (g.g - v.g) * r, (g.b - v.b) * r, 0);
          }
        } else {
          if (p >= v[v.length - f.ENTRIES]) {
            p = v.length;
            l = v[p + f.PREV_R];
            q = v[p + f.PREV_G];
            t = v[p + f.PREV_B];
            var x = v[p + f.PREV_A];
            var z = v[p + f.PREV_R2];
            var y = v[p + f.PREV_G2];
            var A = v[p + f.PREV_B2];
          } else {
            var C = e.binarySearch(v, p, f.ENTRIES);
            l = v[C + f.PREV_R];
            q = v[C + f.PREV_G];
            t = v[C + f.PREV_B];
            x = v[C + f.PREV_A];
            z = v[C + f.PREV_R2];
            y = v[C + f.PREV_G2];
            A = v[C + f.PREV_B2];
            var F = v[C];
            p = this.getCurvePercent(C / f.ENTRIES - 1, 1 - (p - F) / (v[C + f.PREV_TIME] - F));
            l += (v[C + f.R] - l) * p;
            q += (v[C + f.G] - q) * p;
            t += (v[C + f.B] - t) * p;
            x += (v[C + f.A] - x) * p;
            z += (v[C + f.R2] - z) * p;
            y += (v[C + f.G2] - y) * p;
            A += (v[C + f.B2] - A) * p;
          }
          r == 1 ? (g.color.set(l, q, t, x), g.darkColor.set(z, y, A, 1)) : (p = g.color, v = g.darkColor, w == u.setup && (p.setFromColor(g.data.color), v.setFromColor(g.data.darkColor)), p.add((l - p.r) * r, (q - p.g) * r, (t - p.b) * r, (x - p.a) * r), v.add((z - v.r) * r, (y - v.g) * r, (A - v.b) * r, 0));
        }
      }
    };
    f.ENTRIES = 8;
    f.PREV_TIME = -8;
    f.PREV_R = -7;
    f.PREV_G = -6;
    f.PREV_B = -5;
    f.PREV_A = -4;
    f.PREV_R2 = -3;
    f.PREV_G2 = -2;
    f.PREV_B2 = -1;
    f.R = 1;
    f.G = 2;
    f.B = 3;
    f.A = 4;
    f.R2 = 5;
    f.G2 = 6;
    f.B2 = 7;
    return f;
  }(c);
  n.TwoColorTimeline = b;
  b = function() {
    function k(f) {
      this.frames = n.Utils.newFloatArray(f);
      this.attachmentNames = Array(f);
    }
    k.prototype.getPropertyId = function() {
      return (a.attachment << 24) + this.slotIndex;
    };
    k.prototype.getFrameCount = function() {
      return this.frames.length;
    };
    k.prototype.setFrame = function(f, g, l) {
      this.frames[f] = g;
      this.attachmentNames[f] = l;
    };
    k.prototype.apply = function(f, g, l, p, q, r, w) {
      g = f.slots[this.slotIndex];
      g.bone.active && (w == d.mixOut ? r == u.setup && this.setAttachment(f, g, g.data.attachmentName) : (w = this.frames, l < w[0] ? r != u.setup && r != u.first || this.setAttachment(f, g, g.data.attachmentName) : (l = l >= w[w.length - 1] ? w.length - 1 : e.binarySearch(w, l, 1) - 1, l = this.attachmentNames[l], f.slots[this.slotIndex].setAttachment(l == null ? null : f.getAttachment(this.slotIndex, l)))));
    };
    k.prototype.setAttachment = function(f, g, l) {
      g.setAttachment(l == null ? null : f.getAttachment(this.slotIndex, l));
    };
    return k;
  }();
  n.AttachmentTimeline = b;
  var m = null;
  b = function(k) {
    function f(g) {
      var l = k.call(this, g) || this;
      l.frames = n.Utils.newFloatArray(g);
      l.frameVertices = Array(g);
      m == null && (m = n.Utils.newFloatArray(64));
      return l;
    }
    __extends(f, k);
    f.prototype.getPropertyId = function() {
      return (a.deform << 27) + +this.attachment.id + this.slotIndex;
    };
    f.prototype.setFrame = function(g, l, p) {
      this.frames[g] = l;
      this.frameVertices[g] = p;
    };
    f.prototype.apply = function(g, l, p, q, r, w, t) {
      g = g.slots[this.slotIndex];
      if (g.bone.active) {
        var v = g.getAttachment();
        if (v instanceof n.VertexAttachment && v.deformAttachment == this.attachment) {
          l = g.deform;
          l.length == 0 && (w = u.setup);
          t = this.frameVertices;
          g = t[0].length;
          var x = this.frames;
          if (p < x[0]) {
            switch(w) {
              case u.setup:
                l.length = 0;
                break;
              case u.first:
                if (r == 1) {
                  l.length = 0;
                } else {
                  if (l = n.Utils.setArraySize(l, g), v.bones == null) {
                    for (w = v.vertices, q = 0; q < g; q++) {
                      l[q] += (w[q] - l[q]) * r;
                    }
                  } else {
                    for (r = 1 - r, q = 0; q < g; q++) {
                      l[q] *= r;
                    }
                  }
                }
            }
          } else {
            if (l = n.Utils.setArraySize(l, g), p >= x[x.length - 1]) {
              if (q = t[x.length - 1], r == 1) {
                if (w == u.add) {
                  if (v.bones == null) {
                    for (w = v.vertices, r = 0; r < g; r++) {
                      l[r] += q[r] - w[r];
                    }
                  } else {
                    for (r = 0; r < g; r++) {
                      l[r] += q[r];
                    }
                  }
                } else {
                  n.Utils.arrayCopy(q, 0, l, 0, g);
                }
              } else {
                switch(w) {
                  case u.setup:
                    if (v.bones == null) {
                      for (w = v.vertices, t = 0; t < g; t++) {
                        x = w[t], l[t] = x + (q[t] - x) * r;
                      }
                    } else {
                      for (t = 0; t < g; t++) {
                        l[t] = q[t] * r;
                      }
                    }
                    break;
                  case u.first:
                  case u.replace:
                    for (t = 0; t < g; t++) {
                      l[t] += (q[t] - l[t]) * r;
                    }
                    break;
                  case u.add:
                    if (v.bones == null) {
                      for (w = v.vertices, t = 0; t < g; t++) {
                        l[t] += (q[t] - w[t]) * r;
                      }
                    } else {
                      for (t = 0; t < g; t++) {
                        l[t] += q[t] * r;
                      }
                    }
                }
              }
            } else {
              var z = e.binarySearch(x, p);
              q = t[z - 1];
              t = t[z];
              var y = x[z];
              p = this.getCurvePercent(z - 1, 1 - (p - y) / (x[z - 1] - y));
              if (r == 1) {
                if (w == u.add) {
                  if (v.bones == null) {
                    for (w = v.vertices, r = 0; r < g; r++) {
                      v = q[r], l[r] += v + (t[r] - v) * p - w[r];
                    }
                  } else {
                    for (r = 0; r < g; r++) {
                      v = q[r], l[r] += v + (t[r] - v) * p;
                    }
                  }
                } else {
                  for (r = 0; r < g; r++) {
                    v = q[r], l[r] = v + (t[r] - v) * p;
                  }
                }
              } else {
                switch(w) {
                  case u.setup:
                    if (v.bones == null) {
                      for (w = v.vertices, z = 0; z < g; z++) {
                        v = q[z], x = w[z], l[z] = x + (v + (t[z] - v) * p - x) * r;
                      }
                    } else {
                      for (w = 0; w < g; w++) {
                        v = q[w], l[w] = (v + (t[w] - v) * p) * r;
                      }
                    }
                    break;
                  case u.first:
                  case u.replace:
                    for (w = 0; w < g; w++) {
                      v = q[w], l[w] += (v + (t[w] - v) * p - l[w]) * r;
                    }
                    break;
                  case u.add:
                    if (v.bones == null) {
                      for (w = v.vertices, x = 0; x < g; x++) {
                        v = q[x], l[x] += (v + (t[x] - v) * p - w[x]) * r;
                      }
                    } else {
                      for (w = 0; w < g; w++) {
                        v = q[w], l[w] += (v + (t[w] - v) * p) * r;
                      }
                    }
                }
              }
            }
          }
        }
      }
    };
    return f;
  }(c);
  n.DeformTimeline = b;
  b = function() {
    function k(f) {
      this.frames = n.Utils.newFloatArray(f);
      this.events = Array(f);
    }
    k.prototype.getPropertyId = function() {
      return a.event << 24;
    };
    k.prototype.getFrameCount = function() {
      return this.frames.length;
    };
    k.prototype.setFrame = function(f, g) {
      this.frames[f] = g.time;
      this.events[f] = g;
    };
    k.prototype.apply = function(f, g, l, p, q, r, w) {
      if (p != null) {
        var t = this.frames, v = this.frames.length;
        if (g > l) {
          this.apply(f, g, Number.MAX_VALUE, p, q, r, w), g = -1;
        } else if (g >= t[v - 1]) {
          return;
        }
        if (!(l < t[0])) {
          if (g < t[0]) {
            f = 0;
          } else {
            for (f = e.binarySearch(t, g), g = t[f]; f > 0 && t[f - 1] == g;) {
              f--;
            }
          }
          for (; f < v && l >= t[f]; f++) {
            p.push(this.events[f]);
          }
        }
      }
    };
    return k;
  }();
  n.EventTimeline = b;
  b = function() {
    function k(f) {
      this.frames = n.Utils.newFloatArray(f);
      this.drawOrders = Array(f);
    }
    k.prototype.getPropertyId = function() {
      return a.drawOrder << 24;
    };
    k.prototype.getFrameCount = function() {
      return this.frames.length;
    };
    k.prototype.setFrame = function(f, g, l) {
      this.frames[f] = g;
      this.drawOrders[f] = l;
    };
    k.prototype.apply = function(f, g, l, p, q, r, w) {
      g = f.drawOrder;
      p = f.slots;
      if (w == d.mixOut) {
        r == u.setup && n.Utils.arrayCopy(f.slots, 0, f.drawOrder, 0, f.slots.length);
      } else {
        if (w = this.frames, l < w[0]) {
          r != u.setup && r != u.first || n.Utils.arrayCopy(f.slots, 0, f.drawOrder, 0, f.slots.length);
        } else {
          if (f = l >= w[w.length - 1] ? w.length - 1 : e.binarySearch(w, l) - 1, f = this.drawOrders[f], f == null) {
            n.Utils.arrayCopy(p, 0, g, 0, p.length);
          } else {
            for (l = 0, r = f.length; l < r; l++) {
              g[l] = p[f[l]];
            }
          }
        }
      }
    };
    return k;
  }();
  n.DrawOrderTimeline = b;
  b = function(k) {
    function f(g) {
      var l = k.call(this, g) || this;
      l.frames = n.Utils.newFloatArray(g * f.ENTRIES);
      return l;
    }
    __extends(f, k);
    f.prototype.getPropertyId = function() {
      return (a.ikConstraint << 24) + this.ikConstraintIndex;
    };
    f.prototype.setFrame = function(g, l, p, q, r, w, t) {
      g *= f.ENTRIES;
      this.frames[g] = l;
      this.frames[g + f.MIX] = p;
      this.frames[g + f.SOFTNESS] = q;
      this.frames[g + f.BEND_DIRECTION] = r;
      this.frames[g + f.COMPRESS] = w ? 1 : 0;
      this.frames[g + f.STRETCH] = t ? 1 : 0;
    };
    f.prototype.apply = function(g, l, p, q, r, w, t) {
      l = this.frames;
      g = g.ikConstraints[this.ikConstraintIndex];
      if (g.active) {
        if (p < l[0]) {
          switch(w) {
            case u.setup:
              g.mix = g.data.mix;
              g.softness = g.data.softness;
              g.bendDirection = g.data.bendDirection;
              g.compress = g.data.compress;
              g.stretch = g.data.stretch;
              break;
            case u.first:
              g.mix += (g.data.mix - g.mix) * r, g.softness += (g.data.softness - g.softness) * r, g.bendDirection = g.data.bendDirection, g.compress = g.data.compress, g.stretch = g.data.stretch;
          }
        } else {
          if (p >= l[l.length - f.ENTRIES]) {
            w == u.setup ? (g.mix = g.data.mix + (l[l.length + f.PREV_MIX] - g.data.mix) * r, g.softness = g.data.softness + (l[l.length + f.PREV_SOFTNESS] - g.data.softness) * r, t == d.mixOut ? (g.bendDirection = g.data.bendDirection, g.compress = g.data.compress, g.stretch = g.data.stretch) : (g.bendDirection = l[l.length + f.PREV_BEND_DIRECTION], g.compress = l[l.length + f.PREV_COMPRESS] != 0, g.stretch = l[l.length + f.PREV_STRETCH] != 0)) : (g.mix += (l[l.length + f.PREV_MIX] - g.mix) * r, 
            g.softness += (l[l.length + f.PREV_SOFTNESS] - g.softness) * r, t == d.mixIn && (g.bendDirection = l[l.length + f.PREV_BEND_DIRECTION], g.compress = l[l.length + f.PREV_COMPRESS] != 0, g.stretch = l[l.length + f.PREV_STRETCH] != 0));
          } else {
            q = e.binarySearch(l, p, f.ENTRIES);
            var v = l[q + f.PREV_MIX], x = l[q + f.PREV_SOFTNESS], z = l[q];
            p = this.getCurvePercent(q / f.ENTRIES - 1, 1 - (p - z) / (l[q + f.PREV_TIME] - z));
            w == u.setup ? (g.mix = g.data.mix + (v + (l[q + f.MIX] - v) * p - g.data.mix) * r, g.softness = g.data.softness + (x + (l[q + f.SOFTNESS] - x) * p - g.data.softness) * r, t == d.mixOut ? (g.bendDirection = g.data.bendDirection, g.compress = g.data.compress, g.stretch = g.data.stretch) : (g.bendDirection = l[q + f.PREV_BEND_DIRECTION], g.compress = l[q + f.PREV_COMPRESS] != 0, g.stretch = l[q + f.PREV_STRETCH] != 0)) : (g.mix += (v + (l[q + f.MIX] - v) * p - g.mix) * r, g.softness += 
            (x + (l[q + f.SOFTNESS] - x) * p - g.softness) * r, t == d.mixIn && (g.bendDirection = l[q + f.PREV_BEND_DIRECTION], g.compress = l[q + f.PREV_COMPRESS] != 0, g.stretch = l[q + f.PREV_STRETCH] != 0));
          }
        }
      }
    };
    f.ENTRIES = 6;
    f.PREV_TIME = -6;
    f.PREV_MIX = -5;
    f.PREV_SOFTNESS = -4;
    f.PREV_BEND_DIRECTION = -3;
    f.PREV_COMPRESS = -2;
    f.PREV_STRETCH = -1;
    f.MIX = 1;
    f.SOFTNESS = 2;
    f.BEND_DIRECTION = 3;
    f.COMPRESS = 4;
    f.STRETCH = 5;
    return f;
  }(c);
  n.IkConstraintTimeline = b;
  b = function(k) {
    function f(g) {
      var l = k.call(this, g) || this;
      l.frames = n.Utils.newFloatArray(g * f.ENTRIES);
      return l;
    }
    __extends(f, k);
    f.prototype.getPropertyId = function() {
      return (a.transformConstraint << 24) + this.transformConstraintIndex;
    };
    f.prototype.setFrame = function(g, l, p, q, r, w) {
      g *= f.ENTRIES;
      this.frames[g] = l;
      this.frames[g + f.ROTATE] = p;
      this.frames[g + f.TRANSLATE] = q;
      this.frames[g + f.SCALE] = r;
      this.frames[g + f.SHEAR] = w;
    };
    f.prototype.apply = function(g, l, p, q, r, w, t) {
      l = this.frames;
      g = g.transformConstraints[this.transformConstraintIndex];
      if (g.active) {
        if (p < l[0]) {
          switch(p = g.data, w) {
            case u.setup:
              g.rotateMix = p.rotateMix;
              g.translateMix = p.translateMix;
              g.scaleMix = p.scaleMix;
              g.shearMix = p.shearMix;
              break;
            case u.first:
              g.rotateMix += (p.rotateMix - g.rotateMix) * r, g.translateMix += (p.translateMix - g.translateMix) * r, g.scaleMix += (p.scaleMix - g.scaleMix) * r, g.shearMix += (p.shearMix - g.shearMix) * r;
          }
        } else {
          if (p >= l[l.length - f.ENTRIES]) {
            p = l.length;
            q = l[p + f.PREV_ROTATE];
            t = l[p + f.PREV_TRANSLATE];
            var v = l[p + f.PREV_SCALE];
            var x = l[p + f.PREV_SHEAR];
          } else {
            var z = e.binarySearch(l, p, f.ENTRIES);
            q = l[z + f.PREV_ROTATE];
            t = l[z + f.PREV_TRANSLATE];
            v = l[z + f.PREV_SCALE];
            x = l[z + f.PREV_SHEAR];
            var y = l[z];
            p = this.getCurvePercent(z / f.ENTRIES - 1, 1 - (p - y) / (l[z + f.PREV_TIME] - y));
            q += (l[z + f.ROTATE] - q) * p;
            t += (l[z + f.TRANSLATE] - t) * p;
            v += (l[z + f.SCALE] - v) * p;
            x += (l[z + f.SHEAR] - x) * p;
          }
          w == u.setup ? (p = g.data, g.rotateMix = p.rotateMix + (q - p.rotateMix) * r, g.translateMix = p.translateMix + (t - p.translateMix) * r, g.scaleMix = p.scaleMix + (v - p.scaleMix) * r, g.shearMix = p.shearMix + (x - p.shearMix) * r) : (g.rotateMix += (q - g.rotateMix) * r, g.translateMix += (t - g.translateMix) * r, g.scaleMix += (v - g.scaleMix) * r, g.shearMix += (x - g.shearMix) * r);
        }
      }
    };
    f.ENTRIES = 5;
    f.PREV_TIME = -5;
    f.PREV_ROTATE = -4;
    f.PREV_TRANSLATE = -3;
    f.PREV_SCALE = -2;
    f.PREV_SHEAR = -1;
    f.ROTATE = 1;
    f.TRANSLATE = 2;
    f.SCALE = 3;
    f.SHEAR = 4;
    return f;
  }(c);
  n.TransformConstraintTimeline = b;
  b = function(k) {
    function f(g) {
      var l = k.call(this, g) || this;
      l.frames = n.Utils.newFloatArray(g * f.ENTRIES);
      return l;
    }
    __extends(f, k);
    f.prototype.getPropertyId = function() {
      return (a.pathConstraintPosition << 24) + this.pathConstraintIndex;
    };
    f.prototype.setFrame = function(g, l, p) {
      g *= f.ENTRIES;
      this.frames[g] = l;
      this.frames[g + f.VALUE] = p;
    };
    f.prototype.apply = function(g, l, p, q, r, w, t) {
      l = this.frames;
      g = g.pathConstraints[this.pathConstraintIndex];
      if (g.active) {
        if (p < l[0]) {
          switch(w) {
            case u.setup:
              g.position = g.data.position;
              break;
            case u.first:
              g.position += (g.data.position - g.position) * r;
          }
        } else {
          if (p >= l[l.length - f.ENTRIES]) {
            q = l[l.length + f.PREV_VALUE];
          } else {
            t = e.binarySearch(l, p, f.ENTRIES);
            q = l[t + f.PREV_VALUE];
            var v = l[t];
            p = this.getCurvePercent(t / f.ENTRIES - 1, 1 - (p - v) / (l[t + f.PREV_TIME] - v));
            q += (l[t + f.VALUE] - q) * p;
          }
          g.position = w == u.setup ? g.data.position + (q - g.data.position) * r : g.position + (q - g.position) * r;
        }
      }
    };
    f.ENTRIES = 2;
    f.PREV_TIME = -2;
    f.PREV_VALUE = -1;
    f.VALUE = 1;
    return f;
  }(c);
  n.PathConstraintPositionTimeline = b;
  b = function(k) {
    function f(g) {
      return k.call(this, g) || this;
    }
    __extends(f, k);
    f.prototype.getPropertyId = function() {
      return (a.pathConstraintSpacing << 24) + this.pathConstraintIndex;
    };
    f.prototype.apply = function(g, l, p, q, r, w, t) {
      l = this.frames;
      g = g.pathConstraints[this.pathConstraintIndex];
      if (g.active) {
        if (p < l[0]) {
          switch(w) {
            case u.setup:
              g.spacing = g.data.spacing;
              break;
            case u.first:
              g.spacing += (g.data.spacing - g.spacing) * r;
          }
        } else {
          if (p >= l[l.length - f.ENTRIES]) {
            q = l[l.length + f.PREV_VALUE];
          } else {
            t = e.binarySearch(l, p, f.ENTRIES);
            q = l[t + f.PREV_VALUE];
            var v = l[t];
            p = this.getCurvePercent(t / f.ENTRIES - 1, 1 - (p - v) / (l[t + f.PREV_TIME] - v));
            q += (l[t + f.VALUE] - q) * p;
          }
          g.spacing = w == u.setup ? g.data.spacing + (q - g.data.spacing) * r : g.spacing + (q - g.spacing) * r;
        }
      }
    };
    return f;
  }(b);
  n.PathConstraintSpacingTimeline = b;
  c = function(k) {
    function f(g) {
      var l = k.call(this, g) || this;
      l.frames = n.Utils.newFloatArray(g * f.ENTRIES);
      return l;
    }
    __extends(f, k);
    f.prototype.getPropertyId = function() {
      return (a.pathConstraintMix << 24) + this.pathConstraintIndex;
    };
    f.prototype.setFrame = function(g, l, p, q) {
      g *= f.ENTRIES;
      this.frames[g] = l;
      this.frames[g + f.ROTATE] = p;
      this.frames[g + f.TRANSLATE] = q;
    };
    f.prototype.apply = function(g, l, p, q, r, w, t) {
      l = this.frames;
      g = g.pathConstraints[this.pathConstraintIndex];
      if (g.active) {
        if (p < l[0]) {
          switch(w) {
            case u.setup:
              g.rotateMix = g.data.rotateMix;
              g.translateMix = g.data.translateMix;
              break;
            case u.first:
              g.rotateMix += (g.data.rotateMix - g.rotateMix) * r, g.translateMix += (g.data.translateMix - g.translateMix) * r;
          }
        } else {
          if (p >= l[l.length - f.ENTRIES]) {
            q = l[l.length + f.PREV_ROTATE], t = l[l.length + f.PREV_TRANSLATE];
          } else {
            var v = e.binarySearch(l, p, f.ENTRIES);
            q = l[v + f.PREV_ROTATE];
            t = l[v + f.PREV_TRANSLATE];
            var x = l[v];
            p = this.getCurvePercent(v / f.ENTRIES - 1, 1 - (p - x) / (l[v + f.PREV_TIME] - x));
            q += (l[v + f.ROTATE] - q) * p;
            t += (l[v + f.TRANSLATE] - t) * p;
          }
          w == u.setup ? (g.rotateMix = g.data.rotateMix + (q - g.data.rotateMix) * r, g.translateMix = g.data.translateMix + (t - g.data.translateMix) * r) : (g.rotateMix += (q - g.rotateMix) * r, g.translateMix += (t - g.translateMix) * r);
        }
      }
    };
    f.ENTRIES = 3;
    f.PREV_TIME = -3;
    f.PREV_ROTATE = -2;
    f.PREV_TRANSLATE = -1;
    f.ROTATE = 1;
    f.TRANSLATE = 2;
    return f;
  }(c);
  n.PathConstraintMixTimeline = c;
})(spine ||= {});
(function(n) {
  var e = function() {
    function c(b) {
      this.tracks = [];
      this.timeScale = 1;
      this.unkeyedState = 0;
      this.events = [];
      this.listeners = [];
      this.queue = new d(this);
      this.propertyIDs = new n.IntSet();
      this.animationsChanged = !1;
      this.trackEntryPool = new n.Pool(function() {
        return new u();
      });
      this.data = b;
    }
    c.prototype.update = function(b) {
      b *= this.timeScale;
      for (var h = this.tracks, m = 0, k = h.length; m < k; m++) {
        var f = h[m];
        if (f != null) {
          f.animationLast = f.nextAnimationLast;
          f.trackLast = f.nextTrackLast;
          var g = b * f.timeScale;
          if (f.delay > 0) {
            f.delay -= g;
            if (f.delay > 0) {
              continue;
            }
            g = -f.delay;
            f.delay = 0;
          }
          var l = f.next;
          if (l != null) {
            var p = f.trackLast - l.delay;
            if (p >= 0) {
              l.delay = 0;
              l.trackTime += f.timeScale == 0 ? 0 : (p / f.timeScale + b) * l.timeScale;
              f.trackTime += g;
              for (this.setCurrent(m, l, !0); l.mixingFrom != null;) {
                l.mixTime += b, l = l.mixingFrom;
              }
              continue;
            }
          } else if (f.trackLast >= f.trackEnd && f.mixingFrom == null) {
            h[m] = null;
            this.queue.end(f);
            this.disposeNext(f);
            continue;
          }
          if (f.mixingFrom != null && this.updateMixingFrom(f, b)) {
            for (l = f.mixingFrom, f.mixingFrom = null, l != null && (l.mixingTo = null); l != null;) {
              this.queue.end(l), l = l.mixingFrom;
            }
          }
          f.trackTime += g;
        }
      }
      this.queue.drain();
    };
    c.prototype.updateMixingFrom = function(b, h) {
      var m = b.mixingFrom;
      if (m == null) {
        return !0;
      }
      var k = this.updateMixingFrom(m, h);
      m.animationLast = m.nextAnimationLast;
      m.trackLast = m.nextTrackLast;
      if (b.mixTime > 0 && b.mixTime >= b.mixDuration) {
        if (m.totalAlpha == 0 || b.mixDuration == 0) {
          b.mixingFrom = m.mixingFrom, m.mixingFrom != null && (m.mixingFrom.mixingTo = b), b.interruptAlpha = m.interruptAlpha, this.queue.end(m);
        }
        return k;
      }
      m.trackTime += h * m.timeScale;
      b.mixTime += h;
      return !1;
    };
    c.prototype.apply = function(b) {
      if (b == null) {
        throw Error("skeleton cannot be null.");
      }
      this.animationsChanged && this._animationsChanged();
      for (var h = this.events, m = this.tracks, k = !1, f = 0, g = m.length; f < g; f++) {
        var l = m[f];
        if (!(l == null || l.delay > 0)) {
          k = !0;
          var p = f == 0 ? n.MixBlend.first : l.mixBlend, q = l.alpha;
          l.mixingFrom != null ? q *= this.applyMixingFrom(l, b, p) : l.trackTime >= l.trackEnd && l.next == null && (q = 0);
          var r = l.animationLast, w = l.getAnimationTime(), t = l.animation.timelines.length, v = l.animation.timelines;
          if (f == 0 && q == 1 || p == n.MixBlend.add) {
            for (var x = 0; x < t; x++) {
              n.Utils.webkit602BugfixHelper(q, p);
              var z = v[x];
              z instanceof n.AttachmentTimeline ? this.applyAttachmentTimeline(z, b, w, p, !0) : z.apply(b, r, w, h, q, p, n.MixDirection.mixIn);
            }
          } else {
            z = l.timelineMode;
            var y = l.timelinesRotation.length == 0;
            y && n.Utils.setArraySize(l.timelinesRotation, t << 1, null);
            var A = l.timelinesRotation;
            for (x = 0; x < t; x++) {
              var C = v[x], F = z[x] == c.SUBSEQUENT ? p : n.MixBlend.setup;
              C instanceof n.RotateTimeline ? this.applyRotateTimeline(C, b, w, q, F, A, x << 1, y) : C instanceof n.AttachmentTimeline ? this.applyAttachmentTimeline(C, b, w, p, !0) : (n.Utils.webkit602BugfixHelper(q, p), C.apply(b, r, w, h, q, F, n.MixDirection.mixIn));
            }
          }
          this.queueEvents(l, w);
          h.length = 0;
          l.nextAnimationLast = w;
          l.nextTrackLast = l.trackTime;
        }
      }
      h = this.unkeyedState + c.SETUP;
      m = b.slots;
      f = 0;
      for (g = b.slots.length; f < g; f++) {
        l = m[f], l.attachmentState == h && (p = l.data.attachmentName, l.setAttachment(p == null ? null : b.getAttachment(l.data.index, p)));
      }
      this.unkeyedState += 2;
      this.queue.drain();
      return k;
    };
    c.prototype.applyMixingFrom = function(b, h, m) {
      var k = b.mixingFrom;
      k.mixingFrom != null && this.applyMixingFrom(k, h, m);
      if (b.mixDuration == 0) {
        var f = 1;
        m == n.MixBlend.first && (m = n.MixBlend.setup);
      } else {
        f = b.mixTime / b.mixDuration, f > 1 && (f = 1), m != n.MixBlend.first && (m = k.mixBlend);
      }
      var g = f < k.eventThreshold ? this.events : null, l = f < k.attachmentThreshold, p = f < k.drawOrderThreshold, q = k.animationLast, r = k.getAnimationTime(), w = k.animation.timelines.length, t = k.animation.timelines, v = k.alpha * b.interruptAlpha, x = v * (1 - f);
      if (m == n.MixBlend.add) {
        for (var z = 0; z < w; z++) {
          t[z].apply(h, q, r, g, x, m, n.MixDirection.mixOut);
        }
      } else {
        var y = k.timelineMode, A = k.timelineHoldMix, C = k.timelinesRotation.length == 0;
        C && n.Utils.setArraySize(k.timelinesRotation, w << 1, null);
        var F = k.timelinesRotation;
        for (z = k.totalAlpha = 0; z < w; z++) {
          var H = t[z], D = n.MixDirection.mixOut;
          switch(y[z]) {
            case c.SUBSEQUENT:
              if (!p && H instanceof n.DrawOrderTimeline) {
                continue;
              }
              var G = m;
              var B = x;
              break;
            case c.FIRST:
              G = n.MixBlend.setup;
              B = x;
              break;
            case c.HOLD_SUBSEQUENT:
              G = m;
              B = v;
              break;
            case c.HOLD_FIRST:
              G = n.MixBlend.setup;
              B = v;
              break;
            default:
              G = n.MixBlend.setup, B = A[z], B = v * Math.max(0, 1 - B.mixTime / B.mixDuration);
          }
          k.totalAlpha += B;
          H instanceof n.RotateTimeline ? this.applyRotateTimeline(H, h, r, B, G, F, z << 1, C) : H instanceof n.AttachmentTimeline ? this.applyAttachmentTimeline(H, h, r, G, l) : (n.Utils.webkit602BugfixHelper(B, m), p && H instanceof n.DrawOrderTimeline && G == n.MixBlend.setup && (D = n.MixDirection.mixIn), H.apply(h, q, r, g, B, G, D));
        }
      }
      b.mixDuration > 0 && this.queueEvents(k, r);
      this.events.length = 0;
      k.nextAnimationLast = r;
      k.nextTrackLast = k.trackTime;
      return f;
    };
    c.prototype.applyAttachmentTimeline = function(b, h, m, k, f) {
      var g = h.slots[b.slotIndex];
      if (g.bone.active) {
        var l = b.frames;
        m < l[0] ? k != n.MixBlend.setup && k != n.MixBlend.first || this.setAttachment(h, g, g.data.attachmentName, f) : (m = m >= l[l.length - 1] ? l.length - 1 : n.Animation.binarySearch(l, m) - 1, this.setAttachment(h, g, b.attachmentNames[m], f));
        g.attachmentState <= this.unkeyedState && (g.attachmentState = this.unkeyedState + c.SETUP);
      }
    };
    c.prototype.setAttachment = function(b, h, m, k) {
      h.setAttachment(m == null ? null : b.getAttachment(h.data.index, m));
      k && (h.attachmentState = this.unkeyedState + c.CURRENT);
    };
    c.prototype.applyRotateTimeline = function(b, h, m, k, f, g, l, p) {
      p && (g[l] = 0);
      if (k == 1) {
        b.apply(h, 0, m, null, 1, f, n.MixDirection.mixIn);
      } else {
        var q = b.frames;
        h = h.bones[b.boneIndex];
        if (h.active) {
          if (m < q[0]) {
            switch(f) {
              case n.MixBlend.setup:
                h.rotation = h.data.rotation;
              default:
                return;
              case n.MixBlend.first:
                f = h.rotation, q = h.data.rotation;
            }
          } else {
            if (f = f == n.MixBlend.setup ? h.data.rotation : h.rotation, m >= q[q.length - n.RotateTimeline.ENTRIES]) {
              q = h.data.rotation + q[q.length + n.RotateTimeline.PREV_ROTATION];
            } else {
              var r = n.Animation.binarySearch(q, m, n.RotateTimeline.ENTRIES), w = q[r + n.RotateTimeline.PREV_ROTATION], t = q[r];
              b = b.getCurvePercent((r >> 1) - 1, 1 - (m - t) / (q[r + n.RotateTimeline.PREV_TIME] - t));
              q = q[r + n.RotateTimeline.ROTATION] - w;
              q = w + (q - (16384 - (16384.499999999996 - q / 360 | 0)) * 360) * b + h.data.rotation;
              q -= (16384 - (16384.499999999996 - q / 360 | 0)) * 360;
            }
          }
          q -= f;
          q -= (16384 - (16384.499999999996 - q / 360 | 0)) * 360;
          q == 0 ? w = g[l] : (p ? (p = 0, w = q) : (p = g[l], w = g[l + 1]), b = q > 0, m = p >= 0, n.MathUtils.signum(w) != n.MathUtils.signum(q) && Math.abs(w) <= 90 && (Math.abs(p) > 180 && (p += 360 * n.MathUtils.signum(p)), m = b), w = q + p - p % 360, m != b && (w += 360 * n.MathUtils.signum(p)), g[l] = w);
          g[l + 1] = q;
          f += w * k;
          h.rotation = f - (16384 - (16384.499999999996 - f / 360 | 0)) * 360;
        }
      }
    };
    c.prototype.queueEvents = function(b, h) {
      for (var m = b.animationStart, k = b.animationEnd, f = k - m, g = b.trackLast % f, l = this.events, p = 0, q = l.length; p < q; p++) {
        var r = l[p];
        if (r.time < g) {
          break;
        }
        r.time > k || this.queue.event(b, r);
      }
      for ((b.loop ? f == 0 || g > b.trackTime % f : h >= k && b.animationLast < k) && this.queue.complete(b); p < q; p++) {
        l[p].time < m || this.queue.event(b, l[p]);
      }
    };
    c.prototype.clearTracks = function() {
      var b = this.queue.drainDisabled;
      this.queue.drainDisabled = !0;
      for (var h = 0, m = this.tracks.length; h < m; h++) {
        this.clearTrack(h);
      }
      this.tracks.length = 0;
      this.queue.drainDisabled = b;
      this.queue.drain();
    };
    c.prototype.clearTrack = function(b) {
      if (!(b >= this.tracks.length) && (b = this.tracks[b], b != null)) {
        this.queue.end(b);
        this.disposeNext(b);
        for (var h = b;;) {
          var m = h.mixingFrom;
          if (m == null) {
            break;
          }
          this.queue.end(m);
          h.mixingFrom = null;
          h.mixingTo = null;
          h = m;
        }
        this.tracks[b.trackIndex] = null;
        this.queue.drain();
      }
    };
    c.prototype.setCurrent = function(b, h, m) {
      var k = this.expandToIndex(b);
      this.tracks[b] = h;
      k != null && (m && this.queue.interrupt(k), h.mixingFrom = k, k.mixingTo = h, h.mixTime = 0, k.mixingFrom != null && k.mixDuration > 0 && (h.interruptAlpha *= Math.min(1, k.mixTime / k.mixDuration)), k.timelinesRotation.length = 0);
      this.queue.start(h);
    };
    c.prototype.setAnimation = function(b, h, m) {
      var k = this.data.skeletonData.findAnimation(h);
      if (k == null) {
        throw Error("Animation not found: " + h);
      }
      return this.setAnimationWith(b, k, m);
    };
    c.prototype.setAnimationWith = function(b, h, m) {
      if (h == null) {
        throw Error("animation cannot be null.");
      }
      var k = !0, f = this.expandToIndex(b);
      f != null && (f.nextTrackLast == -1 ? (this.tracks[b] = f.mixingFrom, this.queue.interrupt(f), this.queue.end(f), this.disposeNext(f), f = f.mixingFrom, k = !1) : this.disposeNext(f));
      h = this.trackEntry(b, h, m, f);
      this.setCurrent(b, h, k);
      this.queue.drain();
      return h;
    };
    c.prototype.addAnimation = function(b, h, m, k) {
      var f = this.data.skeletonData.findAnimation(h);
      if (f == null) {
        throw Error("Animation not found: " + h);
      }
      return this.addAnimationWith(b, f, m, k);
    };
    c.prototype.addAnimationWith = function(b, h, m, k) {
      if (h == null) {
        throw Error("animation cannot be null.");
      }
      var f = this.expandToIndex(b);
      if (f != null) {
        for (; f.next != null;) {
          f = f.next;
        }
      }
      m = this.trackEntry(b, h, m, f);
      f == null ? (this.setCurrent(b, m, !0), this.queue.drain()) : (f.next = m, k <= 0 && (b = f.animationEnd - f.animationStart, b != 0 ? (k = f.loop ? k + b * (1 + (f.trackTime / b | 0)) : k + Math.max(b, f.trackTime), k -= this.data.getMix(f.animation, h)) : k = f.trackTime));
      m.delay = k;
      return m;
    };
    c.prototype.setEmptyAnimation = function(b, h) {
      b = this.setAnimationWith(b, c.emptyAnimation, !1);
      b.mixDuration = h;
      b.trackEnd = h;
      return b;
    };
    c.prototype.addEmptyAnimation = function(b, h, m) {
      m <= 0 && (m -= h);
      b = this.addAnimationWith(b, c.emptyAnimation, !1, m);
      b.mixDuration = h;
      b.trackEnd = h;
      return b;
    };
    c.prototype.setEmptyAnimations = function(b) {
      var h = this.queue.drainDisabled;
      this.queue.drainDisabled = !0;
      for (var m = 0, k = this.tracks.length; m < k; m++) {
        var f = this.tracks[m];
        f != null && this.setEmptyAnimation(f.trackIndex, b);
      }
      this.queue.drainDisabled = h;
      this.queue.drain();
    };
    c.prototype.expandToIndex = function(b) {
      if (b < this.tracks.length) {
        return this.tracks[b];
      }
      n.Utils.ensureArrayCapacity(this.tracks, b + 1, null);
      this.tracks.length = b + 1;
      return null;
    };
    c.prototype.trackEntry = function(b, h, m, k) {
      var f = this.trackEntryPool.obtain();
      f.trackIndex = b;
      f.animation = h;
      f.loop = m;
      f.holdPrevious = !1;
      f.eventThreshold = 0;
      f.attachmentThreshold = 0;
      f.drawOrderThreshold = 0;
      f.animationStart = 0;
      f.animationEnd = h.duration;
      f.animationLast = -1;
      f.nextAnimationLast = -1;
      f.delay = 0;
      f.trackTime = 0;
      f.trackLast = -1;
      f.nextTrackLast = -1;
      f.trackEnd = Number.MAX_VALUE;
      f.timeScale = 1;
      f.alpha = 1;
      f.interruptAlpha = 1;
      f.mixTime = 0;
      f.mixDuration = k == null ? 0 : this.data.getMix(k.animation, h);
      f.mixBlend = n.MixBlend.replace;
      return f;
    };
    c.prototype.disposeNext = function(b) {
      for (var h = b.next; h != null;) {
        this.queue.dispose(h), h = h.next;
      }
      b.next = null;
    };
    c.prototype._animationsChanged = function() {
      this.animationsChanged = !1;
      this.propertyIDs.clear();
      for (var b = 0, h = this.tracks.length; b < h; b++) {
        var m = this.tracks[b];
        if (m != null) {
          for (; m.mixingFrom != null;) {
            m = m.mixingFrom;
          }
          do {
            m.mixingFrom != null && m.mixBlend == n.MixBlend.add || this.computeHold(m), m = m.mixingTo;
          } while (m != null);
        }
      }
    };
    c.prototype.computeHold = function(b) {
      var h = b.mixingTo, m = b.animation.timelines, k = b.animation.timelines.length, f = n.Utils.setArraySize(b.timelineMode, k);
      b.timelineHoldMix.length = 0;
      var g = n.Utils.setArraySize(b.timelineHoldMix, k), l = this.propertyIDs;
      if (h != null && h.holdPrevious) {
        for (var p = 0; p < k; p++) {
          f[p] = l.add(m[p].getPropertyId()) ? c.HOLD_FIRST : c.HOLD_SUBSEQUENT;
        }
      } else {
        a: for (p = 0; p < k; p++) {
          var q = m[p], r = q.getPropertyId();
          if (l.add(r)) {
            if (h == null || q instanceof n.AttachmentTimeline || q instanceof n.DrawOrderTimeline || q instanceof n.EventTimeline || !h.animation.hasTimeline(r)) {
              f[p] = c.FIRST;
            } else {
              for (q = h.mixingTo; q != null; q = q.mixingTo) {
                if (!q.animation.hasTimeline(r)) {
                  if (b.mixDuration > 0) {
                    f[p] = c.HOLD_MIX;
                    g[p] = q;
                    continue a;
                  }
                  break;
                }
              }
              f[p] = c.HOLD_FIRST;
            }
          } else {
            f[p] = c.SUBSEQUENT;
          }
        }
      }
    };
    c.prototype.getCurrent = function(b) {
      return b >= this.tracks.length ? null : this.tracks[b];
    };
    c.prototype.addListener = function(b) {
      if (b == null) {
        throw Error("listener cannot be null.");
      }
      this.listeners.push(b);
    };
    c.prototype.removeListener = function(b) {
      b = this.listeners.indexOf(b);
      b >= 0 && this.listeners.splice(b, 1);
    };
    c.prototype.clearListeners = function() {
      this.listeners.length = 0;
    };
    c.prototype.clearListenerNotifications = function() {
      this.queue.clear();
    };
    c.emptyAnimation = new n.Animation("<empty>", [], 0);
    c.SUBSEQUENT = 0;
    c.FIRST = 1;
    c.HOLD_SUBSEQUENT = 2;
    c.HOLD_FIRST = 3;
    c.HOLD_MIX = 4;
    c.SETUP = 1;
    c.CURRENT = 2;
    return c;
  }();
  n.AnimationState = e;
  var u = function() {
    function c() {
      this.mixBlend = n.MixBlend.replace;
      this.timelineMode = [];
      this.timelineHoldMix = [];
      this.timelinesRotation = [];
    }
    c.prototype.reset = function() {
      this.listener = this.animation = this.mixingTo = this.mixingFrom = this.next = null;
      this.timelineMode.length = 0;
      this.timelineHoldMix.length = 0;
      this.timelinesRotation.length = 0;
    };
    c.prototype.getAnimationTime = function() {
      if (this.loop) {
        var b = this.animationEnd - this.animationStart;
        return b == 0 ? this.animationStart : this.trackTime % b + this.animationStart;
      }
      return Math.min(this.trackTime + this.animationStart, this.animationEnd);
    };
    c.prototype.setAnimationLast = function(b) {
      this.nextAnimationLast = this.animationLast = b;
    };
    c.prototype.isComplete = function() {
      return this.trackTime >= this.animationEnd - this.animationStart;
    };
    c.prototype.resetRotationDirections = function() {
      this.timelinesRotation.length = 0;
    };
    return c;
  }();
  n.TrackEntry = u;
  var d = function() {
    function c(b) {
      this.objects = [];
      this.drainDisabled = !1;
      this.animState = b;
    }
    c.prototype.start = function(b) {
      this.objects.push(a.start);
      this.objects.push(b);
      this.animState.animationsChanged = !0;
    };
    c.prototype.interrupt = function(b) {
      this.objects.push(a.interrupt);
      this.objects.push(b);
    };
    c.prototype.end = function(b) {
      this.objects.push(a.end);
      this.objects.push(b);
      this.animState.animationsChanged = !0;
    };
    c.prototype.dispose = function(b) {
      this.objects.push(a.dispose);
      this.objects.push(b);
    };
    c.prototype.complete = function(b) {
      this.objects.push(a.complete);
      this.objects.push(b);
    };
    c.prototype.event = function(b, h) {
      this.objects.push(a.event);
      this.objects.push(b);
      this.objects.push(h);
    };
    c.prototype.drain = function() {
      if (!this.drainDisabled) {
        this.drainDisabled = !0;
        for (var b = this.objects, h = this.animState.listeners, m = 0; m < b.length; m += 2) {
          var k = b[m + 1];
          switch(b[m]) {
            case a.start:
              k.listener != null && k.listener.start && k.listener.start(k);
              for (var f = 0; f < h.length; f++) {
                h[f].start && h[f].start(k);
              }
              break;
            case a.interrupt:
              k.listener != null && k.listener.interrupt && k.listener.interrupt(k);
              for (f = 0; f < h.length; f++) {
                h[f].interrupt && h[f].interrupt(k);
              }
              break;
            case a.end:
              for (k.listener != null && k.listener.end && k.listener.end(k), f = 0; f < h.length; f++) {
                h[f].end && h[f].end(k);
              }
            case a.dispose:
              k.listener != null && k.listener.dispose && k.listener.dispose(k);
              for (f = 0; f < h.length; f++) {
                h[f].dispose && h[f].dispose(k);
              }
              this.animState.trackEntryPool.free(k);
              break;
            case a.complete:
              k.listener != null && k.listener.complete && k.listener.complete(k);
              for (f = 0; f < h.length; f++) {
                h[f].complete && h[f].complete(k);
              }
              break;
            case a.event:
              var g = b[m++ + 2];
              k.listener != null && k.listener.event && k.listener.event(k, g);
              for (f = 0; f < h.length; f++) {
                h[f].event && h[f].event(k, g);
              }
          }
        }
        this.clear();
        this.drainDisabled = !1;
      }
    };
    c.prototype.clear = function() {
      this.objects.length = 0;
    };
    return c;
  }();
  n.EventQueue = d;
  var a;
  (function(c) {
    c[c.start = 0] = "start";
    c[c.interrupt = 1] = "interrupt";
    c[c.end = 2] = "end";
    c[c.dispose = 3] = "dispose";
    c[c.complete = 4] = "complete";
    c[c.event = 5] = "event";
  })(a = n.EventType || (n.EventType = {}));
  e = function() {
    function c() {
    }
    c.prototype.start = function(b) {
    };
    c.prototype.interrupt = function(b) {
    };
    c.prototype.end = function(b) {
    };
    c.prototype.dispose = function(b) {
    };
    c.prototype.complete = function(b) {
    };
    c.prototype.event = function(b, h) {
    };
    return c;
  }();
  n.AnimationStateAdapter = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u(d) {
      this.animationToMixTime = {};
      this.defaultMix = 0;
      if (d == null) {
        throw Error("skeletonData cannot be null.");
      }
      this.skeletonData = d;
    }
    u.prototype.setMix = function(d, a, c) {
      var b = this.skeletonData.findAnimation(d);
      if (b == null) {
        throw Error("Animation not found: " + d);
      }
      d = this.skeletonData.findAnimation(a);
      if (d == null) {
        throw Error("Animation not found: " + a);
      }
      this.setMixWith(b, d, c);
    };
    u.prototype.setMixWith = function(d, a, c) {
      if (d == null) {
        throw Error("from cannot be null.");
      }
      if (a == null) {
        throw Error("to cannot be null.");
      }
      this.animationToMixTime[d.name + "." + a.name] = c;
    };
    u.prototype.getMix = function(d, a) {
      d = this.animationToMixTime[d.name + "." + a.name];
      return d === void 0 ? this.defaultMix : d;
    };
    return u;
  }();
  n.AnimationStateData = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u(d, a) {
      a === void 0 && (a = "");
      this.assets = {};
      this.errors = {};
      this.loaded = this.toLoad = 0;
      this.rawDataUris = {};
      this.textureLoader = d;
      this.pathPrefix = a;
    }
    u.prototype.downloadText = function(d, a, c) {
      var b = new XMLHttpRequest();
      b.overrideMimeType("text/html");
      this.rawDataUris[d] && (d = this.rawDataUris[d]);
      b.open("GET", d, !0);
      b.onload = function() {
        b.status == 200 ? a(b.responseText) : c(b.status, b.responseText);
      };
      b.onerror = function() {
        c(b.status, b.responseText);
      };
      b.send();
    };
    u.prototype.downloadBinary = function(d, a, c) {
      var b = new XMLHttpRequest();
      this.rawDataUris[d] && (d = this.rawDataUris[d]);
      b.open("GET", d, !0);
      b.responseType = "arraybuffer";
      b.onload = function() {
        b.status == 200 ? a(new Uint8Array(b.response)) : c(b.status, b.responseText);
      };
      b.onerror = function() {
        c(b.status, b.responseText);
      };
      b.send();
    };
    u.prototype.setRawDataURI = function(d, a) {
      this.rawDataUris[this.pathPrefix + d] = a;
    };
    u.prototype.loadBinary = function(d, a, c) {
      var b = this;
      a === void 0 && (a = null);
      c === void 0 && (c = null);
      d = this.pathPrefix + d;
      this.toLoad++;
      this.downloadBinary(d, function(h) {
        b.assets[d] = h;
        a && a(d, h);
        b.toLoad--;
        b.loaded++;
      }, function(h, m) {
        b.errors[d] = "Couldn't load binary " + d + ": status " + status + ", " + m;
        c && c(d, "Couldn't load binary " + d + ": status " + status + ", " + m);
        b.toLoad--;
        b.loaded++;
      });
    };
    u.prototype.loadText = function(d, a, c) {
      var b = this;
      a === void 0 && (a = null);
      c === void 0 && (c = null);
      d = this.pathPrefix + d;
      this.toLoad++;
      this.downloadText(d, function(h) {
        b.assets[d] = h;
        a && a(d, h);
        b.toLoad--;
        b.loaded++;
      }, function(h, m) {
        b.errors[d] = "Couldn't load text " + d + ": status " + status + ", " + m;
        c && c(d, "Couldn't load text " + d + ": status " + status + ", " + m);
        b.toLoad--;
        b.loaded++;
      });
    };
    u.prototype.loadTexture = function(d, a, c) {
      var b = this;
      a === void 0 && (a = null);
      c === void 0 && (c = null);
      var h = d = this.pathPrefix + d;
      this.toLoad++;
      var m = new Image();
      m.crossOrigin = "anonymous";
      m.onload = function(k) {
        k = b.textureLoader(m);
        b.assets[h] = k;
        b.toLoad--;
        b.loaded++;
        a && a(d, m);
      };
      m.onerror = function(k) {
        b.errors[d] = "Couldn't load image " + d;
        b.toLoad--;
        b.loaded++;
        c && c(d, "Couldn't load image " + d);
      };
      this.rawDataUris[d] && (d = this.rawDataUris[d]);
      m.src = d;
    };
    u.prototype.loadTextureAtlas = function(d, a, c) {
      var b = this;
      a === void 0 && (a = null);
      c === void 0 && (c = null);
      var h = d.lastIndexOf("/") >= 0 ? d.substring(0, d.lastIndexOf("/")) : "";
      d = this.pathPrefix + d;
      this.toLoad++;
      this.downloadText(d, function(m) {
        var k = 0, f = [];
        try {
          new n.TextureAtlas(m, function(p) {
            f.push(h == "" ? p : h + "/" + p);
            p = document.createElement("img");
            p.width = 16;
            p.height = 16;
            return new n.FakeTexture(p);
          });
        } catch (p) {
          var g = p;
          b.errors[d] = "Couldn't load texture atlas " + d + ": " + g.message;
          c && c(d, "Couldn't load texture atlas " + d + ": " + g.message);
          b.toLoad--;
          b.loaded++;
          return;
        }
        g = function(p) {
          var q = !1;
          b.loadTexture(p, function(r, w) {
            k++;
            if (k == f.length) {
              if (q) {
                b.errors[d] = "Couldn't load texture atlas page " + r + "} of atlas " + d, c && c(d, "Couldn't load texture atlas page " + r + " of atlas " + d), b.toLoad--, b.loaded++;
              } else {
                try {
                  var t = new n.TextureAtlas(m, function(v) {
                    return b.get(h == "" ? v : h + "/" + v);
                  });
                  b.assets[d] = t;
                  a && a(d, t);
                  b.toLoad--;
                  b.loaded++;
                } catch (v) {
                  r = v, b.errors[d] = "Couldn't load texture atlas " + d + ": " + r.message, c && c(d, "Couldn't load texture atlas " + d + ": " + r.message), b.toLoad--, b.loaded++;
                }
              }
            }
          }, function(r, w) {
            q = !0;
            k++;
            k == f.length && (b.errors[d] = "Couldn't load texture atlas page " + r + "} of atlas " + d, c && c(d, "Couldn't load texture atlas page " + r + " of atlas " + d), b.toLoad--, b.loaded++);
          });
        };
        for (var l = 0; l < f.length; l++) {
          g(f[l]);
        }
      }, function(m, k) {
        b.errors[d] = "Couldn't load texture atlas " + d + ": status " + status + ", " + k;
        c && c(d, "Couldn't load texture atlas " + d + ": status " + status + ", " + k);
        b.toLoad--;
        b.loaded++;
      });
    };
    u.prototype.get = function(d) {
      d = this.pathPrefix + d;
      return this.assets[d];
    };
    u.prototype.remove = function(d) {
      d = this.pathPrefix + d;
      var a = this.assets[d];
      a.dispose && a.dispose();
      this.assets[d] = null;
    };
    u.prototype.removeAll = function() {
      for (var d in this.assets) {
        var a = this.assets[d];
        a.dispose && a.dispose();
      }
      this.assets = {};
    };
    u.prototype.isLoadingComplete = function() {
      return this.toLoad == 0;
    };
    u.prototype.getToLoad = function() {
      return this.toLoad;
    };
    u.prototype.getLoaded = function() {
      return this.loaded;
    };
    u.prototype.dispose = function() {
      this.removeAll();
    };
    u.prototype.hasErrors = function() {
      return Object.keys(this.errors).length > 0;
    };
    u.prototype.getErrors = function() {
      return this.errors;
    };
    return u;
  }();
  n.AssetManager = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u(d) {
      this.atlas = d;
    }
    u.prototype.newRegionAttachment = function(d, a, c) {
      d = this.atlas.findRegion(c);
      if (d == null) {
        throw Error("Region not found in atlas: " + c + " (region attachment: " + a + ")");
      }
      d.renderObject = d;
      a = new n.RegionAttachment(a);
      a.setRegion(d);
      return a;
    };
    u.prototype.newMeshAttachment = function(d, a, c) {
      d = this.atlas.findRegion(c);
      if (d == null) {
        throw Error("Region not found in atlas: " + c + " (mesh attachment: " + a + ")");
      }
      d.renderObject = d;
      a = new n.MeshAttachment(a);
      a.region = d;
      return a;
    };
    u.prototype.newBoundingBoxAttachment = function(d, a) {
      return new n.BoundingBoxAttachment(a);
    };
    u.prototype.newPathAttachment = function(d, a) {
      return new n.PathAttachment(a);
    };
    u.prototype.newPointAttachment = function(d, a) {
      return new n.PointAttachment(a);
    };
    u.prototype.newClippingAttachment = function(d, a) {
      return new n.ClippingAttachment(a);
    };
    return u;
  }();
  n.AtlasAttachmentLoader = e;
})(spine ||= {});
(function(n) {
  n = n.BlendMode || (n.BlendMode = {});
  n[n.Normal = 0] = "Normal";
  n[n.Additive = 1] = "Additive";
  n[n.Multiply = 2] = "Multiply";
  n[n.Screen = 3] = "Screen";
})(spine ||= {});
(function(n) {
  var e = function() {
    function u(d, a, c) {
      this.children = [];
      this.ashearY = this.ashearX = this.ascaleY = this.ascaleX = this.arotation = this.ay = this.ax = this.shearY = this.shearX = this.scaleY = this.scaleX = this.rotation = this.y = this.x = 0;
      this.appliedValid = !1;
      this.worldX = this.worldY = this.d = this.c = this.b = this.a = 0;
      this.active = this.sorted = !1;
      if (d == null) {
        throw Error("data cannot be null.");
      }
      if (a == null) {
        throw Error("skeleton cannot be null.");
      }
      this.data = d;
      this.skeleton = a;
      this.parent = c;
      this.setToSetupPose();
    }
    u.prototype.isActive = function() {
      return this.active;
    };
    u.prototype.update = function() {
      this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    };
    u.prototype.updateWorldTransform = function() {
      this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    };
    u.prototype.updateWorldTransformWith = function(d, a, c, b, h, m, k) {
      this.ax = d;
      this.ay = a;
      this.arotation = c;
      this.ascaleX = b;
      this.ascaleY = h;
      this.ashearX = m;
      this.ashearY = k;
      this.appliedValid = !0;
      var f = this.parent;
      if (f == null) {
        var g = this.skeleton;
        k = c + 90 + k;
        var l = g.scaleX, p = g.scaleY;
        this.a = n.MathUtils.cosDeg(c + m) * b * l;
        this.b = n.MathUtils.cosDeg(k) * h * l;
        this.c = n.MathUtils.sinDeg(c + m) * b * p;
        this.d = n.MathUtils.sinDeg(k) * h * p;
        this.worldX = d * l + g.x;
        this.worldY = a * p + g.y;
      } else {
        g = f.a;
        l = f.b;
        p = f.c;
        var q = f.d;
        this.worldX = g * d + l * a + f.worldX;
        this.worldY = p * d + q * a + f.worldY;
        switch(this.data.transformMode) {
          case n.TransformMode.Normal:
            k = c + 90 + k;
            d = n.MathUtils.cosDeg(c + m) * b;
            a = n.MathUtils.cosDeg(k) * h;
            b *= n.MathUtils.sinDeg(c + m);
            h *= n.MathUtils.sinDeg(k);
            this.a = g * d + l * b;
            this.b = g * a + l * h;
            this.c = p * d + q * b;
            this.d = p * a + q * h;
            return;
          case n.TransformMode.OnlyTranslation:
            k = c + 90 + k;
            this.a = n.MathUtils.cosDeg(c + m) * b;
            this.b = n.MathUtils.cosDeg(k) * h;
            this.c = n.MathUtils.sinDeg(c + m) * b;
            this.d = n.MathUtils.sinDeg(k) * h;
            break;
          case n.TransformMode.NoRotationOrReflection:
            d = g * g + p * p;
            d > 1e-4 ? (d = Math.abs(g * q - l * p) / d, g /= this.skeleton.scaleX, p /= this.skeleton.scaleY, l = p * d, q = g * d, d = Math.atan2(p, g) * n.MathUtils.radDeg) : (p = g = 0, d = 90 - Math.atan2(q, l) * n.MathUtils.radDeg);
            m = c + m - d;
            k = c + k - d + 90;
            d = n.MathUtils.cosDeg(m) * b;
            a = n.MathUtils.cosDeg(k) * h;
            b *= n.MathUtils.sinDeg(m);
            h *= n.MathUtils.sinDeg(k);
            this.a = g * d - l * b;
            this.b = g * a - l * h;
            this.c = p * d + q * b;
            this.d = p * a + q * h;
            break;
          case n.TransformMode.NoScale:
          case n.TransformMode.NoScaleOrReflection:
            d = n.MathUtils.cosDeg(c), a = n.MathUtils.sinDeg(c), c = (g * d + l * a) / this.skeleton.scaleX, f = (p * d + q * a) / this.skeleton.scaleY, d = Math.sqrt(c * c + f * f), d > 1e-5 && (d = 1 / d), c *= d, f *= d, d = Math.sqrt(c * c + f * f), this.data.transformMode == n.TransformMode.NoScale && g * q - l * p < 0 != (this.skeleton.scaleX < 0 != this.skeleton.scaleY < 0) && (d = -d), l = Math.PI / 2 + Math.atan2(f, c), g = Math.cos(l) * d, l = Math.sin(l) * d, d = n.MathUtils.cosDeg(m) * 
            b, a = n.MathUtils.cosDeg(90 + k) * h, b *= n.MathUtils.sinDeg(m), h *= n.MathUtils.sinDeg(90 + k), this.a = c * d + g * b, this.b = c * a + g * h, this.c = f * d + l * b, this.d = f * a + l * h;
        }
        this.a *= this.skeleton.scaleX;
        this.b *= this.skeleton.scaleX;
        this.c *= this.skeleton.scaleY;
        this.d *= this.skeleton.scaleY;
      }
    };
    u.prototype.setToSetupPose = function() {
      var d = this.data;
      this.x = d.x;
      this.y = d.y;
      this.rotation = d.rotation;
      this.scaleX = d.scaleX;
      this.scaleY = d.scaleY;
      this.shearX = d.shearX;
      this.shearY = d.shearY;
    };
    u.prototype.getWorldRotationX = function() {
      return Math.atan2(this.c, this.a) * n.MathUtils.radDeg;
    };
    u.prototype.getWorldRotationY = function() {
      return Math.atan2(this.d, this.b) * n.MathUtils.radDeg;
    };
    u.prototype.getWorldScaleX = function() {
      return Math.sqrt(this.a * this.a + this.c * this.c);
    };
    u.prototype.getWorldScaleY = function() {
      return Math.sqrt(this.b * this.b + this.d * this.d);
    };
    u.prototype.updateAppliedTransform = function() {
      this.appliedValid = !0;
      var d = this.parent;
      if (d == null) {
        this.ax = this.worldX, this.ay = this.worldY, this.arotation = Math.atan2(this.c, this.a) * n.MathUtils.radDeg, this.ascaleX = Math.sqrt(this.a * this.a + this.c * this.c), this.ascaleY = Math.sqrt(this.b * this.b + this.d * this.d), this.ashearX = 0, this.ashearY = Math.atan2(this.a * this.b + this.c * this.d, this.a * this.d - this.b * this.c) * n.MathUtils.radDeg;
      } else {
        var a = d.a, c = d.b, b = d.c, h = d.d, m = 1 / (a * h - c * b), k = this.worldX - d.worldX;
        d = this.worldY - d.worldY;
        this.ax = k * h * m - d * c * m;
        this.ay = d * a * m - k * b * m;
        h *= m;
        a *= m;
        c *= m;
        m *= b;
        b = h * this.a - c * this.c;
        c = h * this.b - c * this.d;
        h = a * this.c - m * this.a;
        m = a * this.d - m * this.b;
        this.ashearX = 0;
        this.ascaleX = Math.sqrt(b * b + h * h);
        this.ascaleX > 1e-4 ? (a = b * m - c * h, this.ascaleY = a / this.ascaleX, this.ashearY = Math.atan2(b * c + h * m, a) * n.MathUtils.radDeg, this.arotation = Math.atan2(h, b) * n.MathUtils.radDeg) : (this.ascaleX = 0, this.ascaleY = Math.sqrt(c * c + m * m), this.ashearY = 0, this.arotation = 90 - Math.atan2(m, c) * n.MathUtils.radDeg);
      }
    };
    u.prototype.worldToLocal = function(d) {
      var a = this.a, c = this.b, b = this.c, h = this.d, m = 1 / (a * h - c * b), k = d.x - this.worldX, f = d.y - this.worldY;
      d.x = k * h * m - f * c * m;
      d.y = f * a * m - k * b * m;
      return d;
    };
    u.prototype.localToWorld = function(d) {
      var a = d.x, c = d.y;
      d.x = a * this.a + c * this.b + this.worldX;
      d.y = a * this.c + c * this.d + this.worldY;
      return d;
    };
    u.prototype.worldToLocalRotation = function(d) {
      var a = n.MathUtils.sinDeg(d);
      d = n.MathUtils.cosDeg(d);
      return Math.atan2(this.a * a - this.c * d, this.d * d - this.b * a) * n.MathUtils.radDeg + this.rotation - this.shearX;
    };
    u.prototype.localToWorldRotation = function(d) {
      d -= this.rotation - this.shearX;
      var a = n.MathUtils.sinDeg(d);
      d = n.MathUtils.cosDeg(d);
      return Math.atan2(d * this.c + a * this.d, d * this.a + a * this.b) * n.MathUtils.radDeg;
    };
    u.prototype.rotateWorld = function(d) {
      var a = this.a, c = this.b, b = this.c, h = this.d, m = n.MathUtils.cosDeg(d);
      d = n.MathUtils.sinDeg(d);
      this.a = m * a - d * b;
      this.b = m * c - d * h;
      this.c = d * a + m * b;
      this.d = d * c + m * h;
      this.appliedValid = !1;
    };
    return u;
  }();
  n.Bone = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    return function(d, a, c) {
      this.rotation = this.y = this.x = 0;
      this.scaleY = this.scaleX = 1;
      this.shearY = this.shearX = 0;
      this.transformMode = u.Normal;
      this.skinRequired = !1;
      this.color = new n.Color();
      if (d < 0) {
        throw Error("index must be >= 0.");
      }
      if (a == null) {
        throw Error("name cannot be null.");
      }
      this.index = d;
      this.name = a;
      this.parent = c;
    };
  }();
  n.BoneData = e;
  var u;
  (function(d) {
    d[d.Normal = 0] = "Normal";
    d[d.OnlyTranslation = 1] = "OnlyTranslation";
    d[d.NoRotationOrReflection = 2] = "NoRotationOrReflection";
    d[d.NoScale = 3] = "NoScale";
    d[d.NoScaleOrReflection = 4] = "NoScaleOrReflection";
  })(u = n.TransformMode || (n.TransformMode = {}));
})(spine ||= {});
(function(n) {
  var e = function() {
    return function(u, d, a) {
      this.name = u;
      this.order = d;
      this.skinRequired = a;
    };
  }();
  n.ConstraintData = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    return function(u, d) {
      if (d == null) {
        throw Error("data cannot be null.");
      }
      this.time = u;
      this.data = d;
    };
  }();
  n.Event = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    return function(u) {
      this.name = u;
    };
  }();
  n.EventData = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u(d, a) {
      this.bendDirection = 0;
      this.stretch = this.compress = !1;
      this.mix = 1;
      this.softness = 0;
      this.active = !1;
      if (d == null) {
        throw Error("data cannot be null.");
      }
      if (a == null) {
        throw Error("skeleton cannot be null.");
      }
      this.data = d;
      this.mix = d.mix;
      this.softness = d.softness;
      this.bendDirection = d.bendDirection;
      this.compress = d.compress;
      this.stretch = d.stretch;
      this.bones = [];
      for (var c = 0; c < d.bones.length; c++) {
        this.bones.push(a.findBone(d.bones[c].name));
      }
      this.target = a.findBone(d.target.name);
    }
    u.prototype.isActive = function() {
      return this.active;
    };
    u.prototype.apply = function() {
      this.update();
    };
    u.prototype.update = function() {
      var d = this.target, a = this.bones;
      switch(a.length) {
        case 1:
          this.apply1(a[0], d.worldX, d.worldY, this.compress, this.stretch, this.data.uniform, this.mix);
          break;
        case 2:
          this.apply2(a[0], a[1], d.worldX, d.worldY, this.bendDirection, this.stretch, this.softness, this.mix);
      }
    };
    u.prototype.apply1 = function(d, a, c, b, h, m, k) {
      d.appliedValid || d.updateAppliedTransform();
      var f = d.parent, g = f.a, l = f.b, p = f.c, q = f.d, r = -d.ashearX - d.arotation;
      switch(d.data.transformMode) {
        case n.TransformMode.OnlyTranslation:
          l = a - d.worldX;
          q = c - d.worldY;
          break;
        case n.TransformMode.NoRotationOrReflection:
          q = Math.abs(g * q - l * p) / (g * g + p * p);
          var w = g / d.skeleton.scaleX, t = p / d.skeleton.scaleY;
          l = -t * q * d.skeleton.scaleX;
          q = w * q * d.skeleton.scaleY;
          r += Math.atan2(t, w) * n.MathUtils.radDeg;
        default:
          w = a - f.worldX, f = c - f.worldY, t = g * q - l * p, l = (w * q - f * l) / t - d.ax, q = (f * g - w * p) / t - d.ay;
      }
      r += Math.atan2(q, l) * n.MathUtils.radDeg;
      d.ascaleX < 0 && (r += 180);
      r > 180 ? r -= 360 : r < -180 && (r += 360);
      g = d.ascaleX;
      p = d.ascaleY;
      if (b || h) {
        switch(d.data.transformMode) {
          case n.TransformMode.NoScale:
          case n.TransformMode.NoScaleOrReflection:
            l = a - d.worldX, q = c - d.worldY;
        }
        a = d.data.length * g;
        c = Math.sqrt(l * l + q * q);
        if (b && c < a || h && c > a && a > 1e-4) {
          q = (c / a - 1) * k + 1, g *= q, m && (p *= q);
        }
      }
      d.updateWorldTransformWith(d.ax, d.ay, d.arotation + r * k, g, p, d.ashearX, d.ashearY);
    };
    u.prototype.apply2 = function(d, a, c, b, h, m, k, f) {
      if (f == 0) {
        a.updateWorldTransform();
      } else {
        d.appliedValid || d.updateAppliedTransform();
        a.appliedValid || a.updateAppliedTransform();
        var g = d.ax, l = d.ay, p = d.ascaleX, q = p, r = d.ascaleY, w = a.ascaleX;
        if (p < 0) {
          p = -p;
          var t = 180;
          var v = -1;
        } else {
          t = 0, v = 1;
        }
        r < 0 && (r = -r, v = -v);
        if (w < 0) {
          w = -w;
          var x = 180;
        } else {
          x = 0;
        }
        var z = a.ax, y = d.a, A = d.b, C = d.c, F = d.d, H = Math.abs(p - r) <= 1e-4;
        if (H) {
          var D = a.ay;
          var G = y * z + A * D + d.worldX;
          var B = C * z + F * D + d.worldY;
        } else {
          D = 0, G = y * z + d.worldX, B = C * z + d.worldY;
        }
        var I = d.parent;
        y = I.a;
        A = I.b;
        C = I.c;
        F = I.d;
        var J = 1 / (y * F - A * C), E = G - I.worldX;
        G = B - I.worldY;
        B = (E * F - G * A) * J - g;
        G = (G * y - E * C) * J - l;
        B = Math.sqrt(B * B + G * G);
        var L = a.data.length * w;
        if (B < 1e-4) {
          this.apply1(d, c, b, !1, m, !1, f), a.updateWorldTransformWith(z, D, 0, a.ascaleX, a.ascaleY, a.ashearX, a.ashearY);
        } else {
          E = c - I.worldX;
          G = b - I.worldY;
          F = (E * F - G * A) * J - g;
          C = (G * y - E * C) * J - l;
          J = F * F + C * C;
          k != 0 && (k *= p * (w + 1) / 2, y = Math.sqrt(J), A = y - B - L * p + k, A > 0 && (J = Math.min(1, A / (k * 2)) - 1, J = (A - k * (1 - J * J)) / y, F -= J * F, C -= J * C, J = F * F + C * C));
          a: {
            if (H) {
              L *= p, y = (J - B * B - L * L) / (2 * B * L), y < -1 ? y = -1 : y > 1 && (y = 1, m && (q *= (Math.sqrt(J) / (B + L) - 1) * f + 1)), h *= Math.acos(y), y = B + L * y, A = L * Math.sin(h), y = Math.atan2(C * y - F * A, F * y + C * A);
            } else {
              y = p * L;
              A = r * L;
              G = y * y;
              E = A * A;
              m = Math.atan2(C, F);
              C = E * B * B + G * J - G * E;
              k = -2 * E * B;
              H = E - G;
              F = k * k - 4 * H * C;
              if (F >= 0 && (F = Math.sqrt(F), k < 0 && (F = -F), F = -(k + F) / 2, k = F / H, C /= F, C = Math.abs(k) < Math.abs(C) ? k : C, C * C <= J)) {
                G = Math.sqrt(J - C * C) * h;
                y = m - Math.atan2(G, C);
                h = Math.atan2(G / r, (C - B) / p);
                break a;
              }
              p = n.MathUtils.PI;
              k = B - y;
              H = k * k;
              r = L = 0;
              w = B + y;
              c = w * w;
              b = 0;
              C = -y * B / (G - E);
              C >= -1 && C <= 1 && (C = Math.acos(C), E = y * Math.cos(C) + B, G = A * Math.sin(C), F = E * E + G * G, F < H && (p = C, H = F, k = E, L = G), F > c && (r = C, c = F, w = E, b = G));
              J <= (H + c) / 2 ? (y = m - Math.atan2(L * h, k), h *= p) : (y = m - Math.atan2(b * h, w), h *= r);
            }
          }
          B = Math.atan2(D, z) * v;
          A = d.arotation;
          y = (y - B) * n.MathUtils.radDeg + t - A;
          y > 180 ? y -= 360 : y < -180 && (y += 360);
          d.updateWorldTransformWith(g, l, A + y * f, q, d.ascaleY, 0, 0);
          A = a.arotation;
          h = ((h + B) * n.MathUtils.radDeg - a.ashearX) * v + x - A;
          h > 180 ? h -= 360 : h < -180 && (h += 360);
          a.updateWorldTransformWith(z, D, A + h * f, a.ascaleX, a.ascaleY, a.ashearX, a.ashearY);
        }
      }
    };
    return u;
  }();
  n.IkConstraint = e;
})(spine ||= {});
(function(n) {
  var e = function(u) {
    function d(a) {
      a = u.call(this, a, 0, !1) || this;
      a.bones = [];
      a.bendDirection = 1;
      a.compress = !1;
      a.stretch = !1;
      a.uniform = !1;
      a.mix = 1;
      a.softness = 0;
      return a;
    }
    __extends(d, u);
    return d;
  }(n.ConstraintData);
  n.IkConstraintData = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u(d, a) {
      this.translateMix = this.rotateMix = this.spacing = this.position = 0;
      this.spaces = [];
      this.positions = [];
      this.world = [];
      this.curves = [];
      this.lengths = [];
      this.segments = [];
      this.active = !1;
      if (d == null) {
        throw Error("data cannot be null.");
      }
      if (a == null) {
        throw Error("skeleton cannot be null.");
      }
      this.data = d;
      this.bones = [];
      for (var c = 0, b = d.bones.length; c < b; c++) {
        this.bones.push(a.findBone(d.bones[c].name));
      }
      this.target = a.findSlot(d.target.name);
      this.position = d.position;
      this.spacing = d.spacing;
      this.rotateMix = d.rotateMix;
      this.translateMix = d.translateMix;
    }
    u.prototype.isActive = function() {
      return this.active;
    };
    u.prototype.apply = function() {
      this.update();
    };
    u.prototype.update = function() {
      var d = this.target.getAttachment();
      if (d instanceof n.PathAttachment) {
        var a = this.rotateMix, c = this.translateMix, b = a > 0;
        if (c > 0 || b) {
          var h = this.data, m = h.spacingMode == n.SpacingMode.Percent, k = h.rotateMode, f = k == n.RotateMode.Tangent, g = k == n.RotateMode.ChainScale, l = this.bones.length, p = f ? l : l + 1, q = this.bones, r = n.Utils.setArraySize(this.spaces, p), w = null, t = this.spacing;
          if (g || !m) {
            g && (w = n.Utils.setArraySize(this.lengths, l));
            for (var v = h.spacingMode == n.SpacingMode.Length, x = 0, z = p - 1; x < z;) {
              var y = q[x], A = y.data.length;
              if (A < u.epsilon) {
                g && (w[x] = 0), r[++x] = 0;
              } else if (m) {
                if (g) {
                  var C = A * y.a, F = A * y.c;
                  w[x] = Math.sqrt(C * C + F * F);
                }
                r[++x] = t;
              } else {
                C = A * y.a, F = A * y.c, y = Math.sqrt(C * C + F * F), g && (w[x] = y), r[++x] = (v ? A + t : t) * y / A;
              }
            }
          } else {
            for (x = 1; x < p; x++) {
              r[x] = t;
            }
          }
          d = this.computeWorldPositions(d, p, f, h.positionMode == n.PositionMode.Percent, m);
          m = d[0];
          p = d[1];
          h = h.offsetRotation;
          h == 0 ? k = k == n.RotateMode.Chain : (k = !1, t = this.target.bone, h *= t.a * t.d - t.b * t.c > 0 ? n.MathUtils.degRad : -n.MathUtils.degRad);
          x = 0;
          for (t = 3; x < l; x++, t += 3) {
            y = q[x];
            y.worldX += (m - y.worldX) * c;
            y.worldY += (p - y.worldY) * c;
            C = d[t];
            F = d[t + 1];
            v = C - m;
            z = F - p;
            g && (m = w[x], m != 0 && (m = (Math.sqrt(v * v + z * z) / m - 1) * a + 1, y.a *= m, y.c *= m));
            m = C;
            p = F;
            if (b) {
              C = y.a;
              F = y.b;
              A = y.c;
              var H = y.d;
              var D = f ? d[t - 1] : r[x + 1] == 0 ? d[t + 2] : Math.atan2(z, v);
              D -= Math.atan2(A, C);
              if (k) {
                var G = Math.cos(D);
                var B = Math.sin(D);
                var I = y.data.length;
                m += (I * (G * C - B * A) - v) * a;
                p += (I * (B * C + G * A) - z) * a;
              } else {
                D += h;
              }
              D > n.MathUtils.PI ? D -= n.MathUtils.PI2 : D < -n.MathUtils.PI && (D += n.MathUtils.PI2);
              D *= a;
              G = Math.cos(D);
              B = Math.sin(D);
              y.a = G * C - B * A;
              y.b = G * F - B * H;
              y.c = B * C + G * A;
              y.d = B * F + G * H;
            }
            y.appliedValid = !1;
          }
        }
      }
    };
    u.prototype.computeWorldPositions = function(d, a, c, b, h) {
      var m = this.target, k = this.position, f = this.spaces, g = n.Utils.setArraySize(this.positions, a * 3 + 2), l = d.closed, p = d.worldVerticesLength, q = p / 6, r = u.NONE;
      if (!d.constantSpeed) {
        var w = d.lengths;
        q -= l ? 1 : 2;
        var t = w[q];
        b && (k *= t);
        if (h) {
          for (var v = 1; v < a; v++) {
            f[v] *= t;
          }
        }
        var x = n.Utils.setArraySize(this.world, 8);
        for (h = b = v = 0; v < a; v++, b += 3) {
          var z = f[v], y = k += z;
          if (l) {
            y %= t, y < 0 && (y += t), h = 0;
          } else if (y < 0) {
            r != u.BEFORE && (r = u.BEFORE, d.computeWorldVertices(m, 2, 4, x, 0, 2));
            this.addBeforePosition(y, x, 0, g, b);
            continue;
          } else if (y > t) {
            r != u.AFTER && (r = u.AFTER, d.computeWorldVertices(m, p - 6, 4, x, 0, 2));
            this.addAfterPosition(y - t, x, 0, g, b);
            continue;
          }
          for (;; h++) {
            var A = w[h];
            if (!(y > A)) {
              if (h == 0) {
                y /= A;
              } else {
                var C = w[h - 1];
                y = (y - C) / (A - C);
              }
              break;
            }
          }
          h != r && (r = h, l && h == q ? (d.computeWorldVertices(m, p - 4, 4, x, 0, 2), d.computeWorldVertices(m, 0, 4, x, 4, 2)) : d.computeWorldVertices(m, h * 6 + 2, 8, x, 0, 2));
          this.addCurvePosition(y, x[0], x[1], x[2], x[3], x[4], x[5], x[6], x[7], g, b, c || v > 0 && z == 0);
        }
        return g;
      }
      l ? (p += 2, x = n.Utils.setArraySize(this.world, p), d.computeWorldVertices(m, 2, p - 4, x, 0, 2), d.computeWorldVertices(m, 0, 2, x, p - 4, 2), x[p - 2] = x[0], x[p - 1] = x[1]) : (q--, p -= 4, x = n.Utils.setArraySize(this.world, p), d.computeWorldVertices(m, 2, p, x, 0, 2));
      m = n.Utils.setArraySize(this.curves, q);
      w = 0;
      t = x[0];
      A = x[1];
      var F = 0, H = 0, D = 0, G = 0, B = 0, I = 0;
      v = 0;
      for (z = 2; v < q; v++, z += 6) {
        F = x[z];
        H = x[z + 1];
        D = x[z + 2];
        G = x[z + 3];
        B = x[z + 4];
        I = x[z + 5];
        var J = (t - F * 2 + D) * 0.1875;
        var E = (A - H * 2 + G) * 0.1875;
        C = ((F - D) * 3 - t + B) * 0.09375;
        var L = ((H - G) * 3 - A + I) * 0.09375;
        var M = J * 2 + C;
        var O = E * 2 + L;
        J = (F - t) * 0.75 + J + C * 0.16666667;
        E = (H - A) * 0.75 + E + L * 0.16666667;
        w += Math.sqrt(J * J + E * E);
        J += M;
        E += O;
        M += C;
        O += L;
        w += Math.sqrt(J * J + E * E);
        J += M;
        E += O;
        w += Math.sqrt(J * J + E * E);
        J += M + C;
        E += O + L;
        w += Math.sqrt(J * J + E * E);
        m[v] = w;
        t = B;
        A = I;
      }
      k = b ? k * w : w / d.lengths[q - 1] * k;
      if (h) {
        for (v = 1; v < a; v++) {
          f[v] *= w;
        }
      }
      d = this.segments;
      for (L = h = b = v = q = 0; v < a; v++, b += 3) {
        z = f[v];
        y = k += z;
        if (l) {
          y %= w, y < 0 && (y += w), h = 0;
        } else if (y < 0) {
          this.addBeforePosition(y, x, 0, g, b);
          continue;
        } else if (y > w) {
          this.addAfterPosition(y - w, x, p - 4, g, b);
          continue;
        }
        for (;; h++) {
          if (M = m[h], !(y > M)) {
            h == 0 ? y /= M : (C = m[h - 1], y = (y - C) / (M - C));
            break;
          }
        }
        if (h != r) {
          r = h;
          var N = h * 6;
          t = x[N];
          A = x[N + 1];
          F = x[N + 2];
          H = x[N + 3];
          D = x[N + 4];
          G = x[N + 5];
          B = x[N + 6];
          I = x[N + 7];
          J = (t - F * 2 + D) * 0.03;
          E = (A - H * 2 + G) * 0.03;
          C = ((F - D) * 3 - t + B) * 0.006;
          L = ((H - G) * 3 - A + I) * 0.006;
          M = J * 2 + C;
          O = E * 2 + L;
          J = (F - t) * 0.3 + J + C * 0.16666667;
          E = (H - A) * 0.3 + E + L * 0.16666667;
          q = Math.sqrt(J * J + E * E);
          d[0] = q;
          for (N = 1; N < 8; N++) {
            J += M, E += O, M += C, O += L, q += Math.sqrt(J * J + E * E), d[N] = q;
          }
          J += M;
          E += O;
          q += Math.sqrt(J * J + E * E);
          d[8] = q;
          J += M + C;
          E += O + L;
          q += Math.sqrt(J * J + E * E);
          d[9] = q;
          L = 0;
        }
        for (y *= q;; L++) {
          if (M = d[L], !(y > M)) {
            L == 0 ? y /= M : (C = d[L - 1], y = L + (y - C) / (M - C));
            break;
          }
        }
        this.addCurvePosition(y * 0.1, t, A, F, H, D, G, B, I, g, b, c || v > 0 && z == 0);
      }
      return g;
    };
    u.prototype.addBeforePosition = function(d, a, c, b, h) {
      var m = a[c], k = a[c + 1];
      a = Math.atan2(a[c + 3] - k, a[c + 2] - m);
      b[h] = m + d * Math.cos(a);
      b[h + 1] = k + d * Math.sin(a);
      b[h + 2] = a;
    };
    u.prototype.addAfterPosition = function(d, a, c, b, h) {
      var m = a[c + 2], k = a[c + 3];
      a = Math.atan2(k - a[c + 1], m - a[c]);
      b[h] = m + d * Math.cos(a);
      b[h + 1] = k + d * Math.sin(a);
      b[h + 2] = a;
    };
    u.prototype.addCurvePosition = function(d, a, c, b, h, m, k, f, g, l, p, q) {
      if (d == 0 || isNaN(d)) {
        l[p] = a, l[p + 1] = c, l[p + 2] = Math.atan2(h - c, b - a);
      } else {
        var r = d * d, w = r * d, t = 1 - d, v = t * t, x = v * t, z = t * d, y = z * 3;
        t *= y;
        y *= d;
        f = a * x + b * t + m * y + f * w;
        g = c * x + h * t + k * y + g * w;
        l[p] = f;
        l[p + 1] = g;
        q && (l[p + 2] = d < 0.001 ? Math.atan2(h - c, b - a) : Math.atan2(g - (c * v + h * z * 2 + k * r), f - (a * v + b * z * 2 + m * r)));
      }
    };
    u.NONE = -1;
    u.BEFORE = -2;
    u.AFTER = -3;
    u.epsilon = 1e-5;
    return u;
  }();
  n.PathConstraint = e;
})(spine ||= {});
(function(n) {
  var e = function(u) {
    function d(a) {
      a = u.call(this, a, 0, !1) || this;
      a.bones = [];
      return a;
    }
    __extends(d, u);
    return d;
  }(n.ConstraintData);
  n.PathConstraintData = e;
  (function(u) {
    u[u.Fixed = 0] = "Fixed";
    u[u.Percent = 1] = "Percent";
  })(n.PositionMode || (n.PositionMode = {}));
  (function(u) {
    u[u.Length = 0] = "Length";
    u[u.Fixed = 1] = "Fixed";
    u[u.Percent = 2] = "Percent";
  })(n.SpacingMode || (n.SpacingMode = {}));
  (function(u) {
    u[u.Tangent = 0] = "Tangent";
    u[u.Chain = 1] = "Chain";
    u[u.ChainScale = 2] = "ChainScale";
  })(n.RotateMode || (n.RotateMode = {}));
})(spine ||= {});
(function(n) {
  var e = function() {
    function d(a) {
      this.toLoad = [];
      this.assets = {};
      this.clientId = a;
    }
    d.prototype.loaded = function() {
      var a = 0, c;
      for (c in this.assets) {
        a++;
      }
      return a;
    };
    return d;
  }(), u = function() {
    function d(a) {
      a === void 0 && (a = "");
      this.clientAssets = {};
      this.queuedAssets = {};
      this.rawAssets = {};
      this.errors = {};
      this.pathPrefix = a;
    }
    d.prototype.queueAsset = function(a, c, b) {
      var h = this.clientAssets[a];
      if (h === null || h === void 0) {
        h = new e(a), this.clientAssets[a] = h;
      }
      c !== null && (h.textureLoader = c);
      h.toLoad.push(b);
      if (this.queuedAssets[b] === b) {
        return !1;
      }
      this.queuedAssets[b] = b;
      return !0;
    };
    d.prototype.loadText = function(a, c) {
      var b = this;
      c = this.pathPrefix + c;
      if (this.queueAsset(a, null, c)) {
        var h = new XMLHttpRequest();
        h.overrideMimeType("text/html");
        h.onreadystatechange = function() {
          h.readyState == XMLHttpRequest.DONE && (h.status >= 200 && h.status < 300 ? b.rawAssets[c] = h.responseText : b.errors[c] = "Couldn't load text " + c + ": status " + h.status + ", " + h.responseText);
        };
        h.open("GET", c, !0);
        h.send();
      }
    };
    d.prototype.loadJson = function(a, c) {
      var b = this;
      c = this.pathPrefix + c;
      if (this.queueAsset(a, null, c)) {
        var h = new XMLHttpRequest();
        h.overrideMimeType("text/html");
        h.onreadystatechange = function() {
          h.readyState == XMLHttpRequest.DONE && (h.status >= 200 && h.status < 300 ? b.rawAssets[c] = JSON.parse(h.responseText) : b.errors[c] = "Couldn't load text " + c + ": status " + h.status + ", " + h.responseText);
        };
        h.open("GET", c, !0);
        h.send();
      }
    };
    d.prototype.loadTexture = function(a, c, b) {
      var h = this;
      b = this.pathPrefix + b;
      if (this.queueAsset(a, c, b)) {
        if (typeof window !== "undefined" && typeof navigator !== "undefined" && window.document || typeof importScripts === "undefined") {
          var m = new Image();
          m.crossOrigin = "anonymous";
          m.onload = function(k) {
            h.rawAssets[b] = m;
          };
          m.onerror = function(k) {
            h.errors[b] = "Couldn't load image " + b;
          };
          m.src = b;
        } else {
          fetch(b, {mode:"cors"}).then(function(k) {
            k.ok || (h.errors[b] = "Couldn't load image " + b);
            return k.blob();
          }).then(function(k) {
            return createImageBitmap(k, {premultiplyAlpha:"none", colorSpaceConversion:"none"});
          }).then(function(k) {
            h.rawAssets[b] = k;
          });
        }
      }
    };
    d.prototype.get = function(a, c) {
      c = this.pathPrefix + c;
      a = this.clientAssets[a];
      return a === null || a === void 0 ? !0 : a.assets[c];
    };
    d.prototype.updateClientAssets = function(a) {
      for (var c = !(typeof window !== "undefined" && typeof navigator !== "undefined" && window.document) && typeof importScripts !== "undefined", b = 0; b < a.toLoad.length; b++) {
        var h = a.toLoad[b], m = a.assets[h];
        if (m === null || m === void 0) {
          m = this.rawAssets[h], m !== null && m !== void 0 && (a.assets[h] = c ? m instanceof ImageBitmap ? a.textureLoader(m) : m : m instanceof HTMLImageElement ? a.textureLoader(m) : m);
        }
      }
    };
    d.prototype.isLoadingComplete = function(a) {
      a = this.clientAssets[a];
      if (a === null || a === void 0) {
        return !0;
      }
      this.updateClientAssets(a);
      return a.toLoad.length == a.loaded();
    };
    d.prototype.dispose = function() {
    };
    d.prototype.hasErrors = function() {
      return Object.keys(this.errors).length > 0;
    };
    d.prototype.getErrors = function() {
      return this.errors;
    };
    return d;
  }();
  n.SharedAssetManager = u;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u(d) {
      this._updateCache = [];
      this.updateCacheReset = [];
      this.time = 0;
      this.scaleY = this.scaleX = 1;
      this.y = this.x = 0;
      if (d == null) {
        throw Error("data cannot be null.");
      }
      this.data = d;
      this.bones = [];
      for (var a = 0; a < d.bones.length; a++) {
        var c = d.bones[a];
        if (c.parent == null) {
          c = new n.Bone(c, this, null);
        } else {
          var b = this.bones[c.parent.index];
          c = new n.Bone(c, this, b);
          b.children.push(c);
        }
        this.bones.push(c);
      }
      this.slots = [];
      this.drawOrder = [];
      for (a = 0; a < d.slots.length; a++) {
        b = d.slots[a], c = this.bones[b.boneData.index], c = new n.Slot(b, c), this.slots.push(c), this.drawOrder.push(c);
      }
      this.ikConstraints = [];
      for (a = 0; a < d.ikConstraints.length; a++) {
        this.ikConstraints.push(new n.IkConstraint(d.ikConstraints[a], this));
      }
      this.transformConstraints = [];
      for (a = 0; a < d.transformConstraints.length; a++) {
        this.transformConstraints.push(new n.TransformConstraint(d.transformConstraints[a], this));
      }
      this.pathConstraints = [];
      for (a = 0; a < d.pathConstraints.length; a++) {
        this.pathConstraints.push(new n.PathConstraint(d.pathConstraints[a], this));
      }
      this.color = new n.Color(1, 1, 1, 1);
      this.updateCache();
    }
    u.prototype.updateCache = function() {
      this._updateCache.length = 0;
      this.updateCacheReset.length = 0;
      for (var d = this.bones, a = 0, c = d.length; a < c; a++) {
        var b = d[a];
        b.sorted = b.data.skinRequired;
        b.active = !b.sorted;
      }
      if (this.skin != null) {
        var h = this.skin.bones;
        a = 0;
        for (c = this.skin.bones.length; a < c; a++) {
          b = this.bones[h[a].index];
          do {
            b.sorted = !1, b.active = !0, b = b.parent;
          } while (b != null);
        }
      }
      c = this.ikConstraints;
      b = this.transformConstraints;
      h = this.pathConstraints;
      var m = c.length, k = b.length, f = h.length, g = m + k + f;
      a = 0;
      a: for (; a < g; a++) {
        for (var l = 0; l < m; l++) {
          var p = c[l];
          if (p.data.order == a) {
            this.sortIkConstraint(p);
            continue a;
          }
        }
        for (l = 0; l < k; l++) {
          if (p = b[l], p.data.order == a) {
            this.sortTransformConstraint(p);
            continue a;
          }
        }
        for (l = 0; l < f; l++) {
          if (p = h[l], p.data.order == a) {
            this.sortPathConstraint(p);
            continue a;
          }
        }
      }
      a = 0;
      for (c = d.length; a < c; a++) {
        this.sortBone(d[a]);
      }
    };
    u.prototype.sortIkConstraint = function(d) {
      d.active = d.target.isActive() && (!d.data.skinRequired || this.skin != null && n.Utils.contains(this.skin.constraints, d.data, !0));
      if (d.active) {
        this.sortBone(d.target);
        var a = d.bones, c = a[0];
        this.sortBone(c);
        if (a.length > 1) {
          var b = a[a.length - 1];
          this._updateCache.indexOf(b) > -1 || this.updateCacheReset.push(b);
        }
        this._updateCache.push(d);
        this.sortReset(c.children);
        a[a.length - 1].sorted = !0;
      }
    };
    u.prototype.sortPathConstraint = function(d) {
      d.active = d.target.bone.isActive() && (!d.data.skinRequired || this.skin != null && n.Utils.contains(this.skin.constraints, d.data, !0));
      if (d.active) {
        var a = d.target, c = a.data.index, b = a.bone;
        this.skin != null && this.sortPathConstraintAttachment(this.skin, c, b);
        this.data.defaultSkin != null && this.data.defaultSkin != this.skin && this.sortPathConstraintAttachment(this.data.defaultSkin, c, b);
        for (var h = 0, m = this.data.skins.length; h < m; h++) {
          this.sortPathConstraintAttachment(this.data.skins[h], c, b);
        }
        h = a.getAttachment();
        h instanceof n.PathAttachment && this.sortPathConstraintAttachmentWith(h, b);
        b = d.bones;
        a = b.length;
        for (h = 0; h < a; h++) {
          this.sortBone(b[h]);
        }
        this._updateCache.push(d);
        for (h = 0; h < a; h++) {
          this.sortReset(b[h].children);
        }
        for (h = 0; h < a; h++) {
          b[h].sorted = !0;
        }
      }
    };
    u.prototype.sortTransformConstraint = function(d) {
      d.active = d.target.isActive() && (!d.data.skinRequired || this.skin != null && n.Utils.contains(this.skin.constraints, d.data, !0));
      if (d.active) {
        this.sortBone(d.target);
        var a = d.bones, c = a.length;
        if (d.data.local) {
          for (var b = 0; b < c; b++) {
            var h = a[b];
            this.sortBone(h.parent);
            this._updateCache.indexOf(h) > -1 || this.updateCacheReset.push(h);
          }
        } else {
          for (b = 0; b < c; b++) {
            this.sortBone(a[b]);
          }
        }
        this._updateCache.push(d);
        for (d = 0; d < c; d++) {
          this.sortReset(a[d].children);
        }
        for (d = 0; d < c; d++) {
          a[d].sorted = !0;
        }
      }
    };
    u.prototype.sortPathConstraintAttachment = function(d, a, c) {
      if (d = d.attachments[a]) {
        for (var b in d) {
          this.sortPathConstraintAttachmentWith(d[b], c);
        }
      }
    };
    u.prototype.sortPathConstraintAttachmentWith = function(d, a) {
      if (d instanceof n.PathAttachment) {
        if (d = d.bones, d == null) {
          this.sortBone(a);
        } else {
          a = this.bones;
          for (var c = 0; c < d.length;) {
            var b = d[c++];
            for (b = c + b; c < b; c++) {
              this.sortBone(a[d[c]]);
            }
          }
        }
      }
    };
    u.prototype.sortBone = function(d) {
      if (!d.sorted) {
        var a = d.parent;
        a != null && this.sortBone(a);
        d.sorted = !0;
        this._updateCache.push(d);
      }
    };
    u.prototype.sortReset = function(d) {
      for (var a = 0, c = d.length; a < c; a++) {
        var b = d[a];
        b.active && (b.sorted && this.sortReset(b.children), b.sorted = !1);
      }
    };
    u.prototype.updateWorldTransform = function() {
      for (var d = this.updateCacheReset, a = 0, c = d.length; a < c; a++) {
        var b = d[a];
        b.ax = b.x;
        b.ay = b.y;
        b.arotation = b.rotation;
        b.ascaleX = b.scaleX;
        b.ascaleY = b.scaleY;
        b.ashearX = b.shearX;
        b.ashearY = b.shearY;
        b.appliedValid = !0;
      }
      d = this._updateCache;
      a = 0;
      for (c = d.length; a < c; a++) {
        d[a].update();
      }
    };
    u.prototype.setToSetupPose = function() {
      this.setBonesToSetupPose();
      this.setSlotsToSetupPose();
    };
    u.prototype.setBonesToSetupPose = function() {
      for (var d = this.bones, a = 0, c = d.length; a < c; a++) {
        d[a].setToSetupPose();
      }
      var b = this.ikConstraints;
      a = 0;
      for (c = b.length; a < c; a++) {
        d = b[a], d.mix = d.data.mix, d.softness = d.data.softness, d.bendDirection = d.data.bendDirection, d.compress = d.data.compress, d.stretch = d.data.stretch;
      }
      var h = this.transformConstraints;
      a = 0;
      for (c = h.length; a < c; a++) {
        d = h[a], b = d.data, d.rotateMix = b.rotateMix, d.translateMix = b.translateMix, d.scaleMix = b.scaleMix, d.shearMix = b.shearMix;
      }
      h = this.pathConstraints;
      a = 0;
      for (c = h.length; a < c; a++) {
        d = h[a], b = d.data, d.position = b.position, d.spacing = b.spacing, d.rotateMix = b.rotateMix, d.translateMix = b.translateMix;
      }
    };
    u.prototype.setSlotsToSetupPose = function() {
      var d = this.slots;
      n.Utils.arrayCopy(d, 0, this.drawOrder, 0, d.length);
      for (var a = 0, c = d.length; a < c; a++) {
        d[a].setToSetupPose();
      }
    };
    u.prototype.getRootBone = function() {
      return this.bones.length == 0 ? null : this.bones[0];
    };
    u.prototype.findBone = function(d) {
      if (d == null) {
        throw Error("boneName cannot be null.");
      }
      for (var a = this.bones, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.data.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.findBoneIndex = function(d) {
      if (d == null) {
        throw Error("boneName cannot be null.");
      }
      for (var a = this.bones, c = 0, b = a.length; c < b; c++) {
        if (a[c].data.name == d) {
          return c;
        }
      }
      return -1;
    };
    u.prototype.findSlot = function(d) {
      if (d == null) {
        throw Error("slotName cannot be null.");
      }
      for (var a = this.slots, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.data.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.findSlotIndex = function(d) {
      if (d == null) {
        throw Error("slotName cannot be null.");
      }
      for (var a = this.slots, c = 0, b = a.length; c < b; c++) {
        if (a[c].data.name == d) {
          return c;
        }
      }
      return -1;
    };
    u.prototype.setSkinByName = function(d) {
      var a = this.data.findSkin(d);
      if (a == null) {
        throw Error("Skin not found: " + d);
      }
      this.setSkin(a);
    };
    u.prototype.setSkin = function(d) {
      if (d != this.skin) {
        if (d != null) {
          if (this.skin != null) {
            d.attachAll(this, this.skin);
          } else {
            for (var a = this.slots, c = 0, b = a.length; c < b; c++) {
              var h = a[c], m = h.data.attachmentName;
              m != null && (m = d.getAttachment(c, m), m != null && h.setAttachment(m));
            }
          }
        }
        this.skin = d;
        this.updateCache();
      }
    };
    u.prototype.getAttachmentByName = function(d, a) {
      return this.getAttachment(this.data.findSlotIndex(d), a);
    };
    u.prototype.getAttachment = function(d, a) {
      if (a == null) {
        throw Error("attachmentName cannot be null.");
      }
      if (this.skin != null) {
        var c = this.skin.getAttachment(d, a);
        if (c != null) {
          return c;
        }
      }
      return this.data.defaultSkin != null ? this.data.defaultSkin.getAttachment(d, a) : null;
    };
    u.prototype.setAttachment = function(d, a) {
      if (d == null) {
        throw Error("slotName cannot be null.");
      }
      for (var c = this.slots, b = 0, h = c.length; b < h; b++) {
        var m = c[b];
        if (m.data.name == d) {
          c = null;
          if (a != null && (c = this.getAttachment(b, a), c == null)) {
            throw Error("Attachment not found: " + a + ", for slot: " + d);
          }
          m.setAttachment(c);
          return;
        }
      }
      throw Error("Slot not found: " + d);
    };
    u.prototype.findIkConstraint = function(d) {
      if (d == null) {
        throw Error("constraintName cannot be null.");
      }
      for (var a = this.ikConstraints, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.data.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.findTransformConstraint = function(d) {
      if (d == null) {
        throw Error("constraintName cannot be null.");
      }
      for (var a = this.transformConstraints, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.data.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.findPathConstraint = function(d) {
      if (d == null) {
        throw Error("constraintName cannot be null.");
      }
      for (var a = this.pathConstraints, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.data.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.getBounds = function(d, a, c) {
      c === void 0 && (c = Array(2));
      if (d == null) {
        throw Error("offset cannot be null.");
      }
      if (a == null) {
        throw Error("size cannot be null.");
      }
      for (var b = this.drawOrder, h = Number.POSITIVE_INFINITY, m = Number.POSITIVE_INFINITY, k = Number.NEGATIVE_INFINITY, f = Number.NEGATIVE_INFINITY, g = 0, l = b.length; g < l; g++) {
        var p = b[g];
        if (p.bone.active) {
          var q = null, r = p.getAttachment();
          if (r instanceof n.RegionAttachment) {
            var w = 8;
            q = n.Utils.setArraySize(c, w, 0);
            r.computeWorldVertices(p.bone, q, 0, 2);
          } else {
            r instanceof n.MeshAttachment && (w = r.worldVerticesLength, q = n.Utils.setArraySize(c, w, 0), r.computeWorldVertices(p, 0, w, q, 0, 2));
          }
          if (q != null) {
            for (p = 0, w = q.length; p < w; p += 2) {
              r = q[p];
              var t = q[p + 1];
              h = Math.min(h, r);
              m = Math.min(m, t);
              k = Math.max(k, r);
              f = Math.max(f, t);
            }
          }
        }
      }
      d.set(h, m);
      a.set(k - h, f - m);
    };
    u.prototype.update = function(d) {
      this.time += d;
    };
    return u;
  }();
  n.Skeleton = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function c(b) {
      this.scale = 1;
      this.linkedMeshes = [];
      this.attachmentLoader = b;
    }
    c.prototype.readSkeletonData = function(b) {
      var h = this.scale, m = new n.SkeletonData();
      m.name = "";
      b = new u(b);
      m.hash = b.readString();
      m.version = b.readString();
      if ("3.8.75" == m.version) {
        throw Error("Unsupported skeleton data, please export with a newer version of Spine.");
      }
      m.x = b.readFloat();
      m.y = b.readFloat();
      m.width = b.readFloat();
      m.height = b.readFloat();
      var k = b.readBoolean();
      k && (m.fps = b.readFloat(), m.imagesPath = b.readString(), m.audioPath = b.readString());
      var f = b.readInt(!0);
      for (var g = 0; g < f; g++) {
        b.strings.push(b.readString());
      }
      f = b.readInt(!0);
      for (g = 0; g < f; g++) {
        var l = b.readString(), p = g == 0 ? null : m.bones[b.readInt(!0)];
        l = new n.BoneData(g, l, p);
        l.rotation = b.readFloat();
        l.x = b.readFloat() * h;
        l.y = b.readFloat() * h;
        l.scaleX = b.readFloat();
        l.scaleY = b.readFloat();
        l.shearX = b.readFloat();
        l.shearY = b.readFloat();
        l.length = b.readFloat() * h;
        l.transformMode = c.TransformModeValues[b.readInt(!0)];
        l.skinRequired = b.readBoolean();
        k && n.Color.rgba8888ToColor(l.color, b.readInt32());
        m.bones.push(l);
      }
      f = b.readInt(!0);
      for (g = 0; g < f; g++) {
        l = b.readString(), p = m.bones[b.readInt(!0)], l = new n.SlotData(g, l, p), n.Color.rgba8888ToColor(l.color, b.readInt32()), p = b.readInt32(), p != -1 && n.Color.rgb888ToColor(l.darkColor = new n.Color(), p), l.attachmentName = b.readStringRef(), l.blendMode = c.BlendModeValues[b.readInt(!0)], m.slots.push(l);
      }
      f = b.readInt(!0);
      for (g = 0; g < f; g++) {
        l = new n.IkConstraintData(b.readString());
        l.order = b.readInt(!0);
        l.skinRequired = b.readBoolean();
        p = b.readInt(!0);
        for (var q = 0; q < p; q++) {
          l.bones.push(m.bones[b.readInt(!0)]);
        }
        l.target = m.bones[b.readInt(!0)];
        l.mix = b.readFloat();
        l.softness = b.readFloat() * h;
        l.bendDirection = b.readByte();
        l.compress = b.readBoolean();
        l.stretch = b.readBoolean();
        l.uniform = b.readBoolean();
        m.ikConstraints.push(l);
      }
      f = b.readInt(!0);
      for (g = 0; g < f; g++) {
        l = new n.TransformConstraintData(b.readString());
        l.order = b.readInt(!0);
        l.skinRequired = b.readBoolean();
        p = b.readInt(!0);
        for (q = 0; q < p; q++) {
          l.bones.push(m.bones[b.readInt(!0)]);
        }
        l.target = m.bones[b.readInt(!0)];
        l.local = b.readBoolean();
        l.relative = b.readBoolean();
        l.offsetRotation = b.readFloat();
        l.offsetX = b.readFloat() * h;
        l.offsetY = b.readFloat() * h;
        l.offsetScaleX = b.readFloat();
        l.offsetScaleY = b.readFloat();
        l.offsetShearY = b.readFloat();
        l.rotateMix = b.readFloat();
        l.translateMix = b.readFloat();
        l.scaleMix = b.readFloat();
        l.shearMix = b.readFloat();
        m.transformConstraints.push(l);
      }
      f = b.readInt(!0);
      for (g = 0; g < f; g++) {
        l = new n.PathConstraintData(b.readString());
        l.order = b.readInt(!0);
        l.skinRequired = b.readBoolean();
        p = b.readInt(!0);
        for (q = 0; q < p; q++) {
          l.bones.push(m.bones[b.readInt(!0)]);
        }
        l.target = m.slots[b.readInt(!0)];
        l.positionMode = c.PositionModeValues[b.readInt(!0)];
        l.spacingMode = c.SpacingModeValues[b.readInt(!0)];
        l.rotateMode = c.RotateModeValues[b.readInt(!0)];
        l.offsetRotation = b.readFloat();
        l.position = b.readFloat();
        l.positionMode == n.PositionMode.Fixed && (l.position *= h);
        l.spacing = b.readFloat();
        if (l.spacingMode == n.SpacingMode.Length || l.spacingMode == n.SpacingMode.Fixed) {
          l.spacing *= h;
        }
        l.rotateMix = b.readFloat();
        l.translateMix = b.readFloat();
        m.pathConstraints.push(l);
      }
      f = this.readSkin(b, m, !0, k);
      f != null && (m.defaultSkin = f, m.skins.push(f));
      g = m.skins.length;
      for (n.Utils.setArraySize(m.skins, f = g + b.readInt(!0)); g < f; g++) {
        m.skins[g] = this.readSkin(b, m, !1, k);
      }
      f = this.linkedMeshes.length;
      for (g = 0; g < f; g++) {
        h = this.linkedMeshes[g];
        k = h.skin == null ? m.defaultSkin : m.findSkin(h.skin);
        if (k == null) {
          throw Error("Skin not found: " + h.skin);
        }
        k = k.getAttachment(h.slotIndex, h.parent);
        if (k == null) {
          throw Error("Parent mesh not found: " + h.parent);
        }
        h.mesh.deformAttachment = h.inheritDeform ? k : h.mesh;
        h.mesh.setParentMesh(k);
        h.mesh.updateUVs();
      }
      this.linkedMeshes.length = 0;
      f = b.readInt(!0);
      for (g = 0; g < f; g++) {
        l = new n.EventData(b.readStringRef()), l.intValue = b.readInt(!1), l.floatValue = b.readFloat(), l.stringValue = b.readString(), l.audioPath = b.readString(), l.audioPath != null && (l.volume = b.readFloat(), l.balance = b.readFloat()), m.events.push(l);
      }
      f = b.readInt(!0);
      for (g = 0; g < f; g++) {
        m.animations.push(this.readAnimation(b, b.readString(), m));
      }
      return m;
    };
    c.prototype.readSkin = function(b, h, m, k) {
      if (m) {
        var f = b.readInt(!0);
        if (f == 0) {
          return null;
        }
        m = new n.Skin("default");
      } else {
        m = new n.Skin(b.readStringRef());
        m.bones.length = b.readInt(!0);
        var g = 0;
        for (f = m.bones.length; g < f; g++) {
          m.bones[g] = h.bones[b.readInt(!0)];
        }
        g = 0;
        for (f = b.readInt(!0); g < f; g++) {
          m.constraints.push(h.ikConstraints[b.readInt(!0)]);
        }
        g = 0;
        for (f = b.readInt(!0); g < f; g++) {
          m.constraints.push(h.transformConstraints[b.readInt(!0)]);
        }
        g = 0;
        for (f = b.readInt(!0); g < f; g++) {
          m.constraints.push(h.pathConstraints[b.readInt(!0)]);
        }
        f = b.readInt(!0);
      }
      for (g = 0; g < f; g++) {
        for (var l = b.readInt(!0), p = 0, q = b.readInt(!0); p < q; p++) {
          var r = b.readStringRef(), w = this.readAttachment(b, h, m, l, r, k);
          w != null && m.setAttachment(l, r, w);
        }
      }
      return m;
    };
    c.prototype.readAttachment = function(b, h, m, k, f, g) {
      var l = this.scale, p = b.readStringRef();
      p == null && (p = f);
      f = b.readByte();
      switch(c.AttachmentTypeValues[f]) {
        case n.AttachmentType.Region:
          h = b.readStringRef();
          k = b.readFloat();
          var q = b.readFloat(), r = b.readFloat();
          g = b.readFloat();
          var w = b.readFloat(), t = b.readFloat(), v = b.readFloat();
          f = b.readInt32();
          h == null && (h = p);
          b = this.attachmentLoader.newRegionAttachment(m, p, h);
          if (b == null) {
            break;
          }
          b.path = h;
          b.x = q * l;
          b.y = r * l;
          b.scaleX = g;
          b.scaleY = w;
          b.rotation = k;
          b.width = t * l;
          b.height = v * l;
          n.Color.rgba8888ToColor(b.color, f);
          b.updateOffset();
          return b;
        case n.AttachmentType.BoundingBox:
          k = b.readInt(!0);
          q = this.readVertices(b, k);
          f = g ? b.readInt32() : 0;
          l = this.attachmentLoader.newBoundingBoxAttachment(m, p);
          if (l == null) {
            break;
          }
          l.worldVerticesLength = k << 1;
          l.vertices = q.vertices;
          l.bones = q.bones;
          g && n.Color.rgba8888ToColor(l.color, f);
          return l;
        case n.AttachmentType.Mesh:
          h = b.readStringRef();
          f = b.readInt32();
          k = b.readInt(!0);
          r = this.readFloatArray(b, k << 1, 1);
          w = this.readShortArray(b);
          q = this.readVertices(b, k);
          var x = b.readInt(!0), z = null;
          v = t = 0;
          g && (z = this.readShortArray(b), t = b.readFloat(), v = b.readFloat());
          h == null && (h = p);
          b = this.attachmentLoader.newMeshAttachment(m, p, h);
          if (b == null) {
            break;
          }
          b.path = h;
          n.Color.rgba8888ToColor(b.color, f);
          b.bones = q.bones;
          b.vertices = q.vertices;
          b.worldVerticesLength = k << 1;
          b.triangles = w;
          b.regionUVs = r;
          b.updateUVs();
          b.hullLength = x << 1;
          g && (b.edges = z, b.width = t * l, b.height = v * l);
          return b;
        case n.AttachmentType.LinkedMesh:
          h = b.readStringRef();
          f = b.readInt32();
          q = b.readStringRef();
          r = b.readStringRef();
          w = b.readBoolean();
          v = t = 0;
          g && (t = b.readFloat(), v = b.readFloat());
          h == null && (h = p);
          b = this.attachmentLoader.newMeshAttachment(m, p, h);
          if (b == null) {
            break;
          }
          b.path = h;
          n.Color.rgba8888ToColor(b.color, f);
          g && (b.width = t * l, b.height = v * l);
          this.linkedMeshes.push(new d(b, q, k, r, w));
          return b;
        case n.AttachmentType.Path:
          t = b.readBoolean();
          v = b.readBoolean();
          k = b.readInt(!0);
          q = this.readVertices(b, k);
          r = n.Utils.newArray(k / 3, 0);
          f = 0;
          for (h = r.length; f < h; f++) {
            r[f] = b.readFloat() * l;
          }
          f = g ? b.readInt32() : 0;
          h = this.attachmentLoader.newPathAttachment(m, p);
          if (h == null) {
            break;
          }
          h.closed = t;
          h.constantSpeed = v;
          h.worldVerticesLength = k << 1;
          h.vertices = q.vertices;
          h.bones = q.bones;
          h.lengths = r;
          g && n.Color.rgba8888ToColor(h.color, f);
          return h;
        case n.AttachmentType.Point:
          k = b.readFloat();
          q = b.readFloat();
          r = b.readFloat();
          f = g ? b.readInt32() : 0;
          b = this.attachmentLoader.newPointAttachment(m, p);
          if (b == null) {
            break;
          }
          b.x = q * l;
          b.y = r * l;
          b.rotation = k;
          g && n.Color.rgba8888ToColor(b.color, f);
          return b;
        case n.AttachmentType.Clipping:
          if (l = b.readInt(!0), k = b.readInt(!0), q = this.readVertices(b, k), f = g ? b.readInt32() : 0, b = this.attachmentLoader.newClippingAttachment(m, p), b != null) {
            return b.endSlot = h.slots[l], b.worldVerticesLength = k << 1, b.vertices = q.vertices, b.bones = q.bones, g && n.Color.rgba8888ToColor(b.color, f), b;
          }
      }
      return null;
    };
    c.prototype.readVertices = function(b, h) {
      var m = h << 1, k = new a(), f = this.scale;
      if (!b.readBoolean()) {
        return k.vertices = this.readFloatArray(b, m, f), k;
      }
      m = [];
      for (var g = [], l = 0; l < h; l++) {
        var p = b.readInt(!0);
        g.push(p);
        for (var q = 0; q < p; q++) {
          g.push(b.readInt(!0)), m.push(b.readFloat() * f), m.push(b.readFloat() * f), m.push(b.readFloat());
        }
      }
      k.vertices = n.Utils.toFloatArray(m);
      k.bones = g;
      return k;
    };
    c.prototype.readFloatArray = function(b, h, m) {
      var k = Array(h);
      if (m == 1) {
        for (var f = 0; f < h; f++) {
          k[f] = b.readFloat();
        }
      } else {
        for (f = 0; f < h; f++) {
          k[f] = b.readFloat() * m;
        }
      }
      return k;
    };
    c.prototype.readShortArray = function(b) {
      for (var h = b.readInt(!0), m = Array(h), k = 0; k < h; k++) {
        m[k] = b.readShort();
      }
      return m;
    };
    c.prototype.readAnimation = function(b, h, m) {
      for (var k = [], f = this.scale, g = 0, l = new n.Color(), p = new n.Color(), q = 0, r = b.readInt(!0); q < r; q++) {
        for (var w = b.readInt(!0), t = 0, v = b.readInt(!0); t < v; t++) {
          var x = b.readByte(), z = b.readInt(!0);
          switch(x) {
            case c.SLOT_ATTACHMENT:
              x = new n.AttachmentTimeline(z);
              x.slotIndex = w;
              for (var y = 0; y < z; y++) {
                x.setFrame(y, b.readFloat(), b.readStringRef());
              }
              k.push(x);
              g = Math.max(g, x.frames[z - 1]);
              break;
            case c.SLOT_COLOR:
              x = new n.ColorTimeline(z);
              x.slotIndex = w;
              for (y = 0; y < z; y++) {
                var A = b.readFloat();
                n.Color.rgba8888ToColor(l, b.readInt32());
                x.setFrame(y, A, l.r, l.g, l.b, l.a);
                y < z - 1 && this.readCurve(b, y, x);
              }
              k.push(x);
              g = Math.max(g, x.frames[(z - 1) * n.ColorTimeline.ENTRIES]);
              break;
            case c.SLOT_TWO_COLOR:
              x = new n.TwoColorTimeline(z);
              x.slotIndex = w;
              for (y = 0; y < z; y++) {
                A = b.readFloat(), n.Color.rgba8888ToColor(l, b.readInt32()), n.Color.rgb888ToColor(p, b.readInt32()), x.setFrame(y, A, l.r, l.g, l.b, l.a, p.r, p.g, p.b), y < z - 1 && this.readCurve(b, y, x);
              }
              k.push(x);
              g = Math.max(g, x.frames[(z - 1) * n.TwoColorTimeline.ENTRIES]);
          }
        }
      }
      q = 0;
      for (r = b.readInt(!0); q < r; q++) {
        for (A = b.readInt(!0), t = 0, v = b.readInt(!0); t < v; t++) {
          switch(x = b.readByte(), z = b.readInt(!0), x) {
            case c.BONE_ROTATE:
              x = new n.RotateTimeline(z);
              x.boneIndex = A;
              for (y = 0; y < z; y++) {
                x.setFrame(y, b.readFloat(), b.readFloat()), y < z - 1 && this.readCurve(b, y, x);
              }
              k.push(x);
              g = Math.max(g, x.frames[(z - 1) * n.RotateTimeline.ENTRIES]);
              break;
            case c.BONE_TRANSLATE:
            case c.BONE_SCALE:
            case c.BONE_SHEAR:
              w = 1;
              x == c.BONE_SCALE ? x = new n.ScaleTimeline(z) : x == c.BONE_SHEAR ? x = new n.ShearTimeline(z) : (x = new n.TranslateTimeline(z), w = f);
              x.boneIndex = A;
              for (y = 0; y < z; y++) {
                x.setFrame(y, b.readFloat(), b.readFloat() * w, b.readFloat() * w), y < z - 1 && this.readCurve(b, y, x);
              }
              k.push(x);
              g = Math.max(g, x.frames[(z - 1) * n.TranslateTimeline.ENTRIES]);
          }
        }
      }
      q = 0;
      for (r = b.readInt(!0); q < r; q++) {
        A = b.readInt(!0);
        z = b.readInt(!0);
        x = new n.IkConstraintTimeline(z);
        x.ikConstraintIndex = A;
        for (y = 0; y < z; y++) {
          x.setFrame(y, b.readFloat(), b.readFloat(), b.readFloat() * f, b.readByte(), b.readBoolean(), b.readBoolean()), y < z - 1 && this.readCurve(b, y, x);
        }
        k.push(x);
        g = Math.max(g, x.frames[(z - 1) * n.IkConstraintTimeline.ENTRIES]);
      }
      q = 0;
      for (r = b.readInt(!0); q < r; q++) {
        A = b.readInt(!0);
        z = b.readInt(!0);
        x = new n.TransformConstraintTimeline(z);
        x.transformConstraintIndex = A;
        for (y = 0; y < z; y++) {
          x.setFrame(y, b.readFloat(), b.readFloat(), b.readFloat(), b.readFloat(), b.readFloat()), y < z - 1 && this.readCurve(b, y, x);
        }
        k.push(x);
        g = Math.max(g, x.frames[(z - 1) * n.TransformConstraintTimeline.ENTRIES]);
      }
      q = 0;
      for (r = b.readInt(!0); q < r; q++) {
        for (A = b.readInt(!0), l = m.pathConstraints[A], t = 0, v = b.readInt(!0); t < v; t++) {
          switch(x = b.readByte(), z = b.readInt(!0), x) {
            case c.PATH_POSITION:
            case c.PATH_SPACING:
              w = 1;
              if (x == c.PATH_SPACING) {
                if (x = new n.PathConstraintSpacingTimeline(z), l.spacingMode == n.SpacingMode.Length || l.spacingMode == n.SpacingMode.Fixed) {
                  w = f;
                }
              } else {
                x = new n.PathConstraintPositionTimeline(z), l.positionMode == n.PositionMode.Fixed && (w = f);
              }
              x.pathConstraintIndex = A;
              for (y = 0; y < z; y++) {
                x.setFrame(y, b.readFloat(), b.readFloat() * w), y < z - 1 && this.readCurve(b, y, x);
              }
              k.push(x);
              g = Math.max(g, x.frames[(z - 1) * n.PathConstraintPositionTimeline.ENTRIES]);
              break;
            case c.PATH_MIX:
              x = new n.PathConstraintMixTimeline(z);
              x.pathConstraintIndex = A;
              for (y = 0; y < z; y++) {
                x.setFrame(y, b.readFloat(), b.readFloat(), b.readFloat()), y < z - 1 && this.readCurve(b, y, x);
              }
              k.push(x);
              g = Math.max(g, x.frames[(z - 1) * n.PathConstraintMixTimeline.ENTRIES]);
          }
        }
      }
      q = 0;
      for (r = b.readInt(!0); q < r; q++) {
        for (l = m.skins[b.readInt(!0)], t = 0, v = b.readInt(!0); t < v; t++) {
          w = b.readInt(!0);
          p = 0;
          for (var C = b.readInt(!0); p < C; p++) {
            A = l.getAttachment(w, b.readStringRef());
            var F = A.bones != null, H = A.vertices, D = F ? H.length / 3 * 2 : H.length;
            z = b.readInt(!0);
            x = new n.DeformTimeline(z);
            x.slotIndex = w;
            x.attachment = A;
            for (y = 0; y < z; y++) {
              A = b.readFloat();
              var G = b.readInt(!0);
              if (G == 0) {
                var B = F ? n.Utils.newFloatArray(D) : H;
              } else {
                B = n.Utils.newFloatArray(D);
                var I = b.readInt(!0);
                G += I;
                if (f == 1) {
                  for (; I < G; I++) {
                    B[I] = b.readFloat();
                  }
                } else {
                  for (; I < G; I++) {
                    B[I] = b.readFloat() * f;
                  }
                }
                if (!F) {
                  for (I = 0, G = B.length; I < G; I++) {
                    B[I] += H[I];
                  }
                }
              }
              x.setFrame(y, A, B);
              y < z - 1 && this.readCurve(b, y, x);
            }
            k.push(x);
            g = Math.max(g, x.frames[z - 1]);
          }
        }
      }
      f = b.readInt(!0);
      if (f > 0) {
        x = new n.DrawOrderTimeline(f);
        r = m.slots.length;
        for (q = 0; q < f; q++) {
          A = b.readFloat();
          v = b.readInt(!0);
          z = n.Utils.newArray(r, 0);
          for (t = r - 1; t >= 0; t--) {
            z[t] = -1;
          }
          y = n.Utils.newArray(r - v, 0);
          for (t = p = l = 0; t < v; t++) {
            for (w = b.readInt(!0); l != w;) {
              y[p++] = l++;
            }
            z[l + b.readInt(!0)] = l++;
          }
          for (; l < r;) {
            y[p++] = l++;
          }
          for (t = r - 1; t >= 0; t--) {
            z[t] == -1 && (z[t] = y[--p]);
          }
          x.setFrame(q, A, z);
        }
        k.push(x);
        g = Math.max(g, x.frames[f - 1]);
      }
      t = b.readInt(!0);
      if (t > 0) {
        x = new n.EventTimeline(t);
        for (q = 0; q < t; q++) {
          A = b.readFloat(), w = m.events[b.readInt(!0)], A = new n.Event(A, w), A.intValue = b.readInt(!1), A.floatValue = b.readFloat(), A.stringValue = b.readBoolean() ? b.readString() : w.stringValue, A.data.audioPath != null && (A.volume = b.readFloat(), A.balance = b.readFloat()), x.setFrame(q, A);
        }
        k.push(x);
        g = Math.max(g, x.frames[t - 1]);
      }
      return new n.Animation(h, k, g);
    };
    c.prototype.readCurve = function(b, h, m) {
      switch(b.readByte()) {
        case c.CURVE_STEPPED:
          m.setStepped(h);
          break;
        case c.CURVE_BEZIER:
          this.setCurve(m, h, b.readFloat(), b.readFloat(), b.readFloat(), b.readFloat());
      }
    };
    c.prototype.setCurve = function(b, h, m, k, f, g) {
      b.setCurve(h, m, k, f, g);
    };
    c.AttachmentTypeValues = [0, 1, 2, 3, 4, 5, 6];
    c.TransformModeValues = [n.TransformMode.Normal, n.TransformMode.OnlyTranslation, n.TransformMode.NoRotationOrReflection, n.TransformMode.NoScale, n.TransformMode.NoScaleOrReflection];
    c.PositionModeValues = [n.PositionMode.Fixed, n.PositionMode.Percent];
    c.SpacingModeValues = [n.SpacingMode.Length, n.SpacingMode.Fixed, n.SpacingMode.Percent];
    c.RotateModeValues = [n.RotateMode.Tangent, n.RotateMode.Chain, n.RotateMode.ChainScale];
    c.BlendModeValues = [n.BlendMode.Normal, n.BlendMode.Additive, n.BlendMode.Multiply, n.BlendMode.Screen];
    c.BONE_ROTATE = 0;
    c.BONE_TRANSLATE = 1;
    c.BONE_SCALE = 2;
    c.BONE_SHEAR = 3;
    c.SLOT_ATTACHMENT = 0;
    c.SLOT_COLOR = 1;
    c.SLOT_TWO_COLOR = 2;
    c.PATH_POSITION = 0;
    c.PATH_SPACING = 1;
    c.PATH_MIX = 2;
    c.CURVE_LINEAR = 0;
    c.CURVE_STEPPED = 1;
    c.CURVE_BEZIER = 2;
    return c;
  }();
  n.SkeletonBinary = e;
  var u = function() {
    function c(b, h, m, k) {
      h === void 0 && (h = []);
      m === void 0 && (m = 0);
      k === void 0 && (k = new DataView(b.buffer));
      this.strings = h;
      this.index = m;
      this.buffer = k;
    }
    c.prototype.readByte = function() {
      return this.buffer.getInt8(this.index++);
    };
    c.prototype.readShort = function() {
      var b = this.buffer.getInt16(this.index);
      this.index += 2;
      return b;
    };
    c.prototype.readInt32 = function() {
      var b = this.buffer.getInt32(this.index);
      this.index += 4;
      return b;
    };
    c.prototype.readInt = function(b) {
      var h = this.readByte(), m = h & 127;
      (h & 128) != 0 && (h = this.readByte(), m |= (h & 127) << 7, (h & 128) != 0 && (h = this.readByte(), m |= (h & 127) << 14, (h & 128) != 0 && (h = this.readByte(), m |= (h & 127) << 21, (h & 128) != 0 && (h = this.readByte(), m |= (h & 127) << 28))));
      return b ? m : m >>> 1 ^ -(m & 1);
    };
    c.prototype.readStringRef = function() {
      var b = this.readInt(!0);
      return b == 0 ? null : this.strings[b - 1];
    };
    c.prototype.readString = function() {
      var b = this.readInt(!0);
      switch(b) {
        case 0:
          return null;
        case 1:
          return "";
      }
      b--;
      for (var h = "", m = 0; m < b;) {
        var k = this.readByte();
        switch(k >> 4) {
          case 12:
          case 13:
            h += String.fromCharCode((k & 31) << 6 | this.readByte() & 63);
            m += 2;
            break;
          case 14:
            h += String.fromCharCode((k & 15) << 12 | (this.readByte() & 63) << 6 | this.readByte() & 63);
            m += 3;
            break;
          default:
            h += String.fromCharCode(k), m++;
        }
      }
      return h;
    };
    c.prototype.readFloat = function() {
      var b = this.buffer.getFloat32(this.index);
      this.index += 4;
      return b;
    };
    c.prototype.readBoolean = function() {
      return this.readByte() != 0;
    };
    return c;
  }(), d = function() {
    return function(c, b, h, m, k) {
      this.mesh = c;
      this.skin = b;
      this.slotIndex = h;
      this.parent = m;
      this.inheritDeform = k;
    };
  }(), a = function() {
    return function(c, b) {
      c === void 0 && (c = null);
      b === void 0 && (b = null);
      this.bones = c;
      this.vertices = b;
    };
  }();
})(spine ||= {});
(function(n) {
  var e = function() {
    function u() {
      this.maxY = this.maxX = this.minY = this.minX = 0;
      this.boundingBoxes = [];
      this.polygons = [];
      this.polygonPool = new n.Pool(function() {
        return n.Utils.newFloatArray(16);
      });
    }
    u.prototype.update = function(d, a) {
      if (d == null) {
        throw Error("skeleton cannot be null.");
      }
      var c = this.boundingBoxes, b = this.polygons, h = this.polygonPool;
      d = d.slots;
      var m = d.length;
      c.length = 0;
      h.freeAll(b);
      for (var k = b.length = 0; k < m; k++) {
        var f = d[k];
        if (f.bone.active) {
          var g = f.getAttachment();
          if (g instanceof n.BoundingBoxAttachment) {
            c.push(g);
            var l = h.obtain();
            l.length != g.worldVerticesLength && (l = n.Utils.newFloatArray(g.worldVerticesLength));
            b.push(l);
            g.computeWorldVertices(f, 0, g.worldVerticesLength, l, 0, 2);
          }
        }
      }
      a ? this.aabbCompute() : (this.minY = this.minX = Number.POSITIVE_INFINITY, this.maxY = this.maxX = Number.NEGATIVE_INFINITY);
    };
    u.prototype.aabbCompute = function() {
      for (var d = Number.POSITIVE_INFINITY, a = Number.POSITIVE_INFINITY, c = Number.NEGATIVE_INFINITY, b = Number.NEGATIVE_INFINITY, h = this.polygons, m = 0, k = h.length; m < k; m++) {
        var f = h[m], g = f, l = 0;
        for (f = f.length; l < f; l += 2) {
          var p = g[l], q = g[l + 1];
          d = Math.min(d, p);
          a = Math.min(a, q);
          c = Math.max(c, p);
          b = Math.max(b, q);
        }
      }
      this.minX = d;
      this.minY = a;
      this.maxX = c;
      this.maxY = b;
    };
    u.prototype.aabbContainsPoint = function(d, a) {
      return d >= this.minX && d <= this.maxX && a >= this.minY && a <= this.maxY;
    };
    u.prototype.aabbIntersectsSegment = function(d, a, c, b) {
      var h = this.minX, m = this.minY, k = this.maxX, f = this.maxY;
      if (d <= h && c <= h || a <= m && b <= m || d >= k && c >= k || a >= f && b >= f) {
        return !1;
      }
      c = (b - a) / (c - d);
      b = c * (h - d) + a;
      if (b > m && b < f) {
        return !0;
      }
      b = c * (k - d) + a;
      if (b > m && b < f) {
        return !0;
      }
      m = (m - a) / c + d;
      if (m > h && m < k) {
        return !0;
      }
      m = (f - a) / c + d;
      return m > h && m < k ? !0 : !1;
    };
    u.prototype.aabbIntersectsSkeleton = function(d) {
      return this.minX < d.maxX && this.maxX > d.minX && this.minY < d.maxY && this.maxY > d.minY;
    };
    u.prototype.containsPoint = function(d, a) {
      for (var c = this.polygons, b = 0, h = c.length; b < h; b++) {
        if (this.containsPointPolygon(c[b], d, a)) {
          return this.boundingBoxes[b];
        }
      }
      return null;
    };
    u.prototype.containsPointPolygon = function(d, a, c) {
      for (var b = d.length, h = b - 2, m = !1, k = 0; k < b; k += 2) {
        var f = d[k + 1], g = d[h + 1];
        if (f < c && g >= c || g < c && f >= c) {
          var l = d[k];
          l + (c - f) / (g - f) * (d[h] - l) < a && (m = !m);
        }
        h = k;
      }
      return m;
    };
    u.prototype.intersectsSegment = function(d, a, c, b) {
      for (var h = this.polygons, m = 0, k = h.length; m < k; m++) {
        if (this.intersectsSegmentPolygon(h[m], d, a, c, b)) {
          return this.boundingBoxes[m];
        }
      }
      return null;
    };
    u.prototype.intersectsSegmentPolygon = function(d, a, c, b, h) {
      for (var m = d.length, k = a - b, f = c - h, g = a * h - c * b, l = d[m - 2], p = d[m - 1], q = 0; q < m; q += 2) {
        var r = d[q], w = d[q + 1], t = l * w - p * r, v = l - r, x = p - w, z = k * x - f * v;
        v = (g * v - k * t) / z;
        if ((v >= l && v <= r || v >= r && v <= l) && (v >= a && v <= b || v >= b && v <= a) && (l = (g * x - f * t) / z, (l >= p && l <= w || l >= w && l <= p) && (l >= c && l <= h || l >= h && l <= c))) {
          return !0;
        }
        l = r;
        p = w;
      }
      return !1;
    };
    u.prototype.getPolygon = function(d) {
      if (d == null) {
        throw Error("boundingBox cannot be null.");
      }
      d = this.boundingBoxes.indexOf(d);
      return d == -1 ? null : this.polygons[d];
    };
    u.prototype.getWidth = function() {
      return this.maxX - this.minX;
    };
    u.prototype.getHeight = function() {
      return this.maxY - this.minY;
    };
    return u;
  }();
  n.SkeletonBounds = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u() {
      this.triangulator = new n.Triangulator();
      this.clippingPolygon = [];
      this.clipOutput = [];
      this.clippedVertices = [];
      this.clippedTriangles = [];
      this.scratch = [];
    }
    u.prototype.clipStart = function(d, a) {
      if (this.clipAttachment != null) {
        return 0;
      }
      this.clipAttachment = a;
      var c = a.worldVerticesLength, b = n.Utils.setArraySize(this.clippingPolygon, c);
      a.computeWorldVertices(d, 0, c, b, 0, 2);
      d = this.clippingPolygon;
      u.makeClockwise(d);
      d = this.clippingPolygons = this.triangulator.decompose(d, this.triangulator.triangulate(d));
      a = 0;
      for (c = d.length; a < c; a++) {
        b = d[a], u.makeClockwise(b), b.push(b[0]), b.push(b[1]);
      }
      return d.length;
    };
    u.prototype.clipEndWithSlot = function(d) {
      this.clipAttachment != null && this.clipAttachment.endSlot == d.data && this.clipEnd();
    };
    u.prototype.clipEnd = function() {
      this.clipAttachment != null && (this.clippingPolygons = this.clipAttachment = null, this.clippedVertices.length = 0, this.clippedTriangles.length = 0, this.clippingPolygon.length = 0);
    };
    u.prototype.isClipping = function() {
      return this.clipAttachment != null;
    };
    u.prototype.clipTriangles = function(d, a, c, b, h, m, k, f) {
      a = this.clipOutput;
      var g = this.clippedVertices, l = this.clippedTriangles, p = this.clippingPolygons, q = this.clippingPolygons.length, r = f ? 12 : 8, w = 0;
      g.length = 0;
      var t = l.length = 0;
      a: for (; t < b; t += 3) {
        var v = c[t] << 1, x = d[v], z = d[v + 1], y = h[v], A = h[v + 1];
        v = c[t + 1] << 1;
        var C = d[v], F = d[v + 1], H = h[v], D = h[v + 1];
        v = c[t + 2] << 1;
        var G = d[v], B = d[v + 1], I = h[v];
        v = h[v + 1];
        for (var J = 0; J < q; J++) {
          var E = g.length;
          if (this.clip(x, z, C, F, G, B, p[J], a)) {
            var L = a.length;
            if (L != 0) {
              for (var M = F - B, O = G - C, N = x - G, W = B - z, U = 1 / (M * N + O * (z - B)), S = L >> 1, V = this.clipOutput, K = n.Utils.setArraySize(g, E + S * r), P = 0; P < L; P += 2) {
                var Q = V[P], R = V[P + 1];
                K[E] = Q;
                K[E + 1] = R;
                K[E + 2] = m.r;
                K[E + 3] = m.g;
                K[E + 4] = m.b;
                K[E + 5] = m.a;
                Q -= G;
                var T = R - B;
                R = (M * Q + O * T) * U;
                Q = (W * Q + N * T) * U;
                T = 1 - R - Q;
                K[E + 6] = y * R + H * Q + I * T;
                K[E + 7] = A * R + D * Q + v * T;
                f && (K[E + 8] = k.r, K[E + 9] = k.g, K[E + 10] = k.b, K[E + 11] = k.a);
                E += r;
              }
              E = l.length;
              L = n.Utils.setArraySize(l, E + 3 * (S - 2));
              S--;
              for (P = 1; P < S; P++) {
                L[E] = w, L[E + 1] = w + P, L[E + 2] = w + P + 1, E += 3;
              }
              w += S + 1;
            }
          } else {
            K = n.Utils.setArraySize(g, E + 3 * r);
            K[E] = x;
            K[E + 1] = z;
            K[E + 2] = m.r;
            K[E + 3] = m.g;
            K[E + 4] = m.b;
            K[E + 5] = m.a;
            f ? (K[E + 6] = y, K[E + 7] = A, K[E + 8] = k.r, K[E + 9] = k.g, K[E + 10] = k.b, K[E + 11] = k.a, K[E + 12] = C, K[E + 13] = F, K[E + 14] = m.r, K[E + 15] = m.g, K[E + 16] = m.b, K[E + 17] = m.a, K[E + 18] = H, K[E + 19] = D, K[E + 20] = k.r, K[E + 21] = k.g, K[E + 22] = k.b, K[E + 23] = k.a, K[E + 24] = G, K[E + 25] = B, K[E + 26] = m.r, K[E + 27] = m.g, K[E + 28] = m.b, K[E + 29] = m.a, K[E + 30] = I, K[E + 31] = v, K[E + 32] = k.r, K[E + 33] = k.g, K[E + 34] = k.b, K[E + 35] = k.a) : 
            (K[E + 6] = y, K[E + 7] = A, K[E + 8] = C, K[E + 9] = F, K[E + 10] = m.r, K[E + 11] = m.g, K[E + 12] = m.b, K[E + 13] = m.a, K[E + 14] = H, K[E + 15] = D, K[E + 16] = G, K[E + 17] = B, K[E + 18] = m.r, K[E + 19] = m.g, K[E + 20] = m.b, K[E + 21] = m.a, K[E + 22] = I, K[E + 23] = v);
            E = l.length;
            L = n.Utils.setArraySize(l, E + 3);
            L[E] = w;
            L[E + 1] = w + 1;
            L[E + 2] = w + 2;
            w += 3;
            continue a;
          }
        }
      }
    };
    u.prototype.clip = function(d, a, c, b, h, m, k, f) {
      var g = f, l = !1;
      if (k.length % 4 >= 2) {
        var p = f;
        f = this.scratch;
      } else {
        p = this.scratch;
      }
      p.length = 0;
      p.push(d);
      p.push(a);
      p.push(c);
      p.push(b);
      p.push(h);
      p.push(m);
      p.push(d);
      p.push(a);
      f.length = 0;
      a = k.length - 4;
      for (d = 0;; d += 2) {
        c = k[d];
        b = k[d + 1];
        h = k[d + 2];
        m = k[d + 3];
        for (var q = c - h, r = b - m, w = p, t = p.length - 2, v = f.length, x = 0; x < t; x += 2) {
          var z = w[x], y = w[x + 1], A = w[x + 2], C = w[x + 3], F = q * (C - m) - r * (A - h) > 0;
          if (q * (y - m) - r * (z - h) > 0) {
            if (F) {
              f.push(A);
              f.push(C);
              continue;
            }
            l = C - y;
            F = A - z;
            var H = l * (h - c) - F * (m - b);
            Math.abs(H) > 1e-6 ? (l = (F * (b - y) - l * (c - z)) / H, f.push(c + (h - c) * l), f.push(b + (m - b) * l)) : (f.push(c), f.push(b));
          } else {
            F && (l = C - y, F = A - z, H = l * (h - c) - F * (m - b), Math.abs(H) > 1e-6 ? (l = (F * (b - y) - l * (c - z)) / H, f.push(c + (h - c) * l), f.push(b + (m - b) * l)) : (f.push(c), f.push(b)), f.push(A), f.push(C));
          }
          l = !0;
        }
        if (v == f.length) {
          return g.length = 0, !0;
        }
        f.push(f[0]);
        f.push(f[1]);
        if (d == a) {
          break;
        }
        c = f;
        f = p;
        f.length = 0;
        p = c;
      }
      if (g != f) {
        for (d = g.length = 0, k = f.length - 2; d < k; d++) {
          g[d] = f[d];
        }
      } else {
        g.length -= 2;
      }
      return l;
    };
    u.makeClockwise = function(d) {
      for (var a = d.length, c = d[a - 2] * d[1] - d[0] * d[a - 1], b, h, m, k, f = 0, g = a - 3; f < g; f += 2) {
        b = d[f], h = d[f + 1], m = d[f + 2], k = d[f + 3], c += b * k - m * h;
      }
      if (!(c < 0)) {
        for (f = 0, c = a - 2, g = a >> 1; f < g; f += 2) {
          a = d[f], b = d[f + 1], h = c - f, d[f] = d[h], d[f + 1] = d[h + 1], d[h] = a, d[h + 1] = b;
        }
      }
    };
    return u;
  }();
  n.SkeletonClipping = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u() {
      this.bones = [];
      this.slots = [];
      this.skins = [];
      this.events = [];
      this.animations = [];
      this.ikConstraints = [];
      this.transformConstraints = [];
      this.pathConstraints = [];
      this.fps = 0;
    }
    u.prototype.findBone = function(d) {
      if (d == null) {
        throw Error("boneName cannot be null.");
      }
      for (var a = this.bones, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.findBoneIndex = function(d) {
      if (d == null) {
        throw Error("boneName cannot be null.");
      }
      for (var a = this.bones, c = 0, b = a.length; c < b; c++) {
        if (a[c].name == d) {
          return c;
        }
      }
      return -1;
    };
    u.prototype.findSlot = function(d) {
      if (d == null) {
        throw Error("slotName cannot be null.");
      }
      for (var a = this.slots, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.findSlotIndex = function(d) {
      if (d == null) {
        throw Error("slotName cannot be null.");
      }
      for (var a = this.slots, c = 0, b = a.length; c < b; c++) {
        if (a[c].name == d) {
          return c;
        }
      }
      return -1;
    };
    u.prototype.findSkin = function(d) {
      if (d == null) {
        throw Error("skinName cannot be null.");
      }
      for (var a = this.skins, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.findEvent = function(d) {
      if (d == null) {
        throw Error("eventDataName cannot be null.");
      }
      for (var a = this.events, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.findAnimation = function(d) {
      if (d == null) {
        throw Error("animationName cannot be null.");
      }
      for (var a = this.animations, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.findIkConstraint = function(d) {
      if (d == null) {
        throw Error("constraintName cannot be null.");
      }
      for (var a = this.ikConstraints, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.findTransformConstraint = function(d) {
      if (d == null) {
        throw Error("constraintName cannot be null.");
      }
      for (var a = this.transformConstraints, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.findPathConstraint = function(d) {
      if (d == null) {
        throw Error("constraintName cannot be null.");
      }
      for (var a = this.pathConstraints, c = 0, b = a.length; c < b; c++) {
        var h = a[c];
        if (h.name == d) {
          return h;
        }
      }
      return null;
    };
    u.prototype.findPathConstraintIndex = function(d) {
      if (d == null) {
        throw Error("pathConstraintName cannot be null.");
      }
      for (var a = this.pathConstraints, c = 0, b = a.length; c < b; c++) {
        if (a[c].name == d) {
          return c;
        }
      }
      return -1;
    };
    return u;
  }();
  n.SkeletonData = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function d(a) {
      this.scale = 1;
      this.linkedMeshes = [];
      this.attachmentLoader = a;
    }
    d.prototype.readSkeletonData = function(a) {
      var c = this.scale, b = new n.SkeletonData();
      a = typeof a === "string" ? JSON.parse(a) : a;
      var h = a.skeleton;
      if (h != null) {
        b.hash = h.hash;
        b.version = h.spine;
        if ("3.8.75" == b.version) {
          throw Error("Unsupported skeleton data, please export with a newer version of Spine.");
        }
        b.x = h.x;
        b.y = h.y;
        b.width = h.width;
        b.height = h.height;
        b.fps = h.fps;
        b.imagesPath = h.images;
      }
      if (a.bones) {
        for (h = 0; h < a.bones.length; h++) {
          var m = a.bones[h], k = null, f = this.getValue(m, "parent", null);
          if (f != null && (k = b.findBone(f), k == null)) {
            throw Error("Parent bone not found: " + f);
          }
          k = new n.BoneData(b.bones.length, m.name, k);
          k.length = this.getValue(m, "length", 0) * c;
          k.x = this.getValue(m, "x", 0) * c;
          k.y = this.getValue(m, "y", 0) * c;
          k.rotation = this.getValue(m, "rotation", 0);
          k.scaleX = this.getValue(m, "scaleX", 1);
          k.scaleY = this.getValue(m, "scaleY", 1);
          k.shearX = this.getValue(m, "shearX", 0);
          k.shearY = this.getValue(m, "shearY", 0);
          k.transformMode = d.transformModeFromString(this.getValue(m, "transform", "normal"));
          k.skinRequired = this.getValue(m, "skin", !1);
          b.bones.push(k);
        }
      }
      if (a.slots) {
        for (h = 0; h < a.slots.length; h++) {
          m = a.slots[h];
          var g = m.name;
          f = m.bone;
          k = b.findBone(f);
          if (k == null) {
            throw Error("Slot bone not found: " + f);
          }
          k = new n.SlotData(b.slots.length, g, k);
          f = this.getValue(m, "color", null);
          f != null && k.color.setFromString(f);
          f = this.getValue(m, "dark", null);
          f != null && (k.darkColor = new n.Color(1, 1, 1, 1), k.darkColor.setFromString(f));
          k.attachmentName = this.getValue(m, "attachment", null);
          k.blendMode = d.blendModeFromString(this.getValue(m, "blend", "normal"));
          b.slots.push(k);
        }
      }
      if (a.ik) {
        for (h = 0; h < a.ik.length; h++) {
          var l = a.ik[h];
          k = new n.IkConstraintData(l.name);
          k.order = this.getValue(l, "order", 0);
          k.skinRequired = this.getValue(l, "skin", !1);
          for (var p = 0; p < l.bones.length; p++) {
            f = l.bones[p];
            m = b.findBone(f);
            if (m == null) {
              throw Error("IK bone not found: " + f);
            }
            k.bones.push(m);
          }
          m = l.target;
          k.target = b.findBone(m);
          if (k.target == null) {
            throw Error("IK target bone not found: " + m);
          }
          k.mix = this.getValue(l, "mix", 1);
          k.softness = this.getValue(l, "softness", 0) * c;
          k.bendDirection = this.getValue(l, "bendPositive", !0) ? 1 : -1;
          k.compress = this.getValue(l, "compress", !1);
          k.stretch = this.getValue(l, "stretch", !1);
          k.uniform = this.getValue(l, "uniform", !1);
          b.ikConstraints.push(k);
        }
      }
      if (a.transform) {
        for (h = 0; h < a.transform.length; h++) {
          l = a.transform[h];
          k = new n.TransformConstraintData(l.name);
          k.order = this.getValue(l, "order", 0);
          k.skinRequired = this.getValue(l, "skin", !1);
          for (p = 0; p < l.bones.length; p++) {
            f = l.bones[p];
            m = b.findBone(f);
            if (m == null) {
              throw Error("Transform constraint bone not found: " + f);
            }
            k.bones.push(m);
          }
          m = l.target;
          k.target = b.findBone(m);
          if (k.target == null) {
            throw Error("Transform constraint target bone not found: " + m);
          }
          k.local = this.getValue(l, "local", !1);
          k.relative = this.getValue(l, "relative", !1);
          k.offsetRotation = this.getValue(l, "rotation", 0);
          k.offsetX = this.getValue(l, "x", 0) * c;
          k.offsetY = this.getValue(l, "y", 0) * c;
          k.offsetScaleX = this.getValue(l, "scaleX", 0);
          k.offsetScaleY = this.getValue(l, "scaleY", 0);
          k.offsetShearY = this.getValue(l, "shearY", 0);
          k.rotateMix = this.getValue(l, "rotateMix", 1);
          k.translateMix = this.getValue(l, "translateMix", 1);
          k.scaleMix = this.getValue(l, "scaleMix", 1);
          k.shearMix = this.getValue(l, "shearMix", 1);
          b.transformConstraints.push(k);
        }
      }
      if (a.path) {
        for (h = 0; h < a.path.length; h++) {
          l = a.path[h];
          k = new n.PathConstraintData(l.name);
          k.order = this.getValue(l, "order", 0);
          k.skinRequired = this.getValue(l, "skin", !1);
          for (p = 0; p < l.bones.length; p++) {
            f = l.bones[p];
            m = b.findBone(f);
            if (m == null) {
              throw Error("Transform constraint bone not found: " + f);
            }
            k.bones.push(m);
          }
          m = l.target;
          k.target = b.findSlot(m);
          if (k.target == null) {
            throw Error("Path target slot not found: " + m);
          }
          k.positionMode = d.positionModeFromString(this.getValue(l, "positionMode", "percent"));
          k.spacingMode = d.spacingModeFromString(this.getValue(l, "spacingMode", "length"));
          k.rotateMode = d.rotateModeFromString(this.getValue(l, "rotateMode", "tangent"));
          k.offsetRotation = this.getValue(l, "rotation", 0);
          k.position = this.getValue(l, "position", 0);
          k.positionMode == n.PositionMode.Fixed && (k.position *= c);
          k.spacing = this.getValue(l, "spacing", 0);
          if (k.spacingMode == n.SpacingMode.Length || k.spacingMode == n.SpacingMode.Fixed) {
            k.spacing *= c;
          }
          k.rotateMix = this.getValue(l, "rotateMix", 1);
          k.translateMix = this.getValue(l, "translateMix", 1);
          b.pathConstraints.push(k);
        }
      }
      if (a.skins) {
        for (h = 0; h < a.skins.length; h++) {
          k = a.skins[h];
          c = new n.Skin(k.name);
          if (k.bones) {
            for (f = 0; f < k.bones.length; f++) {
              m = b.findBone(k.bones[f]);
              if (m == null) {
                throw Error("Skin bone not found: " + k.bones[h]);
              }
              c.bones.push(m);
            }
          }
          if (k.ik) {
            for (f = 0; f < k.ik.length; f++) {
              m = b.findIkConstraint(k.ik[f]);
              if (m == null) {
                throw Error("Skin IK constraint not found: " + k.ik[h]);
              }
              c.constraints.push(m);
            }
          }
          if (k.transform) {
            for (f = 0; f < k.transform.length; f++) {
              m = b.findTransformConstraint(k.transform[f]);
              if (m == null) {
                throw Error("Skin transform constraint not found: " + k.transform[h]);
              }
              c.constraints.push(m);
            }
          }
          if (k.path) {
            for (f = 0; f < k.path.length; f++) {
              m = b.findPathConstraint(k.path[f]);
              if (m == null) {
                throw Error("Skin path constraint not found: " + k.path[h]);
              }
              c.constraints.push(m);
            }
          }
          for (g in k.attachments) {
            f = b.findSlot(g);
            if (f == null) {
              throw Error("Slot not found: " + g);
            }
            m = k.attachments[g];
            for (var q in m) {
              l = this.readAttachment(m[q], c, f.index, q, b), l != null && c.setAttachment(f.index, q, l);
            }
          }
          b.skins.push(c);
          c.name == "default" && (b.defaultSkin = c);
        }
      }
      h = 0;
      for (g = this.linkedMeshes.length; h < g; h++) {
        q = this.linkedMeshes[h];
        c = q.skin == null ? b.defaultSkin : b.findSkin(q.skin);
        if (c == null) {
          throw Error("Skin not found: " + q.skin);
        }
        c = c.getAttachment(q.slotIndex, q.parent);
        if (c == null) {
          throw Error("Parent mesh not found: " + q.parent);
        }
        q.mesh.deformAttachment = q.inheritDeform ? c : q.mesh;
        q.mesh.setParentMesh(c);
        q.mesh.updateUVs();
      }
      this.linkedMeshes.length = 0;
      if (a.events) {
        for (var r in a.events) {
          h = a.events[r], k = new n.EventData(r), k.intValue = this.getValue(h, "int", 0), k.floatValue = this.getValue(h, "float", 0), k.stringValue = this.getValue(h, "string", ""), k.audioPath = this.getValue(h, "audio", null), k.audioPath != null && (k.volume = this.getValue(h, "volume", 1), k.balance = this.getValue(h, "balance", 0)), b.events.push(k);
        }
      }
      if (a.animations) {
        for (var w in a.animations) {
          this.readAnimation(a.animations[w], w, b);
        }
      }
      return b;
    };
    d.prototype.readAttachment = function(a, c, b, h, m) {
      var k = this.scale;
      h = this.getValue(a, "name", h);
      switch(this.getValue(a, "type", "region")) {
        case "region":
          m = this.getValue(a, "path", h);
          b = this.attachmentLoader.newRegionAttachment(c, h, m);
          if (b == null) {
            break;
          }
          b.path = m;
          b.x = this.getValue(a, "x", 0) * k;
          b.y = this.getValue(a, "y", 0) * k;
          b.scaleX = this.getValue(a, "scaleX", 1);
          b.scaleY = this.getValue(a, "scaleY", 1);
          b.rotation = this.getValue(a, "rotation", 0);
          b.width = a.width * k;
          b.height = a.height * k;
          c = this.getValue(a, "color", null);
          c != null && b.color.setFromString(c);
          b.updateOffset();
          return b;
        case "boundingbox":
          k = this.attachmentLoader.newBoundingBoxAttachment(c, h);
          if (k == null) {
            break;
          }
          this.readVertices(a, k, a.vertexCount << 1);
          c = this.getValue(a, "color", null);
          c != null && k.color.setFromString(c);
          return k;
        case "mesh":
        case "linkedmesh":
          m = this.getValue(a, "path", h);
          h = this.attachmentLoader.newMeshAttachment(c, h, m);
          if (h == null) {
            break;
          }
          h.path = m;
          c = this.getValue(a, "color", null);
          c != null && h.color.setFromString(c);
          h.width = this.getValue(a, "width", 0) * k;
          h.height = this.getValue(a, "height", 0) * k;
          k = this.getValue(a, "parent", null);
          if (k != null) {
            return this.linkedMeshes.push(new u(h, this.getValue(a, "skin", null), b, k, this.getValue(a, "deform", !0))), h;
          }
          k = a.uvs;
          this.readVertices(a, h, k.length);
          h.triangles = a.triangles;
          h.regionUVs = k;
          h.updateUVs();
          h.edges = this.getValue(a, "edges", null);
          h.hullLength = this.getValue(a, "hull", 0) * 2;
          return h;
        case "path":
          m = this.attachmentLoader.newPathAttachment(c, h);
          if (m == null) {
            break;
          }
          m.closed = this.getValue(a, "closed", !1);
          m.constantSpeed = this.getValue(a, "constantSpeed", !0);
          b = a.vertexCount;
          this.readVertices(a, m, b << 1);
          b = n.Utils.newArray(b / 3, 0);
          for (c = 0; c < a.lengths.length; c++) {
            b[c] = a.lengths[c] * k;
          }
          m.lengths = b;
          c = this.getValue(a, "color", null);
          c != null && m.color.setFromString(c);
          return m;
        case "point":
          m = this.attachmentLoader.newPointAttachment(c, h);
          if (m == null) {
            break;
          }
          m.x = this.getValue(a, "x", 0) * k;
          m.y = this.getValue(a, "y", 0) * k;
          m.rotation = this.getValue(a, "rotation", 0);
          c = this.getValue(a, "color", null);
          c != null && m.color.setFromString(c);
          return m;
        case "clipping":
          if (k = this.attachmentLoader.newClippingAttachment(c, h), k != null) {
            b = this.getValue(a, "end", null);
            if (b != null) {
              m = m.findSlot(b);
              if (m == null) {
                throw Error("Clipping end slot not found: " + b);
              }
              k.endSlot = m;
            }
            b = a.vertexCount;
            this.readVertices(a, k, b << 1);
            c = this.getValue(a, "color", null);
            c != null && k.color.setFromString(c);
            return k;
          }
      }
      return null;
    };
    d.prototype.readVertices = function(a, c, b) {
      var h = this.scale;
      c.worldVerticesLength = b;
      a = a.vertices;
      if (b == a.length) {
        var m = n.Utils.toFloatArray(a);
        if (h != 1) {
          b = 0;
          for (var k = a.length; b < k; b++) {
            m[b] *= h;
          }
        }
        c.vertices = m;
      } else {
        m = [];
        var f = [];
        b = 0;
        for (k = a.length; b < k;) {
          var g = a[b++];
          f.push(g);
          for (g = b + g * 4; b < g; b += 4) {
            f.push(a[b]), m.push(a[b + 1] * h), m.push(a[b + 2] * h), m.push(a[b + 3]);
          }
        }
        c.bones = f;
        c.vertices = n.Utils.toFloatArray(m);
      }
    };
    d.prototype.readAnimation = function(a, c, b) {
      var h = this.scale, m = [], k = 0;
      if (a.slots) {
        for (var f in a.slots) {
          var g = a.slots[f], l = b.findSlotIndex(f);
          if (l == -1) {
            throw Error("Slot not found: " + f);
          }
          for (var p in g) {
            var q = g[p];
            if (p == "attachment") {
              var r = new n.AttachmentTimeline(q.length);
              r.slotIndex = l;
              for (var w = 0, t = 0; t < q.length; t++) {
                var v = q[t];
                r.setFrame(w++, this.getValue(v, "time", 0), v.name);
              }
              m.push(r);
              k = Math.max(k, r.frames[r.getFrameCount() - 1]);
            } else if (p == "color") {
              r = new n.ColorTimeline(q.length);
              r.slotIndex = l;
              for (t = w = 0; t < q.length; t++) {
                v = q[t];
                var x = new n.Color();
                x.setFromString(v.color);
                r.setFrame(w, this.getValue(v, "time", 0), x.r, x.g, x.b, x.a);
                this.readCurve(v, r, w);
                w++;
              }
              m.push(r);
              k = Math.max(k, r.frames[(r.getFrameCount() - 1) * n.ColorTimeline.ENTRIES]);
            } else if (p == "twoColor") {
              r = new n.TwoColorTimeline(q.length);
              r.slotIndex = l;
              for (t = w = 0; t < q.length; t++) {
                v = q[t];
                x = new n.Color();
                var z = new n.Color();
                x.setFromString(v.light);
                z.setFromString(v.dark);
                r.setFrame(w, this.getValue(v, "time", 0), x.r, x.g, x.b, x.a, z.r, z.g, z.b);
                this.readCurve(v, r, w);
                w++;
              }
              m.push(r);
              k = Math.max(k, r.frames[(r.getFrameCount() - 1) * n.TwoColorTimeline.ENTRIES]);
            } else {
              throw Error("Invalid timeline type for a slot: " + p + " (" + f + ")");
            }
          }
        }
      }
      if (a.bones) {
        for (var y in a.bones) {
          g = a.bones[y];
          x = b.findBoneIndex(y);
          if (x == -1) {
            throw Error("Bone not found: " + y);
          }
          for (p in g) {
            if (q = g[p], p === "rotate") {
              r = new n.RotateTimeline(q.length);
              r.boneIndex = x;
              for (t = w = 0; t < q.length; t++) {
                v = q[t], r.setFrame(w, this.getValue(v, "time", 0), this.getValue(v, "angle", 0)), this.readCurve(v, r, w), w++;
              }
              m.push(r);
              k = Math.max(k, r.frames[(r.getFrameCount() - 1) * n.RotateTimeline.ENTRIES]);
            } else if (p === "translate" || p === "scale" || p === "shear") {
              l = 1;
              z = 0;
              p === "scale" ? (r = new n.ScaleTimeline(q.length), z = 1) : p === "shear" ? r = new n.ShearTimeline(q.length) : (r = new n.TranslateTimeline(q.length), l = h);
              r.boneIndex = x;
              for (t = w = 0; t < q.length; t++) {
                v = q[t];
                var A = this.getValue(v, "x", z), C = this.getValue(v, "y", z);
                r.setFrame(w, this.getValue(v, "time", 0), A * l, C * l);
                this.readCurve(v, r, w);
                w++;
              }
              m.push(r);
              k = Math.max(k, r.frames[(r.getFrameCount() - 1) * n.TranslateTimeline.ENTRIES]);
            } else {
              throw Error("Invalid timeline type for a bone: " + p + " (" + y + ")");
            }
          }
        }
      }
      if (a.ik) {
        for (var F in a.ik) {
          g = a.ik[F];
          w = b.findIkConstraint(F);
          r = new n.IkConstraintTimeline(g.length);
          r.ikConstraintIndex = b.ikConstraints.indexOf(w);
          for (t = w = 0; t < g.length; t++) {
            v = g[t], r.setFrame(w, this.getValue(v, "time", 0), this.getValue(v, "mix", 1), this.getValue(v, "softness", 0) * h, this.getValue(v, "bendPositive", !0) ? 1 : -1, this.getValue(v, "compress", !1), this.getValue(v, "stretch", !1)), this.readCurve(v, r, w), w++;
          }
          m.push(r);
          k = Math.max(k, r.frames[(r.getFrameCount() - 1) * n.IkConstraintTimeline.ENTRIES]);
        }
      }
      if (a.transform) {
        for (F in a.transform) {
          g = a.transform[F];
          w = b.findTransformConstraint(F);
          r = new n.TransformConstraintTimeline(g.length);
          r.transformConstraintIndex = b.transformConstraints.indexOf(w);
          for (t = w = 0; t < g.length; t++) {
            v = g[t], r.setFrame(w, this.getValue(v, "time", 0), this.getValue(v, "rotateMix", 1), this.getValue(v, "translateMix", 1), this.getValue(v, "scaleMix", 1), this.getValue(v, "shearMix", 1)), this.readCurve(v, r, w), w++;
          }
          m.push(r);
          k = Math.max(k, r.frames[(r.getFrameCount() - 1) * n.TransformConstraintTimeline.ENTRIES]);
        }
      }
      if (a.path) {
        for (F in a.path) {
          g = a.path[F];
          y = b.findPathConstraintIndex(F);
          if (y == -1) {
            throw Error("Path constraint not found: " + F);
          }
          x = b.pathConstraints[y];
          for (p in g) {
            if (q = g[p], p === "position" || p === "spacing") {
              l = 1;
              if (p === "spacing") {
                if (r = new n.PathConstraintSpacingTimeline(q.length), x.spacingMode == n.SpacingMode.Length || x.spacingMode == n.SpacingMode.Fixed) {
                  l = h;
                }
              } else {
                r = new n.PathConstraintPositionTimeline(q.length), x.positionMode == n.PositionMode.Fixed && (l = h);
              }
              r.pathConstraintIndex = y;
              for (t = w = 0; t < q.length; t++) {
                v = q[t], r.setFrame(w, this.getValue(v, "time", 0), this.getValue(v, p, 0) * l), this.readCurve(v, r, w), w++;
              }
              m.push(r);
              k = Math.max(k, r.frames[(r.getFrameCount() - 1) * n.PathConstraintPositionTimeline.ENTRIES]);
            } else if (p === "mix") {
              r = new n.PathConstraintMixTimeline(q.length);
              r.pathConstraintIndex = y;
              for (t = w = 0; t < q.length; t++) {
                v = q[t], r.setFrame(w, this.getValue(v, "time", 0), this.getValue(v, "rotateMix", 1), this.getValue(v, "translateMix", 1)), this.readCurve(v, r, w), w++;
              }
              m.push(r);
              k = Math.max(k, r.frames[(r.getFrameCount() - 1) * n.PathConstraintMixTimeline.ENTRIES]);
            }
          }
        }
      }
      if (a.deform) {
        for (var H in a.deform) {
          y = a.deform[H];
          x = b.findSkin(H);
          if (x == null) {
            throw Error("Skin not found: " + H);
          }
          for (f in y) {
            g = y[f];
            l = b.findSlotIndex(f);
            if (l == -1) {
              throw Error("Slot not found: " + g.name);
            }
            for (p in g) {
              q = g[p];
              w = x.getAttachment(l, p);
              if (w == null) {
                throw Error("Deform attachment not found: " + q.name);
              }
              z = w.bones != null;
              A = w.vertices;
              C = z ? A.length / 3 * 2 : A.length;
              r = new n.DeformTimeline(q.length);
              r.slotIndex = l;
              r.attachment = w;
              for (F = w = 0; F < q.length; F++) {
                v = q[F];
                var D = this.getValue(v, "vertices", null);
                if (D == null) {
                  var G = z ? n.Utils.newFloatArray(C) : A;
                } else {
                  G = n.Utils.newFloatArray(C);
                  t = this.getValue(v, "offset", 0);
                  n.Utils.arrayCopy(D, 0, G, t, D.length);
                  if (h != 1) {
                    for (D = t + D.length; t < D; t++) {
                      G[t] *= h;
                    }
                  }
                  if (!z) {
                    for (t = 0; t < C; t++) {
                      G[t] += A[t];
                    }
                  }
                }
                r.setFrame(w, this.getValue(v, "time", 0), G);
                this.readCurve(v, r, w);
                w++;
              }
              m.push(r);
              k = Math.max(k, r.frames[r.getFrameCount() - 1]);
            }
          }
        }
      }
      h = a.drawOrder;
      h == null && (h = a.draworder);
      if (h != null) {
        r = new n.DrawOrderTimeline(h.length);
        f = b.slots.length;
        for (F = w = 0; F < h.length; F++) {
          p = h[F];
          H = null;
          q = this.getValue(p, "offsets", null);
          if (q != null) {
            H = n.Utils.newArray(f, -1);
            v = n.Utils.newArray(f - q.length, 0);
            for (t = y = g = 0; t < q.length; t++) {
              x = q[t];
              l = b.findSlotIndex(x.slot);
              if (l == -1) {
                throw Error("Slot not found: " + x.slot);
              }
              for (; g != l;) {
                v[y++] = g++;
              }
              H[g + x.offset] = g++;
            }
            for (; g < f;) {
              v[y++] = g++;
            }
            for (t = f - 1; t >= 0; t--) {
              H[t] == -1 && (H[t] = v[--y]);
            }
          }
          r.setFrame(w++, this.getValue(p, "time", 0), H);
        }
        m.push(r);
        k = Math.max(k, r.frames[r.getFrameCount() - 1]);
      }
      if (a.events) {
        r = new n.EventTimeline(a.events.length);
        for (t = w = 0; t < a.events.length; t++) {
          h = a.events[t];
          f = b.findEvent(h.name);
          if (f == null) {
            throw Error("Event not found: " + h.name);
          }
          p = new n.Event(n.Utils.toSinglePrecision(this.getValue(h, "time", 0)), f);
          p.intValue = this.getValue(h, "int", f.intValue);
          p.floatValue = this.getValue(h, "float", f.floatValue);
          p.stringValue = this.getValue(h, "string", f.stringValue);
          p.data.audioPath != null && (p.volume = this.getValue(h, "volume", 1), p.balance = this.getValue(h, "balance", 0));
          r.setFrame(w++, p);
        }
        m.push(r);
        k = Math.max(k, r.frames[r.getFrameCount() - 1]);
      }
      if (isNaN(k)) {
        throw Error("Error while parsing animation, duration is NaN");
      }
      b.animations.push(new n.Animation(c, m, k));
    };
    d.prototype.readCurve = function(a, c, b) {
      a.hasOwnProperty("curve") && (a.curve == "stepped" ? c.setStepped(b) : c.setCurve(b, a.curve, this.getValue(a, "c2", 0), this.getValue(a, "c3", 1), this.getValue(a, "c4", 1)));
    };
    d.prototype.getValue = function(a, c, b) {
      return a[c] !== void 0 ? a[c] : b;
    };
    d.blendModeFromString = function(a) {
      a = a.toLowerCase();
      if (a == "normal") {
        return n.BlendMode.Normal;
      }
      if (a == "additive") {
        return n.BlendMode.Additive;
      }
      if (a == "multiply") {
        return n.BlendMode.Multiply;
      }
      if (a == "screen") {
        return n.BlendMode.Screen;
      }
      throw Error("Unknown blend mode: " + a);
    };
    d.positionModeFromString = function(a) {
      a = a.toLowerCase();
      if (a == "fixed") {
        return n.PositionMode.Fixed;
      }
      if (a == "percent") {
        return n.PositionMode.Percent;
      }
      throw Error("Unknown position mode: " + a);
    };
    d.spacingModeFromString = function(a) {
      a = a.toLowerCase();
      if (a == "length") {
        return n.SpacingMode.Length;
      }
      if (a == "fixed") {
        return n.SpacingMode.Fixed;
      }
      if (a == "percent") {
        return n.SpacingMode.Percent;
      }
      throw Error("Unknown position mode: " + a);
    };
    d.rotateModeFromString = function(a) {
      a = a.toLowerCase();
      if (a == "tangent") {
        return n.RotateMode.Tangent;
      }
      if (a == "chain") {
        return n.RotateMode.Chain;
      }
      if (a == "chainscale") {
        return n.RotateMode.ChainScale;
      }
      throw Error("Unknown rotate mode: " + a);
    };
    d.transformModeFromString = function(a) {
      a = a.toLowerCase();
      if (a == "normal") {
        return n.TransformMode.Normal;
      }
      if (a == "onlytranslation") {
        return n.TransformMode.OnlyTranslation;
      }
      if (a == "norotationorreflection") {
        return n.TransformMode.NoRotationOrReflection;
      }
      if (a == "noscale") {
        return n.TransformMode.NoScale;
      }
      if (a == "noscaleorreflection") {
        return n.TransformMode.NoScaleOrReflection;
      }
      throw Error("Unknown transform mode: " + a);
    };
    return d;
  }();
  n.SkeletonJson = e;
  var u = function() {
    return function(d, a, c, b, h) {
      this.mesh = d;
      this.skin = a;
      this.slotIndex = c;
      this.parent = b;
      this.inheritDeform = h;
    };
  }();
})(spine ||= {});
(function(n) {
  var e = function() {
    return function(d, a, c) {
      this.slotIndex = d;
      this.name = a;
      this.attachment = c;
    };
  }();
  n.SkinEntry = e;
  var u = function() {
    function d(a) {
      this.attachments = [];
      this.bones = [];
      this.constraints = [];
      if (a == null) {
        throw Error("name cannot be null.");
      }
      this.name = a;
    }
    d.prototype.setAttachment = function(a, c, b) {
      if (b == null) {
        throw Error("attachment cannot be null.");
      }
      var h = this.attachments;
      a >= h.length && (h.length = a + 1);
      h[a] || (h[a] = {});
      h[a][c] = b;
    };
    d.prototype.addSkin = function(a) {
      for (var c = 0; c < a.bones.length; c++) {
        for (var b = a.bones[c], h = !1, m = 0; m < this.bones.length; m++) {
          if (this.bones[m] == b) {
            h = !0;
            break;
          }
        }
        h || this.bones.push(b);
      }
      for (c = 0; c < a.constraints.length; c++) {
        b = a.constraints[c];
        h = !1;
        for (m = 0; m < this.constraints.length; m++) {
          if (this.constraints[m] == b) {
            h = !0;
            break;
          }
        }
        h || this.constraints.push(b);
      }
      a = a.getAttachments();
      for (c = 0; c < a.length; c++) {
        h = a[c], this.setAttachment(h.slotIndex, h.name, h.attachment);
      }
    };
    d.prototype.copySkin = function(a) {
      for (var c = 0; c < a.bones.length; c++) {
        for (var b = a.bones[c], h = !1, m = 0; m < this.bones.length; m++) {
          if (this.bones[m] == b) {
            h = !0;
            break;
          }
        }
        h || this.bones.push(b);
      }
      for (c = 0; c < a.constraints.length; c++) {
        b = a.constraints[c];
        h = !1;
        for (m = 0; m < this.constraints.length; m++) {
          if (this.constraints[m] == b) {
            h = !0;
            break;
          }
        }
        h || this.constraints.push(b);
      }
      a = a.getAttachments();
      for (c = 0; c < a.length; c++) {
        h = a[c], h.attachment != null && (h.attachment = h.attachment instanceof n.MeshAttachment ? h.attachment.newLinkedMesh() : h.attachment.copy(), this.setAttachment(h.slotIndex, h.name, h.attachment));
      }
    };
    d.prototype.getAttachment = function(a, c) {
      return (a = this.attachments[a]) ? a[c] : null;
    };
    d.prototype.removeAttachment = function(a, c) {
      (a = this.attachments[a]) && (a[c] = null);
    };
    d.prototype.getAttachments = function() {
      for (var a = [], c = 0; c < this.attachments.length; c++) {
        var b = this.attachments[c];
        if (b) {
          for (var h in b) {
            var m = b[h];
            m && a.push(new e(c, h, m));
          }
        }
      }
      return a;
    };
    d.prototype.getAttachmentsForSlot = function(a, c) {
      var b = this.attachments[a];
      if (b) {
        for (var h in b) {
          var m = b[h];
          m && c.push(new e(a, h, m));
        }
      }
    };
    d.prototype.clear = function() {
      this.attachments.length = 0;
      this.bones.length = 0;
      this.constraints.length = 0;
    };
    d.prototype.attachAll = function(a, c) {
      for (var b = 0, h = 0; h < a.slots.length; h++) {
        var m = a.slots[h], k = m.getAttachment();
        if (k && b < c.attachments.length) {
          var f = c.attachments[b], g;
          for (g in f) {
            if (k == f[g]) {
              k = this.getAttachment(b, g);
              k != null && m.setAttachment(k);
              break;
            }
          }
        }
        b++;
      }
    };
    return d;
  }();
  n.Skin = u;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u(d, a) {
      this.deform = [];
      if (d == null) {
        throw Error("data cannot be null.");
      }
      if (a == null) {
        throw Error("bone cannot be null.");
      }
      this.data = d;
      this.bone = a;
      this.color = new n.Color();
      this.darkColor = d.darkColor == null ? null : new n.Color();
      this.setToSetupPose();
    }
    u.prototype.getSkeleton = function() {
      return this.bone.skeleton;
    };
    u.prototype.getAttachment = function() {
      return this.attachment;
    };
    u.prototype.setAttachment = function(d) {
      this.attachment != d && (this.attachment = d, this.attachmentTime = this.bone.skeleton.time, this.deform.length = 0);
    };
    u.prototype.setAttachmentTime = function(d) {
      this.attachmentTime = this.bone.skeleton.time - d;
    };
    u.prototype.getAttachmentTime = function() {
      return this.bone.skeleton.time - this.attachmentTime;
    };
    u.prototype.setToSetupPose = function() {
      this.color.setFromColor(this.data.color);
      this.darkColor != null && this.darkColor.setFromColor(this.data.darkColor);
      this.data.attachmentName == null ? this.attachment = null : (this.attachment = null, this.setAttachment(this.bone.skeleton.getAttachment(this.data.index, this.data.attachmentName)));
    };
    return u;
  }();
  n.Slot = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    return function(u, d, a) {
      this.color = new n.Color(1, 1, 1, 1);
      if (u < 0) {
        throw Error("index must be >= 0.");
      }
      if (d == null) {
        throw Error("name cannot be null.");
      }
      if (a == null) {
        throw Error("boneData cannot be null.");
      }
      this.index = u;
      this.name = d;
      this.boneData = a;
    };
  }();
  n.SlotData = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function c(b) {
      this._image = b;
    }
    c.prototype.getImage = function() {
      return this._image;
    };
    c.filterFromString = function(b) {
      switch(b.toLowerCase()) {
        case "nearest":
          return u.Nearest;
        case "linear":
          return u.Linear;
        case "mipmap":
          return u.MipMap;
        case "mipmapnearestnearest":
          return u.MipMapNearestNearest;
        case "mipmaplinearnearest":
          return u.MipMapLinearNearest;
        case "mipmapnearestlinear":
          return u.MipMapNearestLinear;
        case "mipmaplinearlinear":
          return u.MipMapLinearLinear;
        default:
          throw Error("Unknown texture filter " + b);
      }
    };
    c.wrapFromString = function(b) {
      switch(b.toLowerCase()) {
        case "mirroredtepeat":
          return d.MirroredRepeat;
        case "clamptoedge":
          return d.ClampToEdge;
        case "repeat":
          return d.Repeat;
        default:
          throw Error("Unknown texture wrap " + b);
      }
    };
    return c;
  }();
  n.Texture = e;
  var u;
  (function(c) {
    c[c.Nearest = 9728] = "Nearest";
    c[c.Linear = 9729] = "Linear";
    c[c.MipMap = 9987] = "MipMap";
    c[c.MipMapNearestNearest = 9984] = "MipMapNearestNearest";
    c[c.MipMapLinearNearest = 9985] = "MipMapLinearNearest";
    c[c.MipMapNearestLinear = 9986] = "MipMapNearestLinear";
    c[c.MipMapLinearLinear = 9987] = "MipMapLinearLinear";
  })(u = n.TextureFilter || (n.TextureFilter = {}));
  var d;
  (function(c) {
    c[c.MirroredRepeat = 33648] = "MirroredRepeat";
    c[c.ClampToEdge = 33071] = "ClampToEdge";
    c[c.Repeat = 10497] = "Repeat";
  })(d = n.TextureWrap || (n.TextureWrap = {}));
  var a = function() {
    return function() {
      this.height = this.width = this.v2 = this.u2 = this.v = this.u = 0;
      this.rotate = !1;
      this.originalHeight = this.originalWidth = this.offsetY = this.offsetX = 0;
    };
  }();
  n.TextureRegion = a;
  e = function(c) {
    function b() {
      return c !== null && c.apply(this, arguments) || this;
    }
    __extends(b, c);
    b.prototype.setFilters = function(h, m) {
    };
    b.prototype.setWraps = function(h, m) {
    };
    b.prototype.dispose = function() {
    };
    return b;
  }(e);
  n.FakeTexture = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function c(b, h) {
      this.pages = [];
      this.regions = [];
      this.load(b, h);
    }
    c.prototype.load = function(b, h) {
      if (h == null) {
        throw Error("textureLoader cannot be null.");
      }
      b = new u(b);
      for (var m = Array(4), k = null;;) {
        var f = b.readLine();
        if (f == null) {
          break;
        }
        f = f.trim();
        if (f.length == 0) {
          k = null;
        } else if (k) {
          var g = new a();
          g.name = f;
          g.page = k;
          f = b.readValue();
          f.toLocaleLowerCase() == "true" ? g.degrees = 90 : f.toLocaleLowerCase() == "false" ? g.degrees = 0 : g.degrees = parseFloat(f);
          g.rotate = g.degrees == 90;
          b.readTuple(m);
          f = parseInt(m[0]);
          var l = parseInt(m[1]);
          b.readTuple(m);
          var p = parseInt(m[0]), q = parseInt(m[1]);
          g.u = f / k.width;
          g.v = l / k.height;
          g.rotate ? (g.u2 = (f + q) / k.width, g.v2 = (l + p) / k.height) : (g.u2 = (f + p) / k.width, g.v2 = (l + q) / k.height);
          g.x = f;
          g.y = l;
          g.width = Math.abs(p);
          g.height = Math.abs(q);
          b.readTuple(m) == 4 && b.readTuple(m) == 4 && b.readTuple(m);
          g.originalWidth = parseInt(m[0]);
          g.originalHeight = parseInt(m[1]);
          b.readTuple(m);
          g.offsetX = parseInt(m[0]);
          g.offsetY = parseInt(m[1]);
          g.index = parseInt(b.readValue());
          g.texture = k.texture;
          this.regions.push(g);
        } else {
          k = new d(), k.name = f, b.readTuple(m) == 2 && (k.width = parseInt(m[0]), k.height = parseInt(m[1]), b.readTuple(m)), b.readTuple(m), k.minFilter = n.Texture.filterFromString(m[0]), k.magFilter = n.Texture.filterFromString(m[1]), g = b.readValue(), k.uWrap = n.TextureWrap.ClampToEdge, k.vWrap = n.TextureWrap.ClampToEdge, g == "x" ? k.uWrap = n.TextureWrap.Repeat : g == "y" ? k.vWrap = n.TextureWrap.Repeat : g == "xy" && (k.uWrap = k.vWrap = n.TextureWrap.Repeat), k.texture = h(f), k.texture.setFilters(k.minFilter, 
          k.magFilter), k.texture.setWraps(k.uWrap, k.vWrap), k.width = k.texture.getImage().width, k.height = k.texture.getImage().height, this.pages.push(k);
        }
      }
    };
    c.prototype.findRegion = function(b) {
      for (var h = 0; h < this.regions.length; h++) {
        if (this.regions[h].name == b) {
          return this.regions[h];
        }
      }
      return null;
    };
    c.prototype.dispose = function() {
      for (var b = 0; b < this.pages.length; b++) {
        this.pages[b].texture.dispose();
      }
    };
    return c;
  }();
  n.TextureAtlas = e;
  var u = function() {
    function c(b) {
      this.index = 0;
      this.lines = b.split(/\r\n|\r|\n/);
    }
    c.prototype.readLine = function() {
      return this.index >= this.lines.length ? null : this.lines[this.index++];
    };
    c.prototype.readValue = function() {
      var b = this.readLine(), h = b.indexOf(":");
      if (h == -1) {
        throw Error("Invalid line: " + b);
      }
      return b.substring(h + 1).trim();
    };
    c.prototype.readTuple = function(b) {
      var h = this.readLine(), m = h.indexOf(":");
      if (m == -1) {
        throw Error("Invalid line: " + h);
      }
      var k = 0;
      for (m += 1; k < 3; k++) {
        var f = h.indexOf(",", m);
        if (f == -1) {
          break;
        }
        b[k] = h.substr(m, f - m).trim();
        m = f + 1;
      }
      b[k] = h.substring(m).trim();
      return k + 1;
    };
    return c;
  }(), d = function() {
    return function() {
    };
  }();
  n.TextureAtlasPage = d;
  var a = function(c) {
    function b() {
      return c !== null && c.apply(this, arguments) || this;
    }
    __extends(b, c);
    return b;
  }(n.TextureRegion);
  n.TextureAtlasRegion = a;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u(d, a) {
      this.shearMix = this.scaleMix = this.translateMix = this.rotateMix = 0;
      this.temp = new n.Vector2();
      this.active = !1;
      if (d == null) {
        throw Error("data cannot be null.");
      }
      if (a == null) {
        throw Error("skeleton cannot be null.");
      }
      this.data = d;
      this.rotateMix = d.rotateMix;
      this.translateMix = d.translateMix;
      this.scaleMix = d.scaleMix;
      this.shearMix = d.shearMix;
      this.bones = [];
      for (var c = 0; c < d.bones.length; c++) {
        this.bones.push(a.findBone(d.bones[c].name));
      }
      this.target = a.findBone(d.target.name);
    }
    u.prototype.isActive = function() {
      return this.active;
    };
    u.prototype.apply = function() {
      this.update();
    };
    u.prototype.update = function() {
      this.data.local ? this.data.relative ? this.applyRelativeLocal() : this.applyAbsoluteLocal() : this.data.relative ? this.applyRelativeWorld() : this.applyAbsoluteWorld();
    };
    u.prototype.applyAbsoluteWorld = function() {
      var d = this.rotateMix, a = this.translateMix, c = this.scaleMix, b = this.shearMix, h = this.target, m = h.a, k = h.b, f = h.c, g = h.d, l = m * g - k * f > 0 ? n.MathUtils.degRad : -n.MathUtils.degRad, p = this.data.offsetRotation * l;
      l *= this.data.offsetShearY;
      for (var q = this.bones, r = 0, w = q.length; r < w; r++) {
        var t = q[r], v = !1;
        if (d != 0) {
          var x = t.a;
          v = t.b;
          var z = t.c, y = t.d, A = Math.atan2(f, m) - Math.atan2(z, x) + p;
          A > n.MathUtils.PI ? A -= n.MathUtils.PI2 : A < -n.MathUtils.PI && (A += n.MathUtils.PI2);
          A *= d;
          var C = Math.cos(A);
          A = Math.sin(A);
          t.a = C * x - A * z;
          t.b = C * v - A * y;
          t.c = A * x + C * z;
          t.d = A * v + C * y;
          v = !0;
        }
        a != 0 && (v = this.temp, h.localToWorld(v.set(this.data.offsetX, this.data.offsetY)), t.worldX += (v.x - t.worldX) * a, t.worldY += (v.y - t.worldY) * a, v = !0);
        c > 0 && (v = Math.sqrt(t.a * t.a + t.c * t.c), y = Math.sqrt(m * m + f * f), v > 1e-5 && (v = (v + (y - v + this.data.offsetScaleX) * c) / v), t.a *= v, t.c *= v, v = Math.sqrt(t.b * t.b + t.d * t.d), y = Math.sqrt(k * k + g * g), v > 1e-5 && (v = (v + (y - v + this.data.offsetScaleY) * c) / v), t.b *= v, t.d *= v, v = !0);
        b > 0 && (v = t.b, y = t.d, x = Math.atan2(y, v), A = Math.atan2(g, k) - Math.atan2(f, m) - (x - Math.atan2(t.c, t.a)), A > n.MathUtils.PI ? A -= n.MathUtils.PI2 : A < -n.MathUtils.PI && (A += n.MathUtils.PI2), A = x + (A + l) * b, v = Math.sqrt(v * v + y * y), t.b = Math.cos(A) * v, t.d = Math.sin(A) * v, v = !0);
        v && (t.appliedValid = !1);
      }
    };
    u.prototype.applyRelativeWorld = function() {
      var d = this.rotateMix, a = this.translateMix, c = this.scaleMix, b = this.shearMix, h = this.target, m = h.a, k = h.b, f = h.c, g = h.d, l = m * g - k * f > 0 ? n.MathUtils.degRad : -n.MathUtils.degRad, p = this.data.offsetRotation * l;
      l *= this.data.offsetShearY;
      for (var q = this.bones, r = 0, w = q.length; r < w; r++) {
        var t = q[r], v = !1;
        if (d != 0) {
          v = t.a;
          var x = t.b, z = t.c, y = t.d, A = Math.atan2(f, m) + p;
          A > n.MathUtils.PI ? A -= n.MathUtils.PI2 : A < -n.MathUtils.PI && (A += n.MathUtils.PI2);
          A *= d;
          var C = Math.cos(A);
          A = Math.sin(A);
          t.a = C * v - A * z;
          t.b = C * x - A * y;
          t.c = A * v + C * z;
          t.d = A * x + C * y;
          v = !0;
        }
        a != 0 && (v = this.temp, h.localToWorld(v.set(this.data.offsetX, this.data.offsetY)), t.worldX += v.x * a, t.worldY += v.y * a, v = !0);
        c > 0 && (v = (Math.sqrt(m * m + f * f) - 1 + this.data.offsetScaleX) * c + 1, t.a *= v, t.c *= v, v = (Math.sqrt(k * k + g * g) - 1 + this.data.offsetScaleY) * c + 1, t.b *= v, t.d *= v, v = !0);
        b > 0 && (A = Math.atan2(g, k) - Math.atan2(f, m), A > n.MathUtils.PI ? A -= n.MathUtils.PI2 : A < -n.MathUtils.PI && (A += n.MathUtils.PI2), x = t.b, y = t.d, A = Math.atan2(y, x) + (A - n.MathUtils.PI / 2 + l) * b, v = Math.sqrt(x * x + y * y), t.b = Math.cos(A) * v, t.d = Math.sin(A) * v, v = !0);
        v && (t.appliedValid = !1);
      }
    };
    u.prototype.applyAbsoluteLocal = function() {
      var d = this.rotateMix, a = this.translateMix, c = this.scaleMix, b = this.shearMix, h = this.target;
      h.appliedValid || h.updateAppliedTransform();
      for (var m = this.bones, k = 0, f = m.length; k < f; k++) {
        var g = m[k];
        g.appliedValid || g.updateAppliedTransform();
        var l = g.arotation;
        if (d != 0) {
          var p = h.arotation - l + this.data.offsetRotation;
          p -= (16384 - (16384.499999999996 - p / 360 | 0)) * 360;
          l += p * d;
        }
        var q = g.ax, r = g.ay;
        a != 0 && (q += (h.ax - q + this.data.offsetX) * a, r += (h.ay - r + this.data.offsetY) * a);
        var w = g.ascaleX, t = g.ascaleY;
        c != 0 && (w > 1e-5 && (w = (w + (h.ascaleX - w + this.data.offsetScaleX) * c) / w), t > 1e-5 && (t = (t + (h.ascaleY - t + this.data.offsetScaleY) * c) / t));
        var v = g.ashearY;
        b != 0 && (p = h.ashearY - v + this.data.offsetShearY, p -= (16384 - (16384.499999999996 - p / 360 | 0)) * 360, g.shearY += p * b);
        g.updateWorldTransformWith(q, r, l, w, t, g.ashearX, v);
      }
    };
    u.prototype.applyRelativeLocal = function() {
      var d = this.rotateMix, a = this.translateMix, c = this.scaleMix, b = this.shearMix, h = this.target;
      h.appliedValid || h.updateAppliedTransform();
      for (var m = this.bones, k = 0, f = m.length; k < f; k++) {
        var g = m[k];
        g.appliedValid || g.updateAppliedTransform();
        var l = g.arotation;
        d != 0 && (l += (h.arotation + this.data.offsetRotation) * d);
        var p = g.ax, q = g.ay;
        a != 0 && (p += (h.ax + this.data.offsetX) * a, q += (h.ay + this.data.offsetY) * a);
        var r = g.ascaleX, w = g.ascaleY;
        c != 0 && (r > 1e-5 && (r *= (h.ascaleX - 1 + this.data.offsetScaleX) * c + 1), w > 1e-5 && (w *= (h.ascaleY - 1 + this.data.offsetScaleY) * c + 1));
        var t = g.ashearY;
        b != 0 && (t += (h.ashearY + this.data.offsetShearY) * b);
        g.updateWorldTransformWith(p, q, l, r, w, g.ashearX, t);
      }
    };
    return u;
  }();
  n.TransformConstraint = e;
})(spine ||= {});
(function(n) {
  var e = function(u) {
    function d(a) {
      a = u.call(this, a, 0, !1) || this;
      a.bones = [];
      a.rotateMix = 0;
      a.translateMix = 0;
      a.scaleMix = 0;
      a.shearMix = 0;
      a.offsetRotation = 0;
      a.offsetX = 0;
      a.offsetY = 0;
      a.offsetScaleX = 0;
      a.offsetScaleY = 0;
      a.offsetShearY = 0;
      a.relative = !1;
      a.local = !1;
      return a;
    }
    __extends(d, u);
    return d;
  }(n.ConstraintData);
  n.TransformConstraintData = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u() {
      this.convexPolygons = [];
      this.convexPolygonsIndices = [];
      this.indicesArray = [];
      this.isConcaveArray = [];
      this.triangles = [];
      this.polygonPool = new n.Pool(function() {
        return [];
      });
      this.polygonIndicesPool = new n.Pool(function() {
        return [];
      });
    }
    u.prototype.triangulate = function(d) {
      for (var a = d.length >> 1, c = this.indicesArray, b = c.length = 0; b < a; b++) {
        c[b] = b;
      }
      var h = this.isConcaveArray;
      b = h.length = 0;
      for (var m = a; b < m; ++b) {
        h[b] = u.isConcave(b, a, d, c);
      }
      m = this.triangles;
      for (m.length = 0; a > 3;) {
        var k = a - 1;
        b = 0;
        for (var f = 1;;) {
          a: {
            if (!h[b]) {
              var g = c[k] << 1, l = c[b] << 1, p = c[f] << 1, q = d[g];
              g = d[g + 1];
              var r = d[l];
              l = d[l + 1];
              var w = d[p];
              p = d[p + 1];
              for (var t = (f + 1) % a; t != k; t = (t + 1) % a) {
                if (h[t]) {
                  var v = c[t] << 1, x = d[v];
                  v = d[v + 1];
                  if (u.positiveArea(w, p, q, g, x, v) && u.positiveArea(q, g, r, l, x, v) && u.positiveArea(r, l, w, p, x, v)) {
                    break a;
                  }
                }
              }
              break;
            }
          }
          if (f == 0) {
            do {
              if (!h[b]) {
                break;
              }
              b--;
            } while (b > 0);
            break;
          }
          k = b;
          b = f;
          f = (f + 1) % a;
        }
        m.push(c[(a + b - 1) % a]);
        m.push(c[b]);
        m.push(c[(b + 1) % a]);
        c.splice(b, 1);
        h.splice(b, 1);
        a--;
        k = (a + b - 1) % a;
        b = b == a ? 0 : b;
        h[k] = u.isConcave(k, a, d, c);
        h[b] = u.isConcave(b, a, d, c);
      }
      a == 3 && (m.push(c[2]), m.push(c[0]), m.push(c[1]));
      return m;
    };
    u.prototype.decompose = function(d, a) {
      var c = this.convexPolygons;
      this.polygonPool.freeAll(c);
      c.length = 0;
      var b = this.convexPolygonsIndices;
      this.polygonIndicesPool.freeAll(b);
      b.length = 0;
      var h = this.polygonIndicesPool.obtain();
      h.length = 0;
      var m = this.polygonPool.obtain();
      m.length = 0;
      for (var k = -1, f = 0, g = 0, l = a.length; g < l; g += 3) {
        var p = a[g] << 1, q = a[g + 1] << 1, r = a[g + 2] << 1, w = d[p], t = d[p + 1], v = d[q], x = d[q + 1], z = d[r], y = d[r + 1], A = !1;
        if (k == p) {
          var C = m.length - 4;
          C = u.winding(m[C], m[C + 1], m[C + 2], m[C + 3], z, y);
          var F = u.winding(z, y, m[0], m[1], m[2], m[3]);
          C == f && F == f && (m.push(z), m.push(y), h.push(r), A = !0);
        }
        A || (m.length > 0 ? (c.push(m), b.push(h)) : (this.polygonPool.free(m), this.polygonIndicesPool.free(h)), m = this.polygonPool.obtain(), m.length = 0, m.push(w), m.push(t), m.push(v), m.push(x), m.push(z), m.push(y), h = this.polygonIndicesPool.obtain(), h.length = 0, h.push(p), h.push(q), h.push(r), f = u.winding(w, t, v, x, z, y), k = p);
      }
      m.length > 0 && (c.push(m), b.push(h));
      g = 0;
      for (l = c.length; g < l; g++) {
        if (h = b[g], h.length != 0) {
          for (d = h[0], a = h[h.length - 1], m = c[g], C = m.length - 4, k = m[C], f = m[C + 1], p = m[C + 2], q = m[C + 3], r = m[0], w = m[1], t = m[2], v = m[3], x = u.winding(k, f, p, q, r, w), A = 0; A < l; A++) {
            if (A != g) {
              var H = b[A];
              if (H.length == 3) {
                C = H[0];
                F = H[1];
                var D = H[2], G = c[A];
                z = G[G.length - 2];
                y = G[G.length - 1];
                C == d && F == a && (C = u.winding(k, f, p, q, z, y), F = u.winding(z, y, r, w, t, v), C == x && F == x && (G.length = 0, H.length = 0, m.push(z), m.push(y), h.push(D), k = p, f = q, p = z, q = y, A = 0));
              }
            }
          }
        }
      }
      for (g = c.length - 1; g >= 0; g--) {
        m = c[g], m.length == 0 && (c.splice(g, 1), this.polygonPool.free(m), h = b[g], b.splice(g, 1), this.polygonIndicesPool.free(h));
      }
      return c;
    };
    u.isConcave = function(d, a, c, b) {
      var h = b[(a + d - 1) % a] << 1, m = b[d] << 1;
      d = b[(d + 1) % a] << 1;
      return !this.positiveArea(c[h], c[h + 1], c[m], c[m + 1], c[d], c[d + 1]);
    };
    u.positiveArea = function(d, a, c, b, h, m) {
      return d * (m - b) + c * (a - m) + h * (b - a) >= 0;
    };
    u.winding = function(d, a, c, b, h, m) {
      c -= d;
      b -= a;
      return h * b - m * c + c * a - d * b >= 0 ? 1 : -1;
    };
    return u;
  }();
  n.Triangulator = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u() {
      this.array = [];
    }
    u.prototype.add = function(d) {
      var a = this.contains(d);
      this.array[d | 0] = d | 0;
      return !a;
    };
    u.prototype.contains = function(d) {
      return this.array[d | 0] != void 0;
    };
    u.prototype.remove = function(d) {
      this.array[d | 0] = void 0;
    };
    u.prototype.clear = function() {
      this.array.length = 0;
    };
    return u;
  }();
  n.IntSet = e;
  e = function() {
    function u(d, a, c, b) {
      d === void 0 && (d = 0);
      a === void 0 && (a = 0);
      c === void 0 && (c = 0);
      b === void 0 && (b = 0);
      this.r = d;
      this.g = a;
      this.b = c;
      this.a = b;
    }
    u.prototype.set = function(d, a, c, b) {
      this.r = d;
      this.g = a;
      this.b = c;
      this.a = b;
      this.clamp();
      return this;
    };
    u.prototype.setFromColor = function(d) {
      this.r = d.r;
      this.g = d.g;
      this.b = d.b;
      this.a = d.a;
      return this;
    };
    u.prototype.setFromString = function(d) {
      d = d.charAt(0) == "#" ? d.substr(1) : d;
      this.r = parseInt(d.substr(0, 2), 16) / 255;
      this.g = parseInt(d.substr(2, 2), 16) / 255;
      this.b = parseInt(d.substr(4, 2), 16) / 255;
      this.a = (d.length != 8 ? 255 : parseInt(d.substr(6, 2), 16)) / 255;
      return this;
    };
    u.prototype.add = function(d, a, c, b) {
      this.r += d;
      this.g += a;
      this.b += c;
      this.a += b;
      this.clamp();
      return this;
    };
    u.prototype.clamp = function() {
      this.r < 0 ? this.r = 0 : this.r > 1 && (this.r = 1);
      this.g < 0 ? this.g = 0 : this.g > 1 && (this.g = 1);
      this.b < 0 ? this.b = 0 : this.b > 1 && (this.b = 1);
      this.a < 0 ? this.a = 0 : this.a > 1 && (this.a = 1);
      return this;
    };
    u.rgba8888ToColor = function(d, a) {
      d.r = ((a & 4278190080) >>> 24) / 255;
      d.g = ((a & 16711680) >>> 16) / 255;
      d.b = ((a & 65280) >>> 8) / 255;
      d.a = (a & 255) / 255;
    };
    u.rgb888ToColor = function(d, a) {
      d.r = ((a & 16711680) >>> 16) / 255;
      d.g = ((a & 65280) >>> 8) / 255;
      d.b = (a & 255) / 255;
    };
    u.WHITE = new u(1, 1, 1, 1);
    u.RED = new u(1, 0, 0, 1);
    u.GREEN = new u(0, 1, 0, 1);
    u.BLUE = new u(0, 0, 1, 1);
    u.MAGENTA = new u(1, 0, 1, 1);
    return u;
  }();
  n.Color = e;
  e = function() {
    function u() {
    }
    u.clamp = function(d, a, c) {
      return d < a ? a : d > c ? c : d;
    };
    u.cosDeg = function(d) {
      return Math.cos(d * u.degRad);
    };
    u.sinDeg = function(d) {
      return Math.sin(d * u.degRad);
    };
    u.signum = function(d) {
      return d > 0 ? 1 : d < 0 ? -1 : 0;
    };
    u.toInt = function(d) {
      return d > 0 ? Math.floor(d) : Math.ceil(d);
    };
    u.cbrt = function(d) {
      var a = Math.pow(Math.abs(d), 1 / 3);
      return d < 0 ? -a : a;
    };
    u.randomTriangular = function(d, a) {
      return u.randomTriangularWith(d, a, (d + a) * 0.5);
    };
    u.randomTriangularWith = function(d, a, c) {
      var b = Math.random(), h = a - d;
      return b <= (c - d) / h ? d + Math.sqrt(b * h * (c - d)) : a - Math.sqrt((1 - b) * h * (a - c));
    };
    u.PI = 3.1415927;
    u.PI2 = u.PI * 2;
    u.radiansToDegrees = 180 / u.PI;
    u.radDeg = u.radiansToDegrees;
    u.degreesToRadians = u.PI / 180;
    u.degRad = u.degreesToRadians;
    return u;
  }();
  n.MathUtils = e;
  e = function() {
    function u() {
    }
    u.prototype.apply = function(d, a, c) {
      return d + (a - d) * this.applyInternal(c);
    };
    return u;
  }();
  n.Interpolation = e;
  e = function(u) {
    function d(a) {
      var c = u.call(this) || this;
      c.power = 2;
      c.power = a;
      return c;
    }
    __extends(d, u);
    d.prototype.applyInternal = function(a) {
      return a <= 0.5 ? Math.pow(a * 2, this.power) / 2 : Math.pow((a - 1) * 2, this.power) / (this.power % 2 == 0 ? -2 : 2) + 1;
    };
    return d;
  }(e);
  n.Pow = e;
  e = function(u) {
    function d(a) {
      return u.call(this, a) || this;
    }
    __extends(d, u);
    d.prototype.applyInternal = function(a) {
      return Math.pow(a - 1, this.power) * (this.power % 2 == 0 ? -1 : 1) + 1;
    };
    return d;
  }(e);
  n.PowOut = e;
  e = function() {
    function u() {
    }
    u.arrayCopy = function(d, a, c, b, h) {
      for (var m = a; m < a + h; m++, b++) {
        c[b] = d[m];
      }
    };
    u.setArraySize = function(d, a, c) {
      c === void 0 && (c = 0);
      var b = d.length;
      if (b == a) {
        return d;
      }
      d.length = a;
      if (b < a) {
        for (; b < a; b++) {
          d[b] = c;
        }
      }
      return d;
    };
    u.ensureArrayCapacity = function(d, a, c) {
      c === void 0 && (c = 0);
      return d.length >= a ? d : u.setArraySize(d, a, c);
    };
    u.newArray = function(d, a) {
      for (var c = Array(d), b = 0; b < d; b++) {
        c[b] = a;
      }
      return c;
    };
    u.newFloatArray = function(d) {
      if (u.SUPPORTS_TYPED_ARRAYS) {
        return new Float32Array(d);
      }
      d = Array(d);
      for (var a = 0; a < d.length; a++) {
        d[a] = 0;
      }
      return d;
    };
    u.newShortArray = function(d) {
      if (u.SUPPORTS_TYPED_ARRAYS) {
        return new Int16Array(d);
      }
      d = Array(d);
      for (var a = 0; a < d.length; a++) {
        d[a] = 0;
      }
      return d;
    };
    u.toFloatArray = function(d) {
      return u.SUPPORTS_TYPED_ARRAYS ? new Float32Array(d) : d;
    };
    u.toSinglePrecision = function(d) {
      return u.SUPPORTS_TYPED_ARRAYS ? Math.fround(d) : d;
    };
    u.webkit602BugfixHelper = function(d, a) {
    };
    u.contains = function(d, a, c) {
      for (c = 0; c < d.length; c++) {
        if (d[c] == a) {
          return !0;
        }
      }
      return !1;
    };
    u.SUPPORTS_TYPED_ARRAYS = typeof Float32Array !== "undefined";
    return u;
  }();
  n.Utils = e;
  e = function() {
    function u() {
    }
    u.logBones = function(d) {
      for (var a = 0; a < d.bones.length; a++) {
        var c = d.bones[a];
        console.log(c.data.name + ", " + c.a + ", " + c.b + ", " + c.c + ", " + c.d + ", " + c.worldX + ", " + c.worldY);
      }
    };
    return u;
  }();
  n.DebugUtils = e;
  e = function() {
    function u(d) {
      this.items = [];
      this.instantiator = d;
    }
    u.prototype.obtain = function() {
      return this.items.length > 0 ? this.items.pop() : this.instantiator();
    };
    u.prototype.free = function(d) {
      d.reset && d.reset();
      this.items.push(d);
    };
    u.prototype.freeAll = function(d) {
      for (var a = 0; a < d.length; a++) {
        this.free(d[a]);
      }
    };
    u.prototype.clear = function() {
      this.items.length = 0;
    };
    return u;
  }();
  n.Pool = e;
  e = function() {
    function u(d, a) {
      d === void 0 && (d = 0);
      a === void 0 && (a = 0);
      this.x = d;
      this.y = a;
    }
    u.prototype.set = function(d, a) {
      this.x = d;
      this.y = a;
      return this;
    };
    u.prototype.length = function() {
      var d = this.x, a = this.y;
      return Math.sqrt(d * d + a * a);
    };
    u.prototype.normalize = function() {
      var d = this.length();
      d != 0 && (this.x /= d, this.y /= d);
      return this;
    };
    return u;
  }();
  n.Vector2 = e;
  e = function() {
    function u() {
      this.maxDelta = 0.064;
      this.totalTime = this.delta = this.framesPerSecond = 0;
      this.lastTime = Date.now() / 1e3;
      this.frameTime = this.frameCount = 0;
    }
    u.prototype.update = function() {
      var d = Date.now() / 1e3;
      this.delta = d - this.lastTime;
      this.frameTime += this.delta;
      this.totalTime += this.delta;
      this.delta > this.maxDelta && (this.delta = this.maxDelta);
      this.lastTime = d;
      this.frameCount++;
      this.frameTime > 1 && (this.framesPerSecond = this.frameCount / this.frameTime, this.frameCount = this.frameTime = 0);
    };
    return u;
  }();
  n.TimeKeeper = e;
  e = function() {
    function u(d) {
      d === void 0 && (d = 32);
      this.mean = this.lastValue = this.addedValues = 0;
      this.dirty = !0;
      this.values = Array(d);
    }
    u.prototype.hasEnoughData = function() {
      return this.addedValues >= this.values.length;
    };
    u.prototype.addValue = function(d) {
      this.addedValues < this.values.length && this.addedValues++;
      this.values[this.lastValue++] = d;
      this.lastValue > this.values.length - 1 && (this.lastValue = 0);
      this.dirty = !0;
    };
    u.prototype.getMean = function() {
      if (this.hasEnoughData()) {
        if (this.dirty) {
          for (var d = 0, a = 0; a < this.values.length; a++) {
            d += this.values[a];
          }
          this.mean = d / this.values.length;
          this.dirty = !1;
        }
        return this.mean;
      }
      return 0;
    };
    return u;
  }();
  n.WindowedMean = e;
})(spine ||= {});
(function() {
  Math.fround || (Math.fround = function(n) {
    return function(e) {
      return n[0] = e, n[0];
    };
  }(new Float32Array(1)));
})();
(function(n) {
  var e = function() {
    return function(u) {
      if (u == null) {
        throw Error("name cannot be null.");
      }
      this.name = u;
    };
  }();
  n.Attachment = e;
  e = function(u) {
    function d(a) {
      a = u.call(this, a) || this;
      a.id = (d.nextID++ & 65535) << 11;
      a.worldVerticesLength = 0;
      return a.deformAttachment = a;
    }
    __extends(d, u);
    d.prototype.computeWorldVertices = function(a, c, b, h, m, k) {
      b = m + (b >> 1) * k;
      var f = a.bone.skeleton, g = a.deform, l = this.vertices, p = this.bones;
      if (p == null) {
        g.length > 0 && (l = g);
        a = a.bone;
        g = a.worldX;
        p = a.worldY;
        var q = a.a;
        f = a.b;
        var r = a.c;
        a = a.d;
        for (var w = c; m < b; w += 2, m += k) {
          c = l[w];
          var t = l[w + 1];
          h[m] = c * q + t * f + g;
          h[m + 1] = c * r + t * a + p;
        }
      } else {
        for (t = a = q = 0; t < c; t += 2) {
          r = p[q], q += r + 1, a += r;
        }
        w = f.bones;
        if (g.length == 0) {
          for (f = a * 3; m < b; m += k) {
            var v = 0, x = 0;
            r = p[q++];
            for (r += q; q < r; q++, f += 3) {
              a = w[p[q]];
              c = l[f];
              t = l[f + 1];
              var z = l[f + 2];
              v += (c * a.a + t * a.b + a.worldX) * z;
              x += (c * a.c + t * a.d + a.worldY) * z;
            }
            h[m] = v;
            h[m + 1] = x;
          }
        } else {
          f = a * 3;
          for (var y = a << 1; m < b; m += k) {
            x = v = 0;
            r = p[q++];
            for (r += q; q < r; q++, f += 3, y += 2) {
              a = w[p[q]], c = l[f] + g[y], t = l[f + 1] + g[y + 1], z = l[f + 2], v += (c * a.a + t * a.b + a.worldX) * z, x += (c * a.c + t * a.d + a.worldY) * z;
            }
            h[m] = v;
            h[m + 1] = x;
          }
        }
      }
    };
    d.prototype.copyTo = function(a) {
      this.bones != null ? (a.bones = Array(this.bones.length), n.Utils.arrayCopy(this.bones, 0, a.bones, 0, this.bones.length)) : a.bones = null;
      this.vertices != null ? (a.vertices = n.Utils.newFloatArray(this.vertices.length), n.Utils.arrayCopy(this.vertices, 0, a.vertices, 0, this.vertices.length)) : a.vertices = null;
      a.worldVerticesLength = this.worldVerticesLength;
      a.deformAttachment = this.deformAttachment;
    };
    d.nextID = 0;
    return d;
  }(e);
  n.VertexAttachment = e;
})(spine ||= {});
(function(n) {
  n = n.AttachmentType || (n.AttachmentType = {});
  n[n.Region = 0] = "Region";
  n[n.BoundingBox = 1] = "BoundingBox";
  n[n.Mesh = 2] = "Mesh";
  n[n.LinkedMesh = 3] = "LinkedMesh";
  n[n.Path = 4] = "Path";
  n[n.Point = 5] = "Point";
  n[n.Clipping = 6] = "Clipping";
})(spine ||= {});
(function(n) {
  var e = function(u) {
    function d(a) {
      a = u.call(this, a) || this;
      a.color = new n.Color(1, 1, 1, 1);
      return a;
    }
    __extends(d, u);
    d.prototype.copy = function() {
      var a = new d(this.name);
      this.copyTo(a);
      a.color.setFromColor(this.color);
      return a;
    };
    return d;
  }(n.VertexAttachment);
  n.BoundingBoxAttachment = e;
})(spine ||= {});
(function(n) {
  var e = function(u) {
    function d(a) {
      a = u.call(this, a) || this;
      a.color = new n.Color(0.2275, 0.2275, 0.8078, 1);
      return a;
    }
    __extends(d, u);
    d.prototype.copy = function() {
      var a = new d(this.name);
      this.copyTo(a);
      a.endSlot = this.endSlot;
      a.color.setFromColor(this.color);
      return a;
    };
    return d;
  }(n.VertexAttachment);
  n.ClippingAttachment = e;
})(spine ||= {});
(function(n) {
  var e = function(u) {
    function d(a) {
      a = u.call(this, a) || this;
      a.color = new n.Color(1, 1, 1, 1);
      a.tempColor = new n.Color(0, 0, 0, 0);
      return a;
    }
    __extends(d, u);
    d.prototype.updateUVs = function() {
      var a = this.regionUVs;
      if (this.uvs == null || this.uvs.length != a.length) {
        this.uvs = n.Utils.newFloatArray(a.length);
      }
      var c = this.uvs, b = this.uvs.length, h = this.region.u, m = this.region.v;
      if (this.region instanceof n.TextureAtlasRegion) {
        var k = this.region;
        var f = k.texture.getImage().width;
        var g = k.texture.getImage().height;
        switch(k.degrees) {
          case 90:
            h -= (k.originalHeight - k.offsetY - k.height) / f;
            m -= (k.originalWidth - k.offsetX - k.width) / g;
            f = k.originalHeight / f;
            k = k.originalWidth / g;
            for (g = 0; g < b; g += 2) {
              c[g] = h + a[g + 1] * f, c[g + 1] = m + (1 - a[g]) * k;
            }
            return;
          case 180:
            h -= (k.originalWidth - k.offsetX - k.width) / f;
            m -= k.offsetY / g;
            f = k.originalWidth / f;
            k = k.originalHeight / g;
            for (g = 0; g < b; g += 2) {
              c[g] = h + (1 - a[g]) * f, c[g + 1] = m + (1 - a[g + 1]) * k;
            }
            return;
          case 270:
            h -= k.offsetY / f;
            m -= k.offsetX / g;
            f = k.originalHeight / f;
            k = k.originalWidth / g;
            for (g = 0; g < b; g += 2) {
              c[g] = h + (1 - a[g + 1]) * f, c[g + 1] = m + a[g] * k;
            }
            return;
        }
        h -= k.offsetX / f;
        m -= (k.originalHeight - k.offsetY - k.height) / g;
        f = k.originalWidth / f;
        k = k.originalHeight / g;
      } else {
        this.region == null ? (h = m = 0, f = k = 1) : (f = this.region.u2 - h, k = this.region.v2 - m);
      }
      for (g = 0; g < b; g += 2) {
        c[g] = h + a[g] * f, c[g + 1] = m + a[g + 1] * k;
      }
    };
    d.prototype.getParentMesh = function() {
      return this.parentMesh;
    };
    d.prototype.setParentMesh = function(a) {
      this.parentMesh = a;
      a != null && (this.bones = a.bones, this.vertices = a.vertices, this.worldVerticesLength = a.worldVerticesLength, this.regionUVs = a.regionUVs, this.triangles = a.triangles, this.hullLength = a.hullLength, this.worldVerticesLength = a.worldVerticesLength);
    };
    d.prototype.copy = function() {
      if (this.parentMesh != null) {
        return this.newLinkedMesh();
      }
      var a = new d(this.name);
      a.region = this.region;
      a.path = this.path;
      a.color.setFromColor(this.color);
      this.copyTo(a);
      a.regionUVs = Array(this.regionUVs.length);
      n.Utils.arrayCopy(this.regionUVs, 0, a.regionUVs, 0, this.regionUVs.length);
      a.uvs = Array(this.uvs.length);
      n.Utils.arrayCopy(this.uvs, 0, a.uvs, 0, this.uvs.length);
      a.triangles = Array(this.triangles.length);
      n.Utils.arrayCopy(this.triangles, 0, a.triangles, 0, this.triangles.length);
      a.hullLength = this.hullLength;
      this.edges != null && (a.edges = Array(this.edges.length), n.Utils.arrayCopy(this.edges, 0, a.edges, 0, this.edges.length));
      a.width = this.width;
      a.height = this.height;
      return a;
    };
    d.prototype.newLinkedMesh = function() {
      var a = new d(this.name);
      a.region = this.region;
      a.path = this.path;
      a.color.setFromColor(this.color);
      a.deformAttachment = this.deformAttachment;
      a.setParentMesh(this.parentMesh != null ? this.parentMesh : this);
      a.updateUVs();
      return a;
    };
    return d;
  }(n.VertexAttachment);
  n.MeshAttachment = e;
})(spine ||= {});
(function(n) {
  var e = function(u) {
    function d(a) {
      a = u.call(this, a) || this;
      a.closed = !1;
      a.constantSpeed = !1;
      a.color = new n.Color(1, 1, 1, 1);
      return a;
    }
    __extends(d, u);
    d.prototype.copy = function() {
      var a = new d(this.name);
      this.copyTo(a);
      a.lengths = Array(this.lengths.length);
      n.Utils.arrayCopy(this.lengths, 0, a.lengths, 0, this.lengths.length);
      a.closed = closed;
      a.constantSpeed = this.constantSpeed;
      a.color.setFromColor(this.color);
      return a;
    };
    return d;
  }(n.VertexAttachment);
  n.PathAttachment = e;
})(spine ||= {});
(function(n) {
  var e = function(u) {
    function d(a) {
      a = u.call(this, a) || this;
      a.color = new n.Color(0.38, 0.94, 0, 1);
      return a;
    }
    __extends(d, u);
    d.prototype.computeWorldPosition = function(a, c) {
      c.x = this.x * a.a + this.y * a.b + a.worldX;
      c.y = this.x * a.c + this.y * a.d + a.worldY;
      return c;
    };
    d.prototype.computeWorldRotation = function(a) {
      var c = n.MathUtils.cosDeg(this.rotation), b = n.MathUtils.sinDeg(this.rotation);
      return Math.atan2(c * a.c + b * a.d, c * a.a + b * a.b) * n.MathUtils.radDeg;
    };
    d.prototype.copy = function() {
      var a = new d(this.name);
      a.x = this.x;
      a.y = this.y;
      a.rotation = this.rotation;
      a.color.setFromColor(this.color);
      return a;
    };
    return d;
  }(n.VertexAttachment);
  n.PointAttachment = e;
})(spine ||= {});
(function(n) {
  var e = function(u) {
    function d(a) {
      a = u.call(this, a) || this;
      a.x = 0;
      a.y = 0;
      a.scaleX = 1;
      a.scaleY = 1;
      a.rotation = 0;
      a.width = 0;
      a.height = 0;
      a.color = new n.Color(1, 1, 1, 1);
      a.offset = n.Utils.newFloatArray(8);
      a.uvs = n.Utils.newFloatArray(8);
      a.tempColor = new n.Color(1, 1, 1, 1);
      return a;
    }
    __extends(d, u);
    d.prototype.updateOffset = function() {
      var a = this.width / this.region.originalWidth * this.scaleX, c = this.height / this.region.originalHeight * this.scaleY, b = -this.width / 2 * this.scaleX + this.region.offsetX * a, h = -this.height / 2 * this.scaleY + this.region.offsetY * c, m = b + this.region.width * a;
      a = h + this.region.height * c;
      c = this.rotation * Math.PI / 180;
      var k = Math.cos(c), f = Math.sin(c);
      c = b * k + this.x;
      b *= f;
      var g = h * k + this.y;
      h *= f;
      var l = m * k + this.x;
      m *= f;
      k = a * k + this.y;
      a *= f;
      f = this.offset;
      f[d.OX1] = c - h;
      f[d.OY1] = g + b;
      f[d.OX2] = c - a;
      f[d.OY2] = k + b;
      f[d.OX3] = l - a;
      f[d.OY3] = k + m;
      f[d.OX4] = l - h;
      f[d.OY4] = g + m;
    };
    d.prototype.setRegion = function(a) {
      this.region = a;
      var c = this.uvs;
      a.rotate ? (c[2] = a.u, c[3] = a.v2, c[4] = a.u, c[5] = a.v, c[6] = a.u2, c[7] = a.v, c[0] = a.u2, c[1] = a.v2) : (c[0] = a.u, c[1] = a.v2, c[2] = a.u, c[3] = a.v, c[4] = a.u2, c[5] = a.v, c[6] = a.u2, c[7] = a.v2);
    };
    d.prototype.computeWorldVertices = function(a, c, b, h) {
      var m = this.offset, k = a.worldX, f = a.worldY, g = a.a, l = a.b, p = a.c;
      a = a.d;
      var q = m[d.OX1];
      var r = m[d.OY1];
      c[b] = q * g + r * l + k;
      c[b + 1] = q * p + r * a + f;
      b += h;
      q = m[d.OX2];
      r = m[d.OY2];
      c[b] = q * g + r * l + k;
      c[b + 1] = q * p + r * a + f;
      b += h;
      q = m[d.OX3];
      r = m[d.OY3];
      c[b] = q * g + r * l + k;
      c[b + 1] = q * p + r * a + f;
      b += h;
      q = m[d.OX4];
      r = m[d.OY4];
      c[b] = q * g + r * l + k;
      c[b + 1] = q * p + r * a + f;
    };
    d.prototype.copy = function() {
      var a = new d(this.name);
      a.region = this.region;
      a.rendererObject = this.rendererObject;
      a.path = this.path;
      a.x = this.x;
      a.y = this.y;
      a.scaleX = this.scaleX;
      a.scaleY = this.scaleY;
      a.rotation = this.rotation;
      a.width = this.width;
      a.height = this.height;
      n.Utils.arrayCopy(this.uvs, 0, a.uvs, 0, 8);
      n.Utils.arrayCopy(this.offset, 0, a.offset, 0, 8);
      a.color.setFromColor(this.color);
      return a;
    };
    d.OX1 = 0;
    d.OY1 = 1;
    d.OX2 = 2;
    d.OY2 = 3;
    d.OX3 = 4;
    d.OY3 = 5;
    d.OX4 = 6;
    d.OY4 = 7;
    d.X1 = 0;
    d.Y1 = 1;
    d.C1R = 2;
    d.C1G = 3;
    d.C1B = 4;
    d.C1A = 5;
    d.U1 = 6;
    d.V1 = 7;
    d.X2 = 8;
    d.Y2 = 9;
    d.C2R = 10;
    d.C2G = 11;
    d.C2B = 12;
    d.C2A = 13;
    d.U2 = 14;
    d.V2 = 15;
    d.X3 = 16;
    d.Y3 = 17;
    d.C3R = 18;
    d.C3G = 19;
    d.C3B = 20;
    d.C3A = 21;
    d.U3 = 22;
    d.V3 = 23;
    d.X4 = 24;
    d.Y4 = 25;
    d.C4R = 26;
    d.C4G = 27;
    d.C4B = 28;
    d.C4A = 29;
    d.U4 = 30;
    d.V4 = 31;
    return d;
  }(n.Attachment);
  n.RegionAttachment = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u(d, a) {
      this.jitterY = this.jitterX = 0;
      this.jitterX = d;
      this.jitterY = a;
    }
    u.prototype.begin = function(d) {
    };
    u.prototype.transform = function(d, a, c, b) {
      d.x += n.MathUtils.randomTriangular(-this.jitterX, this.jitterY);
      d.y += n.MathUtils.randomTriangular(-this.jitterX, this.jitterY);
    };
    u.prototype.end = function() {
    };
    return u;
  }();
  n.JitterEffect = e;
})(spine ||= {});
(function(n) {
  var e = function() {
    function u(d) {
      this.worldY = this.worldX = this.angle = this.radius = this.centerY = this.centerX = 0;
      this.radius = d;
    }
    u.prototype.begin = function(d) {
      this.worldX = d.x + this.centerX;
      this.worldY = d.y + this.centerY;
    };
    u.prototype.transform = function(d, a, c, b) {
      b = this.angle * n.MathUtils.degreesToRadians;
      a = d.x - this.worldX;
      c = d.y - this.worldY;
      var h = Math.sqrt(a * a + c * c);
      h < this.radius && (h = u.interpolation.apply(0, b, (this.radius - h) / this.radius), b = Math.cos(h), h = Math.sin(h), d.x = b * a - h * c + this.worldX, d.y = h * a + b * c + this.worldY);
    };
    u.prototype.end = function() {
    };
    u.interpolation = new n.PowOut(2);
    return u;
  }();
  n.SwirlEffect = e;
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function(d) {
      function a(c, b) {
        b === void 0 && (b = "");
        return d.call(this, function(h) {
          return new n.webgl.GLTexture(c, h);
        }, b) || this;
      }
      __extends(a, d);
      return a;
    }(n.AssetManager);
    e.AssetManager = u;
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function() {
      function d(a, c) {
        this.position = new e.Vector3(0, 0, 0);
        this.direction = new e.Vector3(0, 0, -1);
        this.up = new e.Vector3(0, 1, 0);
        this.near = 0;
        this.far = 100;
        this.zoom = 1;
        this.viewportHeight = this.viewportWidth = 0;
        this.projectionView = new e.Matrix4();
        this.inverseProjectionView = new e.Matrix4();
        this.projection = new e.Matrix4();
        this.view = new e.Matrix4();
        this.tmp = new e.Vector3();
        this.viewportWidth = a;
        this.viewportHeight = c;
        this.update();
      }
      d.prototype.update = function() {
        var a = this.projection, c = this.view, b = this.projectionView, h = this.inverseProjectionView, m = this.zoom, k = this.viewportWidth, f = this.viewportHeight;
        a.ortho(-k / 2 * m, k / 2 * m, -f / 2 * m, f / 2 * m, this.near, this.far);
        c.lookAt(this.position, this.direction, this.up);
        b.set(a.values);
        b.multiply(c);
        h.set(b.values).invert();
      };
      d.prototype.screenToWorld = function(a, c, b) {
        var h = b - a.y - 1, m = this.tmp;
        m.x = 2 * a.x / c - 1;
        m.y = 2 * h / b - 1;
        m.z = 2 * a.z - 1;
        m.project(this.inverseProjectionView);
        a.set(m.x, m.y, m.z);
        return a;
      };
      d.prototype.setViewport = function(a, c) {
        this.viewportWidth = a;
        this.viewportHeight = c;
      };
      return d;
    }();
    e.OrthoCamera = u;
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function(d) {
      function a(c, b, h) {
        h === void 0 && (h = !1);
        b = d.call(this, b) || this;
        b.texture = null;
        b.boundUnit = 0;
        b.useMipMaps = !1;
        b.context = c instanceof e.ManagedWebGLRenderingContext ? c : new e.ManagedWebGLRenderingContext(c);
        b.useMipMaps = h;
        b.restore();
        b.context.addRestorable(b);
        return b;
      }
      __extends(a, d);
      a.prototype.setFilters = function(c, b) {
        var h = this.context.gl;
        this.bind();
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MIN_FILTER, c);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, a.validateMagFilter(b));
      };
      a.validateMagFilter = function(c) {
        switch(c) {
          case n.TextureFilter.MipMap:
          case n.TextureFilter.MipMapLinearLinear:
          case n.TextureFilter.MipMapLinearNearest:
          case n.TextureFilter.MipMapNearestLinear:
          case n.TextureFilter.MipMapNearestNearest:
            return n.TextureFilter.Linear;
          default:
            return c;
        }
      };
      a.prototype.setWraps = function(c, b) {
        var h = this.context.gl;
        this.bind();
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_S, c);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_T, b);
      };
      a.prototype.update = function(c) {
        var b = this.context.gl;
        this.texture || (this.texture = this.context.gl.createTexture());
        this.bind();
        a.DISABLE_UNPACK_PREMULTIPLIED_ALPHA_WEBGL && b.pixelStorei(b.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1);
        b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, b.RGBA, b.UNSIGNED_BYTE, this._image);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.LINEAR);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, c ? b.LINEAR_MIPMAP_LINEAR : b.LINEAR);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
        c && b.generateMipmap(b.TEXTURE_2D);
      };
      a.prototype.restore = function() {
        this.texture = null;
        this.update(this.useMipMaps);
      };
      a.prototype.bind = function(c) {
        c === void 0 && (c = 0);
        var b = this.context.gl;
        this.boundUnit = c;
        b.activeTexture(b.TEXTURE0 + c);
        b.bindTexture(b.TEXTURE_2D, this.texture);
      };
      a.prototype.unbind = function() {
        var c = this.context.gl;
        c.activeTexture(c.TEXTURE0 + this.boundUnit);
        c.bindTexture(c.TEXTURE_2D, null);
      };
      a.prototype.dispose = function() {
        this.context.removeRestorable(this);
        this.context.gl.deleteTexture(this.texture);
      };
      a.DISABLE_UNPACK_PREMULTIPLIED_ALPHA_WEBGL = !1;
      return a;
    }(n.Texture);
    e.GLTexture = u;
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function() {
      function d(a) {
        this.lastY = this.lastX = 0;
        this.buttonDown = !1;
        this.currTouch = null;
        this.touchesPool = new n.Pool(function() {
          return new n.webgl.Touch(0, 0, 0);
        });
        this.listeners = [];
        this.element = a;
        this.setupCallbacks(a);
      }
      d.prototype.setupCallbacks = function(a) {
        var c = this, b = function(m) {
          if (m instanceof MouseEvent) {
            var k = a.getBoundingClientRect(), f = m.clientX - k.left;
            m = m.clientY - k.top;
            k = c.listeners;
            for (var g = 0; g < k.length; g++) {
              c.buttonDown ? k[g].dragged && k[g].dragged(f, m) : k[g].moved && k[g].moved(f, m);
            }
            c.lastX = f;
            c.lastY = m;
          }
        }, h = function(m) {
          if (m instanceof MouseEvent) {
            var k = a.getBoundingClientRect(), f = m.clientX - k.left;
            m = m.clientY - k.top;
            k = c.listeners;
            for (var g = 0; g < k.length; g++) {
              k[g].up && k[g].up(f, m);
            }
            c.lastX = f;
            c.lastY = m;
            c.buttonDown = !1;
            document.removeEventListener("mousemove", b);
            document.removeEventListener("mouseup", h);
          }
        };
        a.addEventListener("mousedown", function(m) {
          if (m instanceof MouseEvent) {
            var k = a.getBoundingClientRect(), f = m.clientX - k.left;
            m = m.clientY - k.top;
            k = c.listeners;
            for (var g = 0; g < k.length; g++) {
              k[g].down && k[g].down(f, m);
            }
            c.lastX = f;
            c.lastY = m;
            c.buttonDown = !0;
            document.addEventListener("mousemove", b);
            document.addEventListener("mouseup", h);
          }
        }, !0);
        a.addEventListener("mousemove", b, !0);
        a.addEventListener("mouseup", h, !0);
        a.addEventListener("touchstart", function(m) {
          if (c.currTouch == null) {
            for (var k = m.changedTouches, f = 0; f < k.length; f++) {
              k = k[f];
              var g = a.getBoundingClientRect();
              f = k.clientX - g.left;
              g = k.clientY - g.top;
              c.currTouch = c.touchesPool.obtain();
              c.currTouch.identifier = k.identifier;
              c.currTouch.x = f;
              c.currTouch.y = g;
              break;
            }
            k = c.listeners;
            for (f = 0; f < k.length; f++) {
              k[f].down && k[f].down(c.currTouch.x, c.currTouch.y);
            }
            c.lastX = c.currTouch.x;
            c.lastY = c.currTouch.y;
            c.buttonDown = !0;
            m.preventDefault();
          }
        }, !1);
        a.addEventListener("touchend", function(m) {
          for (var k = m.changedTouches, f = 0; f < k.length; f++) {
            var g = k[f];
            if (c.currTouch.identifier === g.identifier) {
              f = a.getBoundingClientRect();
              k = c.currTouch.x = g.clientX - f.left;
              g = c.currTouch.y = g.clientY - f.top;
              c.touchesPool.free(c.currTouch);
              f = c.listeners;
              for (var l = 0; l < f.length; l++) {
                f[l].up && f[l].up(k, g);
              }
              c.lastX = k;
              c.lastY = g;
              c.buttonDown = !1;
              c.currTouch = null;
              break;
            }
          }
          m.preventDefault();
        }, !1);
        a.addEventListener("touchcancel", function(m) {
          for (var k = m.changedTouches, f = 0; f < k.length; f++) {
            var g = k[f];
            if (c.currTouch.identifier === g.identifier) {
              f = a.getBoundingClientRect();
              k = c.currTouch.x = g.clientX - f.left;
              g = c.currTouch.y = g.clientY - f.top;
              c.touchesPool.free(c.currTouch);
              f = c.listeners;
              for (var l = 0; l < f.length; l++) {
                f[l].up && f[l].up(k, g);
              }
              c.lastX = k;
              c.lastY = g;
              c.buttonDown = !1;
              c.currTouch = null;
              break;
            }
          }
          m.preventDefault();
        }, !1);
        a.addEventListener("touchmove", function(m) {
          if (c.currTouch != null) {
            for (var k = m.changedTouches, f = 0; f < k.length; f++) {
              var g = k[f];
              if (c.currTouch.identifier === g.identifier) {
                f = a.getBoundingClientRect();
                k = g.clientX - f.left;
                g = g.clientY - f.top;
                f = c.listeners;
                for (var l = 0; l < f.length; l++) {
                  f[l].dragged && f[l].dragged(k, g);
                }
                c.lastX = c.currTouch.x = k;
                c.lastY = c.currTouch.y = g;
                break;
              }
            }
            m.preventDefault();
          }
        }, !1);
      };
      d.prototype.addListener = function(a) {
        this.listeners.push(a);
      };
      d.prototype.removeListener = function(a) {
        a = this.listeners.indexOf(a);
        a > -1 && this.listeners.splice(a, 1);
      };
      return d;
    }();
    e.Input = u;
    u = function() {
      return function(d, a, c) {
        this.identifier = d;
        this.x = a;
        this.y = c;
      };
    }();
    e.Touch = u;
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function() {
      function d(a) {
        this.spinner = this.logo = null;
        this.fadeOut = this.angle = 0;
        this.timeKeeper = new n.TimeKeeper();
        this.backgroundColor = new n.Color(0.135, 0.135, 0.135, 1);
        this.tempColor = new n.Color();
        this.firstDraw = 0;
        this.renderer = a;
        this.timeKeeper.maxDelta = 9;
        d.logoImg === null && (a = navigator.userAgent.indexOf("Safari") > -1, d.logoImg = new Image(), d.logoImg.src = d.SPINE_LOGO_DATA, a || (d.logoImg.crossOrigin = "anonymous"), d.logoImg.onload = function(c) {
          d.loaded++;
        }, d.spinnerImg = new Image(), d.spinnerImg.src = d.SPINNER_DATA, a || (d.spinnerImg.crossOrigin = "anonymous"), d.spinnerImg.onload = function(c) {
          d.loaded++;
        });
      }
      d.prototype.draw = function(a) {
        a === void 0 && (a = !1);
        if (!(a && this.fadeOut > d.FADE_SECONDS)) {
          this.timeKeeper.update();
          var c = Math.abs(Math.sin(this.timeKeeper.totalTime + 0.75));
          this.angle -= this.timeKeeper.delta / 1.4 * 360 * (1 + 1.5 * Math.pow(c, 5));
          var b = this.renderer, h = b.canvas, m = b.context.gl;
          b.resize(e.ResizeMode.Stretch);
          var k = b.camera.position.x, f = b.camera.position.y;
          b.camera.position.set(h.width / 2, h.height / 2, 0);
          b.camera.viewportWidth = h.width;
          b.camera.viewportHeight = h.height;
          if (a) {
            this.fadeOut += this.timeKeeper.delta * (this.timeKeeper.totalTime < 1 ? 2 : 1);
            if (this.fadeOut > d.FADE_SECONDS) {
              b.camera.position.set(k, f, 0);
              return;
            }
            c = 1 - this.fadeOut / d.FADE_SECONDS;
            this.tempColor.setFromColor(this.backgroundColor);
            this.tempColor.a = 1 - (c - 1) * (c - 1);
            b.begin();
            b.quad(!0, 0, 0, h.width, 0, h.width, h.height, 0, h.height, this.tempColor, this.tempColor, this.tempColor, this.tempColor);
            b.end();
          } else {
            m.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a), m.clear(m.COLOR_BUFFER_BIT), this.tempColor.a = 1;
          }
          this.tempColor.set(1, 1, 1, this.tempColor.a);
          if (d.loaded == 2) {
            this.logo === null && (this.logo = new e.GLTexture(b.context, d.logoImg), this.spinner = new e.GLTexture(b.context, d.spinnerImg));
            this.logo.update(!1);
            this.spinner.update(!1);
            a = this.logo.getImage().width;
            c = this.logo.getImage().height;
            var g = this.spinner.getImage().width, l = this.spinner.getImage().height;
            b.batcher.setBlendMode(m.SRC_ALPHA, m.ONE_MINUS_SRC_ALPHA);
            b.begin();
            b.drawTexture(this.logo, (h.width - a) / 2, (h.height - c) / 2, a, c, this.tempColor);
            b.drawTextureRotated(this.spinner, (h.width - g) / 2, (h.height - l) / 2, g, l, g / 2, l / 2, this.angle, this.tempColor);
            b.end();
            b.camera.position.set(k, f, 0);
          }
        }
      };
      d.FADE_SECONDS = 1;
      d.loaded = 0;
      d.spinnerImg = null;
      d.logoImg = null;
      d.SPINNER_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKMAAACjCAYAAADmbK6AAAAACXBIWXMAAAsTAAALEwEAmpwYAAALB2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMTEtMTVUMTY6NDA6NTkrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmZDhlNTljMC02NGJjLTIxNGQtODAyZi1jZDlhODJjM2ZjMGMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmYmNmZWJlYS03MjY2LWE0NGQtOTI4NS0wOTJmNGNhYzk4ZWEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjY1NTM1IiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjk3IiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjQyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHN0RXZ0OndoZW49IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNThlMTlkNi0xYTRjLTQyNDEtODU0ZC01MDVlZjYxMjRhODQiIHN0RXZ0OndoZW49IjIwMTgtMTEtMTVUMTY6NDA6MjMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ3YzYzYzIwLWJkYjgtYzM0YS1hYzMyLWQ5MDdjOWEyOTA0MCIgc3RFdnQ6d2hlbj0iMjAxOC0xMS0xNVQxNjo0MDo1OSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZmQ4ZTU5YzAtNjRiYy0yMTRkLTgwMmYtY2Q5YTgyYzNmYzBjIiBzdEV2dDp3aGVuPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0N2M2M2MyMC1iZGI4LWMzNGEtYWMzMi1kOTA3YzlhMjkwNDAiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2OWRmZjljYy01YzFiLWE5NDctOTc3OS03ODgxZjM0ODk3MDMiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiLz4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2U8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7qS4aQAAAKZElEQVR42u2de4xVxR3HP8dd3rQryPKo4dGNbtVAQRa1YB93E1tTS7VYqCBiSWhsqGltSx+0xD60tKBorYnNkkBtFUt9xJaGNGlty6EqRAK1KlalshK2C8tzpcIigpz+MbPr5e5y987dM2fv4/tJbjC7v3P2+JvPnTMzZ85MEEURQhQClUpB7gRBAECUYiYwH6gDqoEKoA1oBDYCy4OQJgB92R3yq2S5yRilWASs6CZ0DzA5CNmn/ObOOUpB7kQpRgNLcwj9AHCnMiYZfXIT0C/H2DlRSs0gyeiPaQ6xg4FapUwy+mKUY/wwpUwy+uK4Y/xhpUwy+mKfY3yTUiYZfdHiENsahBxRyiSjL5odYncpXZLRJ3sdYhuVLslYKDKqZpSMBXObVs0oGQumA6OaUTL6Iwg5CBzNMXy7MiYZffNCDjH7g5DdSpVk9M36mGKEZOwxq4Fj3cT8UmmSjEm0Gw8At2UJaQhCtilTeeRWM5EdkmVfOwCIUtQBE4AqILC1ZQuwPgjpSKryWwgy1gfZfjsQ886IKFY2xO9N0jOR69srDOAtzCyYFuCUSrcg6AOcBIYCY4C3gVeT+uNJyvg94GPAxzFjcDuBl4C/AP+UBwXBR4AaYDYwDvgr8Drwi1KScRnwXfut6wNcYT+7Ma97LgX+JRd6jfOAucAXgCvTfl4DvAuMtJVJ0cu41IoYWRHTGWM/1TZmq/2fF8nR14r4U2BQF7+LgMW2k7bY54X4Htr5EvD99s5SlriPArcAY+VGsh1YYDpwMzAgSwy2svhWscpYA/wkx9gKm5S5wBA5kgjnAJcDX7NNpVxcWAZMLUYZJwHDHeKrgXnAdWjZlSS4BLgVuMzRlxt9eeNTxsG2veFyy7gQWAR8Sq54byfeYDssAx3LqLabJldBytgMHMjjuPHAQvTOsU++aJtE/fI4dpevTqZPGV+2veN8+DTwIHCBr29hmVJhJXwA+GAex7cBjxZjm7EFWAL8DfeX39s7NPOy9PKEO7XAV+k8xJYLrcDPgL8Xo4xgJqIuA7bkeXw9ZsBVxMMMYEqex64FfuO7e++bTcAPgD8Bpx2PvRSYKIdi61DOs3edXImAV4Cv2zJsKnYZ24B/AJ+xteRrwAmHBF4mj2JhEnCRg4QnrYh3YZ5NH/J9gUmP5zXYtsdsW+Pl8vffkEex8I5D7HHgGeBhe0dLhKRlbMJM298NXI8Z68rGk8AGeRQLu4DHMGOL2dgJPA78AXguyQvsjScdrTYp2zBDPzfbXl7mmNc64B7MFCbRc/bbfPYHrs343WnbZHsG+BXwZ8y65JS6jOnfwPuBg8BnMQtxjsWsh/0IsNJ2fkR8bAHutbfhG2x7vp9tDzZiFs5/Non2YaHJ2N6OWQf8BxiBeRx4EDPZ9nm544WNVsLtwFWYJ2Wh/fmO3ryw3noHpiv6YyZ5NsuXROhrRypeAv7nfHQJvAOTjbclYuJ3pWcL6YL03rSQjEJIRiEZhZCMQjIKIRmFZBRCMgrJKIRkFJJRCMkoJKMQklFIRiEkoxCSUUhGISSjkIxCSEYhGYWQjEIyCiEZhWQUQjIKySiEZBSSUQjJKCSjEAVCJUAQmCWPoxSjgZuAaZgF348D+zD7ADYDe+2nGWgJQg52dVJvSzOLgqHdmU5ln2IYZou9861Do+x/j8Ss2z7AOrQJWBOEZtetKIrMmt5BEBClWAQsxW3b16OY/QHXA6uD0GzpG0VRPmt6i2KSMeyQrxpYgNl4dCJmV7NcOQEsCULu6ZCR+mAmZiOannAMuC0IWS0Zy0PGKMUCzFZug3p4ullsiJ5obzPOj+H6BgGrohR1KqrSx5bzqhhE7PCvXcY4BZqgoioL4iznunQZq2M8cZXKqSyIs5yr02WsiPHEaiyWSbMxxnNVpMvYFuOJj6mcyoI4y7ktXcbGGE/conIqC+Is58Z0GTfGdNIGzJijKH3W2/KOg43pMi4n//2F92P2KJ4ShCwMQvT4pRwajCFRELIQmGLLf3+ep9pj/TvjCcwI4E5gDp1H0VsxO7k3Zvy7PQjZnXl2DXqXhYydiFKMAcYD44CajH+HZIQfBdYCtwch+854HJh2wkqgFhgGHAaagpAjLhcqGctTxqxOpKgCRgNDMXuK7whCTqU7U9khz3ucAv59xomUe9FVhePGEfs5q1eaQiYKBskoJKMQklFIRiEko5CMQkhGIRmFkIxCMgohGYVkFEIyCskohGQUklEIySiEZBSSUQjJKCSjEJJRSEYhJKOQjEJIRiEZhZCMQjIKIRmFZBSijGXMvIZ+KpZEaF8qeygwHOjb2xdUWQBJqQL6ADOBi4GHMGuGH5Iv3hiG2SJtIWaV4mZgB/AadF6jvVxkvAKzv3UdMNX+bDJm9fx10PV+1qLHIl4P3GLzfh3QBLwKbAZ+DJwuFxkDm5CZmN0Vzsv4/TTMyviVwGOYnRZEPAwBZgDfAC5K+/lo+5kKXAjcBzwPnCz1NuP77LfxO12I2M7FNmFXE+++huVOPfDNDBEz25FzgHuBa4Bzk8x/0jJeCiwCFmP2BsnGh4BbgYFyKDZmZRExnTpbGcywHZySuk0PsbeAG4HZDt+2C6yMb8mjWHgXs+NFd5v09Ac+AYzC7An0EPBKqdSM1wDfBqY7Vvubk263lDhPYHamypVa4MvAHUCq2GvGgcB8YAEwKQ/5nwa33blEVrYDLwJXOhxzLvBJzDhkK/BCMdaMA4C5wF2Y4RrXv7UF+KO9tYh42A08msfoRxVwLfBDYGwxyliLGUMclMexL9rOy075EyvvAKuBlcCbeTa3Pl+MMk7GbP/qyiHg18BWueOFNnu3ymeP8X62h11dbDKm7K3a9Zv7e+BJOeOVRmCNvQO5cgmdt4AueBkH5zCE0FWHpQH4r3zxzlPAw3kcdxg4VmwybnaMfx1YAWxTpyURjtj24wpHuZ7C0yNanzL+FnjZIX4lsEGOJEorcDewKcf4vTb+ZLHJuAeYBxzvJm4/8CPg58AJ+ZE4BzBDNk93k//jwOeAN4qxNw1m5sdV9jZwtlvv48ADujX3GpFtUt0OhPZnJzN63wdtOW7xeSFJPJvehBnBv8/2ricAp2wb8UHgETRvsRDYCiy3IrbPCWi0Mt4BPOf7AoIoivycub5TR/rDmBkjs4Df2fbHJjlQcLwfuNyW13rMXILOkyQ2REUtI5jnnG+mNRFOF3Gh1dlavgozhHUMaLEFGJWImBVnbT4VlYwlSBCYL1iUYgGw6ixhDUHIwo4GmfIrGX3JGKWotj3KbM/cpwQh2yRjYfWmS5EFdD/54ytKk2RMgukxxQjJ2GMm5hAzPEoxRqmSjN6IUgwj9xkr45UxyeiTkQ6x45QuyeiT8x1ia5QuyeiTUaoZJWMxyqiaUTIWzG1aNaNkLJgOzJAoRZVSJhl9McIxfrRSJhl94fq241ClTDL6Yq9jvCYNS0ZvuEwGPopZmlhIRi+sIfeXxtYGIaeUMsnohSCkCViSQ+gezAtOwiW/mvzpkKz3ZnrPxCz1V4dZd6YC8+JSI2YNm+VWXE2ulYyiGPk/nslB8d6ayMkAAAAASUVORK5CYII=";
      d.SPINE_LOGO_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAABsCAYAAAALzHKmAAAACXBIWXMAAAsTAAALEwEAmpwYAAALB2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMTEtMTVUMTY6NDA6NTkrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMTdhZGQ3Ni04OTZlLThlNGUtYmM5MS00ZjEyNjI1YjA3MjgiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplMTViNGE2ZS1hMDg3LWEzNDktODdhOS1mNDYzYjE2MzQ0Y2MiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjY1NTM1IiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjk3IiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjQyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHN0RXZ0OndoZW49IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNThlMTlkNi0xYTRjLTQyNDEtODU0ZC01MDVlZjYxMjRhODQiIHN0RXZ0OndoZW49IjIwMTgtMTEtMTVUMTY6NDA6MjMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJlNjJiMWM2LWIxYzQtNDk0MC04MDMxLWU4ZDkyNTBmODJjNSIgc3RFdnQ6d2hlbj0iMjAxOC0xMS0xNVQxNjo0MDo1OSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDE3YWRkNzYtODk2ZS04ZTRlLWJjOTEtNGYxMjYyNWIwNzI4IiBzdEV2dDp3aGVuPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyZTYyYjFjNi1iMWM0LTQ5NDAtODAzMS1lOGQ5MjUwZjgyYzUiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2OWRmZjljYy01YzFiLWE5NDctOTc3OS03ODgxZjM0ODk3MDMiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiLz4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2U8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5ayrctAAATYUlEQVR42u2dfVQV553Hv88AXq5uAAlJ0CBem912jQh60kZ8y0tdC5soJnoaXzC4Tdz4cjya1GN206Zqsu3Jpm6yeM5uTG3iaYGoJNFdEY3GaFGD0p4mqS9AXpoV0OZFUOHS3usFuc/+Idde8M7M8zr3gsw5HOCZZ2aemecz39/LPPMMMLAMLDG2kIFzjqmFDiDZP6AkN3gf0gEob8x2kj4MCx2AMnbb1BcVld6IwJJ+0oYb2YTT/gYq6WPHJP3gmtA+Biztr1CSKLevLytprCkh7ctQkj4KsK590hiGlsbSOcVCR5I+BC7pA6BEAzQaq1DqhFFH3Vg16TSG4KHRgNPpyFd1XdIHAyrdCkhjADgaTSiJw/VIP1BSp6GhUQSOOgmlkzASxSqq2zpQB+ClGiGlUb65tAUZOmDUAa5u5XRSgajibVRCR3VCSRyoQwSBE/EvYy3YkYGESuwrpuAkDgPJCg4RhFVUNUkMw6hK6agDcFInoSQxAqNqWHVdD6fUhQqUsfiaVCN41IlOUBEx88JIJCCU8T+tttOR6pEFUgRQXoCVrydRAJJw/G+2jig6llN+p0wnsZpYXsAoxzGognYzryeagBRRR8L5t4iCRsvflDHnIopINcCpGkzlUOoCkqWcKABdlznXZa5lTK7Z/6zlvMeXXqdTCVWoI696ygZN0YZSp/KxQCijmiJgUp3gyQBpVy4Kq4gPqhpWlQrCCxgPeLz70wqmyqcksgELS5kKQEWCIBn1FEn7qFBKKgmnajCloZQtlwWSZR0PoCJBkJMDMnT4iSxlsQCmFJQidVUASQS3ZSlXadqhWDVkTCoLiDKw8t40XOU6oFQBJMtvkSBJ1ITLqKaOgIbVF+y9jd3/omAqVUtViigTTfMAyKqqKnxOlWZcFEzVZjrSb11gaodSRiVVAikCo4hKyjzpkh3No8tf1AUmrxnXCmW0gSSCcIqki4hipbTqGNU+IwuMqsAUfSLVoywezi46gGSFU8Sk86bBKOd1oJzrwuuEQLIbBU8sfiPC37DYhuW8pEfex3NcQBUqyVrO+7edeZdNIfFCSi22oZwdSkzUk1jAaQcrGMA0O34kUJXAaAYl0aSMkRQMjODxAArGct6onPf68CgLbGCkNv4r4axrp4wwUUc7CAnDdkzXJ14SNFHVEQFNRjHtbg7ZoMfuOlHGDiG9/DPCCDgLjDBROFgon50ZV6mQ1/YVzwmgSniJhFryAMpybB4TLjJLRqTOZPUbZYIrwmiqZYC02lboXOIV0C3qm5nVZQGSSCiuaETOe5PygEg4AbXyM1lhJIxqqiWYUQklUaiShMGc2gFpBbDdcXl9StHXka38KVZ/i8V35DXzZibcClIWtRS90ZQpJa/ysZhtHiBV+pk8imm2TjTFwxsQWIHL42PaRd4iroW0ksZLKAFv5MoKbyQQVZl1mShc5LxYOo4Fxt4KyZPysXMhrOrwqKWyHGa8wiCHVSXtzDaxgYSA36xDEk4V5lvGpxRVIZb8pZ0Z571x7My6Up9S17SBhMGvjASfocCUi0TkvOaZMJh11vSPGVSEcT0s1JYyKKnu1BABQOMloeJ9ssMCg53phoKUkVDQs2MMcvNSsZICwfYufPZVB+o/86HxbAAXP/ah9Z2LuPSnAK5wqB1PLlIkmGEBkzVbwKuWolkE6ddXeYeb2akfEfwRTRnZRf89/r84Bf81NB73WtDQ+VUHKocfw1ob35J3QAXrYApq8X94edBmvVUZS9si/Qbr/wacWXgeN/LCCAHAQ+sNhvqhOiQOcNucZMKwQXh42XCkM95AELjZRFNjRCAPSxSmAbXlKXlNOlF0wj2WoqKi5Hnz5mdTGiQA8OCDDx4T6aiNGzeOufnmm5MBoKysrHbfvn3tVhf40hX8MSked1u1LUhx+e1mXGBIz1znC77xxtaJhmFQwzDo3LmPHBdJ6ezZs2cqIVf3UVt7unH16tWNsB4gwpItsPKdlSfTZd4EZH1MKKJkEX8WLfqnlPXr1/8oNTV1QQ8QgsG2pqamX+TkZG+OtP/y8jcn5efnb+nq6vKmpg7NfeONrZOmT5++3uVyZYTvp76+vjg3d8IWs2vy2DDcsunvUDrIQLrZBT3fgXduO4ZnrEx1aWlpbkHBrM0AkJyclFVZWZl3990TngpvT1dXl7e29vRLU6dOLTcxmT3+P3Hi5NLMzMwlhmEkh7fH7/cfraqqemHevLknTMy10yZci/mO2rR5GzZs2JaamrogGAy2Xbx4cWtTU9OLXq93r2EYyR6P52kLdQQAxMXFJR05cvSRGTNmvOZyuTJ8Pl+d1+utCa0fPXr0kydOnHzSzFRu+RLNM09j7qc+vHY5iIbe7Wu7gt8t+wwbGG9YAEBV1eHvT516z0uh9vj9/tpQW7Ozc54rL39zkt1Dh6+/Pl/h8XieNgwjORAInGpqanqxvb19TzAYbHO73VPz8vK2vfXW29kKUnuOLIZitYWFryjlq1RXV890uVxjAWD37oqFo0Z5fjR2bNYvRozIWLFx48b7zpw5s8EmqgYA5OTkrA8EAud2767452HD0ueOGJHxxLp16x7w+Xx1AODxeB5buXLlCDOf9d2L8H7rd3jFfQSzv/MBpjx7BrP/4yzmP1qP76W8j6U7m3HJzpoEg8Fr5ePHj1/n8/nqtmx5fe6wYemPpKffNreysnJxaP2999672sqi/eEPJ5YkJiZmAcDhw1WP3nrrLQVjx2Ztysi4ffmqVSunBAKBU4ZhJE+bNu1VDj81qosRZfVjyU0CABk6dGgmAHR2djYVFRWdCl+3du1Pzo0bl7PZDPxwCHw+X11R0aOPLFy4sCa0vrj4P8+9++7+jaE6P/jBY3NYgrTft8P3s0Y0rPkcn5R9jRaGtNR159zdnieeeuqpulBZYeGCmsbGxtcBwO12jzFT3Iceejh55MiRTwBAQ0PDzwsKCqrDj1NSUuL98MMPX+hW3pHvvXdwqoK+1jELs3KlVGHmbZPVgUBHGwAkJCRklpSUjBW9MB988PvXwwKaa3UWLVpUEwgEzgFAamrqnWYppZ+Owt8eHoeCfdmY/vYYTH43B9/76Nt4tP5uLHlrDCbyntd77x0oPnDggLd3nbNnz9aG/i4vf3NipG1XrFgxKeRD7tq1a2+k4+Tn570fDAbbAOD222/P5uwTJ9/41BJ9izaOKXVQXFxcWVxc/IxhGMmzZj20+5NPPn21vLx8+9q1Pzlrd/xwpWxtbfWawev3+//kcrkyUlJSJpi1618z8cs4guRIx/mmG34Aky2i0+si1bC29VgX1s4e7Q+vl5aWNiJUmJ2dnVlRUTGiWxUpAISi8M7OzqaQ66O4r7UM4HDyxTEpn+XXv/5V2/Tp/1CYn/+PryQkJGSmp6cvXbVq1dLFixdX19TUbJ49++Fjsvm1L774oqYbSMtcpOk6YrqOuwND6S7W/dx///0l6CdLfBQVkntZuHDhqfnz58/84Q9XP5iZmbkgMTExa8iQIZOnTZs2+fPP/2/7HXd8Y63uNrR04vitgzAt0rqvOnAADgyCjbScOXNmAyGEAoBhGNd+E4Jrqrl//77KGwlK6hSY27Zta922bdtWANsrKiomT5iQ+y+JiYlZaWlp83bs2LlvzpzZx0X3PXz48Nyr/utV3zLS8vgn+Onr3wK9ZRDuI93X7wpFW9Nl7J51GpsQpY+4jxuX8yqsHy9SxMAH5p1KCfGAq3R/BQUF1cuXLy8KOfKjRo3KipDQ7bGkpKQkmbXrpptuGg0AXq+33uyglRfQdtsxPJ15HJOL6pE/4xS+m3AY373jt3j59F/gtzn369oUUrXedQn5a3lYnR7n5fP5rvmdW7ZsyXKYHW1fVjMcbqjyLyjs2PF2W0dHx1nWHdx117cfz8vLS+q9r4MHD82Ji4tLAoDm5uY6WM/6gHMBdJZ+jfN7LqAVzn0cqceyb9871X/NZ9433+6GjCXwoqWUvJ1hCUFjY9O/19XVLSssLOwR+R469JsHQsnjy5cvtyHSY6swNRo8ePCdpaVl5WVlZbmhstLS0gnjx49fBVx9vPfssz/eEaFN17VrrQee34zDA59OwIrWKdjsvwf/uysL90TYhjKCyzPvOH3++efPtrS0bO+OxOedOHFyaaR9VldXz2hsbHpRQf9R8E05I8RFvNM+oY1Pavpik8vlykxJSSl85ZVNz7z00svvB4NBEhcXlxwG5OlJkyZuh/mLUSGTVzd48OA7Z84s+OX5883nuvd97Znz0aNH/u3gwYPeCBexRwDzq7/HXYvS8VrvE5mSjO8DOGzRCT0nc+oOTnp3bASzHrFD16xZs2HTpk1ZiYmJWR6P5+lLl1qXBAKBU6H1brd7Snh1sD2rjqqJNxw6sOzkobSqquoFv99/NHShhwwZMjkEZEtLy/Zly5YtMrubwzv40KFDL3/00UfPdXV1eV0uV0YIyEAgcK6iYtcTs2bN2m+iCD3KvuyAN1LDr1D8xSSwuFYW3p7m5mavHRQXLlxoM1FdunPnjtbly5cXNTQ0/DwYDLYZhpHsdrunhH6Aq4MyPv744yWM6kwZ1VFr7tDub7P/HR8lBIAUFRWlRBi2Fn6DXXec0CghAKisrFxcWLjgOABSVlY2MQRG92M+rhfHGnKxZmQiFgAgXRTeLzuwf+Vn+O//aUErg2ljnemMdZQOBUBLSkrGpqXdkhQCPz8/7wjYBveKjBLinenN1nIAoCpHnvNOEGD2zo0RATKrdbZvPJaXvzk5BOXevXsfnz9/Xg3jednlYsnEJAz5hhvuPRdwsfUKuhhUHzYdZjWvJAuwlBE8ltHoVnDa3UDCUKp8omM3QwPrdlb7sVuHSD5luLns/ttquhIzGCP6eMe9aD/uRTtnMAfoeSXCDkie9rGabuX+qFOPGSMFHdREgVjA6w0N7xt2PLNWUCur8ZwHnu8kYWTbFfiS4zHY3wX/nFr8llEZRGG0U1Fq4xebKR+PD6kN1mg80bEC1Awyq1dCbUG0UEpWv9sUrCcz8OOkePR4Xp79N7jr5J8RsIFSdo5yW//SQkV5VZIKmmKhaDxeEkKr90/AYM5Z1NIOFtuX4ktLS08TQhZRSklpaWkt+N+tNl28XfhjOJS+LtSf/DMuC4Aoo5i8QFKbDIFTSfbIT7M4Ah2WYEck+FH9Zh/AN+EVU6RtBuo3B2PQ1tGYlZYAT3sXvljXgMqdzWiTMN0qfEuegEVHlC38eq1IR7BOJgAOIKEATqt9mKWw7CJuFZPx83x+xA5Klq8+iAIJsL8kZrdOGso4zo5gnQhV9qsOVuMheYbYs3yvmmc9lagn+iUGarMPVsW0y5FSAUXXYuLjBXZMBLdhmU02UtBjFQzx+ps850EtoLfzpbnVgUN5VOQxWdVR9MtmUiki1Skhq3wiTIBkgRMCKR/CWM6bV+W581kHL7DkMXk+1sQKJK9VcWQEEq/5FjXhIsGF7Ddt7MDhufAqTBYFlHzuWORLYpRBSXnNtowvKaWULDN42W3D+hkNMOQhAfNEN8/stay5U5nv3/AGPLI5TFa/kgrUlb05uW7gOEF1UqWWdhOk8kS9Ks0uT3BDGbbn8Sl54VTla1qZZ542Sy9xnGkgcAAkOoMukQBT1L+TMfci7gGvOecxsSzmXTaYYTk/nuvODSVLmchH5cH5t+hMuyyjuFmdedFXGyij/waoiXhlHlOyHgsMbY5q9G3le/LOu83ywSHRNBXLY1GRtA9vwMPaqU59wVZFG6DoWkkppajS8XyHW8V3t4lEekP09VS7kTp2Ebmsvyli0kWyBSqsyHVlcYIAyviWsmASThhVBjY84wtZ9suaK5RJy4iaaNa8pVKVNINSRi11gSkSheu4o82UkAVmnhymKIgi0TnA/8hRNPKmqqHkVUsnwBR91Meqjiocd5ZASgQKFT4nT1DDA6TUdSOaymXAFEkniZp7FSOBdAU9LOkVqgBQp4BkLieKgLUqkzXvVuDx7EMEQl35URHoIAmODMAqFJIZyjjNKqriE8a8yXynAxsIdgRrp/KabxkYow6kjFKIqqjKZDnhvAFELYNO8w3Jjuc15yLmmjWoUQZlnIT5UgGmjGqyjLtUrXy6oGRRTl2QivqwrJaJG2KZ5DQvsKwmmccHZVVD2fSSLmXk6XxRSHgVU5U6iqqnFJSyYKqAU+QGiJVAh2oClUdhqeLjSgOpSjFkTbwOVRXNGEDB9aCSwFIFHa3DFZBRfi1Q6gBTFk4Rs63zGijrFIg/ylRt7lW3m6kOUagQqiJ5orFONKJtHR0ok/vUAaPKOrbRt2owZZVTJmhRDaKOYW26I1st06yoBFKmk4jD61UCShSfq1OdpTLgUDW6R8t87rqcfZ1BlMr6uq6Vjhf2owGvozDKmG9dyiQCeTSAiwXVdNIP1A2uls7QkYhW/fgzVgIeXVOe6ISFOnSOjjn+uuHsK5F2NM1hLG/jSGfpjoSdjLSJg7Cp7FjaR7ZzXEGcinBJDF8DnZ1Ho7wPrYNadHdINGCLdVMdrU6nMdimqHYgiaF2kn4IXJ8FMJY6iPRxsPqTksbc55ZJP2vHgOnuYwD2tU4k/eycaT891g0F5YDZ7qfQ3SidTAZgG4By4FwHgBtYBpYbZ/l/2EJnC9N0gaQAAAAASUVORK5CYII=";
      return d;
    }();
    e.LoadingScreen = u;
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    e.M00 = 0;
    e.M01 = 4;
    e.M02 = 8;
    e.M03 = 12;
    e.M10 = 1;
    e.M11 = 5;
    e.M12 = 9;
    e.M13 = 13;
    e.M20 = 2;
    e.M21 = 6;
    e.M22 = 10;
    e.M23 = 14;
    e.M30 = 3;
    e.M31 = 7;
    e.M32 = 11;
    e.M33 = 15;
    var u = function() {
      function d() {
        this.temp = new Float32Array(16);
        var a = this.values = new Float32Array(16);
        a[e.M00] = 1;
        a[e.M11] = 1;
        a[e.M22] = 1;
        a[e.M33] = 1;
      }
      d.prototype.set = function(a) {
        this.values.set(a);
        return this;
      };
      d.prototype.transpose = function() {
        var a = this.temp, c = this.values;
        a[e.M00] = c[e.M00];
        a[e.M01] = c[e.M10];
        a[e.M02] = c[e.M20];
        a[e.M03] = c[e.M30];
        a[e.M10] = c[e.M01];
        a[e.M11] = c[e.M11];
        a[e.M12] = c[e.M21];
        a[e.M13] = c[e.M31];
        a[e.M20] = c[e.M02];
        a[e.M21] = c[e.M12];
        a[e.M22] = c[e.M22];
        a[e.M23] = c[e.M32];
        a[e.M30] = c[e.M03];
        a[e.M31] = c[e.M13];
        a[e.M32] = c[e.M23];
        a[e.M33] = c[e.M33];
        return this.set(a);
      };
      d.prototype.identity = function() {
        var a = this.values;
        a[e.M00] = 1;
        a[e.M01] = 0;
        a[e.M02] = 0;
        a[e.M03] = 0;
        a[e.M10] = 0;
        a[e.M11] = 1;
        a[e.M12] = 0;
        a[e.M13] = 0;
        a[e.M20] = 0;
        a[e.M21] = 0;
        a[e.M22] = 1;
        a[e.M23] = 0;
        a[e.M30] = 0;
        a[e.M31] = 0;
        a[e.M32] = 0;
        a[e.M33] = 1;
        return this;
      };
      d.prototype.invert = function() {
        var a = this.values, c = this.temp, b = a[e.M30] * a[e.M21] * a[e.M12] * a[e.M03] - a[e.M20] * a[e.M31] * a[e.M12] * a[e.M03] - a[e.M30] * a[e.M11] * a[e.M22] * a[e.M03] + a[e.M10] * a[e.M31] * a[e.M22] * a[e.M03] + a[e.M20] * a[e.M11] * a[e.M32] * a[e.M03] - a[e.M10] * a[e.M21] * a[e.M32] * a[e.M03] - a[e.M30] * a[e.M21] * a[e.M02] * a[e.M13] + a[e.M20] * a[e.M31] * a[e.M02] * a[e.M13] + a[e.M30] * a[e.M01] * a[e.M22] * a[e.M13] - a[e.M00] * a[e.M31] * a[e.M22] * a[e.M13] - a[e.M20] * a[e.M01] * 
        a[e.M32] * a[e.M13] + a[e.M00] * a[e.M21] * a[e.M32] * a[e.M13] + a[e.M30] * a[e.M11] * a[e.M02] * a[e.M23] - a[e.M10] * a[e.M31] * a[e.M02] * a[e.M23] - a[e.M30] * a[e.M01] * a[e.M12] * a[e.M23] + a[e.M00] * a[e.M31] * a[e.M12] * a[e.M23] + a[e.M10] * a[e.M01] * a[e.M32] * a[e.M23] - a[e.M00] * a[e.M11] * a[e.M32] * a[e.M23] - a[e.M20] * a[e.M11] * a[e.M02] * a[e.M33] + a[e.M10] * a[e.M21] * a[e.M02] * a[e.M33] + a[e.M20] * a[e.M01] * a[e.M12] * a[e.M33] - a[e.M00] * a[e.M21] * a[e.M12] * 
        a[e.M33] - a[e.M10] * a[e.M01] * a[e.M22] * a[e.M33] + a[e.M00] * a[e.M11] * a[e.M22] * a[e.M33];
        if (b == 0) {
          throw Error("non-invertible matrix");
        }
        b = 1 / b;
        c[e.M00] = a[e.M12] * a[e.M23] * a[e.M31] - a[e.M13] * a[e.M22] * a[e.M31] + a[e.M13] * a[e.M21] * a[e.M32] - a[e.M11] * a[e.M23] * a[e.M32] - a[e.M12] * a[e.M21] * a[e.M33] + a[e.M11] * a[e.M22] * a[e.M33];
        c[e.M01] = a[e.M03] * a[e.M22] * a[e.M31] - a[e.M02] * a[e.M23] * a[e.M31] - a[e.M03] * a[e.M21] * a[e.M32] + a[e.M01] * a[e.M23] * a[e.M32] + a[e.M02] * a[e.M21] * a[e.M33] - a[e.M01] * a[e.M22] * a[e.M33];
        c[e.M02] = a[e.M02] * a[e.M13] * a[e.M31] - a[e.M03] * a[e.M12] * a[e.M31] + a[e.M03] * a[e.M11] * a[e.M32] - a[e.M01] * a[e.M13] * a[e.M32] - a[e.M02] * a[e.M11] * a[e.M33] + a[e.M01] * a[e.M12] * a[e.M33];
        c[e.M03] = a[e.M03] * a[e.M12] * a[e.M21] - a[e.M02] * a[e.M13] * a[e.M21] - a[e.M03] * a[e.M11] * a[e.M22] + a[e.M01] * a[e.M13] * a[e.M22] + a[e.M02] * a[e.M11] * a[e.M23] - a[e.M01] * a[e.M12] * a[e.M23];
        c[e.M10] = a[e.M13] * a[e.M22] * a[e.M30] - a[e.M12] * a[e.M23] * a[e.M30] - a[e.M13] * a[e.M20] * a[e.M32] + a[e.M10] * a[e.M23] * a[e.M32] + a[e.M12] * a[e.M20] * a[e.M33] - a[e.M10] * a[e.M22] * a[e.M33];
        c[e.M11] = a[e.M02] * a[e.M23] * a[e.M30] - a[e.M03] * a[e.M22] * a[e.M30] + a[e.M03] * a[e.M20] * a[e.M32] - a[e.M00] * a[e.M23] * a[e.M32] - a[e.M02] * a[e.M20] * a[e.M33] + a[e.M00] * a[e.M22] * a[e.M33];
        c[e.M12] = a[e.M03] * a[e.M12] * a[e.M30] - a[e.M02] * a[e.M13] * a[e.M30] - a[e.M03] * a[e.M10] * a[e.M32] + a[e.M00] * a[e.M13] * a[e.M32] + a[e.M02] * a[e.M10] * a[e.M33] - a[e.M00] * a[e.M12] * a[e.M33];
        c[e.M13] = a[e.M02] * a[e.M13] * a[e.M20] - a[e.M03] * a[e.M12] * a[e.M20] + a[e.M03] * a[e.M10] * a[e.M22] - a[e.M00] * a[e.M13] * a[e.M22] - a[e.M02] * a[e.M10] * a[e.M23] + a[e.M00] * a[e.M12] * a[e.M23];
        c[e.M20] = a[e.M11] * a[e.M23] * a[e.M30] - a[e.M13] * a[e.M21] * a[e.M30] + a[e.M13] * a[e.M20] * a[e.M31] - a[e.M10] * a[e.M23] * a[e.M31] - a[e.M11] * a[e.M20] * a[e.M33] + a[e.M10] * a[e.M21] * a[e.M33];
        c[e.M21] = a[e.M03] * a[e.M21] * a[e.M30] - a[e.M01] * a[e.M23] * a[e.M30] - a[e.M03] * a[e.M20] * a[e.M31] + a[e.M00] * a[e.M23] * a[e.M31] + a[e.M01] * a[e.M20] * a[e.M33] - a[e.M00] * a[e.M21] * a[e.M33];
        c[e.M22] = a[e.M01] * a[e.M13] * a[e.M30] - a[e.M03] * a[e.M11] * a[e.M30] + a[e.M03] * a[e.M10] * a[e.M31] - a[e.M00] * a[e.M13] * a[e.M31] - a[e.M01] * a[e.M10] * a[e.M33] + a[e.M00] * a[e.M11] * a[e.M33];
        c[e.M23] = a[e.M03] * a[e.M11] * a[e.M20] - a[e.M01] * a[e.M13] * a[e.M20] - a[e.M03] * a[e.M10] * a[e.M21] + a[e.M00] * a[e.M13] * a[e.M21] + a[e.M01] * a[e.M10] * a[e.M23] - a[e.M00] * a[e.M11] * a[e.M23];
        c[e.M30] = a[e.M12] * a[e.M21] * a[e.M30] - a[e.M11] * a[e.M22] * a[e.M30] - a[e.M12] * a[e.M20] * a[e.M31] + a[e.M10] * a[e.M22] * a[e.M31] + a[e.M11] * a[e.M20] * a[e.M32] - a[e.M10] * a[e.M21] * a[e.M32];
        c[e.M31] = a[e.M01] * a[e.M22] * a[e.M30] - a[e.M02] * a[e.M21] * a[e.M30] + a[e.M02] * a[e.M20] * a[e.M31] - a[e.M00] * a[e.M22] * a[e.M31] - a[e.M01] * a[e.M20] * a[e.M32] + a[e.M00] * a[e.M21] * a[e.M32];
        c[e.M32] = a[e.M02] * a[e.M11] * a[e.M30] - a[e.M01] * a[e.M12] * a[e.M30] - a[e.M02] * a[e.M10] * a[e.M31] + a[e.M00] * a[e.M12] * a[e.M31] + a[e.M01] * a[e.M10] * a[e.M32] - a[e.M00] * a[e.M11] * a[e.M32];
        c[e.M33] = a[e.M01] * a[e.M12] * a[e.M20] - a[e.M02] * a[e.M11] * a[e.M20] + a[e.M02] * a[e.M10] * a[e.M21] - a[e.M00] * a[e.M12] * a[e.M21] - a[e.M01] * a[e.M10] * a[e.M22] + a[e.M00] * a[e.M11] * a[e.M22];
        a[e.M00] = c[e.M00] * b;
        a[e.M01] = c[e.M01] * b;
        a[e.M02] = c[e.M02] * b;
        a[e.M03] = c[e.M03] * b;
        a[e.M10] = c[e.M10] * b;
        a[e.M11] = c[e.M11] * b;
        a[e.M12] = c[e.M12] * b;
        a[e.M13] = c[e.M13] * b;
        a[e.M20] = c[e.M20] * b;
        a[e.M21] = c[e.M21] * b;
        a[e.M22] = c[e.M22] * b;
        a[e.M23] = c[e.M23] * b;
        a[e.M30] = c[e.M30] * b;
        a[e.M31] = c[e.M31] * b;
        a[e.M32] = c[e.M32] * b;
        a[e.M33] = c[e.M33] * b;
        return this;
      };
      d.prototype.determinant = function() {
        var a = this.values;
        return a[e.M30] * a[e.M21] * a[e.M12] * a[e.M03] - a[e.M20] * a[e.M31] * a[e.M12] * a[e.M03] - a[e.M30] * a[e.M11] * a[e.M22] * a[e.M03] + a[e.M10] * a[e.M31] * a[e.M22] * a[e.M03] + a[e.M20] * a[e.M11] * a[e.M32] * a[e.M03] - a[e.M10] * a[e.M21] * a[e.M32] * a[e.M03] - a[e.M30] * a[e.M21] * a[e.M02] * a[e.M13] + a[e.M20] * a[e.M31] * a[e.M02] * a[e.M13] + a[e.M30] * a[e.M01] * a[e.M22] * a[e.M13] - a[e.M00] * a[e.M31] * a[e.M22] * a[e.M13] - a[e.M20] * a[e.M01] * a[e.M32] * a[e.M13] + a[e.M00] * 
        a[e.M21] * a[e.M32] * a[e.M13] + a[e.M30] * a[e.M11] * a[e.M02] * a[e.M23] - a[e.M10] * a[e.M31] * a[e.M02] * a[e.M23] - a[e.M30] * a[e.M01] * a[e.M12] * a[e.M23] + a[e.M00] * a[e.M31] * a[e.M12] * a[e.M23] + a[e.M10] * a[e.M01] * a[e.M32] * a[e.M23] - a[e.M00] * a[e.M11] * a[e.M32] * a[e.M23] - a[e.M20] * a[e.M11] * a[e.M02] * a[e.M33] + a[e.M10] * a[e.M21] * a[e.M02] * a[e.M33] + a[e.M20] * a[e.M01] * a[e.M12] * a[e.M33] - a[e.M00] * a[e.M21] * a[e.M12] * a[e.M33] - a[e.M10] * a[e.M01] * 
        a[e.M22] * a[e.M33] + a[e.M00] * a[e.M11] * a[e.M22] * a[e.M33];
      };
      d.prototype.translate = function(a, c, b) {
        var h = this.values;
        h[e.M03] += a;
        h[e.M13] += c;
        h[e.M23] += b;
        return this;
      };
      d.prototype.copy = function() {
        return (new d()).set(this.values);
      };
      d.prototype.projection = function(a, c, b, h) {
        this.identity();
        b = 1 / Math.tan(Math.PI / 180 * b / 2);
        var m = this.values;
        m[e.M00] = b / h;
        m[e.M10] = 0;
        m[e.M20] = 0;
        m[e.M30] = 0;
        m[e.M01] = 0;
        m[e.M11] = b;
        m[e.M21] = 0;
        m[e.M31] = 0;
        m[e.M02] = 0;
        m[e.M12] = 0;
        m[e.M22] = (c + a) / (a - c);
        m[e.M32] = -1;
        m[e.M03] = 0;
        m[e.M13] = 0;
        m[e.M23] = 2 * c * a / (a - c);
        m[e.M33] = 0;
        return this;
      };
      d.prototype.ortho2d = function(a, c, b, h) {
        return this.ortho(a, a + b, c, c + h, 0, 1);
      };
      d.prototype.ortho = function(a, c, b, h, m, k) {
        this.identity();
        var f = this.values;
        f[e.M00] = 2 / (c - a);
        f[e.M10] = 0;
        f[e.M20] = 0;
        f[e.M30] = 0;
        f[e.M01] = 0;
        f[e.M11] = 2 / (h - b);
        f[e.M21] = 0;
        f[e.M31] = 0;
        f[e.M02] = 0;
        f[e.M12] = 0;
        f[e.M22] = -2 / (k - m);
        f[e.M32] = 0;
        f[e.M03] = -(c + a) / (c - a);
        f[e.M13] = -(h + b) / (h - b);
        f[e.M23] = -(k + m) / (k - m);
        f[e.M33] = 1;
        return this;
      };
      d.prototype.multiply = function(a) {
        var c = this.temp, b = this.values;
        a = a.values;
        c[e.M00] = b[e.M00] * a[e.M00] + b[e.M01] * a[e.M10] + b[e.M02] * a[e.M20] + b[e.M03] * a[e.M30];
        c[e.M01] = b[e.M00] * a[e.M01] + b[e.M01] * a[e.M11] + b[e.M02] * a[e.M21] + b[e.M03] * a[e.M31];
        c[e.M02] = b[e.M00] * a[e.M02] + b[e.M01] * a[e.M12] + b[e.M02] * a[e.M22] + b[e.M03] * a[e.M32];
        c[e.M03] = b[e.M00] * a[e.M03] + b[e.M01] * a[e.M13] + b[e.M02] * a[e.M23] + b[e.M03] * a[e.M33];
        c[e.M10] = b[e.M10] * a[e.M00] + b[e.M11] * a[e.M10] + b[e.M12] * a[e.M20] + b[e.M13] * a[e.M30];
        c[e.M11] = b[e.M10] * a[e.M01] + b[e.M11] * a[e.M11] + b[e.M12] * a[e.M21] + b[e.M13] * a[e.M31];
        c[e.M12] = b[e.M10] * a[e.M02] + b[e.M11] * a[e.M12] + b[e.M12] * a[e.M22] + b[e.M13] * a[e.M32];
        c[e.M13] = b[e.M10] * a[e.M03] + b[e.M11] * a[e.M13] + b[e.M12] * a[e.M23] + b[e.M13] * a[e.M33];
        c[e.M20] = b[e.M20] * a[e.M00] + b[e.M21] * a[e.M10] + b[e.M22] * a[e.M20] + b[e.M23] * a[e.M30];
        c[e.M21] = b[e.M20] * a[e.M01] + b[e.M21] * a[e.M11] + b[e.M22] * a[e.M21] + b[e.M23] * a[e.M31];
        c[e.M22] = b[e.M20] * a[e.M02] + b[e.M21] * a[e.M12] + b[e.M22] * a[e.M22] + b[e.M23] * a[e.M32];
        c[e.M23] = b[e.M20] * a[e.M03] + b[e.M21] * a[e.M13] + b[e.M22] * a[e.M23] + b[e.M23] * a[e.M33];
        c[e.M30] = b[e.M30] * a[e.M00] + b[e.M31] * a[e.M10] + b[e.M32] * a[e.M20] + b[e.M33] * a[e.M30];
        c[e.M31] = b[e.M30] * a[e.M01] + b[e.M31] * a[e.M11] + b[e.M32] * a[e.M21] + b[e.M33] * a[e.M31];
        c[e.M32] = b[e.M30] * a[e.M02] + b[e.M31] * a[e.M12] + b[e.M32] * a[e.M22] + b[e.M33] * a[e.M32];
        c[e.M33] = b[e.M30] * a[e.M03] + b[e.M31] * a[e.M13] + b[e.M32] * a[e.M23] + b[e.M33] * a[e.M33];
        return this.set(this.temp);
      };
      d.prototype.multiplyLeft = function(a) {
        var c = this.temp, b = this.values;
        a = a.values;
        c[e.M00] = a[e.M00] * b[e.M00] + a[e.M01] * b[e.M10] + a[e.M02] * b[e.M20] + a[e.M03] * b[e.M30];
        c[e.M01] = a[e.M00] * b[e.M01] + a[e.M01] * b[e.M11] + a[e.M02] * b[e.M21] + a[e.M03] * b[e.M31];
        c[e.M02] = a[e.M00] * b[e.M02] + a[e.M01] * b[e.M12] + a[e.M02] * b[e.M22] + a[e.M03] * b[e.M32];
        c[e.M03] = a[e.M00] * b[e.M03] + a[e.M01] * b[e.M13] + a[e.M02] * b[e.M23] + a[e.M03] * b[e.M33];
        c[e.M10] = a[e.M10] * b[e.M00] + a[e.M11] * b[e.M10] + a[e.M12] * b[e.M20] + a[e.M13] * b[e.M30];
        c[e.M11] = a[e.M10] * b[e.M01] + a[e.M11] * b[e.M11] + a[e.M12] * b[e.M21] + a[e.M13] * b[e.M31];
        c[e.M12] = a[e.M10] * b[e.M02] + a[e.M11] * b[e.M12] + a[e.M12] * b[e.M22] + a[e.M13] * b[e.M32];
        c[e.M13] = a[e.M10] * b[e.M03] + a[e.M11] * b[e.M13] + a[e.M12] * b[e.M23] + a[e.M13] * b[e.M33];
        c[e.M20] = a[e.M20] * b[e.M00] + a[e.M21] * b[e.M10] + a[e.M22] * b[e.M20] + a[e.M23] * b[e.M30];
        c[e.M21] = a[e.M20] * b[e.M01] + a[e.M21] * b[e.M11] + a[e.M22] * b[e.M21] + a[e.M23] * b[e.M31];
        c[e.M22] = a[e.M20] * b[e.M02] + a[e.M21] * b[e.M12] + a[e.M22] * b[e.M22] + a[e.M23] * b[e.M32];
        c[e.M23] = a[e.M20] * b[e.M03] + a[e.M21] * b[e.M13] + a[e.M22] * b[e.M23] + a[e.M23] * b[e.M33];
        c[e.M30] = a[e.M30] * b[e.M00] + a[e.M31] * b[e.M10] + a[e.M32] * b[e.M20] + a[e.M33] * b[e.M30];
        c[e.M31] = a[e.M30] * b[e.M01] + a[e.M31] * b[e.M11] + a[e.M32] * b[e.M21] + a[e.M33] * b[e.M31];
        c[e.M32] = a[e.M30] * b[e.M02] + a[e.M31] * b[e.M12] + a[e.M32] * b[e.M22] + a[e.M33] * b[e.M32];
        c[e.M33] = a[e.M30] * b[e.M03] + a[e.M31] * b[e.M13] + a[e.M32] * b[e.M23] + a[e.M33] * b[e.M33];
        return this.set(this.temp);
      };
      d.prototype.lookAt = function(a, c, b) {
        d.initTemps();
        var h = d.xAxis, m = d.yAxis, k = d.zAxis;
        k.setFrom(c).normalize();
        h.setFrom(c).normalize();
        h.cross(b).normalize();
        m.setFrom(h).cross(k).normalize();
        this.identity();
        c = this.values;
        c[e.M00] = h.x;
        c[e.M01] = h.y;
        c[e.M02] = h.z;
        c[e.M10] = m.x;
        c[e.M11] = m.y;
        c[e.M12] = m.z;
        c[e.M20] = -k.x;
        c[e.M21] = -k.y;
        c[e.M22] = -k.z;
        d.tmpMatrix.identity();
        d.tmpMatrix.values[e.M03] = -a.x;
        d.tmpMatrix.values[e.M13] = -a.y;
        d.tmpMatrix.values[e.M23] = -a.z;
        this.multiply(d.tmpMatrix);
        return this;
      };
      d.initTemps = function() {
        d.xAxis === null && (d.xAxis = new e.Vector3());
        d.yAxis === null && (d.yAxis = new e.Vector3());
        d.zAxis === null && (d.zAxis = new e.Vector3());
      };
      d.xAxis = null;
      d.yAxis = null;
      d.zAxis = null;
      d.tmpMatrix = new d();
      return d;
    }();
    e.Matrix4 = u;
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function() {
      function c(b, h, m, k) {
        this.attributes = h;
        this.verticesLength = 0;
        this.dirtyVertices = !1;
        this.indicesLength = 0;
        this.dirtyIndices = !1;
        this.elementsPerVertex = 0;
        this.context = b instanceof e.ManagedWebGLRenderingContext ? b : new e.ManagedWebGLRenderingContext(b);
        for (b = this.elementsPerVertex = 0; b < h.length; b++) {
          this.elementsPerVertex += h[b].numElements;
        }
        this.vertices = new Float32Array(m * this.elementsPerVertex);
        this.indices = new Uint16Array(k);
        this.context.addRestorable(this);
      }
      c.prototype.getAttributes = function() {
        return this.attributes;
      };
      c.prototype.maxVertices = function() {
        return this.vertices.length / this.elementsPerVertex;
      };
      c.prototype.numVertices = function() {
        return this.verticesLength / this.elementsPerVertex;
      };
      c.prototype.setVerticesLength = function(b) {
        this.dirtyVertices = !0;
        this.verticesLength = b;
      };
      c.prototype.getVertices = function() {
        return this.vertices;
      };
      c.prototype.maxIndices = function() {
        return this.indices.length;
      };
      c.prototype.numIndices = function() {
        return this.indicesLength;
      };
      c.prototype.setIndicesLength = function(b) {
        this.dirtyIndices = !0;
        this.indicesLength = b;
      };
      c.prototype.getIndices = function() {
        return this.indices;
      };
      c.prototype.getVertexSizeInFloats = function() {
        for (var b = 0, h = 0; h < this.attributes.length; h++) {
          b += this.attributes[h].numElements;
        }
        return b;
      };
      c.prototype.setVertices = function(b) {
        this.dirtyVertices = !0;
        if (b.length > this.vertices.length) {
          throw Error("Mesh can't store more than " + this.maxVertices() + " vertices");
        }
        this.vertices.set(b, 0);
        this.verticesLength = b.length;
      };
      c.prototype.setIndices = function(b) {
        this.dirtyIndices = !0;
        if (b.length > this.indices.length) {
          throw Error("Mesh can't store more than " + this.maxIndices() + " indices");
        }
        this.indices.set(b, 0);
        this.indicesLength = b.length;
      };
      c.prototype.draw = function(b, h) {
        this.drawWithOffset(b, h, 0, this.indicesLength > 0 ? this.indicesLength : this.verticesLength / this.elementsPerVertex);
      };
      c.prototype.drawWithOffset = function(b, h, m, k) {
        var f = this.context.gl;
        (this.dirtyVertices || this.dirtyIndices) && this.update();
        this.bind(b);
        this.indicesLength > 0 ? f.drawElements(h, k, f.UNSIGNED_SHORT, m * 2) : f.drawArrays(h, m, k);
        this.unbind(b);
      };
      c.prototype.bind = function(b) {
        var h = this.context.gl;
        h.bindBuffer(h.ARRAY_BUFFER, this.verticesBuffer);
        for (var m = 0, k = 0; k < this.attributes.length; k++) {
          var f = this.attributes[k], g = b.getAttributeLocation(f.name);
          h.enableVertexAttribArray(g);
          h.vertexAttribPointer(g, f.numElements, h.FLOAT, !1, this.elementsPerVertex * 4, m * 4);
          m += f.numElements;
        }
        this.indicesLength > 0 && h.bindBuffer(h.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
      };
      c.prototype.unbind = function(b) {
        for (var h = this.context.gl, m = 0; m < this.attributes.length; m++) {
          var k = b.getAttributeLocation(this.attributes[m].name);
          h.disableVertexAttribArray(k);
        }
        h.bindBuffer(h.ARRAY_BUFFER, null);
        this.indicesLength > 0 && h.bindBuffer(h.ELEMENT_ARRAY_BUFFER, null);
      };
      c.prototype.update = function() {
        var b = this.context.gl;
        this.dirtyVertices && (this.verticesBuffer || (this.verticesBuffer = b.createBuffer()), b.bindBuffer(b.ARRAY_BUFFER, this.verticesBuffer), b.bufferData(b.ARRAY_BUFFER, this.vertices.subarray(0, this.verticesLength), b.DYNAMIC_DRAW), this.dirtyVertices = !1);
        this.dirtyIndices && (this.indicesBuffer || (this.indicesBuffer = b.createBuffer()), b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this.indicesBuffer), b.bufferData(b.ELEMENT_ARRAY_BUFFER, this.indices.subarray(0, this.indicesLength), b.DYNAMIC_DRAW), this.dirtyIndices = !1);
      };
      c.prototype.restore = function() {
        this.indicesBuffer = this.verticesBuffer = null;
        this.update();
      };
      c.prototype.dispose = function() {
        this.context.removeRestorable(this);
        var b = this.context.gl;
        b.deleteBuffer(this.verticesBuffer);
        b.deleteBuffer(this.indicesBuffer);
      };
      return c;
    }();
    e.Mesh = u;
    u = function() {
      return function(c, b, h) {
        this.name = c;
        this.type = b;
        this.numElements = h;
      };
    }();
    e.VertexAttribute = u;
    var d = function(c) {
      function b() {
        return c.call(this, e.Shader.POSITION, a.Float, 2) || this;
      }
      __extends(b, c);
      return b;
    }(u);
    e.Position2Attribute = d;
    d = function(c) {
      function b() {
        return c.call(this, e.Shader.POSITION, a.Float, 3) || this;
      }
      __extends(b, c);
      return b;
    }(u);
    e.Position3Attribute = d;
    d = function(c) {
      function b(h) {
        h === void 0 && (h = 0);
        return c.call(this, e.Shader.TEXCOORDS + (h == 0 ? "" : h), a.Float, 2) || this;
      }
      __extends(b, c);
      return b;
    }(u);
    e.TexCoordAttribute = d;
    d = function(c) {
      function b() {
        return c.call(this, e.Shader.COLOR, a.Float, 4) || this;
      }
      __extends(b, c);
      return b;
    }(u);
    e.ColorAttribute = d;
    u = function(c) {
      function b() {
        return c.call(this, e.Shader.COLOR2, a.Float, 4) || this;
      }
      __extends(b, c);
      return b;
    }(u);
    e.Color2Attribute = u;
    var a;
    (function(c) {
      c[c.Float = 0] = "Float";
    })(a = e.VertexAttributeType || (e.VertexAttributeType = {}));
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function() {
      function d(a, c, b) {
        c === void 0 && (c = !0);
        b === void 0 && (b = 10920);
        this.isDrawing = !1;
        this.lastTexture = this.shader = null;
        this.indicesLength = this.verticesLength = 0;
        if (b > 10920) {
          throw Error("Can't have more than 10920 triangles per batch: " + b);
        }
        this.context = a instanceof e.ManagedWebGLRenderingContext ? a : new e.ManagedWebGLRenderingContext(a);
        c = c ? [new e.Position2Attribute(), new e.ColorAttribute(), new e.TexCoordAttribute(), new e.Color2Attribute()] : [new e.Position2Attribute(), new e.ColorAttribute(), new e.TexCoordAttribute()];
        this.mesh = new e.Mesh(a, c, b, b * 3);
        this.srcBlend = this.context.gl.SRC_ALPHA;
        this.dstBlend = this.context.gl.ONE_MINUS_SRC_ALPHA;
      }
      d.prototype.begin = function(a) {
        var c = this.context.gl;
        if (this.isDrawing) {
          throw Error("PolygonBatch is already drawing. Call PolygonBatch.end() before calling PolygonBatch.begin()");
        }
        this.drawCalls = 0;
        this.shader = a;
        this.lastTexture = null;
        this.isDrawing = !0;
        c.enable(c.BLEND);
        c.blendFunc(this.srcBlend, this.dstBlend);
      };
      d.prototype.setBlendMode = function(a, c) {
        var b = this.context.gl;
        this.srcBlend = a;
        this.dstBlend = c;
        this.isDrawing && (this.flush(), b.blendFunc(this.srcBlend, this.dstBlend));
      };
      d.prototype.draw = function(a, c, b) {
        a != this.lastTexture ? (this.flush(), this.lastTexture = a) : (this.verticesLength + c.length > this.mesh.getVertices().length || this.indicesLength + b.length > this.mesh.getIndices().length) && this.flush();
        a = this.mesh.numVertices();
        this.mesh.getVertices().set(c, this.verticesLength);
        this.verticesLength += c.length;
        this.mesh.setVerticesLength(this.verticesLength);
        c = this.mesh.getIndices();
        for (var h = this.indicesLength, m = 0; m < b.length; h++, m++) {
          c[h] = b[m] + a;
        }
        this.indicesLength += b.length;
        this.mesh.setIndicesLength(this.indicesLength);
      };
      d.prototype.flush = function() {
        var a = this.context.gl;
        this.verticesLength != 0 && (this.lastTexture.bind(), this.mesh.draw(this.shader, a.TRIANGLES), this.indicesLength = this.verticesLength = 0, this.mesh.setVerticesLength(0), this.mesh.setIndicesLength(0), this.drawCalls++);
      };
      d.prototype.end = function() {
        var a = this.context.gl;
        if (!this.isDrawing) {
          throw Error("PolygonBatch is not drawing. Call PolygonBatch.begin() before calling PolygonBatch.end()");
        }
        (this.verticesLength > 0 || this.indicesLength > 0) && this.flush();
        this.lastTexture = this.shader = null;
        this.isDrawing = !1;
        a.disable(a.BLEND);
      };
      d.prototype.getDrawCalls = function() {
        return this.drawCalls;
      };
      d.prototype.dispose = function() {
        this.mesh.dispose();
      };
      return d;
    }();
    e.PolygonBatcher = u;
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function() {
      function a(c, b, h) {
        h === void 0 && (h = !0);
        this.twoColorTint = !1;
        this.activeRenderer = null;
        this.QUAD = [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0];
        this.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];
        this.WHITE = new n.Color(1, 1, 1, 1);
        this.canvas = c;
        this.context = b instanceof e.ManagedWebGLRenderingContext ? b : new e.ManagedWebGLRenderingContext(b);
        this.twoColorTint = h;
        this.camera = new e.OrthoCamera(c.width, c.height);
        this.batcherShader = h ? e.Shader.newTwoColoredTextured(this.context) : e.Shader.newColoredTextured(this.context);
        this.batcher = new e.PolygonBatcher(this.context, h);
        this.shapesShader = e.Shader.newColored(this.context);
        this.shapes = new e.ShapeRenderer(this.context);
        this.skeletonRenderer = new e.SkeletonRenderer(this.context, h);
        this.skeletonDebugRenderer = new e.SkeletonDebugRenderer(this.context);
      }
      a.prototype.begin = function() {
        this.camera.update();
        this.enableRenderer(this.batcher);
      };
      a.prototype.drawSkeleton = function(c, b, h, m) {
        b === void 0 && (b = !1);
        h === void 0 && (h = -1);
        m === void 0 && (m = -1);
        this.enableRenderer(this.batcher);
        this.skeletonRenderer.premultipliedAlpha = b;
        this.skeletonRenderer.draw(this.batcher, c, h, m);
      };
      a.prototype.drawSkeletonDebug = function(c, b, h) {
        b === void 0 && (b = !1);
        h === void 0 && (h = null);
        this.enableRenderer(this.shapes);
        this.skeletonDebugRenderer.premultipliedAlpha = b;
        this.skeletonDebugRenderer.draw(this.shapes, c, h);
      };
      a.prototype.drawTexture = function(c, b, h, m, k, f) {
        f === void 0 && (f = null);
        this.enableRenderer(this.batcher);
        f === null && (f = this.WHITE);
        var g = this.QUAD, l = 0;
        g[l++] = b;
        g[l++] = h;
        g[l++] = f.r;
        g[l++] = f.g;
        g[l++] = f.b;
        g[l++] = f.a;
        g[l++] = 0;
        g[l++] = 1;
        this.twoColorTint && (g[l++] = 0, g[l++] = 0, g[l++] = 0, g[l++] = 0);
        g[l++] = b + m;
        g[l++] = h;
        g[l++] = f.r;
        g[l++] = f.g;
        g[l++] = f.b;
        g[l++] = f.a;
        g[l++] = 1;
        g[l++] = 1;
        this.twoColorTint && (g[l++] = 0, g[l++] = 0, g[l++] = 0, g[l++] = 0);
        g[l++] = b + m;
        g[l++] = h + k;
        g[l++] = f.r;
        g[l++] = f.g;
        g[l++] = f.b;
        g[l++] = f.a;
        g[l++] = 1;
        g[l++] = 0;
        this.twoColorTint && (g[l++] = 0, g[l++] = 0, g[l++] = 0, g[l++] = 0);
        g[l++] = b;
        g[l++] = h + k;
        g[l++] = f.r;
        g[l++] = f.g;
        g[l++] = f.b;
        g[l++] = f.a;
        g[l++] = 0;
        g[l++] = 0;
        this.twoColorTint && (g[l++] = 0, g[l++] = 0, g[l++] = 0, g[l++] = 0);
        this.batcher.draw(c, g, this.QUAD_TRIANGLES);
      };
      a.prototype.drawTextureUV = function(c, b, h, m, k, f, g, l, p, q) {
        q === void 0 && (q = null);
        this.enableRenderer(this.batcher);
        q === null && (q = this.WHITE);
        var r = this.QUAD, w = 0;
        r[w++] = b;
        r[w++] = h;
        r[w++] = q.r;
        r[w++] = q.g;
        r[w++] = q.b;
        r[w++] = q.a;
        r[w++] = f;
        r[w++] = g;
        this.twoColorTint && (r[w++] = 0, r[w++] = 0, r[w++] = 0, r[w++] = 0);
        r[w++] = b + m;
        r[w++] = h;
        r[w++] = q.r;
        r[w++] = q.g;
        r[w++] = q.b;
        r[w++] = q.a;
        r[w++] = l;
        r[w++] = g;
        this.twoColorTint && (r[w++] = 0, r[w++] = 0, r[w++] = 0, r[w++] = 0);
        r[w++] = b + m;
        r[w++] = h + k;
        r[w++] = q.r;
        r[w++] = q.g;
        r[w++] = q.b;
        r[w++] = q.a;
        r[w++] = l;
        r[w++] = p;
        this.twoColorTint && (r[w++] = 0, r[w++] = 0, r[w++] = 0, r[w++] = 0);
        r[w++] = b;
        r[w++] = h + k;
        r[w++] = q.r;
        r[w++] = q.g;
        r[w++] = q.b;
        r[w++] = q.a;
        r[w++] = f;
        r[w++] = p;
        this.twoColorTint && (r[w++] = 0, r[w++] = 0, r[w++] = 0, r[w++] = 0);
        this.batcher.draw(c, r, this.QUAD_TRIANGLES);
      };
      a.prototype.drawTextureRotated = function(c, b, h, m, k, f, g, l, p, q) {
        p === void 0 && (p = null);
        this.enableRenderer(this.batcher);
        p === null && (p = this.WHITE);
        q = this.QUAD;
        b += f;
        h += g;
        var r = -f, w = -g;
        m -= f;
        var t = k - g;
        if (l != 0) {
          var v = n.MathUtils.cosDeg(l), x = n.MathUtils.sinDeg(l);
          l = v * r - x * w;
          k = x * r + v * w;
          g = v * r - x * t;
          f = x * r + v * t;
          r = v * m - x * t;
          t = x * m + v * t;
          m = r + (l - g);
          w = t + (k - f);
        } else {
          l = r, k = w, g = r, f = t, r = m;
        }
        v = 0;
        q[v++] = l + b;
        q[v++] = k + h;
        q[v++] = p.r;
        q[v++] = p.g;
        q[v++] = p.b;
        q[v++] = p.a;
        q[v++] = 0;
        q[v++] = 1;
        this.twoColorTint && (q[v++] = 0, q[v++] = 0, q[v++] = 0, q[v++] = 0);
        q[v++] = m + b;
        q[v++] = w + h;
        q[v++] = p.r;
        q[v++] = p.g;
        q[v++] = p.b;
        q[v++] = p.a;
        q[v++] = 1;
        q[v++] = 1;
        this.twoColorTint && (q[v++] = 0, q[v++] = 0, q[v++] = 0, q[v++] = 0);
        q[v++] = r + b;
        q[v++] = t + h;
        q[v++] = p.r;
        q[v++] = p.g;
        q[v++] = p.b;
        q[v++] = p.a;
        q[v++] = 1;
        q[v++] = 0;
        this.twoColorTint && (q[v++] = 0, q[v++] = 0, q[v++] = 0, q[v++] = 0);
        q[v++] = g + b;
        q[v++] = f + h;
        q[v++] = p.r;
        q[v++] = p.g;
        q[v++] = p.b;
        q[v++] = p.a;
        q[v++] = 0;
        q[v++] = 0;
        this.twoColorTint && (q[v++] = 0, q[v++] = 0, q[v++] = 0, q[v++] = 0);
        this.batcher.draw(c, q, this.QUAD_TRIANGLES);
      };
      a.prototype.drawRegion = function(c, b, h, m, k, f, g) {
        f === void 0 && (f = null);
        this.enableRenderer(this.batcher);
        f === null && (f = this.WHITE);
        g = this.QUAD;
        var l = 0;
        g[l++] = b;
        g[l++] = h;
        g[l++] = f.r;
        g[l++] = f.g;
        g[l++] = f.b;
        g[l++] = f.a;
        g[l++] = c.u;
        g[l++] = c.v2;
        this.twoColorTint && (g[l++] = 0, g[l++] = 0, g[l++] = 0, g[l++] = 0);
        g[l++] = b + m;
        g[l++] = h;
        g[l++] = f.r;
        g[l++] = f.g;
        g[l++] = f.b;
        g[l++] = f.a;
        g[l++] = c.u2;
        g[l++] = c.v2;
        this.twoColorTint && (g[l++] = 0, g[l++] = 0, g[l++] = 0, g[l++] = 0);
        g[l++] = b + m;
        g[l++] = h + k;
        g[l++] = f.r;
        g[l++] = f.g;
        g[l++] = f.b;
        g[l++] = f.a;
        g[l++] = c.u2;
        g[l++] = c.v;
        this.twoColorTint && (g[l++] = 0, g[l++] = 0, g[l++] = 0, g[l++] = 0);
        g[l++] = b;
        g[l++] = h + k;
        g[l++] = f.r;
        g[l++] = f.g;
        g[l++] = f.b;
        g[l++] = f.a;
        g[l++] = c.u;
        g[l++] = c.v;
        this.twoColorTint && (g[l++] = 0, g[l++] = 0, g[l++] = 0, g[l++] = 0);
        this.batcher.draw(c.texture, g, this.QUAD_TRIANGLES);
      };
      a.prototype.line = function(c, b, h, m, k, f) {
        k === void 0 && (k = null);
        this.enableRenderer(this.shapes);
        this.shapes.line(c, b, h, m, k);
      };
      a.prototype.triangle = function(c, b, h, m, k, f, g, l, p, q) {
        l === void 0 && (l = null);
        p === void 0 && (p = null);
        q === void 0 && (q = null);
        this.enableRenderer(this.shapes);
        this.shapes.triangle(c, b, h, m, k, f, g, l, p, q);
      };
      a.prototype.quad = function(c, b, h, m, k, f, g, l, p, q, r, w, t) {
        q === void 0 && (q = null);
        r === void 0 && (r = null);
        w === void 0 && (w = null);
        t === void 0 && (t = null);
        this.enableRenderer(this.shapes);
        this.shapes.quad(c, b, h, m, k, f, g, l, p, q, r, w, t);
      };
      a.prototype.rect = function(c, b, h, m, k, f) {
        f === void 0 && (f = null);
        this.enableRenderer(this.shapes);
        this.shapes.rect(c, b, h, m, k, f);
      };
      a.prototype.rectLine = function(c, b, h, m, k, f, g) {
        g === void 0 && (g = null);
        this.enableRenderer(this.shapes);
        this.shapes.rectLine(c, b, h, m, k, f, g);
      };
      a.prototype.polygon = function(c, b, h, m) {
        m === void 0 && (m = null);
        this.enableRenderer(this.shapes);
        this.shapes.polygon(c, b, h, m);
      };
      a.prototype.circle = function(c, b, h, m, k, f) {
        k === void 0 && (k = null);
        f === void 0 && (f = 0);
        this.enableRenderer(this.shapes);
        this.shapes.circle(c, b, h, m, k, f);
      };
      a.prototype.curve = function(c, b, h, m, k, f, g, l, p, q) {
        q === void 0 && (q = null);
        this.enableRenderer(this.shapes);
        this.shapes.curve(c, b, h, m, k, f, g, l, p, q);
      };
      a.prototype.end = function() {
        this.activeRenderer === this.batcher ? this.batcher.end() : this.activeRenderer === this.shapes && this.shapes.end();
        this.activeRenderer = null;
      };
      a.prototype.resize = function(c) {
        var b = this.canvas, h = b.clientWidth, m = b.clientHeight;
        if (b.width != h || b.height != m) {
          b.width = h, b.height = m;
        }
        this.context.gl.viewport(0, 0, b.width, b.height);
        c !== d.Stretch && (c === d.Expand ? this.camera.setViewport(h, m) : c === d.Fit && (c = b.width, b = b.height, h = this.camera.viewportWidth, m = this.camera.viewportHeight, h = m / h < b / c ? h / c : m / b, this.camera.viewportWidth = c * h, this.camera.viewportHeight = b * h));
        this.camera.update();
      };
      a.prototype.enableRenderer = function(c) {
        this.activeRenderer !== c && (this.end(), c instanceof e.PolygonBatcher ? (this.batcherShader.bind(), this.batcherShader.setUniform4x4f(e.Shader.MVP_MATRIX, this.camera.projectionView.values), this.batcherShader.setUniformi("u_texture", 0), this.batcher.begin(this.batcherShader), this.activeRenderer = this.batcher) : c instanceof e.ShapeRenderer ? (this.shapesShader.bind(), this.shapesShader.setUniform4x4f(e.Shader.MVP_MATRIX, this.camera.projectionView.values), this.shapes.begin(this.shapesShader), 
        this.activeRenderer = this.shapes) : this.activeRenderer = this.skeletonDebugRenderer);
      };
      a.prototype.dispose = function() {
        this.batcher.dispose();
        this.batcherShader.dispose();
        this.shapes.dispose();
        this.shapesShader.dispose();
        this.skeletonDebugRenderer.dispose();
      };
      return a;
    }();
    e.SceneRenderer = u;
    var d;
    (function(a) {
      a[a.Stretch = 0] = "Stretch";
      a[a.Expand = 1] = "Expand";
      a[a.Fit = 2] = "Fit";
    })(d = e.ResizeMode || (e.ResizeMode = {}));
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function() {
      function d(a, c, b) {
        this.vertexShader = c;
        this.fragmentShader = b;
        this.program = this.fs = this.vs = null;
        this.tmp2x2 = new Float32Array(4);
        this.tmp3x3 = new Float32Array(9);
        this.tmp4x4 = new Float32Array(16);
        this.vsSource = c;
        this.fsSource = b;
        this.context = a instanceof e.ManagedWebGLRenderingContext ? a : new e.ManagedWebGLRenderingContext(a);
        this.context.addRestorable(this);
        this.compile();
      }
      d.prototype.getProgram = function() {
        return this.program;
      };
      d.prototype.getVertexShader = function() {
        return this.vertexShader;
      };
      d.prototype.getFragmentShader = function() {
        return this.fragmentShader;
      };
      d.prototype.getVertexShaderSource = function() {
        return this.vsSource;
      };
      d.prototype.getFragmentSource = function() {
        return this.fsSource;
      };
      d.prototype.compile = function() {
        var a = this.context.gl;
        try {
          this.vs = this.compileShader(a.VERTEX_SHADER, this.vertexShader), this.fs = this.compileShader(a.FRAGMENT_SHADER, this.fragmentShader), this.program = this.compileProgram(this.vs, this.fs);
        } catch (c) {
          throw this.dispose(), c;
        }
      };
      d.prototype.compileShader = function(a, c) {
        var b = this.context.gl;
        a = b.createShader(a);
        b.shaderSource(a, c);
        b.compileShader(a);
        if (!b.getShaderParameter(a, b.COMPILE_STATUS) && (c = "Couldn't compile shader: " + b.getShaderInfoLog(a), b.deleteShader(a), !b.isContextLost())) {
          throw Error(c);
        }
        return a;
      };
      d.prototype.compileProgram = function(a, c) {
        var b = this.context.gl, h = b.createProgram();
        b.attachShader(h, a);
        b.attachShader(h, c);
        b.linkProgram(h);
        if (!b.getProgramParameter(h, b.LINK_STATUS) && (a = "Couldn't compile shader program: " + b.getProgramInfoLog(h), b.deleteProgram(h), !b.isContextLost())) {
          throw Error(a);
        }
        return h;
      };
      d.prototype.restore = function() {
        this.compile();
      };
      d.prototype.bind = function() {
        this.context.gl.useProgram(this.program);
      };
      d.prototype.unbind = function() {
        this.context.gl.useProgram(null);
      };
      d.prototype.setUniformi = function(a, c) {
        this.context.gl.uniform1i(this.getUniformLocation(a), c);
      };
      d.prototype.setUniformf = function(a, c) {
        this.context.gl.uniform1f(this.getUniformLocation(a), c);
      };
      d.prototype.setUniform2f = function(a, c, b) {
        this.context.gl.uniform2f(this.getUniformLocation(a), c, b);
      };
      d.prototype.setUniform3f = function(a, c, b, h) {
        this.context.gl.uniform3f(this.getUniformLocation(a), c, b, h);
      };
      d.prototype.setUniform4f = function(a, c, b, h, m) {
        this.context.gl.uniform4f(this.getUniformLocation(a), c, b, h, m);
      };
      d.prototype.setUniform2x2f = function(a, c) {
        var b = this.context.gl;
        this.tmp2x2.set(c);
        b.uniformMatrix2fv(this.getUniformLocation(a), !1, this.tmp2x2);
      };
      d.prototype.setUniform3x3f = function(a, c) {
        var b = this.context.gl;
        this.tmp3x3.set(c);
        b.uniformMatrix3fv(this.getUniformLocation(a), !1, this.tmp3x3);
      };
      d.prototype.setUniform4x4f = function(a, c) {
        var b = this.context.gl;
        this.tmp4x4.set(c);
        b.uniformMatrix4fv(this.getUniformLocation(a), !1, this.tmp4x4);
      };
      d.prototype.getUniformLocation = function(a) {
        var c = this.context.gl, b = c.getUniformLocation(this.program, a);
        if (!b && !c.isContextLost()) {
          throw Error("Couldn't find location for uniform " + a);
        }
        return b;
      };
      d.prototype.getAttributeLocation = function(a) {
        var c = this.context.gl, b = c.getAttribLocation(this.program, a);
        if (b == -1 && !c.isContextLost()) {
          throw Error("Couldn't find location for attribute " + a);
        }
        return b;
      };
      d.prototype.dispose = function() {
        this.context.removeRestorable(this);
        var a = this.context.gl;
        this.vs && (a.deleteShader(this.vs), this.vs = null);
        this.fs && (a.deleteShader(this.fs), this.fs = null);
        this.program && (a.deleteProgram(this.program), this.program = null);
      };
      d.newColoredTextured = function(a) {
        return new d(a, "\n\t\t\t\tattribute vec4 " + d.POSITION + ";\n\t\t\t\tattribute vec4 " + d.COLOR + ";\n\t\t\t\tattribute vec2 " + d.TEXCOORDS + ";\n\t\t\t\tuniform mat4 " + d.MVP_MATRIX + ";\n\t\t\t\tvarying vec4 v_color;\n\t\t\t\tvarying vec2 v_texCoords;\n\n\t\t\t\tvoid main () {\n\t\t\t\t\tv_color = " + d.COLOR + ";\n\t\t\t\t\tv_texCoords = " + d.TEXCOORDS + ";\n\t\t\t\t\tgl_Position = " + d.MVP_MATRIX + " * " + d.POSITION + ";\n\t\t\t\t}\n\t\t\t", "\n\t\t\t\t#ifdef GL_ES\n\t\t\t\t\t#define LOWP lowp\n\t\t\t\t\tprecision mediump float;\n\t\t\t\t#else\n\t\t\t\t\t#define LOWP\n\t\t\t\t#endif\n\t\t\t\tvarying LOWP vec4 v_color;\n\t\t\t\tvarying vec2 v_texCoords;\n\t\t\t\tuniform sampler2D u_texture;\n\n\t\t\t\tvoid main () {\n\t\t\t\t\tgl_FragColor = v_color * texture2D(u_texture, v_texCoords);\n\t\t\t\t}\n\t\t\t");
      };
      d.newTwoColoredTextured = function(a) {
        return new d(a, "\n\t\t\t\tattribute vec4 " + d.POSITION + ";\n\t\t\t\tattribute vec4 " + d.COLOR + ";\n\t\t\t\tattribute vec4 " + d.COLOR2 + ";\n\t\t\t\tattribute vec2 " + d.TEXCOORDS + ";\n\t\t\t\tuniform mat4 " + d.MVP_MATRIX + ";\n\t\t\t\tvarying vec4 v_light;\n\t\t\t\tvarying vec4 v_dark;\n\t\t\t\tvarying vec2 v_texCoords;\n\n\t\t\t\tvoid main () {\n\t\t\t\t\tv_light = " + d.COLOR + ";\n\t\t\t\t\tv_dark = " + d.COLOR2 + ";\n\t\t\t\t\tv_texCoords = " + d.TEXCOORDS + ";\n\t\t\t\t\tgl_Position = " + 
        d.MVP_MATRIX + " * " + d.POSITION + ";\n\t\t\t\t}\n\t\t\t", "\n\t\t\t\t#ifdef GL_ES\n\t\t\t\t\t#define LOWP lowp\n\t\t\t\t\tprecision mediump float;\n\t\t\t\t#else\n\t\t\t\t\t#define LOWP\n\t\t\t\t#endif\n\t\t\t\tvarying LOWP vec4 v_light;\n\t\t\t\tvarying LOWP vec4 v_dark;\n\t\t\t\tvarying vec2 v_texCoords;\n\t\t\t\tuniform sampler2D u_texture;\n\n\t\t\t\tvoid main () {\n\t\t\t\t\tvec4 texColor = texture2D(u_texture, v_texCoords);\n\t\t\t\t\tgl_FragColor.a = texColor.a * v_light.a;\n\t\t\t\t\tgl_FragColor.rgb = ((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb;\n\t\t\t\t}\n\t\t\t");
      };
      d.newColored = function(a) {
        return new d(a, "\n\t\t\t\tattribute vec4 " + d.POSITION + ";\n\t\t\t\tattribute vec4 " + d.COLOR + ";\n\t\t\t\tuniform mat4 " + d.MVP_MATRIX + ";\n\t\t\t\tvarying vec4 v_color;\n\n\t\t\t\tvoid main () {\n\t\t\t\t\tv_color = " + d.COLOR + ";\n\t\t\t\t\tgl_Position = " + d.MVP_MATRIX + " * " + d.POSITION + ";\n\t\t\t\t}\n\t\t\t", "\n\t\t\t\t#ifdef GL_ES\n\t\t\t\t\t#define LOWP lowp\n\t\t\t\t\tprecision mediump float;\n\t\t\t\t#else\n\t\t\t\t\t#define LOWP\n\t\t\t\t#endif\n\t\t\t\tvarying LOWP vec4 v_color;\n\n\t\t\t\tvoid main () {\n\t\t\t\t\tgl_FragColor = v_color;\n\t\t\t\t}\n\t\t\t");
      };
      d.MVP_MATRIX = "u_projTrans";
      d.POSITION = "a_position";
      d.COLOR = "a_color";
      d.COLOR2 = "a_color2";
      d.TEXCOORDS = "a_texCoords";
      d.SAMPLER = "u_texture";
      return d;
    }();
    e.Shader = u;
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function() {
      function a(c, b) {
        b === void 0 && (b = 10920);
        this.isDrawing = !1;
        this.shapeType = d.Filled;
        this.color = new n.Color(1, 1, 1, 1);
        this.vertexIndex = 0;
        this.tmp = new n.Vector2();
        if (b > 10920) {
          throw Error("Can't have more than 10920 triangles per batch: " + b);
        }
        this.context = c instanceof e.ManagedWebGLRenderingContext ? c : new e.ManagedWebGLRenderingContext(c);
        this.mesh = new e.Mesh(c, [new e.Position2Attribute(), new e.ColorAttribute()], b, 0);
        this.srcBlend = this.context.gl.SRC_ALPHA;
        this.dstBlend = this.context.gl.ONE_MINUS_SRC_ALPHA;
      }
      a.prototype.begin = function(c) {
        if (this.isDrawing) {
          throw Error("ShapeRenderer.begin() has already been called");
        }
        this.shader = c;
        this.vertexIndex = 0;
        this.isDrawing = !0;
        c = this.context.gl;
        c.enable(c.BLEND);
        c.blendFunc(this.srcBlend, this.dstBlend);
      };
      a.prototype.setBlendMode = function(c, b) {
        var h = this.context.gl;
        this.srcBlend = c;
        this.dstBlend = b;
        this.isDrawing && (this.flush(), h.blendFunc(this.srcBlend, this.dstBlend));
      };
      a.prototype.setColor = function(c) {
        this.color.setFromColor(c);
      };
      a.prototype.setColorWith = function(c, b, h, m) {
        this.color.set(c, b, h, m);
      };
      a.prototype.point = function(c, b, h) {
        h === void 0 && (h = null);
        this.check(d.Point, 1);
        h === null && (h = this.color);
        this.vertex(c, b, h);
      };
      a.prototype.line = function(c, b, h, m, k) {
        k === void 0 && (k = null);
        this.check(d.Line, 2);
        this.mesh.getVertices();
        k === null && (k = this.color);
        this.vertex(c, b, k);
        this.vertex(h, m, k);
      };
      a.prototype.triangle = function(c, b, h, m, k, f, g, l, p, q) {
        l === void 0 && (l = null);
        p === void 0 && (p = null);
        q === void 0 && (q = null);
        this.check(c ? d.Filled : d.Line, 3);
        this.mesh.getVertices();
        l === null && (l = this.color);
        p === null && (p = this.color);
        q === null && (q = this.color);
        c ? (this.vertex(b, h, l), this.vertex(m, k, p), this.vertex(f, g, q)) : (this.vertex(b, h, l), this.vertex(m, k, p), this.vertex(m, k, l), this.vertex(f, g, p), this.vertex(f, g, l), this.vertex(b, h, p));
      };
      a.prototype.quad = function(c, b, h, m, k, f, g, l, p, q, r, w, t) {
        q === void 0 && (q = null);
        r === void 0 && (r = null);
        w === void 0 && (w = null);
        t === void 0 && (t = null);
        this.check(c ? d.Filled : d.Line, 3);
        this.mesh.getVertices();
        q === null && (q = this.color);
        r === null && (r = this.color);
        w === null && (w = this.color);
        t === null && (t = this.color);
        c ? (this.vertex(b, h, q), this.vertex(m, k, r), this.vertex(f, g, w), this.vertex(f, g, w)) : (this.vertex(b, h, q), this.vertex(m, k, r), this.vertex(m, k, r), this.vertex(f, g, w), this.vertex(f, g, w), this.vertex(l, p, t));
        this.vertex(l, p, t);
        this.vertex(b, h, q);
      };
      a.prototype.rect = function(c, b, h, m, k, f) {
        f === void 0 && (f = null);
        this.quad(c, b, h, b + m, h, b + m, h + k, b, h + k, f, f, f, f);
      };
      a.prototype.rectLine = function(c, b, h, m, k, f, g) {
        g === void 0 && (g = null);
        this.check(c ? d.Filled : d.Line, 8);
        g === null && (g = this.color);
        var l = this.tmp.set(k - h, b - m);
        l.normalize();
        f *= 0.5;
        var p = l.x * f;
        f *= l.y;
        c ? (this.vertex(b + p, h + f, g), this.vertex(b - p, h - f, g), this.vertex(m + p, k + f, g), this.vertex(m - p, k - f, g), this.vertex(m + p, k + f, g)) : (this.vertex(b + p, h + f, g), this.vertex(b - p, h - f, g), this.vertex(m + p, k + f, g), this.vertex(m - p, k - f, g), this.vertex(m + p, k + f, g), this.vertex(b + p, h + f, g), this.vertex(m - p, k - f, g));
        this.vertex(b - p, h - f, g);
      };
      a.prototype.x = function(c, b, h) {
        this.line(c - h, b - h, c + h, b + h);
        this.line(c - h, b + h, c + h, b - h);
      };
      a.prototype.polygon = function(c, b, h, m) {
        m === void 0 && (m = null);
        if (h < 3) {
          throw Error("Polygon must contain at least 3 vertices");
        }
        this.check(d.Line, h * 2);
        m === null && (m = this.color);
        this.mesh.getVertices();
        b <<= 1;
        h <<= 1;
        var k = c[b], f = c[b + 1], g = b + h, l = b;
        for (b = b + h - 2; l < b; l += 2) {
          h = c[l];
          var p = c[l + 1];
          if (l + 2 >= g) {
            var q = k;
            var r = f;
          } else {
            q = c[l + 2], r = c[l + 3];
          }
          this.vertex(h, p, m);
          this.vertex(q, r, m);
        }
      };
      a.prototype.circle = function(c, b, h, m, k, f) {
        k === void 0 && (k = null);
        f === void 0 && (f = 0);
        f === 0 && (f = Math.max(1, 6 * n.MathUtils.cbrt(m) | 0));
        if (f <= 0) {
          throw Error("segments must be > 0.");
        }
        k === null && (k = this.color);
        var g = 2 * n.MathUtils.PI / f, l = Math.cos(g);
        g = Math.sin(g);
        var p = m, q = 0;
        if (c) {
          this.check(d.Filled, f * 3 + 3);
          f--;
          for (c = 0; c < f; c++) {
            this.vertex(b, h, k);
            this.vertex(b + p, h + q, k);
            var r = p;
            p = l * p - g * q;
            q = g * r + l * q;
            this.vertex(b + p, h + q, k);
          }
          this.vertex(b, h, k);
        } else {
          for (this.check(d.Line, f * 2 + 2), c = 0; c < f; c++) {
            this.vertex(b + p, h + q, k), r = p, p = l * p - g * q, q = g * r + l * q, this.vertex(b + p, h + q, k);
          }
        }
        this.vertex(b + p, h + q, k);
        this.vertex(b + m, h + 0, k);
      };
      a.prototype.curve = function(c, b, h, m, k, f, g, l, p, q) {
        q === void 0 && (q = null);
        this.check(d.Line, p * 2 + 2);
        q === null && (q = this.color);
        var r = 1 / p, w = r * r, t = r * r * r, v = 3 * r, x = 3 * w;
        r = 6 * w;
        w = 6 * t;
        var z = c - h * 2 + k, y = b - m * 2 + f, A = (h - k) * 3 - c + g, C = (m - f) * 3 - b + l;
        f = c;
        k = b;
        c = (h - c) * v + z * x + A * t;
        b = (m - b) * v + y * x + C * t;
        m = z * r + A * w;
        t = y * r + C * w;
        r = A * w;
        for (w *= C; p-- > 0;) {
          this.vertex(f, k, q), f += c, k += b, c += m, b += t, m += r, t += w, this.vertex(f, k, q);
        }
        this.vertex(f, k, q);
        this.vertex(g, l, q);
      };
      a.prototype.vertex = function(c, b, h) {
        var m = this.vertexIndex, k = this.mesh.getVertices();
        k[m++] = c;
        k[m++] = b;
        k[m++] = h.r;
        k[m++] = h.g;
        k[m++] = h.b;
        k[m++] = h.a;
        this.vertexIndex = m;
      };
      a.prototype.end = function() {
        if (!this.isDrawing) {
          throw Error("ShapeRenderer.begin() has not been called");
        }
        this.flush();
        this.context.gl.disable(this.context.gl.BLEND);
        this.isDrawing = !1;
      };
      a.prototype.flush = function() {
        this.vertexIndex != 0 && (this.mesh.setVerticesLength(this.vertexIndex), this.mesh.draw(this.shader, this.shapeType), this.vertexIndex = 0);
      };
      a.prototype.check = function(c, b) {
        if (!this.isDrawing) {
          throw Error("ShapeRenderer.begin() has not been called");
        }
        this.shapeType == c ? this.mesh.maxVertices() - this.mesh.numVertices() < b && this.flush() : (this.flush(), this.shapeType = c);
      };
      a.prototype.dispose = function() {
        this.mesh.dispose();
      };
      return a;
    }();
    e.ShapeRenderer = u;
    var d;
    (function(a) {
      a[a.Point = 0] = "Point";
      a[a.Line = 1] = "Line";
      a[a.Filled = 4] = "Filled";
    })(d = e.ShapeType || (e.ShapeType = {}));
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function() {
      function d(a) {
        this.boneLineColor = new n.Color(1, 0, 0, 1);
        this.boneOriginColor = new n.Color(0, 1, 0, 1);
        this.attachmentLineColor = new n.Color(0, 0, 1, 0.5);
        this.triangleLineColor = new n.Color(1, 0.64, 0, 0.5);
        this.pathColor = (new n.Color()).setFromString("FF7F00");
        this.clipColor = new n.Color(0.8, 0, 0, 2);
        this.aabbColor = new n.Color(0, 1, 0, 0.5);
        this.drawPaths = this.drawMeshTriangles = this.drawMeshHull = this.drawBoundingBoxes = this.drawRegionAttachments = this.drawBones = !0;
        this.drawSkeletonXY = !1;
        this.drawClipping = !0;
        this.premultipliedAlpha = !1;
        this.scale = 1;
        this.boneWidth = 2;
        this.bounds = new n.SkeletonBounds();
        this.temp = [];
        this.vertices = n.Utils.newFloatArray(2048);
        this.context = a instanceof e.ManagedWebGLRenderingContext ? a : new e.ManagedWebGLRenderingContext(a);
      }
      d.prototype.draw = function(a, c, b) {
        b === void 0 && (b = null);
        var h = c.x, m = c.y, k = this.context.gl;
        a.setBlendMode(this.premultipliedAlpha ? k.ONE : k.SRC_ALPHA, k.ONE_MINUS_SRC_ALPHA);
        var f = c.bones;
        if (this.drawBones) {
          a.setColor(this.boneLineColor);
          k = 0;
          for (var g = f.length; k < g; k++) {
            var l = f[k];
            if (!(b && b.indexOf(l.data.name) > -1) && l.parent != null) {
              var p = h + l.data.length * l.a + l.worldX, q = m + l.data.length * l.c + l.worldY;
              a.rectLine(!0, h + l.worldX, m + l.worldY, p, q, this.boneWidth * this.scale);
            }
          }
          this.drawSkeletonXY && a.x(h, m, 4 * this.scale);
        }
        if (this.drawRegionAttachments) {
          for (a.setColor(this.attachmentLineColor), l = c.slots, k = 0, g = l.length; k < g; k++) {
            var r = l[k], w = r.getAttachment();
            if (w instanceof n.RegionAttachment) {
              var t = this.vertices;
              w.computeWorldVertices(r.bone, t, 0, 2);
              a.line(t[0], t[1], t[2], t[3]);
              a.line(t[2], t[3], t[4], t[5]);
              a.line(t[4], t[5], t[6], t[7]);
              a.line(t[6], t[7], t[0], t[1]);
            }
          }
        }
        if (this.drawMeshHull || this.drawMeshTriangles) {
          for (l = c.slots, k = 0, g = l.length; k < g; k++) {
            if (r = l[k], r.bone.active && (w = r.getAttachment(), w instanceof n.MeshAttachment)) {
              t = this.vertices;
              w.computeWorldVertices(r, 0, w.worldVerticesLength, t, 0, 2);
              var v = w.triangles, x = w.hullLength;
              if (this.drawMeshTriangles) {
                for (a.setColor(this.triangleLineColor), r = 0, w = v.length; r < w; r += 3) {
                  p = v[r] * 2;
                  q = v[r + 1] * 2;
                  var z = v[r + 2] * 2;
                  a.triangle(!1, t[p], t[p + 1], t[q], t[q + 1], t[z], t[z + 1]);
                }
              }
              if (this.drawMeshHull && x > 0) {
                for (a.setColor(this.attachmentLineColor), x = (x >> 1) * 2, v = t[x - 2], z = t[x - 1], r = 0, w = x; r < w; r += 2) {
                  p = t[r], q = t[r + 1], a.line(p, q, v, z), v = p, z = q;
                }
              }
            }
          }
        }
        if (this.drawBoundingBoxes) {
          for (k = this.bounds, k.update(c, !0), a.setColor(this.aabbColor), a.rect(!1, k.minX, k.minY, k.getWidth(), k.getHeight()), l = k.polygons, w = k.boundingBoxes, k = 0, g = l.length; k < g; k++) {
            r = l[k], a.setColor(w[k].color), a.polygon(r, 0, r.length);
          }
        }
        if (this.drawPaths) {
          for (l = c.slots, k = 0, g = l.length; k < g; k++) {
            if (r = l[k], r.bone.active && (w = r.getAttachment(), w instanceof n.PathAttachment)) {
              x = w;
              w = x.worldVerticesLength;
              t = this.temp = n.Utils.setArraySize(this.temp, w, 0);
              x.computeWorldVertices(r, 0, w, t, 0, 2);
              p = this.pathColor;
              q = t[2];
              z = t[3];
              if (x.closed) {
                a.setColor(p);
                var y = t[0], A = t[1], C = t[w - 2], F = t[w - 1];
                x = t[w - 4];
                v = t[w - 3];
                a.curve(q, z, y, A, C, F, x, v, 32);
                a.setColor(d.LIGHT_GRAY);
                a.line(q, z, y, A);
                a.line(x, v, C, F);
              }
              w -= 4;
              for (r = 4; r < w; r += 6) {
                y = t[r], A = t[r + 1], C = t[r + 2], F = t[r + 3], x = t[r + 4], v = t[r + 5], a.setColor(p), a.curve(q, z, y, A, C, F, x, v, 32), a.setColor(d.LIGHT_GRAY), a.line(q, z, y, A), a.line(x, v, C, F), q = x, z = v;
              }
            }
          }
        }
        if (this.drawBones) {
          for (a.setColor(this.boneOriginColor), k = 0, g = f.length; k < g; k++) {
            l = f[k], b && b.indexOf(l.data.name) > -1 || a.circle(!0, h + l.worldX, m + l.worldY, 3 * this.scale, d.GREEN, 8);
          }
        }
        if (this.drawClipping) {
          for (l = c.slots, a.setColor(this.clipColor), k = 0, g = l.length; k < g; k++) {
            if (r = l[k], r.bone.active && (w = r.getAttachment(), w instanceof n.ClippingAttachment)) {
              for (c = w, w = c.worldVerticesLength, t = this.temp = n.Utils.setArraySize(this.temp, w, 0), c.computeWorldVertices(r, 0, w, t, 0, 2), c = 0, b = t.length; c < b; c += 2) {
                p = t[c], q = t[c + 1], x = t[(c + 2) % t.length], v = t[(c + 3) % t.length], a.line(p, q, x, v);
              }
            }
          }
        }
      };
      d.prototype.dispose = function() {
      };
      d.LIGHT_GRAY = new n.Color(192 / 255, 192 / 255, 192 / 255, 1);
      d.GREEN = new n.Color(0, 1, 0, 1);
      return d;
    }();
    e.SkeletonDebugRenderer = u;
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function() {
      return function(a, c, b) {
        this.vertices = a;
        this.numVertices = c;
        this.numFloats = b;
      };
    }(), d = function() {
      function a(c, b) {
        b === void 0 && (b = !0);
        this.premultipliedAlpha = !1;
        this.vertexEffect = null;
        this.tempColor = new n.Color();
        this.tempColor2 = new n.Color();
        this.vertexSize = 8;
        this.twoColorTint = !1;
        this.renderable = new u(null, 0, 0);
        this.clipper = new n.SkeletonClipping();
        this.temp = new n.Vector2();
        this.temp2 = new n.Vector2();
        this.temp3 = new n.Color();
        this.temp4 = new n.Color();
        if (this.twoColorTint = b) {
          this.vertexSize += 4;
        }
        this.vertices = n.Utils.newFloatArray(this.vertexSize * 1024);
      }
      a.prototype.draw = function(c, b, h, m) {
        h === void 0 && (h = -1);
        m === void 0 && (m = -1);
        var k = this.clipper, f = this.premultipliedAlpha, g = this.twoColorTint, l = null, p = this.temp, q = this.temp2, r = this.temp3, w = this.temp4, t = this.renderable, v = b.drawOrder;
        b = b.color;
        var x = g ? 12 : 8, z = !1;
        h == -1 && (z = !0);
        for (var y = 0, A = v.length; y < A; y++) {
          var C = k.isClipping() ? 2 : x, F = v[y];
          if (F.bone.active && (h >= 0 && h == F.data.index && (z = !0), z)) {
            m >= 0 && m == F.data.index && (z = !1);
            var H = F.getAttachment();
            if (H instanceof n.RegionAttachment) {
              var D = H;
              t.vertices = this.vertices;
              t.numVertices = 4;
              t.numFloats = C << 2;
              D.computeWorldVertices(F.bone, t.vertices, 0, C);
              H = a.QUAD_TRIANGLES;
              var G = D.uvs;
              C = D.region.renderObject.texture;
              D = D.color;
            } else if (H instanceof n.MeshAttachment) {
              D = H, t.vertices = this.vertices, t.numVertices = D.worldVerticesLength >> 1, t.numFloats = t.numVertices * C, t.numFloats > t.vertices.length && (t.vertices = this.vertices = n.Utils.newFloatArray(t.numFloats)), D.computeWorldVertices(F, 0, D.worldVerticesLength, t.vertices, 0, C), H = D.triangles, C = D.region.renderObject.texture, G = D.uvs, D = D.color;
            } else {
              H instanceof n.ClippingAttachment ? k.clipStart(F, H) : k.clipEndWithSlot(F);
              continue;
            }
            if (C != null) {
              var B = F.color, I = this.tempColor;
              I.r = b.r * B.r * D.r;
              I.g = b.g * B.g * D.g;
              I.b = b.b * B.b * D.b;
              I.a = b.a * B.a * D.a;
              f && (I.r *= I.a, I.g *= I.a, I.b *= I.a);
              var J = this.tempColor2;
              F.darkColor == null ? J.set(0, 0, 0, 1) : (f ? (J.r = F.darkColor.r * I.a, J.g = F.darkColor.g * I.a, J.b = F.darkColor.b * I.a) : J.setFromColor(F.darkColor), J.a = f ? 1 : 0);
              D = F.data.blendMode;
              D != l && (l = D, c.setBlendMode(e.WebGLBlendModeConverter.getSourceGLBlendMode(l, f), e.WebGLBlendModeConverter.getDestGLBlendMode(l)));
              if (k.isClipping()) {
                k.clipTriangles(t.vertices, t.numFloats, H, H.length, G, I, J, g);
                H = new Float32Array(k.clippedVertices);
                G = k.clippedTriangles;
                if (this.vertexEffect != null) {
                  var E = this.vertexEffect;
                  D = H;
                  if (g) {
                    for (B = 0, I = H.length; B < I; B += x) {
                      p.x = D[B], p.y = D[B + 1], r.set(D[B + 2], D[B + 3], D[B + 4], D[B + 5]), q.x = D[B + 6], q.y = D[B + 7], w.set(D[B + 8], D[B + 9], D[B + 10], D[B + 11]), E.transform(p, q, r, w), D[B] = p.x, D[B + 1] = p.y, D[B + 2] = r.r, D[B + 3] = r.g, D[B + 4] = r.b, D[B + 5] = r.a, D[B + 6] = q.x, D[B + 7] = q.y, D[B + 8] = w.r, D[B + 9] = w.g, D[B + 10] = w.b, D[B + 11] = w.a;
                    }
                  } else {
                    for (B = 0, I = H.length; B < I; B += x) {
                      p.x = D[B], p.y = D[B + 1], r.set(D[B + 2], D[B + 3], D[B + 4], D[B + 5]), q.x = D[B + 6], q.y = D[B + 7], w.set(0, 0, 0, 0), E.transform(p, q, r, w), D[B] = p.x, D[B + 1] = p.y, D[B + 2] = r.r, D[B + 3] = r.g, D[B + 4] = r.b, D[B + 5] = r.a, D[B + 6] = q.x, D[B + 7] = q.y;
                    }
                  }
                }
                c.draw(C, H, G);
              } else {
                D = t.vertices;
                if (this.vertexEffect != null) {
                  if (E = this.vertexEffect, g) {
                    M = B = 0;
                    for (var L = t.numFloats; B < L; B += x, M += 2) {
                      p.x = D[B], p.y = D[B + 1], q.x = G[M], q.y = G[M + 1], r.setFromColor(I), w.setFromColor(J), E.transform(p, q, r, w), D[B] = p.x, D[B + 1] = p.y, D[B + 2] = r.r, D[B + 3] = r.g, D[B + 4] = r.b, D[B + 5] = r.a, D[B + 6] = q.x, D[B + 7] = q.y, D[B + 8] = w.r, D[B + 9] = w.g, D[B + 10] = w.b, D[B + 11] = w.a;
                    }
                  } else {
                    var M = B = 0;
                    for (J = t.numFloats; B < J; B += x, M += 2) {
                      p.x = D[B], p.y = D[B + 1], q.x = G[M], q.y = G[M + 1], r.setFromColor(I), w.set(0, 0, 0, 0), E.transform(p, q, r, w), D[B] = p.x, D[B + 1] = p.y, D[B + 2] = r.r, D[B + 3] = r.g, D[B + 4] = r.b, D[B + 5] = r.a, D[B + 6] = q.x, D[B + 7] = q.y;
                    }
                  }
                } else {
                  if (g) {
                    for (B = 2, M = 0, E = t.numFloats; B < E; B += x, M += 2) {
                      D[B] = I.r, D[B + 1] = I.g, D[B + 2] = I.b, D[B + 3] = I.a, D[B + 4] = G[M], D[B + 5] = G[M + 1], D[B + 6] = J.r, D[B + 7] = J.g, D[B + 8] = J.b, D[B + 9] = J.a;
                    }
                  } else {
                    for (B = 2, M = 0, E = t.numFloats; B < E; B += x, M += 2) {
                      D[B] = I.r, D[B + 1] = I.g, D[B + 2] = I.b, D[B + 3] = I.a, D[B + 4] = G[M], D[B + 5] = G[M + 1];
                    }
                  }
                }
                G = t.vertices.subarray(0, t.numFloats);
                c.draw(C, G, H);
              }
            }
          }
          k.clipEndWithSlot(F);
        }
        k.clipEnd();
      };
      a.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];
      return a;
    }();
    e.SkeletonRenderer = d;
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function() {
      function d(a, c, b) {
        a === void 0 && (a = 0);
        c === void 0 && (c = 0);
        b === void 0 && (b = 0);
        this.z = this.y = this.x = 0;
        this.x = a;
        this.y = c;
        this.z = b;
      }
      d.prototype.setFrom = function(a) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        return this;
      };
      d.prototype.set = function(a, c, b) {
        this.x = a;
        this.y = c;
        this.z = b;
        return this;
      };
      d.prototype.add = function(a) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;
      };
      d.prototype.sub = function(a) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;
      };
      d.prototype.scale = function(a) {
        this.x *= a;
        this.y *= a;
        this.z *= a;
        return this;
      };
      d.prototype.normalize = function() {
        var a = this.length();
        if (a == 0) {
          return this;
        }
        a = 1 / a;
        this.x *= a;
        this.y *= a;
        this.z *= a;
        return this;
      };
      d.prototype.cross = function(a) {
        return this.set(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x);
      };
      d.prototype.multiply = function(a) {
        a = a.values;
        return this.set(this.x * a[e.M00] + this.y * a[e.M01] + this.z * a[e.M02] + a[e.M03], this.x * a[e.M10] + this.y * a[e.M11] + this.z * a[e.M12] + a[e.M13], this.x * a[e.M20] + this.y * a[e.M21] + this.z * a[e.M22] + a[e.M23]);
      };
      d.prototype.project = function(a) {
        a = a.values;
        var c = 1 / (this.x * a[e.M30] + this.y * a[e.M31] + this.z * a[e.M32] + a[e.M33]);
        return this.set((this.x * a[e.M00] + this.y * a[e.M01] + this.z * a[e.M02] + a[e.M03]) * c, (this.x * a[e.M10] + this.y * a[e.M11] + this.z * a[e.M12] + a[e.M13]) * c, (this.x * a[e.M20] + this.y * a[e.M21] + this.z * a[e.M22] + a[e.M23]) * c);
      };
      d.prototype.dot = function(a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
      };
      d.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      };
      d.prototype.distance = function(a) {
        var c = a.x - this.x, b = a.y - this.y;
        a = a.z - this.z;
        return Math.sqrt(c * c + b * b + a * a);
      };
      return d;
    }();
    e.Vector3 = u;
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});
(function(n) {
  (function(e) {
    var u = function() {
      function d(a, c) {
        c === void 0 && (c = {alpha:"true"});
        this.restorables = [];
        a instanceof WebGLRenderingContext || a instanceof WebGL2RenderingContext ? (this.gl = a, this.canvas = this.gl.canvas) : this.setupCanvas(a, c);
      }
      d.prototype.setupCanvas = function(a, c) {
        var b = this;
        this.gl = a.getContext("webgl2", c) || a.getContext("webgl", c);
        this.canvas = a;
        a.addEventListener("webglcontextlost", function(h) {
          h && h.preventDefault();
        });
        a.addEventListener("webglcontextrestored", function(h) {
          h = 0;
          for (var m = b.restorables.length; h < m; h++) {
            b.restorables[h].restore();
          }
        });
      };
      d.prototype.addRestorable = function(a) {
        this.restorables.push(a);
      };
      d.prototype.removeRestorable = function(a) {
        a = this.restorables.indexOf(a);
        a > -1 && this.restorables.splice(a, 1);
      };
      return d;
    }();
    e.ManagedWebGLRenderingContext = u;
    u = function() {
      function d() {
      }
      d.getDestGLBlendMode = function(a) {
        switch(a) {
          case n.BlendMode.Normal:
            return d.ONE_MINUS_SRC_ALPHA;
          case n.BlendMode.Additive:
            return d.ONE;
          case n.BlendMode.Multiply:
            return d.ONE_MINUS_SRC_ALPHA;
          case n.BlendMode.Screen:
            return d.ONE_MINUS_SRC_ALPHA;
          default:
            throw Error("Unknown blend mode: " + a);
        }
      };
      d.getSourceGLBlendMode = function(a, c) {
        c === void 0 && (c = !1);
        switch(a) {
          case n.BlendMode.Normal:
            return c ? d.ONE : d.SRC_ALPHA;
          case n.BlendMode.Additive:
            return c ? d.ONE : d.SRC_ALPHA;
          case n.BlendMode.Multiply:
            return d.DST_COLOR;
          case n.BlendMode.Screen:
            return d.ONE;
          default:
            throw Error("Unknown blend mode: " + a);
        }
      };
      d.ZERO = 0;
      d.ONE = 1;
      d.SRC_COLOR = 768;
      d.ONE_MINUS_SRC_COLOR = 769;
      d.SRC_ALPHA = 770;
      d.ONE_MINUS_SRC_ALPHA = 771;
      d.DST_ALPHA = 772;
      d.ONE_MINUS_DST_ALPHA = 773;
      d.DST_COLOR = 774;
      return d;
    }();
    e.WebGLBlendModeConverter = u;
  })(n.webgl || (n.webgl = {}));
})(spine ||= {});