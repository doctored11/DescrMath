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
canvas.width = window.screen.width * 0.7;
canvas.height = canvas.width;

{
  //events
  let randomMatrixBtn = document.querySelector('.ub__btn-random-generate');
  let inputN = document.querySelector('.form-control');

  randomMatrixBtn.addEventListener('click', () => {
    X = Number(inputN.value) || 2;
    if (X < 2) X++;
    if (X > 16) X = 10;
    console.log(X);
    Y = X;
    let matrix = createMatrix(X, Y);
    fillMatrix(matrix);
    console.log(matrix);
    tableClearVisualFull('table-rand');
    createTable(matrix, randMatrix);
    matrixStatusCheck(matrix);
  });

  //блок 1 (со случайной матрицей)
  let randMatrix = document.querySelector('.table-rand');
  function createTable(
    matrix,
    activeBlock,
    attribute = 'descr-num',
    id = 'id',
    mode = 'descr',
    matrix0 = 'none'
  ) {
    for (let j = 0; j < matrix.length; ++j) {
      let stroke = document.createElement('tr');
      activeBlock.append(stroke);
      for (let i = 0; i < matrix.length; ++i) {
        let bufAttribute = attribute;
        let buf = document.createElement('th');
        buf.classList.add('cell');
        if ((matrix[j][i] == Infinity || matrix[j][i] == NaN) && mode != 'descr') {
          matrix[j][i] = 0;
        }
        if (matrix0 != 'none' && matrix[j][i] != matrix0[j][i] && mode != 'descr') {
          matrix0[j][i] == null ? (bufAttribute = 'new') : (bufAttribute = 'changed');
        }
        buf.innerHTML = `<span class ="${bufAttribute} rand-num" ${id} = "${j}-${i}">${matrix[j][i]}</span>`;
        stroke.append(buf);
      }
    }
  }

  // функции dom матрица
  let statusMessage = document.querySelectorAll('.status');
  function matrixStatusCheck(matrix) {
    checkDiagonal(matrix, 'main', 0)
      ? (statusMessage[0].innerHTML = ' <span class="accent-txt">антирефлексивна<span>')
      : (statusMessage[0].textContent = 'условия антирефлексивности не выполненны');

    checkDiagonal(matrix, 'main', 1)
      ? (statusMessage[1].innerHTML = '<span class="accent-txt"> рефлексивна</span>')
      : (statusMessage[1].textContent = 'условия рефлексивности не выполненны');
    checkSymmetry(matrix, '')
      ? (statusMessage[2].innerHTML = '<span class="accent-txt">симметрична</span>')
      : (statusMessage[2].textContent = 'не симметрична');
    checkSymmetry(matrix, 'anti')
      ? (statusMessage[3].innerHTML = '<span class="accent-txt">антисимметрична</span>')
      : (statusMessage[3].textContent = 'не антисимметрична');
    checkSymmetry(matrix, 'a') && checkDiagonal(matrix, 'main', 0)
      ? (statusMessage[4].innerHTML = '<span class="accent-txt">асимметрична</span>')
      : (statusMessage[4].textContent = 'не асимметрична');

    if (checkSymmetry(matrix, '') && checkDiagonal(matrix, 'main', 1)) {
      checkTransit(matrix)
        ? (statusMessage[5].innerHTML = '<span class="accent-txt">транзитивна</span>')
        : (statusMessage[5].textContent = 'не транзитивна');
    } else {
      statusMessage[5].textContent = 'не транзитивна';
    }
  }

  function tableClearVisualFull(attribute) {
    let matrix = document.querySelector(`.${attribute}`);
    let buf = matrix.childNodes.length;
    for (let i = 0; i < buf; ++i) {
      matrix.childNodes[0].remove();
    }
  }

  // блок DOM множества
  showPlenty();

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
            return 0;
          }
        }
      }
    }
    buf = `есть ${mode} на ${direction} диагонале -- ${status} `;
    console.log(buf);
    return 1;
  }

  function checkSymmetry(matrix, mode = '0') {
    let buf;

    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[0].length; ++x) {
        mode === 'anti' && x != y && matrix[x][y] != 0
          ? (buf = reverse(matrix[y][x]))
          : (buf = matrix[y][x]);

        if (mode === 'a' && x != y) {
          buf = reverse(matrix[y][x]);
        } else if (mode == '0') {
          buf = matrix[y][x];
        }

        if (matrix[x][y] != buf) {
          console.log('не симметрична относительно главной');
          return 0;
        }
      }
    }
    console.log(`${mode}симметрична относительно главной`);
    return 1;
  }

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
  // -- вспомогательные функции для модуля 1
  function reverse(number) {
    number = `${number}`.split('');
    for (let i = 0; i < number.length; ++i) {
      number[i] == 1 ? number.splice(i, 1, '0') : number.splice(i, 1, '1');
    }
    return Number(number.join(''));
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
  function getDiscrRandom() {
    return Math.round(Math.random());
  }

  // второе задание - поиск подмножеств
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
      buf = buf.split(',').join('  ');
      console.log(buf);
      filterArray.push(buf);
    }
    console.log(filterArray);
    String(filterArray).split(',').join('-');
    return filterArray;
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
      for (j = 0; j < i; j++) arr[j] = '0' + arr[j];
      for (j = i; j < 2 * i; j++) arr[j] = '1' + arr[j];
    }

    return arr;
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
    return matrix;
  }

  // транзитивное замыкание DOM

  let inputClose = document.querySelector('.form-close');
  let btnClose = document.querySelector('.btn-close');
  let takeBtn = document.createElement('button');
  btnClose.addEventListener('click', () => {
    let inputArray = document.querySelector('.input-canvas');
    let closeN = Number(inputClose.value) || 3;

    //верхнее ограничение для красивой визуальной состовляющей
    if (closeN < 2) closeN = 2;
    if (closeN > 22) closeN = 22;
    if (screen.width < 880) {
      if (closeN > 15) closeN = 12;
    }

    inputArray.innerHTML = '';

    for (let i = 0; i < closeN; ++i) {
      let inputStroke = document.createElement('div');
      inputArray.append(inputStroke);
      for (let j = 0; j < closeN; ++j) {
        let inputCell = document.createElement('input');
        inputStroke.append(inputCell);
        inputCell.classList.add(`cell`);
        inputCell.classList.add(`close-cell`);
        inputCell.classList.add(`cell-${j}-${i}`);
        if (i == j) {
          inputCell.value = 0;
          inputCell.readOnly = true;
        }
      }
    }

    let btnsBlock = document.querySelector('.close-btns');
    takeBtn.classList.add(`btn-calc`);
    takeBtn.classList.add(`btn`);
    takeBtn.classList.add(`calc`);
    takeBtn.textContent = 'рассчитать';
    btnsBlock.append(takeBtn);

    takeBtn.addEventListener('click', () => {
      clearCanvas();
      let matrix = createMatrix(closeN, closeN);
      calcCanvasStep(closeN);
      takeProperties(matrix);
      let startMatrix = JSON.parse(JSON.stringify(matrix));

      matrix = floydWarshallAlgorithm(matrix); // алгоритм изменяет начальную матрицу
      window.coordsArray = paintArrayOfPoints(matrix);

      CalcExistingEdge(startMatrix);
      addTextToPoints();
      addTextToEdge(startMatrix);

      let matrixTabble = document.querySelector('.table-floyd');
      tableClearVisualFull('table-floyd');
      createTable(matrix, matrixTabble, 'floyd-cell', 'floyd', 'floyd-mode', startMatrix);
    });
  });
  // -- вспомогательные функции для модуля 3
  function takeProperties(matrix) {
    let cellArray = document.querySelectorAll('.close-cell');
    for (let i = 0; i < cellArray.length; ++i) {
      let y = cellArray[i].classList[2].split('-')[1];
      let x = cellArray[i].classList[2].split('-')[2];

      matrix[x][y] = Number(cellArray[i].value) || 0;
      if (
        Number(cellArray[i].value) == 0 ||
        Number(cellArray[i].value) == null ||
        Number(cellArray[i].value) == undefined ||
        Number(cellArray[i].value) == NaN
      ) {
        matrix[x][y] = Infinity;
      }
      if (x == y) matrix[x][y] = 0;
    }
    console.log(matrix);
  }
}
//основная логика ↑↑↑
//||||||||||||
//логика визуала  ↓↓↓

