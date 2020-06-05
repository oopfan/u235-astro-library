export class U235AstroMatrix3D {
  elem = [[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

  getElement(row: number, column: number): number {
    return this.elem[row][column];
  }

  setElement(row: number, column: number, value: number): void {
    this.elem[row][column] = value;
  }

  setRotateX(angleRad: number): U235AstroMatrix3D {
    var sina = Math.sin(angleRad);
    var cosa = Math.cos(angleRad);
    this.elem[1][1] = 1;
    this.elem[1][2] = 0;
    this.elem[1][3] = 0;
    this.elem[2][1] = 0;
    this.elem[2][2] = cosa;
    this.elem[2][3] = sina;
    this.elem[3][1] = 0;
    this.elem[3][2] = -sina;
    this.elem[3][3] = cosa;
    return this;
  }

  setRotateY(angleRad: number): U235AstroMatrix3D {
    var sina = Math.sin(angleRad);
    var cosa = Math.cos(angleRad);
    this.elem[1][1] = cosa;
    this.elem[1][2] = 0;
    this.elem[1][3] = -sina;
    this.elem[2][1] = 0;
    this.elem[2][2] = 1;
    this.elem[2][3] = 0;
    this.elem[3][1] = sina;
    this.elem[3][2] = 0;
    this.elem[3][3] = cosa;
    return this;
  }

  setRotateZ(angleRad: number): U235AstroMatrix3D {
    var sina = Math.sin(angleRad);
    var cosa = Math.cos(angleRad);
    this.elem[1][1] = cosa;
    this.elem[1][2] = sina;
    this.elem[1][3] = 0;
    this.elem[2][1] = -sina;
    this.elem[2][2] = cosa;
    this.elem[2][3] = 0;
    this.elem[3][1] = 0;
    this.elem[3][2] = 0;
    this.elem[3][3] = 1;
    return this;
  }

  matrixMultiply(rhs: U235AstroMatrix3D): U235AstroMatrix3D {
    const a11 =
      this.elem[1][1] * rhs.elem[1][1] +
      this.elem[1][2] * rhs.elem[2][1] +
      this.elem[1][3] * rhs.elem[3][1];
    const a12 =
      this.elem[1][1] * rhs.elem[1][2] +
      this.elem[1][2] * rhs.elem[2][2] +
      this.elem[1][3] * rhs.elem[3][2];
    const a13 =
      this.elem[1][1] * rhs.elem[1][3] +
      this.elem[1][2] * rhs.elem[2][3] +
      this.elem[1][3] * rhs.elem[3][3];
    const a21 =
      this.elem[2][1] * rhs.elem[1][1] +
      this.elem[2][2] * rhs.elem[2][1] +
      this.elem[2][3] * rhs.elem[3][1];
    const a22 =
      this.elem[2][1] * rhs.elem[1][2] +
      this.elem[2][2] * rhs.elem[2][2] +
      this.elem[2][3] * rhs.elem[3][2];
    const a23 =
      this.elem[2][1] * rhs.elem[1][3] +
      this.elem[2][2] * rhs.elem[2][3] +
      this.elem[2][3] * rhs.elem[3][3];
    const a31 =
      this.elem[3][1] * rhs.elem[1][1] +
      this.elem[3][2] * rhs.elem[2][1] +
      this.elem[3][3] * rhs.elem[3][1];
    const a32 =
      this.elem[3][1] * rhs.elem[1][2] +
      this.elem[3][2] * rhs.elem[2][2] +
      this.elem[3][3] * rhs.elem[3][2];
    const a33 =
      this.elem[3][1] * rhs.elem[1][3] +
      this.elem[3][2] * rhs.elem[2][3] +
      this.elem[3][3] * rhs.elem[3][3];

    this.elem[1][1] = a11;
    this.elem[1][2] = a12;
    this.elem[1][3] = a13;
    this.elem[2][1] = a21;
    this.elem[2][2] = a22;
    this.elem[2][3] = a23;
    this.elem[3][1] = a31;
    this.elem[3][2] = a32;
    this.elem[3][3] = a33;
    return this;
  }

}
