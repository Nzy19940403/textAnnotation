import { CanvasView } from './canvasView';
import { Master } from './master';
import { CanvasModel } from "./canvasModel";
import { CanvasController } from './canvasController';

export class Canvas {
  private model:CanvasModel & Master
  private controller:CanvasController
  private view:CanvasView
  constructor(){
    this.model = new CanvasModel();
    this.controller = new CanvasController(this.model);
    this.view = new CanvasView(this.model,this.controller);
  }

  html(){
    return this.view.html();
  }

  setup(){
    this.model.setup()
  }

  renderAnnotation(){
    this.model.renderAnnotation();
  }

  renderAnnotationLabel(annotation:any,value:any){
    this.model.renderAnnotationLabel(annotation,value)
  }

}
