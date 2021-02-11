// 在线繁体转换
// https://www.aies.cn/
// vercel
// https://vercel.com/
// 生成gif
// http://jnordberg.github.io/gif.js/tests/video.html

(function () {
  const colors = {
    red: '#d00018',
    black: '#000',
    orange: '#ec4318',
    orangeA: o => `rgba(236, 67, 24, ${o})`
  };
  const width = 560;
  const height = 400;

  const drawBtn = document.querySelector('#drawBtn');
  const radios = document.querySelectorAll('.imgType');
  const canvas = document.querySelector('#canvas');
  const ctx = canvas.getContext('2d');

  let mainText = document.querySelector('#titleInput').value;

  let isPlaying = true;
  let startTime = 0;

  drawBtn.addEventListener('click', () => {
    const text = document.querySelector('#titleInput').value;
    if (text.length === 4 || text.length === 5) {
      mainText = text;
      if (!isPlaying) draw();
    }
  });
  [].forEach.call(radios, (radio) => {
    radio.addEventListener('change', e => {
      const { currentTarget } = e;
      if (!currentTarget.checked) return;
      isPlaying = currentTarget.dataset.value === 'gif';
      draw();
    });
  });

  nextFrame();

  function nextFrame() {
    if (startTime === 0) startTime = + new Date;
    requestAnimationFrame(draw);
  }

  function draw() {
    const now = isPlaying ? +new Date : 0;
    drawBg(now);
    drawText1();
    drawText2();
    drawText3(now);
    drawLine1();
    drawMainText(mainText, now);
    drawLine2();
    drawText4(now);
    drawText5();

    if (isPlaying) nextFrame();
  }
  function drawBg(now) {
    ctx.fillStyle = colors.black;
    ctx.fillRect(0, 0, width, height);

    const stripeOffset = 20;
    const stripeWidth = 100;
    const stripeGapWidthWidth = 150;
    const startX = ((now - startTime) / 6) % stripeGapWidthWidth - stripeGapWidthWidth;
    ctx.fillStyle = colors.red;
    for (let x = startX; x < width + stripeWidth; x += stripeGapWidthWidth) {
      drawStripe(x, 5, height, stripeWidth, stripeOffset);
    }

    ctx.fillStyle = colors.black;
    ctx.fillRect(0, 0, 250, 315);
    ctx.fillRect(250, 125, 410, 190);
    ctx.fillRect(380, 310, 180, 90);
    ctx.fillRect(250, 25, 410, 80);
    ctx.fillRect(0, 330, 380, 60);
  }
  function drawText1() {
    fillRoundRect(5, 7, 240, 38, 4, colors.red);
    fillText('非常事態', 5, 12, 240, 32, colors.black);
  }
  function drawText2() {
    fillText('警告', 5, 55, 240, 80, colors.red);
  }
  function drawText3(now) {
    const opacity = Math.abs(100 - (now - startTime) / 5 % 200) / 100;
    fillText2('WARNING', 260, 40, 60, colors.orangeA(opacity));
  }
  function drawLine1() {
    ctx.fillStyle = colors.red;
    ctx.fillRect(0, 130, width, 10);
  }
  function drawMainText(mainText, now) {
    const hasBg = ((now - startTime) / 4 % 200) > 100;
    if (hasBg) {
      ctx.fillStyle = colors.red;
      ctx.fillRect(0, 150, width, 140);
    }
    fillText(mainText, 0, 170, width, 120, hasBg ? colors.black : colors.red);
  }
  function drawLine2() {
    ctx.fillStyle = colors.red;
    ctx.fillRect(0, 300, width, 10);
  }
  function drawText4(now) {
    const opacity = Math.abs(100 - (now - startTime) / 5 % 200) / 100;
    fillText2('EMERGENCY', 10, 337, 56, colors.orangeA(opacity));
  }
  function drawText5() {
    fillText('発令', 380, 320, 184, 80, colors.red);
  }
  
  function drawStripe(x, y, height, width, offsetX) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - width - offsetX, y + height);
    ctx.lineTo(x - offsetX, y + height);
    ctx.lineTo(x + width, y);
    ctx.closePath();
    ctx.fill();
  }
  function fillText(text, start, y, width, fs, fillColor) {
    ctx.fillStyle = fillColor;
    ctx.font = `bold ${fs}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const arr = text.split('');
    const step = width / arr.length;
    arr.forEach((t, i) => {
      ctx.fillText(t, start + (i + 0.5) * step, y);
    });
  }
  function fillText2(text, x, y, fs, fillColor) {
    ctx.fillStyle = fillColor;
    ctx.font = `bold ${fs}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
  }
  function fillRoundRect(x, y, width, height, radius, fillColor) {
    if (2 * radius > width || 2 * radius > height) { return false; }
    ctx.save();
    ctx.translate(x, y);
    drawRoundRectPath(width, height, radius);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.restore();
  }
  function drawRoundRectPath(width, height, radius) {
    ctx.beginPath(0);
    //从右下角顺时针绘制，弧度从0到1/2PI  
    ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
    //矩形下边线  
    ctx.lineTo(radius, height);
    //左下角圆弧，弧度从1/2PI到PI  
    ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
    //矩形左边线  
    ctx.lineTo(0, radius);
    //左上角圆弧，弧度从PI到3/2PI  
    ctx.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
    //上边线  
    ctx.lineTo(width - radius, 0);
    //右上角圆弧  
    ctx.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
    //右边线  
    ctx.lineTo(width, height - radius);
    ctx.closePath();
  }
})();
