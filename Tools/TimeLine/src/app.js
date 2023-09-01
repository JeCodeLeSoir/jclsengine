import CutImage from "./cut.js";

/*const canvas = document.querySelector('canvas');

if (canvas === null) {
  throw new Error("Canvas not found");
}

const ctx = canvas.getContext('2d');

if (ctx === null) {
  throw new Error("Canvas context not found");
}

function draw(timestamp) {
  currentTime = timestamp;
  const deltaTime = (currentTime - previousTime) / 1000;
  previousTime = currentTime;

  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let w = canvas.width;
  let h = canvas.height;


  //ctx.fillStyle = 'red';
  //ctx.fillRect(0, 10, 1, h - 10);

  /*for (let i = 0; i < 10; i++) {
    ctx.fillStyle = 'red';
    ctx.fillRect(i * 100, 10, 1, h - 10);
  }*/
/*
}
requestAnimationFrame(draw);*/

let previousTime = 0;
let currentTime = 0;

let zoom = 100;
let size = 1;
let sizebyZoom = size * zoom;
let frameMax = 60;


let ElementsUpdate = [];
let ElementsUpdateFrame = [];

let cursor_position = 10;

let AnimationData = {}
/*let AnimationData = {
  animations: [
    {
      name: "idle",
      frames: [
        {
          start: 0,
          end: 8,
          img: "http://fakeimg.pl/100/"
        }
      ]
    }
  ]
}*/

let default_img_ObjectURL = null;
let default_img_url = "http://fakeimg.pl/100";


let rectsList = [];
let Frames = [];

let cursor = document.createElement("div");
cursor.style.zIndex = "100";
cursor.style.width = "5px";
cursor.style.height = "100%";
cursor.style.backgroundColor = "yellow";
cursor.style.position = "absolute";
cursor.style.left = `${cursor_position * (sizebyZoom)}px`;
cursor.style.top = "0px";

let IsResizeFrame = false;
let ResizeTarget = null;
let dir = 0;

let isMoveCursor = false;

const timeline = document.querySelector(".timeline")
const timeline_rect = timeline.getBoundingClientRect();
const timeline_container = document.createElement("div");

timeline_container.style.width = `${frameMax * sizebyZoom}px`;
timeline_container.style.height = "150px";
timeline_container.style.position = "relative";
timeline_container.style.top = "50%";
timeline_container.style.transform = "translateY(-50%)";
timeline_container.style.backgroundColor = "grey";

//key press
document.addEventListener('keydown', (e) => {
  console.log(e.key);
  //key delete
  if (ResizeTarget)
    if (e.key === "Delete") {
      ResizeTarget.remove();
      let id = ResizeTarget.id.split("_")[1];
      Frames.splice(id - 1, 1);
    }
})

timeline_container.addEventListener('drop', (e) => {
  e.preventDefault();

  if (!IsInterneImg)
    return;

  const frame = JSON.parse(e.dataTransfer.getData("copyintimeline"));

  frame.start = Math.floor((e.clientX - timeline_rect.left) / sizebyZoom);
  frame.end = Math.floor((e.clientX - timeline_rect.left) / sizebyZoom) + 1;

  let frame_id = Frames.push(frame)

  CreateImgFrame(frame_id);
});


let FrameContener = []

