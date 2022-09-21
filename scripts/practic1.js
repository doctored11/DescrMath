const matrix = [];
let Y = 3,
  X = 3;

//
//🛑 - выполнить в первую очередь
//❌ - выполнить во вторую очередь
//👨🏻‍💻 - в третью очередь рефакторинг и разбиение на финкции и скрипты.js
//   - мини шаг - проверить на работоспособность и устойчивость к вводу
//🌈 - в четвертую очередь стили css (width 1200 - 2000px)
//⭕️ - в пятую сдеалать красивым все отображение на канвас
//✅ - в шестую сдеалать адаптив css ( width 200 - 2000+ )

//
let stepX, stepY;
const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d');
console.log(canvas);
canvas.width = 500;
canvas.height = 500;

//

{
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
    tableClearVisualFull(matrix);
    createTable(matrix);
    matrixStatusCheck(matrix);
  });

  //  //Dom
  //блок со случайной матрицей
  let randMatrix = document.querySelector('.table-rand');
  function createTable(matrix) {
    for (let j = 0; j < matrix.length; ++j) {
      let stroke = document.createElement('tr');
      randMatrix.append(stroke);
      for (let i = 0; i < matrix.length; ++i) {
        let buf = document.createElement('th');
        buf.classList.add('cell');
        buf.innerHTML = `<span class ="descr-num rand-num" id = "${j}-${i}">${matrix[j][i]}</span>`;
        stroke.append(buf);
      }
    }
  }

  // функции dom матрица
  let statusMessage = document.querySelectorAll('.status');
  function matrixStatusCheck(matrix) {
    for (let i = 0; i < statusMessage.length; ++i) {
      checkDiagonal(matrix, 'main', 0)
        ? (statusMessage[0].textContent = ' антирефлексивна')
        : (statusMessage[0].textContent = 'условия антирефлексивности не выполненны');

      checkDiagonal(matrix, 'main', 1)
        ? (statusMessage[1].textContent = ' рефлексивна')
        : (statusMessage[1].textContent = 'условия рефлексивности не выполненны');
      checkSymmetry(matrix, '')
        ? (statusMessage[2].textContent = 'симметрична')
        : (statusMessage[2].textContent = 'не симметрична');

      checkSymmetry(matrix, 'anti')
        ? (statusMessage[3].textContent = 'антисимметрична')
        : (statusMessage[3].textContent = 'не антисимметрична');

      if (checkSymmetry(matrix, '') && checkDiagonal(matrix, 'main', 1)) {
        checkTransit(matrix)
          ? (statusMessage[4].textContent = 'транзитивна')
          : (statusMessage[4].textContent = 'не транзитивна');
      } else {
        statusMessage[4].textContent = 'не транзитивна';
      }
    }
  }
  function tableClearVisualFull() {
    let matrix = document.querySelector('.table-rand');
    let buf = matrix.childNodes.length;
    for (let i = 0; i < buf; ++i) {
      matrix.childNodes[0].remove();
    }
  }
  // блок DOM множества
  let inputPlenty = document.querySelector('.form-plenty');

  let btnPlenty = document.querySelector('.btn-plenty');
  btnPlenty.addEventListener('click', () => {
    let mainPlanty = inputPlenty.value;
    let out = document.querySelector('.plenty-output');

    out.innerHTML = `|   ${String(searchSubsets(mainPlanty))
      .split(',')
      .join('<span class="accent0"> | </span>')}  |`;
  });
  // транзитивное замыкание DOM
  let inputClose = document.querySelector('.form-close');
  let btnClose = document.querySelector('.btn-close');
  btnClose.addEventListener('click', () => {
    let inputArray = document.querySelector('.input-canvas');
    let closeN = Number(inputClose.value); //  ❌ поставить ограничения от 3 до 22 включительно( просто для красоты верхняя планка) ❌ второй очередью

    for (let i = 0; i < closeN; ++i) {
      let inputStroke = document.createElement('div');

      inputArray.append(inputStroke);
      for (let j = 0; j < closeN; ++j) {
        let inputCell = document.createElement('input');
        inputStroke.append(inputCell);
        inputCell.classList.add(`cell`);
        inputCell.classList.add(`close-cell`);
        inputCell.classList.add(`cell-${j}-${i}`);
      }
    }
    let btnsBlock = document.querySelector('.close-btns');
    let takeBtn = document.createElement('button');
    takeBtn.classList.add(`btn-calc`);
    takeBtn.classList.add(`calc`);
    takeBtn.textContent = 'рассчитать';
    btnsBlock.append(takeBtn);
    takeBtn.addEventListener('click', () => {
      //написать функцию для очистки матрицы инпутов ❌ во вторую очередь
      let matrix = createMatrix(closeN, closeN);
      takeProperties(matrix); // 🛑сразу главную диагональ заполнить нулями (и запретить их изменять) !перваяочередь🛑
      let startMatrix = JSON.parse(JSON.stringify(matrix));
      calcCanvasStep(closeN);
      matrix = floydWarshallAlgorithm(matrix); // алгоритм изменяет начальную матрицу
      window.coordsArray = paintArrayOfPoints(matrix);

      CalcExistingEdge(startMatrix);
      addTextToPoints();
      addTextToEdge(startMatrix);

      // выводить таблицу с быстрыми путями куда нибуть (+функция) 🛑 в первую очередь
    });
  });

  function takeProperties(matrix) {
    let cellArray = document.querySelectorAll('.close-cell');
    for (let i = 0; i < cellArray.length; ++i) {
      let y = cellArray[i].classList[2].split('-')[1];
      let x = cellArray[i].classList[2].split('-')[2];
      matrix[x][y] = Number(cellArray[i].value);
    }
    console.log(matrix);
  }
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
    let buf;

    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[0].length; ++x) {
        direction == 'main' ? (X = x) : (X = n - x - 1);
        if (X == y) {
          if (matrix[x][y] != mode) {
            buf = `есть ${reverse(mode)} на ${direction} диагонале`;
            console.log(buf);
            return 0;
          }
        }
      }
    }
    buf = `есть ${mode} на ${direction} диагонале -- ${status} `;
    console.log(buf);
    return 1;
  }

  function checkSymmetry(matrix, mode) {
    let buf;

    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[0].length; ++x) {
        mode == 'anti' && x != y ? (buf = reverse(matrix[y][x])) : (buf = matrix[y][x]);
        if (matrix[x][y] != buf) {
          console.log(`не симметрична относительно главной`);
          return 0;
        }
      }
    }
    //проверить удовия анти симметричность
    console.log(`${mode}симметрична относительно главной`);
    return 1;
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

  // !!______________________________________________________________!!

  function checkTransit(matrix) {
    //на вход только симметричную матрицу с единицами на главной диагонале
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[0].length; ++x) {
        if (matrix[x][y] == 1) {
          console.log('1');
          if (matrix[x].join('') != matrix[y].join('')) return 0;
        }
      }
    }
    console.log('транзитивна');
    return 1;
  }

  function generateTableGray(n) {
    if (n <= 0) return;

    let arr = [];

    //cтартовый патерн
    arr.push('0');
    arr.push('1');

    let i, j;
    for (i = 2; i < 1 << n; i = i << 1) {
      for (j = i - 1; j >= 0; j--) arr.push(arr[j]);
      //первая часть
      for (j = 0; j < i; j++) arr[j] = '0' + arr[j];

      //вторая часть
      for (j = i; j < 2 * i; j++) arr[j] = '1' + arr[j];
    }

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

      buf = String(buf);
      buf = buf.split(',').join(' и ');
      console.log(buf);
      filterArray.push(buf);
    }
    console.log(filterArray);
    String(filterArray).split(',').join('-');
    return filterArray;
  }
}
{
  //алгоритм флойда

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
  // ❌ сделать красивые разноцветные точки - во вторую очередь
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
  // сделать визуально красиво ❌-вторая оч
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
