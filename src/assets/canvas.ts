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

  renderCertainAnnotationLabel(annotation:any,value:any){
    this.model.renderCertainAnnotationLabel(annotation,value)
  }
  joinSpan(list:any[]){
    return this.model.joinSpan(list)
  }

  setupLabels(data:any[]){
    this.model.setupLabels(data)
  }

  setRememberLabel(value:any){
    this.model.rememberLabel = value
  }

  get rememberLabel(){
    return this.model.rememberLabel
  }

}