function CreateImgFrame(frame_id) {
  let frame = Frames[frame_id - 1];
  const _frame = document.createElement("div");

  _frame.style.width = `${(frame.end - frame.start) * sizebyZoom}px`;
  _frame.style.height = "100%";
  _frame.style.position = "absolute";
  _frame.style.left = `${frame.start * sizebyZoom}px`;
  _frame.style.top = "0px";
  //_frame.style.backgroundColor = "blue";
  _frame.id = `frame_${frame_id}`;

  console.log(frame.size.width);
  _frame.style.backgroundImage = `url(${frame.img})`;
  _frame.style.backgroundRepeat = "repeat-x";
  _frame.style.backgroundSize = `${frame.size.width + 50}px 100%`;


  const rect_left = document.createElement("div");
  rect_left.style.width = "35px";
  rect_left.style.height = "100%";
  rect_left.style.backgroundColor = "#9225b9d4";
  rect_left.style.position = "absolute";
  rect_left.style.left = "0px";
  rect_left.style.top = "0px";
  rect_left.id = "rect_left";
  _frame.appendChild(rect_left);

  const rect_right = document.createElement("div");
  rect_right.style.width = "35px";
  rect_right.style.height = "100%";
  rect_right.style.backgroundColor = "#9225b9d4";
  rect_right.style.position = "absolute";
  rect_right.style.left = `${((frame.end - frame.start) * sizebyZoom) - 35}px`;
  rect_right.style.top = "0px";
  rect_right.id = "rect_right";
  _frame.appendChild(rect_right);


  ElementsUpdateFrame.push({
    element: _frame,
    isClearable: false,
    parent: timeline_container,
    Resize(sizebyZoom) {
      this.element.style.width = `${(frame.end - frame.start) * sizebyZoom}px`;
      this.element.style.left = `${frame.start * sizebyZoom}px`;
      rect_right.style.left = `${((frame.end - frame.start) * sizebyZoom) - 35}px`;
    }
  });

  _frame.addEventListener('pointerdown', (e) => {
    if (
      e.target.id !== "rect_left"
      && e.target.id !== "rect_right"
    )
      ResizeTarget = e.target;
  })

  function PointerDown(e) {
    IsResizeFrame = true;
    if (e.target.id === "rect_left")
      dir = 0
    if (e.target.id === "rect_right")
      dir = 1

    ResizeTarget = e.target.parentNode;
  }

  function PointerUp(e) {
    IsResizeFrame = false;

    //ResizeTarget = null;
  }

  function PointerMove(e) {
    if (IsResizeFrame) {

      if (_frame !== ResizeTarget) {
        return;
      }

      if (dir === 0
      ) {
        let x = e.clientX - timeline_rect.left;
        let frame_start = Math.floor(x / sizebyZoom);

        _frame.style.left = `${frame_start * sizebyZoom}px`;
        _frame.style.width = `${(frame.end - frame_start) * sizebyZoom}px`;

        rect_left.style.left = "0px";
        rect_right.style.left = `${((frame.end - frame_start) * sizebyZoom) - 35}px`;

        frame.start = frame_start;

        FrameContener.forEach((_frame_) => {
          if (_frame_ !== _frame) {
            let rect_left_ = _frame_.querySelector("#rect_left");
            let rect_right_ = _frame_.querySelector("#rect_right");

            let rect_right_rect_b = rect_right_.getBoundingClientRect();

            let rect_left_rect_a = rect_left.getBoundingClientRect();
            let rect_right_rect_a = rect_right.getBoundingClientRect();

            let distance_ = rect_left_rect_a.left - rect_right_rect_b.left;
            let max_distance = (rect_right_rect_a.left - rect_left_rect_a.left) - 35;

            console.log(distance_);
            console.log(max_distance);

            if (distance_ <= 35 && distance_ >= (-max_distance)) {
              //rect_left.style.backgroundColor = "red";
              //rect_right_.style.backgroundColor = "blue";

              let x = e.clientX - timeline_rect.left;
              let frame_end = Math.floor(x / sizebyZoom);
              let __frame = Frames[_frame_.id.split("_")[1] - 1];


              _frame_.style.width = `${(frame_end - __frame.start) * sizebyZoom}px`;
              rect_right_.style.left = `${((frame_end - __frame.start) * sizebyZoom) - 35}px`;

              __frame.end = frame_end;

            }
            else {
              //rect_left.style.backgroundColor = "#9225b9d4";
              //rect_right_.style.backgroundColor = "#9225b9d4";
            }

          }

        })
      }
      if (dir === 1
      ) {

        let x = e.clientX - timeline_rect.left;
        let frame_end = Math.floor(x / sizebyZoom);

        _frame.style.width = `${(frame_end - frame.start) * sizebyZoom}px`;
        rect_right.style.left = `${((frame_end - frame.start) * sizebyZoom) - 35}px`;
        frame.end = frame_end;


        FrameContener.forEach((_frame_) => {
          if (_frame_ !== _frame) {
            let rect_left_ = _frame_.querySelector("#rect_left");
            let rect_right_ = _frame_.querySelector("#rect_right");

            let rect_left_rect_b = rect_left_.getBoundingClientRect();
            let rect_right_rect_b = rect_right_.getBoundingClientRect();

            let rect_left_rect_a = rect_left.getBoundingClientRect();
            let rect_right_rect_a = rect_right.getBoundingClientRect();

            let distance_ = rect_right_rect_a.left - rect_left_rect_b.left;
            let max_distance = (rect_right_rect_a.left - rect_left_rect_a.left) - 35;

            if (distance_ >= (-35) && distance_ <= (max_distance)) {
              //rect_right.style.backgroundColor = "blue";
              //rect_left_.style.backgroundColor = "red";

              let x = e.clientX - timeline_rect.left;
              let frame_start = Math.floor(x / sizebyZoom);
              let __frame = Frames[_frame_.id.split("_")[1] - 1];

              _frame_.style.left = `${frame_start * sizebyZoom}px`;
              _frame_.style.width = `${(__frame.end - frame_start) * sizebyZoom}px`;

              rect_left_.style.left = "0px";
              rect_right_.style.left = `${((__frame.end - frame_start) * sizebyZoom) - 35}px`;
              __frame.start = frame_start;
            }
            else {
              //rect_right.style.backgroundColor = "#9225b9d4";
              //rect_left_.style.backgroundColor = "#9225b9d4";
            }

          }
        })
      }


    }
  }

  rect_left.addEventListener('pointerdown', (e) => PointerDown(e));
  rect_left.addEventListener('pointerup', (e) => PointerUp(e));

  rect_right.addEventListener('pointerdown', (e) => PointerDown(e));
  rect_right.addEventListener('pointerup', (e) => PointerUp(e));

  timeline.addEventListener('pointerup', (e) => PointerUp(e));
  timeline.addEventListener('pointermove', (e) => PointerMove(e));

  timeline_container.appendChild(_frame);
  FrameContener.push(_frame);
}

