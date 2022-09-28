#Дискретная математика
##Операции над множествами. Свойства бинарных отношений. Замыкания отношений
###реализация на javascript

---

Для запуска откройте файл index.html в корневой директории.
Файл откроется в браузере как веб страница, затем нажмите на ссылку _задание1_.
<br>
###Блок 1
####Задание 1

> Проверьте единичную квадратную матрицу на рефлексивность.

Для проверки на рефлексивность нужно проверить главную диагональ матрицы на отсутствие нулей.

```javascript
function checkReflecs(matrix) {
  let n = matrix.length;

  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix[0].length; ++x) {
      if (x == y) {
        if (matrix[x][y] != 1) {
          return 0;
        }
      }
    }
  }
  return 1;
}
```

На вход функции подается единичная матрица, на выходе функция возвращает 0 если матрица не рефлексивна и 1 если рефлексивна.

####Задание 2

> Проверьте единичную квадратную матрицу на антирефлексивность.

Для проверки на рефлексивность нужно проверить главную диагональ матрицы на отсутствие единиц.

```javascript
function checkAntiReflecs(matrix) {
  let n = matrix.length;

  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix[0].length; ++x) {
      if (x == y) {
        if (matrix[x][y] != 0) {
          return 0;
        }
      }
    }
  }
  return 1;
}
```

На вход функции подается единичная матрица, на выходе функция возвращает 0 если матрица не антирефлексивна и 1 если антирефлексивна.

> но это можно выполнить и одной функцией, которая заменяет собой 2 предыдущие благодоря входжному параметру 'mode'

```javascript
function checkDiagonal(matrix, direction = 'main', mode) {
  let n = matrix.length;
  let X;

  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix[0].length; ++x) {
      direction == 'main' ? (X = x) : (X = n - x - 1);
      if (X == y) {
        if (matrix[x][y] != mode) {
          return 0;
        }
      }
    }
  }

  return 1;
}
```

####Задание 3

> Проверьте единичную квадратную матрицу на симметричность.

чтобы проверить матрицу на симметричность, нужно проверить эллементы симметричные главной диагонали на равенство.

####Задание 4

> Проверьте единичную квадратную матрицу на антисимметричность.

чтобы проверить матрицу на антисимметричность, нужно проверить симметричную пару каждого не нулевого эллемента на противоположность.

задания 3,4 выполняются одной функцией (как и задания 1,2).

```js
function checkSymmetry(matrix, mode = 'n0') {
  let buf;

  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix[0].length; ++x) {
      buf = 0;
      if (mode == 'anti') {
        x != y && matrix[x][y] != 0
          ? (buf = reverse(matrix[y][x]))
          : (buf = matrix[x][y]);
      }

      if (mode === 'a' && x != y) {
        buf = reverse(matrix[y][x]);
      } else if (mode == 'n0') {
        buf = matrix[y][x];
      }

      if (matrix[x][y] != buf) {
        return 0;
      }
    }
  }

  return 1;
}
```

На фход функции _checkSymmetry_ подается массив и режим проверки. Для проверки на антисимметричность в параметр _mode_ передаем строку _'anti'_, для проверки на ассиметричность строку _'a'_, для проверки на симметричность передавать значение не обязательно.
На выходе функция вернет 0 при негативном исходе и единицу если проверка прошла успешно.

####Задание 5

> Проверьте единичную квадратную матрицу на транзитивность.

Для проверки транзитивности нужно проверить, что если i,j-ый и j,k-ый элементы принадлежат отношению, то и i,k-ый элемент тоже равен единице

```js
function checkTransit(matrix) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix[0].length; ++x) {
      if (matrix[x][y] == 1) {
        console.log('1');
        if (matrix[x].join('') != matrix[y].join('')) return 0;
      }
    }
  }
  return 1;
}
```

На вход функции _checkTransit_ подается симметричная матрица, на выходе будет возвращен 1, если матрица транзитивна и 0 если нет.

---

###Блок 2

#### Задание 1

> Найдите все подмножества множества с помощью алгоритма Грея

Для поиска всех подмножеств, создается единичная матрица по алгоритму Грея.

```js
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
```

На вход функции _generateTableGray_ подается длина исходного множества, на выходе мы получаем единичную матрицу Грея.

```js
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
```

На вход функции _searchSubsets_ подается множество, затем определяется его длина и с помощью функции _generateTableGray_ создается нужная таблица Грея.
Затем сопоставляется каждая строка из таблицы грея и исходное множество, символы на месте которых расположены единицы остаются и формируют подмножество, остальные символы в подмножество вклюбчены не будут.
На выходе мы получаем все подмножества исходного множества.

---

###Блок 3
####Задание 1

> С помощью алгоритма Флойда-Уоршалла найдите кратчайшие пути между точками. Заполните матрицу.

```js
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
```

На вход функция принимает квадратную матрицу, входе выполнения алгоритма матрица будет изменена и возвращена.

---

<br>

_#11_
