const matrix = [];
let Y = 3,
  X = 3;

//
let stepX, stepY;
const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d');
console.log(canvas);
canvas.width = 500;
canvas.height = 500;

//
document.addEventListener('DOMContentLoaded', () => {
  start();
});
{
  function start() {
    // let matrix = [
    //   [0, 5, 2],
    //   [5, 0, 3],
    //   [2, 3, 0],
    // ];
    // let matrix2 = [
    //   [0, -1, 10, Infinity, 3],
    //   [8, 0, 2, Infinity, 3],
    //   [10, 3, 0, 5, 3],
    //   [Infinity, Infinity, 5, 0, 9],
    //   [2, 3, 5, 0, 9],
    // ];
    // let startMatrix = JSON.parse(JSON.stringify(matrix2));
    // console.log(matrix);
    // // рефлексивность - передаем единицу, антирефлексивность - 0
    // checkDiagonal(matrix, 'main', 0);
    // checkDiagonal(matrix, 'main', 1);
    // checkSymmetry(matrix, '');
    // searchSubsets('123'); //тут строка входной параметр - надо в переменную поместить.
    // checkTransit(matrix); // перед этим выполнить проверку на симметричность +единицы
    // floydWarshallAlgorithm(matrix2); // сюда уже другую матрицу( на главной нули) - остальные значения забрать у пользователя
    // calcCanvasStep(5); //длину массива    !!!!!
    // matrix = floydWarshallAlgorithm(matrix2); // алгоритм изменяет начальную матрицу
    // window.coordsArray = paintArrayOfPoints(matrix);
    // console.log(coordsArray);
    // CalcExistingEdge(startMatrix); // стартовую матрицу
    // addTextToPoints();
    // addTextToEdge(startMatrix); // стартовую матрицу + доделать
  } //
  //events
  let randomMatrixBtn = document.querySelector('.ub__btn-random-generate');
  let inputN = document.querySelector('.form-control');
  // console.log(inputN);
  randomMatrixBtn.addEventListener('click', () => {
    X = Number(inputN.value);
    console.log(X);
    Y = X;
    let matrix = createMatrix(X, Y);

    fillMatrix(matrix);
    console.log(matrix);
  });

  //   Cоздание и зполнение

  function createMatrix(X, Y) {
    let arr = new Array(Y);
    for (let i = 0; i < Y; i++) {
      arr[i] = new Array(X);
    }
    return arr;
  }
  function fillMatrix(matrix) {
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[0].length; x++) {
        matrix[x][y] = getDiscrRandom();
      }
    }
    return matrix;
  }

  function getDiscrRandom() {
    return Math.round(Math.random());
  }
  //   Диагонали

  function checkDiagonal(matrix, direction = 'main', mode) {
    let n = matrix.length;
    let X, status;
    mode == 1 ? (status = '!Рефлексивность') : (status = '!антиРефлексивность');

    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[0].length; ++x) {
        direction == 'main' ? (X = x) : (X = n - x - 1);
        if (X == y) {
          if (matrix[x][y] != mode) {
            console.log(`${reverse(mode)} на ${direction} диагонале`);
            return;
          }
        }
      }
    }
    console.log(`${mode} на ${direction} диагонале -- ${status} `);
  }

  function checkSymmetry(matrix, mode) {
    let n = matrix.length - 1;
    let buf;

    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[0].length; ++x) {
        mode == 'anti' && x != y ? (buf = reverse(matrix[y][x])) : (buf = matrix[y][x]);
        if (matrix[x][y] != buf) {
          console.log(`не симметрична относительно главной`);
          return;
        }
      }
    }
    console.log(`симметрична относительно главной`);
  }

  function convertToBinary(number) {
    let num = number;
    let binary = (num % 2).toString();
    for (; num > 1; ) {
      num = parseInt(num / 2);
      binary = (num % 2) + binary;
    }
    return binary;
  }

  function reverse(number) {
    number = `${number}`.split('');
    for (let i = 0; i < number.length; ++i) {
      number[i] == 1 ? number.splice(i, 1, '0') : number.splice(i, 1, '1');
    }
    return Number(number.join(''));
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!______________________________________________________________!!!!!!!!!!!!!!!!!
  function checkTransit(matrix) {
    //на вход только симметричную матрицу с единицами на главной диагонале
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[0].length; ++x) {
        if (matrix[x][y] == 1) {
          console.log('1');
          if (matrix[x].join('') != matrix[y].join('')) return false;
        }
      }
    }
    console.log('транзитивна');
  }

  // matrix function generates all n bit Gray codes and prints the
  // generated codes
  function generateTableGray(n) {
    // base case
    if (n <= 0) return;

    // "arr" will store all generated codes
    let arr = [];

    // start with one-bit pattern
    arr.push('0');
    arr.push('1');

    // Every iteration of matrix loop generates 2*i codes from previously
    // generated i codes.
    let i, j;
    for (i = 2; i < 1 << n; i = i << 1) {
      // Enter the prviously generated codes again in arr[] in reverse
      // order. Nor arr[] has double number of codes.
      for (j = i - 1; j >= 0; j--) arr.push(arr[j]);

      // append 0 to the first half
      for (j = 0; j < i; j++) arr[j] = '0' + arr[j];

      // append 1 to the second half
      for (j = i; j < 2 * i; j++) arr[j] = '1' + arr[j];
    }

    // print contents of arr[]
    // for (i = 0; i < arr.length; i++) document.write(arr[i] + '<br>');
    return arr;
  }

  function searchSubsets(set) {
    //на вход строку без разделителей( сплошную)
    let graysArray = generateTableGray(set.length);
    let filterArray = [];
    for (let i = 0; i < graysArray.length; ++i) {
      let bufferArray = graysArray[i].split('');
      let buf = [];
      for (let n = 0; n < set.length; ++n) {
        if (bufferArray[n] == 1) buf.push(set[n]);
      }
      // console.log(buf);
      buf = String(buf);
      filterArray.push(buf);
    }
    console.log(filterArray);
    return filterArray;
  }
}
{
  //алгоритм флойда

  let matrix = [
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
  ];

  function getMinFloyd(matrix) {
    console.log(matrix);
    let n = matrix.length;
    for (let k = 0; k < n; ++k) {
      for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
          if (matrix[i][k] < Infinity && matrix[k][j] < Infinity) {
            matrix[i][j] = Math.min(matrix[i][j], matrix[i][k] + matrix[k][j]);
            console.log(` из ${k} в ${j} =  ${matrix[i][j]}`);
          }
        }
      }
    }
    console.log('стоп');
  }
  let matrix2 = [
    [0, 8, 10, 999],
    [8, 0, 3, 999],
    [10, 3, 0, 5],
    [999, 999, 5, 0],
  ];

  //
  function floydWarshallAlgorithm(matrix) {
    let startMatrix = JSON.parse(JSON.stringify(matrix));
    let numberOfPoints = matrix.length;
    for (let k = 0; k < numberOfPoints; ++k) {
      for (let i = 0; i < numberOfPoints; ++i) {
        for (let j = 0; j < numberOfPoints; ++j) {
          if (matrix[i][j] > matrix[i][k] + matrix[k][j]) {
            matrix[i][j] = matrix[i][k] + matrix[k][j];
          }
        }
      }
    }
    console.log(startMatrix);
    console.log(matrix);
    return matrix;
  }

  //
}
//
//
//  Canvas
//
//

