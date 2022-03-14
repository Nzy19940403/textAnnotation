
import { AnnotationCollection } from './annotation-collection';
import { MapOfList, ListNode } from './list';
import { MasterImpl } from './master';
import * as _ from 'lodash'
export class CanvasModel extends MasterImpl {
  private mapOfList:Map<number,any>
  private mapOfListInstance:MapOfList

  private origindata:string[] = ['人工智能的定义可以分为两部分,','即“人工”和“智能”。','“人工”比较好理解,','争议性也不大。','而且有时我们会要考虑什么是人力所能及制造的，',
  '或者人自身的智能程度有没有高到可以创造人工智能的地步，','但总的来说，','“人工系统”就是通常意义下的人工系统。',
  '人工智能的定义可以分为两部分,','即“人工”和“智能”。','“人工”比较好理解,','争议性也不大。','而且有时我们会要考虑什么是人力所能及制造的，',
  '或者人自身的智能程度有没有高到可以创造人工智能的地步，','但总的来说，','“人工系统”就是通常意义下的人工系统。',
  '人工智能的定义可以分为两部分,','即“人工”和“智能”。','“人工”比较好理解,','争议性也不大。','而且有时我们会要考虑什么是人力所能及制造的，',
  '或者人自身的智能程度有没有高到可以创造人工智能的地步，','但总的来说，','“人工系统”就是通常意义下的人工系统。',
  '人工智能的定义可以分为两部分,','即“人工”和“智能”。','“人工”比较好理解,','争议性也不大。','而且有时我们会要考虑什么是人力所能及制造的，',
  '或者人自身的智能程度有没有高到可以创造人工智能的地步，','但总的来说，','“人工系统”就是通常意义下的人工系统。',
  '人工智能的定义可以分为两部分,','即“人工”和“智能”。','“人工”比较好理解,','争议性也不大。','而且有时我们会要考虑什么是人力所能及制造的，',
  '或者人自身的智能程度有没有高到可以创造人工智能的地步，','但总的来说，','“人工系统”就是通常意义下的人工系统。'
  ];
  private formedData:any[] = []

  private labels:any[] = []

  private annotationCollection:AnnotationCollection

  //后面要移出model中，放在store里记录，model创建出来的东西，以自定义时间发送至angular组件中，调用相关方法组合生成相应的标注信息，再放回canvas中调用renderAnnotation方法
  private recentLabel:any = null

  constructor(){
    super();

    this.annotationCollection = new AnnotationCollection(this);
    this.mapOfListInstance = new MapOfList(this.origindata,this.annotationCollection);
    this.mapOfList = this.mapOfListInstance.getMap();



  }

  setup(){
    this.makeFormedData()
  }

  setupLabels(data:any[]){
    this.labels = this.labels.concat(data)
  }

  makeFormedData(){
    this.formedData = this.mapOfListInstance.getFormedData();

    this.notify('ADD_VIEW');
  }
  updateNodesMap(data:NodesMapUpdateData){
    //更新map存储的节点信息
    //返回需要替换的节点

    let updateNodesInfo = this.mapOfListInstance.updateNodesMap(data);

    this.formedData
    updateNodesInfo.forEach((item)=>{
      let tarIndex = _.findIndex(this.formedData,(node)=>{
        return item.deleted == node.index
      });
      for(let i = item.newNodes.length-1;i>=0;i--){
        this.formedData.splice(tarIndex,0,{
          index:item.newNodes[i].nodeID,
          value:item.newNodes[i].value.data
        });
      }
      _.remove(this.formedData,(node)=>{
        return item.deleted == node.index
      });

    })


    let created = this.annotationCollection.getCreated()

    //更新dom节点，删除并替换操作
    this.notify('UPDATE_NODES',{updateNodesInfo,created})

  }
  // updateAnnotation(){
  //   this.annotationCollection
  //   console.log(this.annotationCollection.exported)
  // }

  renderAnnotation(){
    this.annotationCollection.initAnnotationObjectLevelMap()
    this.notify('RENDER_ANNOTATION');
  }
  renderCertainAnnotationLabel(annotation:any,value:any){

    let node = this.map.get(annotation.endNodeId) as ListNode;
    node.val!.annotationObject!.LabelName = value
    this.notify('RENDER_ANNOTATION_LABEL',{
      annotationId:annotation.clientId,
      nodeId:annotation.endNodeId
    })
  }

  getFormedSelectionInfo(data:NodesMapUpdateData){

    let leftIndex = _.findIndex(this.formedData,(item)=>{
      return item.index==data.leftNodeId
    });
    let rightIndex = _.findIndex(this.formedData,(item)=>{
      return item.index==data.rightNodeId
    });

    if(leftIndex>rightIndex){
      let res:NodesMapUpdateData = {
        leftNodeId:data.rightNodeId,
        leftNodeOffset:data.rightNodeOffset,
        rightNodeId:data.leftNodeId,
        rightNodeOffset:data.leftNodeOffset
      };
      return res;
    }

    return data
  }

  joinSpan(list:any[]):string{
    let str = '';
    for(const id of list){
      let data = this.map.get(id);
      str += data.value.data;

    }
    return str;
  }

  get exported(){
    return this.annotationCollection.exported
  }

  get renderData(){
    return this.formedData;
  }

  get map(){
    return this.mapOfList
  }
  get collection (){
    return this.annotationCollection
  }

  get rememberLabel (){
    return this.recentLabel
  }

  set rememberLabel(value){
    this.recentLabel = value
  }

}


export interface NodesMapUpdateData {
  leftNodeId:number,
  leftNodeOffset:number,
  rightNodeId:number,
  rightNodeOffset:number
}
