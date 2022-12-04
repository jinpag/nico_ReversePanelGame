const WIDTH = 3;
const HEIGHT = 3;
const SIZE = 100;

let gameover = false;

const board = [];

const init = () => {
  const container = document.createElement("div");
  container.style.position = "relative";
  document.body.appendChild(container);

  for (let y = 0; y < HEIGHT; y++) {
    board[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      const panel = document.createElement("div");
      panel.style.position = "absolute";
      panel.style.left = `${x * SIZE + 2}px`;
      panel.style.top = `${y * SIZE + 2}px`;
      panel.style.width = `${SIZE - 4}px`;
      panel.style.height = `${SIZE - 4}px`;
      panel.style.backgroundColor = "#f00";
      panel.style.borderRadius = "10px";
      panel.style.transition = "all 150ms linear";

      container.appendChild(panel);

      board[y][x] = { panel, color: 0 };

      panel.onpointerdown = (e) => {
        e.preventDefault();
        ondown(x, y);
      };
    }
  }
};

let isAnimation = false;

const flip = async (x, y) => {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) {
    return;
  }
  isAnimation = true;

  const panel = board[y][x].panel;
  let color = board[y][x].color;
  color = 1 - color;
  board[y][x].color = color;

  // アニメーション処理（★処理内容が謎）

  // パネルを90度回転
  panel.style.transform = "perspective(200px) rotateY(90deg)";
  await new Promise((r) => setTimeout(r, 150)); // ウェイト
  // パネルの色変更
  panel.style.backgroundColor = color ? "#00f" : "#f00";
  // パネルの90度回転を戻す
  panel.style.transform = "perspective(200px) rotateY(-90deg)";
  // DOM操作によるアニメーション停止（※裏技）
  panel.parentElement.appendChild(panel);
  await new Promise((r) => setTimeout(r, 50)); // ウェイト
  panel.style.transform = "perspective(200px) rotateY(0deg)";
  await new Promise((r) => setTimeout(r, 150)); // ウェイト

  isAnimation = false;
};

const ondown = (x, y) => {
  if (isAnimation) {
    return;
  }
  if (gameover) {
    return;
  }
  flip(x, y);
  flip(x, y - 1);
  flip(x - 1, y);
  flip(x + 1, y);
  flip(x, y + 1);

  gameover = board.flat().every((v) => v.color === 1);
};

window.onload = () => {
  init();
};
