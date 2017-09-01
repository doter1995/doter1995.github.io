const Work = {
  nodes: [
    {
      op_type: 'Op_Add',
      flow: {
        x: 100, y: 50, w: 150, h: 100, c: 0
      },
      input: [
        {
          type: 'ElementType_FromResult',
          node: { x: 90, y: 100, r: 10, to: -1 },
          value: {
            id: 'id2',
            layerId: ''
          }
        },
        {
          type: 'ElementType_Double',
          node: { x: 90, y: 60, r: 10, to: -1 },
          value: 12
        }
      ],
      outputAttr: {
        node: { x: 250, y: 100, r: 15 },
        cached: true,
        saveToFile: false,
        saveToAccu: false,
        resultId: ''
      }
    }
  ]
}
export default Work