if (AnimationData.animations) {
  AnimationData.animations.forEach((animation) => {
    animation.frames.forEach((frame) => {
    })
  })
}


timeline.appendChild(timeline_container);
timeline.addEventListener('pointerdown', (e) => {
  if (!IsResizeFrame)
    isMoveCursor = true;
});

timeline.addEventListener('pointerup', (e) => {
  isMoveCursor = false;
});

let client_X;

timeline.addEventListener('pointermove', (e) => {
  client_X = e.clientX;
  if (isMoveCursor) {
    cursor_position = (client_X + timeline.scrollLeft) / sizebyZoom;
    cursor.style.left = `${cursor_position * sizebyZoom}px`;
  }
});


let last_cursor_position = 0;
const input_position = document.querySelector("#input_position");
input_position.addEventListener('change', (e) => {
  cursor_position = input_position.value;
  cursor.style.left = `${cursor_position * sizebyZoom}px`;
})

const input_maxFrame = document.querySelector("#input_maxFrame");
let last_input_maxFrame = frameMax;

input_maxFrame.addEventListener('change', (e) => {
  frameMax = parseInt(input_maxFrame.value);

  if (last_input_maxFrame !== frameMax) {
    timeline_container.style.width = `${frameMax * sizebyZoom}px`;

    ElementsUpdate.forEach((element, index) => {
      if (element.isClearable === true) {
        element.parent.removeChild(element.element);
      }
    })

    ElementsUpdate = [];

    console.log(ElementsUpdate);
    setTimeout(() => {
      console.log(frameMax);
      CreateTimeLineGrid(frameMax);
    }, 10);
    last_input_maxFrame = frameMax;
  }

})

let IsPlay = false;
const button_play = document.querySelector("#button_play");
button_play.addEventListener('click', (e) => {
  console.log("play");
  IsPlay = !IsPlay;
})