function clearCanvas() {
  canvas.width = canvas.width;
}

function paintArrayOfPoints(matrix) {
  let n = matrix.length;
  let bufA, bufB;
  const сoordinatesOfPoints = [];
  for (let i = 0; i < n; ++i) {
    bufA = (i + 1) * stepX;
    bufB = (n - i + 1) * stepY * getRandomArbitrary(0.2, 1) + 1;
    let bufArray = [];
    bufArray.push(bufA, bufB);
    сoordinatesOfPoints.push(bufArray);
    paintPoint(bufA, bufB, i);
  }
  console.log(сoordinatesOfPoints);
  return сoordinatesOfPoints;
}

function CalcExistingEdge(matrix) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix.length; ++x) {
      if (matrix[x][y] != null && matrix[x][y] != undefined && matrix[x][y] != Infinity) {
        paintEdge(x, y);
      }
    }
  }
}

function paintEdge(point1, point2) {
  let x1, x2, y1, y2;
  x1 = coordsArray[point1][0];
  y1 = coordsArray[point1][1];
  x2 = coordsArray[point2][0];
  y2 = coordsArray[point2][1];

  //
  context.beginPath();
  context.moveTo(x1 * stepY, y1 * stepY);
  context.lineTo(x2 * stepY, y2 * stepY);

  context.strokeStyle = 'blue';
  context.lineWidth = 1;
  context.lineCap = 'round';
  context.lineJoin = 'bevel';

  context.stroke();
}

