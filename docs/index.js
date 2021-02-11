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
  const downloadBtn = document.querySelector('#downloadBtn');
  const radios = document.querySelectorAll('.imgType');
  const canvas = document.querySelector('#canvas');
  const context = canvas.getContext('2d');
  const canvas2 = document.querySelector('#canvas2');
  const context2 = canvas2.getContext('2d');

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
      if (currentTarget.dataset.value === 'gif') {
        radios[0].parentNode.classList.remove('active');
        radios[1].parentNode.classList.add('active');
        isPlaying = true;
      } else {
        radios[0].parentNode.classList.add('active');
        radios[1].parentNode.classList.remove('active');
        isPlaying = false;
      }
      nextFrame();
    });
  });
  downloadBtn.addEventListener('click', generateImage);

  nextFrame();

  function generateImage() {
    let img = document.querySelector('#image');
    if (img) img.remove();
    img = new Image();
    img.id = 'image';
    if (isPlaying) {
      const mask = document.querySelector('#mask');
      mask.style.display = 'block';
      
      const gif = new GIF({
        repeat: 0,
        workers: 2,
        quality: 8
      });

      const step = 50;
      for (let x = 0; x <= 1000; x += step) {
        draw(context2, startTime + x);
        const imageData = context2.getImageData(0, 0, width, height);
        gif.addFrame(imageData, { delay: step });
      }
      canvas2.style.display = 'none';
      
      gif.on('finished', function(blob) {
        // img.src = URL.createObjectURL(blob);
        // document.body.appendChild(img);
        window.open(URL.createObjectURL(blob));
        mask.style.display = 'none';
      });
      
      gif.render();
    } else {
      img.src = canvas.toDataURL("image/png");
      document.body.appendChild(img);
    }
  }

  function nextFrame() {
    if (startTime === 0) startTime = + new Date;
    requestAnimationFrame(() => {
      draw();
      if (isPlaying) nextFrame();
    });
  }

  function draw(ctx = null, now = null, ) {
    ctx = ctx || context;
    if (now === null) now = isPlaying ? +new Date : 0;
    drawBg(ctx, now);
    drawText1(ctx);
    drawText2(ctx);
    drawText3(ctx, now);
    drawLine1(ctx);
    drawMainText(ctx, mainText, now);
    drawLine2(ctx);
    drawText4(ctx, now);
    drawText5(ctx);
  }
  function drawBg(ctx, now) {
    ctx.fillStyle = colors.black;
    ctx.fillRect(0, 0, width, height);

    const stripeOffset = 20;
    const stripeWidth = 60;
    const stripeGapWidthWidth = 100;
    const startX = ((now - startTime) / 6) % stripeGapWidthWidth - stripeGapWidthWidth;
    ctx.fillStyle = colors.red;
    for (let x = startX; x < width + stripeWidth; x += stripeGapWidthWidth) {
      drawStripe(ctx, x, 5, height, stripeWidth, stripeOffset);
    }

    ctx.fillStyle = colors.black;
    ctx.fillRect(0, 0, 250, 315);
    ctx.fillRect(250, 125, 410, 190);
    ctx.fillRect(380, 310, 180, 90);
    ctx.fillRect(250, 25, 410, 80);
    ctx.fillRect(0, 330, 380, 60);
  }
  function drawText1(ctx) {
    fillRoundRect(ctx, 5, 7, 240, 38, 4, colors.red);
    fillText(ctx, '非常事態', 5, 12, 240, 32, colors.black);
  }
  function drawText2(ctx) {
    fillText(ctx, '警告', 5, 55, 240, 80, colors.red);
  }
  function drawText3(ctx, now) {
    const opacity = Math.abs(100 - (now - startTime) / 5 % 200) / 100;
    fillText2(ctx, 'WARNING', 260, 40, 60, colors.orangeA(opacity));
  }
  function drawLine1(ctx) {
    ctx.fillStyle = colors.red;
    ctx.fillRect(0, 130, width, 10);
  }
  function drawMainText(ctx, mainText, now) {
    const hasBg = ((now - startTime) / 5 % 200) > 100;
    if (hasBg) {
      ctx.fillStyle = colors.red;
      ctx.fillRect(0, 150, width, 140);
    }
    fillText(ctx, mainText, 0, 170, width, 120, hasBg ? colors.black : colors.red);
  }
  function drawLine2(ctx) {
    ctx.fillStyle = colors.red;
    ctx.fillRect(0, 300, width, 10);
  }
  function drawText4(ctx, now) {
    const opacity = Math.abs(100 - (now - startTime) / 5 % 200) / 100;
    fillText2(ctx, 'EMERGENCY', 10, 337, 56, colors.orangeA(opacity));
  }
  function drawText5(ctx) {
    fillText(ctx, '発令', 380, 320, 184, 80, colors.red);
  }
  
  function drawStripe(ctx, x, y, height, width, offsetX) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - width - offsetX, y + height);
    ctx.lineTo(x - offsetX, y + height);
    ctx.lineTo(x + width, y);
    ctx.closePath();
    ctx.fill();
  }
  function fillText(ctx, text, start, y, width, fs, fillColor) {
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
  function fillText2(ctx, text, x, y, fs, fillColor) {
    ctx.fillStyle = fillColor;
    ctx.font = `bold ${fs}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
  }
  function fillRoundRect(ctx, x, y, width, height, radius, fillColor) {
    if (2 * radius > width || 2 * radius > height) { return false; }
    ctx.save();
    ctx.translate(x, y);
    drawRoundRectPath(ctx, width, height, radius);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.restore();
  }
  function drawRoundRectPath(ctx, width, height, radius) {
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