let speed = 1;
const input_speed = document.querySelector("#input_speed");
input_speed.addEventListener('change', (e) => {
  console.log(input_speed.value);
  speed = input_speed.value;
})


let preview = document.querySelector("#preview")
const UpdateScollTimeline = (timestamp) => {

  currentTime = timestamp;
  const deltaTime = (currentTime - previousTime) / 1000;
  previousTime = currentTime;

  requestAnimationFrame(UpdateScollTimeline);

  if (last_cursor_position !== cursor_position) {
    input_position.value = cursor_position;
    last_cursor_position = cursor_position;
  }

  if (isMoveCursor) {
    if (client_X <= 25) {
      timeline.scrollLeft -= 10;
    } else if (client_X > (window.innerWidth - 25)) {
      timeline.scrollLeft += 10;
    }
  }

  let get_img_by_position = Frames.find((frame) => {
    return frame.start <= cursor_position && frame.end >= cursor_position;
  });

  if (get_img_by_position) {
    if (preview) {
      preview.style.display = "block";
      preview.src = get_img_by_position.img;
    }
  }
  else {
    if (preview && default_img_ObjectURL !== null) {
      preview.src = default_img_ObjectURL
    }
    else {
      preview.style.display = "none";
    }
  }

  if (IsPlay) {
    cursor_position += speed * deltaTime;
    cursor.style.left = `${cursor_position * sizebyZoom}px`;

    if (cursor_position >= frameMax) {
      cursor_position = 0;
    }
  }

}
requestAnimationFrame(UpdateScollTimeline);

timeline.appendChild(cursor);
timeline.addEventListener('wheel', (e) => {

  zoom -= 0.1 * e.deltaY;
  sizebyZoom = size * zoom;

  cursor.style.left = `${cursor_position * sizebyZoom}px`;
  timeline_container.style.width = `${frameMax * sizebyZoom}px`;

  ElementsUpdateFrame.forEach((element) => {
    element.Resize(sizebyZoom);
  })

  ElementsUpdate.forEach((element) => {
    element.Resize(sizebyZoom);
  })
});

const CreateTimeLineGrid = (frameMax) => {

  console.log("CreateTimeLineGrid");



  for (let i = 0; i < frameMax + 1; i++) {

    let rect = document.createElement("div");

    rect.style.width = "1px";
    rect.style.height = "100%";
    rect.style.backgroundColor = "red";
    rect.style.position = "absolute";
    rect.style.left = `${i * sizebyZoom}px`;
    rect.style.top = "0px";

    timeline.appendChild(rect);

    let text = document.createElement("div");

    text.style.position = "absolute";
    text.style.left = `${i * sizebyZoom}px`;
    text.style.top = "0px";
    text.style.color = "white";
    text.style.fontSize = "20px";
    text.innerHTML = i;

    timeline.appendChild(text);

    ElementsUpdate.push({
      index: i,
      element: rect,
      parent: timeline,
      isClearable: true,
      Resize(sizebyZoom) {
        this.element.style.left = `${this.index * sizebyZoom}px`;
      },
    })

    ElementsUpdate.push({
      index: i,
      element: text,
      parent: timeline,
      isClearable: true,
      Resize(sizebyZoom) {
        this.element.style.left = `${this.index * sizebyZoom}px`;
      },
    })

  }
}
CreateTimeLineGrid(frameMax);

/* bar */
const resizeBar = document.getElementById('resizeBar');
const leftBlock = document.querySelector('.left-block');
const rightBlock = document.querySelector('.right-block');
let isResizing = false;

resizeBar.addEventListener('mousedown', (e) => {
  isResizing = true;
});

let Files = [];
let IsInterneImg = false;