function calcCanvasStep(n) {
  // подаем кол во точек для построения
  n += 1;

  stepX = canvas.width / (n * 10);
  stepY = canvas.height / (n * 10);
}
function paintPoint(x, y, n) {
  context.beginPath();
  context.arc(x * stepX, y * stepY, stepX, 0, 2 * Math.PI, false);
  context.fillStyle = 'red';
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = 'red';
  context.stroke();
}
function addTextToPoints() {
  console.log('!2');
  for (let i = 0; i < coordsArray.length; ++i) {
    context.font = '30px mono';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.fillStyle = 'green';
    context.fillText(i, (coordsArray[i][0] + 2) * stepX, (coordsArray[i][1] + 2) * stepY);
  }
}
function addTextToEdge(matrix) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix.length; ++x) {
      if (matrix[x][y] == matrix[y][x]) {
        console.log(x, y, matrix[x][y], matrix[y][x]);
        context.font = '12px mono';
        context.fillStyle = 'red';
        let previous = y - 1;
        // y == 0 ? (previous = matrix.length - 1) : (previous = y - 1);
        let bufA = ((coordsArray[y][0] + coordsArray[x][0]) / 2) * stepX;

        let bufB = ((coordsArray[y][1] + coordsArray[x][1]) / 2) * stepX - stepY;
        if (matrix[x][y] != null && x != y) {
          console.log('!!!');
          let bufC = matrix[x][y];
          console.log(coordsArray);
          console.log('___');
          context.fillText(bufC, bufA, bufB);
        }
      } else {
        let bufCenterX = ((coordsArray[y][0] + coordsArray[x][0]) / 2) * stepX; //cередина отрезка
        let bufCenterY = ((coordsArray[y][1] + coordsArray[x][1]) / 2) * stepX;

        let x0 = (bufCenterX + coordsArray[y][0] * stepX) / 2;
        let y0 = (bufCenterY + coordsArray[y][1] * stepY) / 2;
        let x1 = (bufCenterX + coordsArray[x][0] * stepX) / 2;
        let y1 = (bufCenterY + coordsArray[x][1] * stepY) / 2;

        canvas_arrow(context, x1, y1, x0, y0, 10, matrix[x][y]);
        //

        // let bufC = matrix[x][y];
      }

      //хочу по середине отрисовать стрелки в разные строны разных цветов и расстояние писать разными цветами)
    }
  }
}

// /
function canvas_arrow(context, fromx, fromy, tox, toy, r, content, color = 'green') {
  let x_center = tox;
  let y_center = toy;

  let angle;
  let x;
  let y;

  context.beginPath();

  angle = Math.atan2(toy - fromy, tox - fromx);
  x = r * Math.cos(angle) + x_center;
  y = r * Math.sin(angle) + y_center;

  context.moveTo(x, y);

  angle += (1 / 3) * (2 * Math.PI);
  x = r * Math.cos(angle) + x_center;
  y = r * Math.sin(angle) + y_center;

  context.lineTo(x, y);

  angle += (1 / 3) * (2 * Math.PI);
  x = r * Math.cos(angle) + x_center;
  y = r * Math.sin(angle) + y_center;

  context.lineTo(x, y);

  context.closePath();
  context.fillStyle = color;

  context.fill();
  //
  context.font = '18px mono';
  context.fillStyle = 'black';

  context.fillText(content, x + stepX, y - 1.2 * stepY);
}
//
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
