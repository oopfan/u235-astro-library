import { U235AstroMatrix3D } from './u235-astro-matrix3d.class';

export class U235AstroVector3D {
  private elem: number[] = [0, 1, 1, 1];

  assign(rhs: U235AstroVector3D): U235AstroVector3D {
    this.elem[1] = rhs.elem[1];
    this.elem[2] = rhs.elem[2];
    this.elem[3] = rhs.elem[3];
    return this;
  }

  getElement(row: number): number {
    return this.elem[row];
  }
    
  setElement(row: number, value: number) {
    this.elem[row] = value;
  }
    
  setPolar(phi: number, theta: number, radius: number): U235AstroVector3D {
    const rxy = radius * Math.cos(theta);
    this.elem[1] = rxy * Math.cos(phi);
    this.elem[2] = rxy * Math.sin(phi);
    this.elem[3] = radius * Math.sin(theta);
    return this;
  }

  getPolar(): number[] {
    const radius = this._getRadius();
    const phi = Math.atan2(this.elem[2], this.elem[1]);
    const theta = Math.asin(this.elem[3] / radius);
    return [phi, theta, radius];
  }

  getRadius(): number {
    return this._getRadius();
  }

  _getRadius(): number {
    return Math.sqrt(this._dotProduct(this));
  }

  dotProduct(vec: U235AstroVector3D): number {
    return this._dotProduct(vec);
  }

  _dotProduct(vec: U235AstroVector3D): number {
    return (
      this.elem[1] * vec.elem[1] +
      this.elem[2] * vec.elem[2] +
      this.elem[3] * vec.elem[3]
    );
  }

  getAngularSeparation(vec: U235AstroVector3D): number {
    return Math.acos(Math.max(-1, Math.min(1, this._dotProduct(vec) /
      (this._getRadius() * vec._getRadius()))));
  }

  add(rhs: U235AstroVector3D): U235AstroVector3D {
    this.elem[1] += rhs.elem[1];
    this.elem[2] += rhs.elem[2];
    this.elem[3] += rhs.elem[3];
    return this;
  }

  subtract(rhs: U235AstroVector3D): U235AstroVector3D {
    this.elem[1] -= rhs.elem[1];
    this.elem[2] -= rhs.elem[2];
    this.elem[3] -= rhs.elem[3];
    return this;
  }

  scalarMultiply(scalar: number): U235AstroVector3D {
    this.elem[1] *= scalar;
    this.elem[2] *= scalar;
    this.elem[3] *= scalar;
    return this;
  }

  crossProduct(rhs: U235AstroVector3D): U235AstroVector3D {
    const x = this.elem[2] * rhs.elem[3] - this.elem[3] * rhs.elem[2];
    const y = this.elem[3] * rhs.elem[1] - this.elem[1] * rhs.elem[3];
    const z = this.elem[1] * rhs.elem[2] - this.elem[2] * rhs.elem[1];
    this.elem[1] = x;
    this.elem[2] = y;
    this.elem[3] = z;
    return this;
  }

  matrixMultiply(mat: U235AstroMatrix3D): U235AstroVector3D {
    const x =
      mat.elem[1][1] * this.elem[1] +
      mat.elem[1][2] * this.elem[2] +
      mat.elem[1][3] * this.elem[3];
    const y =
      mat.elem[2][1] * this.elem[1] +
      mat.elem[2][2] * this.elem[2] +
      mat.elem[2][3] * this.elem[3];
    const z =
      mat.elem[3][1] * this.elem[1] +
      mat.elem[3][2] * this.elem[2] +
      mat.elem[3][3] * this.elem[3];
    this.elem[1] = x;
    this.elem[2] = y;
    this.elem[3] = z;
    return this;
  }

}