const sprites_contain = document.querySelector(".sprites")
sprites_contain.addEventListener('drop', (e) => {
  e.preventDefault();

  console.log(e.dataTransfer.items);

  if (IsInterneImg) {
    IsInterneImg = false;
    return;
  }

  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach((item, i) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        //console.log(`… file[${i}].name = ${file.name}`);
        if (
          file.type === "image/png" || file.type === "image/jpeg" ||
          file.type === "image/jpg" || file.type === "image/gif"
        ) {
          /* file is contain */
          if (Files.find((e) => e.name === file.name) !== undefined) {
            return;
          }
          Files.push(file);
          /* top image */
          let img = document.createElement("img");

          img.addEventListener('dragstart', (e) => {
            console.log('dragstart');
            IsInterneImg = true;
            //e.dataTransfer.setData('text/plain', img.src);
            /*e.dataTransfer.setData('size', JSON.stringify({
              width: img.width,
              height: img.height,
            }));*/

            e.dataTransfer.setData('copyintimeline', JSON.stringify({
              size: {
                width: img.width,
                height: img.height,
              },
              img: img.src,
            }))

          })

          img.src = URL.createObjectURL(file);
          img.onload = function () {
          }
          sprites_contain.appendChild(img);
        }
      }
    });
  }
})

document.addEventListener('dragover', (e) => {
  e.preventDefault();
})

document.addEventListener('mousemove', (e) => {
  if (!isResizing) return;

  const containerWidth = document.querySelector('.container').getBoundingClientRect().width;
  const mouseX = e.clientX;

  const leftBlockWidth = mouseX;
  const rightBlockWidth = containerWidth - mouseX;

  leftBlock.style.flexBasis = `${leftBlockWidth}px`;
  rightBlock.style.flexBasis = `${rightBlockWidth}px`;
});

document.addEventListener('mouseup', () => {
  isResizing = false;
});


const OpenFile = document.querySelector("#OpenFile");
OpenFile.addEventListener('click', (e) => {

  console.log("OpenFile");
  /* open file json */
  const input = document.createElement('input');

  input.type = 'file';
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = readerEvent => {
      const content = readerEvent.target.result;
      const json = JSON.parse(content);

      let guid = json.img.guid;
      let src = json.img.src;
      let width = json.img.w;
      let height = json.img.h;

      let rects = json.rects;
      let rects_list_id = rectsList.push(rects) - 1;


      let imgs = []

      let finish = () => {
        imgs.forEach((img) => {
          sprites_contain.appendChild(img);
        })
      }

      rects.forEach((rect, index) => {
        let _cut = new CutImage()
        _cut.CutImage(src, 400, rect.x, rect.y, rect.w, rect.h, (src2) => {
          fetch(src2)
            .then(res => res.blob())
            .then(blob => {
              //console.log(src2);

              let img = document.createElement("img");
              img.src = URL.createObjectURL(blob);
              img.guid = guid;
              img.id = `rect_${rects_list_id}_${index}`;
              img.addEventListener('dragstart', (e) => {
                console.log('dragstart');
                IsInterneImg = true;

                /*e.dataTransfer.setData('id', img.id);
                e.dataTransfer.setData('text/plain', img.src);
                e.dataTransfer.setData('size', JSON.stringify({
                  width: img.width,
                  height: img.height,
                }));*/

                e.dataTransfer.setData('copyintimeline', JSON.stringify({
                  size: {
                    width: img.width,
                    height: img.height,
                  },
                  img: img.src,
                  id: img.id,
                  guid: guid,
                }))

              })
              imgs[index] = img;
              if (imgs.length === rects.length) {
                finish();
              }
            })
          _cut.Dispose();
        })
      })
    }
  }
  input.click();
})

const SaveFile = document.querySelector("#SaveFile");
SaveFile.addEventListener('click', (e) => {

  let Animation = [];

  Frames.forEach((frame) => {
    console.log(frame);

    let id_info = frame.id.split("_");
    console.log(id_info);
    let ind_rect = parseInt(id_info[1]);
    let ind_img = parseInt(id_info[2]);

    let rect = rectsList[ind_rect][ind_img];

    Animation.push({
      start: frame.start,
      end: frame.end,
      guid: frame.guid,
      rect: rect,
    })

  })

  let json = {
    speed: speed,
    frameMax: frameMax,
    animations: [Animation],
  }

  let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
  let a = document.createElement('a');
  a.href = data;
  a.download = 'data.json';
  a.click();


})