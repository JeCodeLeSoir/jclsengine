
let JsonFile = "./data/rects.json"
let JsonData = null;
let image = null;

fetch(JsonFile)
  .then(response => response.json())
  .then(data => JsonData = data);




let test_anim_index = 0;
let test_time_anim = 0;

let position_cursor = 0;

if (JsonData !== null) {

  if (image === null) {
    image = new Image();
    image.src = JsonData.img.src;
    image.onload = function () {
    }
  }
  else {
    //ctx.drawImage(image, 0, 0);
  }

  if (test_time_anim > 1) {

    if (test_anim_index < JsonData.rects.length - 1) {

      test_anim_index++;
    }
    else {
      test_anim_index = 0;
    }

    if (position_cursor < 60) {
      position_cursor += 0.25;
    }
    else {
      position_cursor = 0;
    }

    test_time_anim = 0;
  }

  let test_rect = JsonData.rects[test_anim_index];
  //console.log(test_rect);
  test_time_anim += 12 * deltaTime;


  /*DrawImage(ctx,
    {
      x: 0,
      y: 0
    },
    {
      x: 400,
      y: 400
    },
    {
      position: {
        x: test_rect.x,
        y: test_rect.y
      },
      size: {
        x: test_rect.w,
        y: test_rect.h
      }
    })*/


  //console.log(JsonData);
  for (let i = 0; i < JsonData.rects.length; i++) {
    let rect = JsonData.rects[i];
    //console.log(rect);
    //ctx.fillStyle = "#0000ff";
    //ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  }

  /* timeline */

  let size_timeline = 300;
  ctx.fillStyle = "#0000ff";
  ctx.fillRect(0, canvas.height - size_timeline,
    canvas.width, size_timeline);

  let maxframe = 60;

  /* draw frame text */

  let pos = 0;
  pos += position_cursor;
  let ix = (canvas.width / maxframe) * (pos + 0.25);

  for (let i = 0; i < maxframe; i++) {
    ctx.fillStyle = "#ffffff";
    let x = (canvas.width / maxframe) * (i + 0.25);
    /*scale font size*/

    let font_size = (canvas.width / maxframe) * 0.5;
    ctx.font = font_size + "px Arial";
    ctx.fillRect(x + 5,
      canvas.height + 5 - size_timeline
      , 10, 10);
    ctx.fillText(i,
      x, canvas.height - 5 - size_timeline
    );
    ctx.fillStyle = "#00ff3c";
    /* draw line top a bottom */
    ctx.fillRect(x,
      canvas.height - size_timeline, 1, size_timeline);
  }


  ctx.fillStyle = "#ff0000";
  ctx.fillRect(ix - 2.5, canvas.height - size_timeline, 5, size_timeline);

  //ctx.fillText("Frame: " + test_anim_index, 10, canvas.height - 10);
}

function DrawImage(ctx, position, size, rect) {
  ctx.drawImage(image,
    rect.position.x, rect.position.y,
    rect.size.x, rect.size.y,
    position.x, position.y,
    size.x, size.y);

  /*ctx.drawImage(image, 250, 0,
     250, 250,
     0, 0,
     800, 800);*/
}