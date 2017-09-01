export const CreatFlowNode = (x = 600, y = 50, w = 100, h = 100, inL = 0, outL = 3, inr = 10, outr = 15) => {
  var inx = inL % 2 == 0
    ? x + w / 2
    : (inL % 3 == 1
      ? x - inr
      : x + w + inr)
  var iny = inL % 2 == 1
    ? y + h / 2
    : (inL % 4 == 0
      ? y - inr
      : y + h + inr)
  var outx = outL % 2 == 0
    ? x + w / 2
    : (outL % 3 == 1
      ? x
      : x + w)
  var outy = outL % 2 == 1
    ? y + h / 2
    : (outL % 4 == 0
      ? y
      : y + h)
  return ({
    op_type: 'Op_Add',
    flow: {
      x: x,
      y: y,
      w: w,
      h: h,
      c: 0
    },
    input: [
      {
        type: 'ElementType_FromResult',
        node: {
          x: inx,
          y: iny,
          r: inr,
          to: -1
        },
        value: {
          id: 'id2',
          layerId: ''
        }
      }
    ],
    outputAttr: {
      node: {
        x: outx,
        y: outy,
        r: outr
      },
      cached: true,
      saveToFile: false,
      saveToAccu: false,
      resultId: 'test'
    }
  })
};
export const GetLine = (x1, y1, x2, y2, r1, r2) => {
  var X = x2 - x1,
    Y = y2 - y1
  var Z = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2))
  var a1 = X * r1 / Z
  var b1 = Y * r1 / Z
  var a2 = X * r2 / Z
  var b2 = Y * r2 / Z
  return {
    X1: x1 + a1,
    Y1: y1 + b1,
    X2: x2 + a2,
    Y2: y2 + b1
  }
};
export const flowMove = (x, y, node) => {
  var mx = x - node.flow.x
  var my = y - node.flow.y
  node.flow.x = x
  node.flow.y = y

  node
    .input
    .map((item, i) => {
      item.node.x = item.node.x + mx
      item.node.y = item.node.y + my
    })

  node.outputAttr.node.x += mx
  node.outputAttr.node.y += my
  return node
};
export const getLocation = (x, y, w, h, ox, oy, inL, inR = 10) => {
  console.log('new location', x, y, w, h, ox, oy, inL, inR)
  var inX = x
  var inY = y
  if (inL == 0) {
    inX = ox
    inY = inY - inR
  } else if (inL == 1) {
    inX = inX + w + inR
    inY = oy
  } else if (inL == 2) {
    inX = ox
    inY = inY + h + inR
  } else if (inL == 3) {
    inX = inX - inR
    inY = oy
  }
  return { x: inX, y: inY }

};
export default CreatFlowNode
