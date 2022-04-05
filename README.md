### Angular dicom viewer features
1. View dicom(.dcm) files
2. Use [cornerstonejs](https://tools.cornerstonejs.org/ "cornerstonejs") plugins and features

### Demo
https://ngx-dicom.web.app/

### Install

1. `$ npm install ngx-dicom`
2. `$ npm install cornerstone-core`
3. `$ npm install cornerstone-math`
4. `$ npm install cornerstone-tools`
5. `$ npm install cornerstone-wado-image-loader`
6. `$ npm install hammerjs`

### Add scripts to angular.json architect.build.options:
```json
"scripts": [
"./node_modules/hammerjs/hammer.js",
"./node_modules/cornerstone-math/dist/cornerstoneMath.js",
"./node_modules/cornerstone-tools/dist/cornerstoneTools.js",
"./node_modules/cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoader.bundle.min.js",
"./node_modules/dicom-parser/dist/dicomParser.js"
]
```

### Add module:

```typescript
  imports: [
    NgxDicomModule,
	]
```

### Config example:

```typescript
config: IDicomConfig = {
  fileUrl: 'http://localhost:4200/assets/0002.DCM',
  tools: [
    {
      name: 'DragProbe',
      options: { mouseButtonMask: 1 },
      mode: ToolModeEnum.Passive
    },
    {
      name: 'Eraser',
      options: { mouseButtonMask: 1 },
      mode: ToolModeEnum.Passive
    },
    {
      name: 'Magnify',
      options: { mouseButtonMask: 1 },
      mode: ToolModeEnum.Passive
    },
    {
      name: 'StackScrollMouseWheel',
      options: { mouseButtonMask: 1 },
      mode: ToolModeEnum.Active
    },
    {
      name: 'Rotate',
      options: { mouseButtonMask: 1 },
      mode: ToolModeEnum.Passive
    },
    {
      name: 'Pan',
      options: { mouseButtonMask: 1 },
      mode: ToolModeEnum.Passive
    },
    {
      name: 'ZoomMouseWheel',
      options: { mouseButtonMask: 1 },
      mode: ToolModeEnum.Passive
    },
    {
      name: 'Length',
      options: { mouseButtonMask: 1 },
      mode: ToolModeEnum.Passive
    },
    {
      name: 'Angle',
      options: { mouseButtonMask: 1 },
      mode: ToolModeEnum.Passive
    },
    {
      name: 'FreehandRoi',
      options: { mouseButtonMask: 1 },
      mode: ToolModeEnum.Passive
    },
    {
      name: 'Wwwc',
      options: { mouseButtonMask: 1 },
      mode: ToolModeEnum.Passive
    }
  ],
  classList: 'canvas-container'
};
```
## Add component:

```html
<ngx-dicom [config]="config" (initialized)="viewerProvider = $event"></ngx-dicom>
```

You can manage features by **viewerProvider**.

Library based on: https://github.com/cornerstonejs/cornerstoneTools

Docs: https://tools.cornerstonejs.org/
