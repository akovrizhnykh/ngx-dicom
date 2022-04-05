export interface IDicomConfig {
  fileUrl: string;
  tools?: ITool[];
  classList?: string;
}

export interface IStack {
  currentImageIdIndex: number;
  imageIds: string[];
}

export interface IViewerProvider {
  element: any;
  cornerstoneTools: any;
  cornerstone: any;
  playClip?: {
    play(frameRate: number): void;
    stop(): void;
  };
}

export interface ITool {
  name: string;
  options: any;
  mode: ToolModeEnum;
  state?: any;
}

export enum ToolModeEnum {
  Active = 'Active',
  Passive = 'Passive',
  Enabled = 'Enabled',
  Disabled  = 'Disabled'
}
