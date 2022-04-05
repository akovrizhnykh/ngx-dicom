import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

// @ts-ignore
import * as cornerstone from 'cornerstone-core';
// @ts-ignore
import * as cornerstoneMath from 'cornerstone-math';
// @ts-ignore
import * as cornerstoneTools from 'cornerstone-tools';
// @ts-ignore
import Hammer from 'hammerjs';
// @ts-ignore
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { IDicomConfig, IStack, IViewerProvider } from './models';

@Component({
  selector: 'ngx-dicom',
  templateUrl: './ngx-dicom.component.html',
  styleUrls: ['./ngx-dicom.component.scss']
})
export class NgxDicomComponent implements AfterViewInit {
  @Input() config: IDicomConfig;
  @Output() initialized = new EventEmitter<IViewerProvider>();

  @ViewChild('dicomViewport') viewport: ElementRef;

  private element: Element;
  private stack: IStack;
  private provider: IViewerProvider = {
    element: null,
    cornerstoneTools,
    cornerstone
  };
  private isMultiFrame: boolean;
  private playClipActive: boolean;

  constructor() {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  }

  ngAfterViewInit(): void {
    this.element = this.viewport.nativeElement;
    cornerstoneTools.init(
      {
        showSVGCursors: true,
      }
    );
    cornerstone.enable(this.element);
    this.registerImageLoader();
  }

  private registerImageLoader(): void {
    const schema = this.config.fileUrl.split(':')[0];
    cornerstone.registerImageLoader(schema, cornerstoneWADOImageLoader.wadouri.loadImage);
    this.load();
  }

  private load(): void {
    cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.load(
      this.config.fileUrl,
      cornerstoneWADOImageLoader.internal.xhrRequest
    ).then((dataSet: any) => {
      const numFrames = dataSet.intString('x00280008');
      if (!numFrames) {
        this.loadImage(this.config.fileUrl);
      } else {
        this.isMultiFrame = true;
        this.loadWithMultiFrame(numFrames);
      }
    });
  }

  private loadWithMultiFrame(numFrames: number): void {
    const imageIds = [];
    const imageIdRoot = 'wadouri:' + this.config.fileUrl;

    for (let i = 0; i < numFrames; i++) {
      const imageId = imageIdRoot + "?frame=" + i;
      imageIds.push(imageId);
    }

    this.stack = {
      currentImageIdIndex: 0,
      imageIds: imageIds
    };

    // cornerstoneTools.setElementToolStateManager(this.element, cornerstoneTools.newStackSpecificToolStateManager);
    cornerstoneTools.addStackStateManager(this.element, ['stack']);
    cornerstoneTools.addToolState(this.element, 'stack', this.stack);
    this.loadImage(imageIds[0]);
  }

  private loadImage(url: string): void {
    cornerstone.loadAndCacheImage(url).then((image: any) => {
      cornerstone.displayImage(this.element, image);
      this.initTools();
      cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.unload(url);
      this.initializeProvider();
    });
  }

  private initTools(): void {
    if (this.config.tools) {
      this.config.tools.forEach((tool) => {
        const apiTool = cornerstoneTools[`${tool.name}Tool`];
        cornerstoneTools.addTool(apiTool);
        cornerstoneTools[`setTool${tool.mode}`](tool.name, tool.options);
        if (tool.state) {
          cornerstoneTools.addToolState(this.element, tool.name, tool.state);
        }
      });
    }
  }

  private initializeProvider(): void {
    if (this.isMultiFrame) {
      this.provider.playClip = {
        play: (frameRate => {
          if (!this.playClipActive) {
            cornerstoneTools.playClip(this.element, frameRate);
            this.playClipActive = true;
          }
        }),
        stop: () => {
          if (this.playClipActive) {
            cornerstoneTools.stopClip(this.element);
            this.playClipActive = false;
          }
        }
      }
    }
    this.provider.element = this.element;
    this.initialized.emit(this.provider);
  }
}
