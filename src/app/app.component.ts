import { Component } from '@angular/core';
import { IDicomConfig, ITool, IViewerProvider, ToolModeEnum } from '../../projects/ngx-dicom/src/lib/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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

  viewerProvider: IViewerProvider | undefined;

  exportStateToJson(): void {
    this.download(
      JSON.stringify(this.viewerProvider?.cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState()),
      'toolsState.json',
      'application/json'
    )
  }

  saveAs(): void {
    this.viewerProvider?.cornerstoneTools.SaveAs(this.viewerProvider?.element, 'screenshot.png');
  }

  activateTool(name: string): void {
    const foundTool = this.config.tools?.find((tool) => tool.name === name);
    if (foundTool && this.viewerProvider) {
      this.viewerProvider.cornerstoneTools['setToolActive'](name, foundTool.options)
    }
  }

  isActive(tool: ITool): boolean {
    return this.viewerProvider?.cornerstoneTools.isToolActiveForElement(this.viewerProvider?.element, tool.name);
  }

  private download(content: any, fileName: string, contentType: string) {
    const a = document.createElement("a");
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
}
