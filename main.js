var yyy = document.getElementById('xxx');
var context = yyy.getContext('2d');
var lineWidth = 2

autoSetCanvasSize(yyy)


/******/
listenToUser(yyy)


/********/
var eraserEnabled = false
pen.onclick = function () {
  eraserEnabled = false
  pen.classList.add('active')
  eraser.classList.remove('active')
}
eraser.onclick = function () {
  eraserEnabled = true
  eraser.classList.add('active')
  pen.classList.remove('active')
}
clear.onclick = function () {
  context.clearRect(0, 0, yyy.width, yyy.height)
}
save.onclick = function () {
  var image = yyy.toDataURL("image/png").replace("image/png", "image/octet-stream");
  window.location.href = image;
}



var colors = $('#colors > li')
for (let i = 0; i < colors.length; i++) {
  $(colors[i]).on('click', function (x) {
    var penColor = colors[i].className
    $('#palette').css({
      fill: penColor
    })
    $('#pen').css({
      fill: penColor
    })
    context.strokeStyle = `${penColor}`
    $(x.currentTarget).addClass("active").siblings().removeClass("active")
  })
}


$(palette).on('click',function (){
  if($(colorPalette).css("display")=="none"){
      $(colorPalette).show();
  }else{
      $(colorPalette).hide();            
  }
})


var size = $('#size > li')
for (let i = 0; i < size.length; i++) {
  $(size[i]).on('click', function (x) {
    var index = $(x.currentTarget).index()
    lineWidth = 2 * (index + 1)
    $(size[i]).css({
      width: 24
    })
    $(size[i]).siblings().css({ width: 16 })
  })
}


/********/
function autoSetCanvasSize(canvas) {
  setCanvasSize()
  window.onresize = function () {
    setCanvasSize()
  }

  function setCanvasSize() {
    var pageWidth = document.documentElement.clientWidth
    var pageHeight = document.documentElement.clientHeight
    canvas.width = pageWidth
    canvas.height = pageHeight
  }
}

function drawCircle(x, y, radius) {
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill()
}

function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1) //起点
  context.lineWidth = lineWidth
  context.lineTo(x2, y2) //终点
  context.stroke()
  context.closePath()
}

function listenToUser(canvas) {
  var using = false
  var lastPoint = { x: undefined, y: undefined }
  if (document.body.ontouchstart !== undefined) {
    //触屏设备
    canvas.ontouchstart = function (aaa) {
      var x = aaa.touches[0].clientX
      var y = aaa.touches[0].clientY
      using = true
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        lastPoint = {
          "x": x,
          "y": y
        }
      }
    }
    canvas.ontouchmove = function (aaa) {
      var x = aaa.touches[0].clientX
      var y = aaa.touches[0].clientY
      if (!using) { return }
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        var newPoint = {
          "x": x,
          "y": y
        }
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }
    }
    canvas.ontouchend = function (aaa) {
      using = false
    }
  } else {
    //非触屏设备
    canvas.onmousedown = function (aaa) {
      var x = aaa.clientX
      var y = aaa.clientY
      using = true
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        lastPoint = {
          "x": x,
          "y": y
        }
      }
    }

    canvas.onmousemove = function (aaa) {
      var x = aaa.clientX
      var y = aaa.clientY
      if (!using) { return }
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        var newPoint = {
          "x": x,
          "y": y
        }
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }
    }

    canvas.onmouseup = function (aaa) {
      using = false
    }
  }

}