function showPlenty() {
  let inputPlenty = document.querySelector('.form-plenty');
  let btnPlenty = document.querySelector('.btn-plenty');
  btnPlenty.addEventListener('click', () => {
    let mainPlanty = inputPlenty.value;
    let out = document.querySelector('.plenty-output');

    out.innerHTML = `|   ${String(searchSubsets(mainPlanty))
      .split(',')
      .join('<span class="accent0"> | </span>')}  |`;
  });
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
    i < n / 2
      ? (bufB = (n - i) * getRandomArbitrary(0.4, 1.1) * stepY)
      : (bufB = (i * getRandomArbitrary(0.3, 0.8) + n / i) * stepY);

    let bufArray = [];
    bufArray.push(bufA, bufB);
    сoordinatesOfPoints.push(bufArray);
    paintPoint(bufA, bufB, i);
  }
  console.log(сoordinatesOfPoints);
  return сoordinatesOfPoints;
}

function CalcExistingEdge(matrix, x) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix.length; ++x) {
      if (
        matrix[x][y] != null &&
        matrix[x][y] != undefined &&
        matrix[x][y] != Infinity &&
        matrix[x][y] != 0
      ) {
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
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);

  context.strokeStyle = `#3b1e92`;
  context.lineWidth = 2;
  context.lineCap = 'round';
  context.lineJoin = 'bevel';

  context.stroke();
}

