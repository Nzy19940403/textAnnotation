import { Master } from './master';
import { CanvasModel, NodesMapUpdateData } from "./canvasModel";



export class CanvasController {
  model:CanvasModel&Master
  constructor(model:CanvasModel&Master){
    this.model = model;
  }

  updateNodesMap(data:NodesMapUpdateData){
    this.model.updateNodesMap(data)
  }

  // updateAnnotation(){
  //   this.model.updateAnnotation()
  // }

  getFormedSelectionInfo(data:NodesMapUpdateData){
    //调整正反选的情况
    return this.model.getFormedSelectionInfo(data)
  }

  get exported(){
    return this.model.exported
  }

  get collection(){
    return this.model.collection
  }

  get map(){
    return this.model.map
  }

}
