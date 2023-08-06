const map = document.getElementById("map");

const CELL_COUNT = 100;

//이 값은 각 셀의 상태를 나타낸다.
// {isBomb = true/false, isOpen = true/false}
const gameMap = [];
const BOMB_COUNT = 20;

for (let i = 0; i < CELL_COUNT; i++) {
  gameMap.push({ isBomb: false, isOpen: false });
}

for (let i = 0; i < BOMB_COUNT; i++) {
  let index;
  do {
    index = Math.floor(Math.random() * 100);
  } while (gameMap[index].isBomb);
  gameMap[index].isBomb = true;
}

//버튼을 CELL_COUNT만큼 생성, 누를 수 있다.
for (let i = 0; i < CELL_COUNT; i++) {
  const button = document.createElement("button");
  button.classList.add("image-button-unclicked");
  map.appendChild(button);

  button.addEventListener("click", () => {
    if (!gameMap[i].button.classList.contains("image-button-flag"))
      handleButton(i, button);
  });
  button.addEventListener("contextmenu", () => {
    if (!gameMap[i].isOpen) {
      if (gameMap[i].button.classList.contains("image-button-flag")) {
        gameMap[i].button.classList.remove("image-button-flag");
        gameMap[i].button.classList.add("image-button-unclicked");
      } else {
        gameMap[i].button.classList.remove("image-button-unclicked");
        gameMap[i].button.classList.add("image-button-flag");
      }
    }
  });
  gameMap[i].button = button;
}

function handleButton(i, button) {
  if (!gameMap[i].isOpen) {
    //연다
    openCell(i);
  }
}

function getCell(x, y) {
  if (x < 0 || x > 9) return undefined;
  if (y < 0 || y > 9) return undefined;
  return gameMap[y * 10 + x];
}

function getNearBombCount(i) {
  let count = 0;

  const x = i % 10;
  const y = Math.floor(i / 10);

  for (let a = -1; a <= 1; a++) {
    for (let b = -1; b <= 1; b++) {
      if (a === 0 && b === 0) continue;
      const cell = getCell(x + a, y + b);
      if (!cell) continue;
      if (cell.isBomb) count++;
    }
  }
  return count;
}

//고른 버튼을 뒤집는 함수
function openCell(i) {
  const cell = gameMap[i];
  if (
    cell.isBomb &&
    !gameMap[i].button.classList.contains("image-button-flag")
  ) {
    cell.button.classList.remove("image-button-unclicked");
    cell.button.classList.add("image-button-mine2");
    cell.isBomb = true;
    cell.isOpen = true;
    openAllCell();
  } else if (
    !cell.isOpen &&
    !gameMap[i].button.classList.contains("image-button-flag")
  ) {
    const sum = getNearBombCount(i);
    if (sum !== 0) {
      cell.button.classList.remove("image-button-unclicked");
      cell.button.classList.add(`image-button-number${sum}`);
    } else if (!gameMap[i].button.classList.contains("image-button-flag")) {
      flipAllZero(i);
    }
  }
  cell.isOpen = true;
  //이거 채우기
  //폭탄일 경우 " 모든 셀 열기"
}

//모든 버튼을 뒤집는 함수
function openAllCell() {
  for (let i = 0; i < CELL_COUNT; i++) {
    const cell = gameMap[i];
    if (!cell.isOpen) {
      if (cell.isBomb) {
        cell.button.classList.remove("image-button-unclicked");
        cell.button.classList.add("image-button-mine1");
      } else {
        const sum = getNearBombCount(i);
        if (sum === 0) {
          cell.button.classList.remove("image-button-unclicked");
          cell.button.classList.add("image-button-number0");
        } else {
          cell.button.classList.remove("image-button-unclicked");
          cell.button.classList.add(`image-button-number${sum}`);
        }
      }
      cell.isOpen = true;
    }
  }
}

//연속된 0과 그 주변을 뒤집는 함수
//dfs 알고리듬 사용
function flipAllZero(i) {
  const x = i % 10;
  const y = Math.floor(i / 10);
  if (i >= CELL_COUNT) {
    return undefined;
  }
  for (let a = -1; a <= 1; a++) {
    for (let b = -1; b <= 1; b++) {
      const cell = getCell(x + a, y + b);
      if (!cell) continue;
      if (
        !cell.isBomb &&
        !cell.isOpen &&
        !gameMap[i].button.classList.contains("image-button-flag")
      ) {
        let sum = getNearBombCount(i);
        if (
          sum === 0 &&
          !gameMap[i].button.classList.contains("image-button-flag")
        ) {
          gameMap[i].button.classList.remove("image-button-unclicked");
          gameMap[i].button.classList.add("image-button-number0");
          gameMap[i].isOpen = true;
          flipAllZero(i + a + 10 * b);
        } else if (!gameMap[i].button.classList.contains("image-button-flag")) {
          gameMap[i].button.classList.remove("image-button-unclicked");
          gameMap[i].button.classList.add(`image-button-number${sum}`);
          gameMap[i].isOpen = true;
        }
      }
    }
  }
}