function calcCanvasStep(n) {
  // canvas.width = 2000;
  // подаем кол во точек для построения
  n += 1;

  // подумать над лучшим расчетом шага

  if (n < 10) a = 0.03;
  if (n > 9) a = 0.1;

  stepX = (0.7 * window.screen.width) / n;

  stepY = stepX;
  canvas.width = n * stepX;
  canvas.height = canvas.width;
  console.log(window.screen.width, stepX, n, canvas.width);
}
function paintPoint(x, y, n) {
  console.log(window.screen.width, stepX, n, canvas.width);

  let rad = 0.2;
  if (window.screen.width < 550) rad = 0.35;

  context.moveTo(0, 0);
  context.beginPath();
  context.arc(x, y, rad * stepX, 0, 2 * Math.PI, false);
  context.fillStyle = 'red';
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = 'red';
  context.stroke();
  //
  // context.moveTo(0, 0);
  // context.beginPath();
  // context.arc(x, y, 0.1 * stepX, 0, 2 * Math.PI, false);
  // context.fillStyle = '#fff';
  // context.fill();
  // context.lineWidth = 1;
  // context.strokeStyle = '#fff';
  // context.stroke();
}
function addTextToPoints() {
  console.log('!2');
  let rad = 0.1;
  if (window.screen.width < 550) rad = 0.3;
  for (let i = 0; i < coordsArray.length; ++i) {
    context.moveTo(0, 0);
    context.beginPath();
    context.arc(coordsArray[i][0], coordsArray[i][1], rad * stepX, 0, 2 * Math.PI, false);
    context.fillStyle = '#fff';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#fff';
    context.stroke();
    let fontSize = stepX / 10;
    if (window.screen.width < 550) fontSize = stepX / 2;

    context.font = `${fontSize}px Arial Black`; // попробовать подключить другой
    context.fillStyle = 'red';
    context.background = `#fff`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(i, coordsArray[i][0], coordsArray[i][1]);
  }
}
function addTextToEdge(matrix) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix.length; ++x) {
      if (matrix[x][y] == matrix[y][x]) {
        console.log(x, y, matrix[x][y], matrix[y][x]);
        let fontSize = stepX / 15;
        if (window.screen.width < 550) fontSize = stepX / 4;

        context.font = `${fontSize}px Arial Black`; // попробовать подключить другой
        context.fillStyle = '#8B00FF';
        let previous = y - 1;

        let bufA = (coordsArray[y][0] + coordsArray[x][0]) / 2;

        let bufB = (coordsArray[y][1] + coordsArray[x][1]) / 2; //
        if (matrix[x][y] != null && x != y) {
          console.log('!!!');
          let bufC = matrix[x][y];
          console.log(coordsArray);
          console.log('___');
          context.fillText(bufC, bufA, bufB);
        }
      } else if (matrix[x][y] != 0 && matrix[x][y] != null && matrix[x][y] != NaN) {
        let bufCenterX = (coordsArray[y][0] + coordsArray[x][0]) / 2 - 0.4; //cередина отрезка
        let bufCenterY = (coordsArray[y][1] + coordsArray[x][1]) / 2;

        let x0 = (bufCenterX + coordsArray[y][0]) / 2;
        let y0 = (bufCenterY + coordsArray[y][1]) / 2;
        let x1 = (bufCenterX + coordsArray[x][0]) / 2;
        let y1 = (bufCenterY + coordsArray[x][1]) / 2;
        let color = `	rgb(${getRandomArbitrary(35, 255)},${getRandomArbitrary(
          15,
          40
        )},${getRandomArbitrary(25, 250)})`;
        console.log(color);

        let r = stepX / 20;
        if (window.screen.width < 550) r = stepX / 6;
        canvas_arrow(context, x1, y1, x0, y0, r, matrix[x][y], color);
        //
      }
    }
  }
}

//
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
  let fontSize = stepX / 8;
  if (window.screen.width < 550) fontSize = stepX / 3;
  context.font = `${fontSize}px Arial Black`;

  context.fillStyle = color;

  context.fillText(content, x, y * 0.95);
}
//
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
//ani
let a = 1;
let b = 1;
let time = 820;
setInterval(function () {
  a > 5 ? (a = 1) : a++;
  b++;
  aniTxt(a);
}, time);

function aniTxt(a) {
  let txtPole = document.querySelector('.txt-paint');
  let buf;

  switch (a) {
    case 1:
      buf = '¯_(ツ)_/¯';
      break;
    case 2:
      buf = '(ಥ﹏ಥ)';
      break;
    case 3:
      buf = '◘_◘';
      break;
    case 4:
      buf = '⊙﹏⊙';
      break;
    case 5:
      buf = '^ↀᴥↀ^';
      break;
    case 6:
      buf = '¯_(⊙_ʖ⊙)_/¯';
      break;
  }
  txtPole.innerHTML = buf;
}
