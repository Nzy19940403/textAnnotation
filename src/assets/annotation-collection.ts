import { ListNode } from './list';
import { NodesMapUpdateData } from './canvasModel';
import { AnnotationObject } from './annotation-objects';
import * as _ from 'lodash'
import { BASIC_ANNOTATION_PADDING } from './const';
export class AnnotationCollection {
  //标注的集合， map管理了annotationObjects 每个annotationObject对应一个listNode和对应多个标签
  private annotationList:any[] = [];
  private map = new Map();
  private count:number = 0;
  constructor(){

  }
  updateAnnotation(data:any[],map:Map<number,ListNode>){



    //更新已有的标注信息
    console.log(this.annotationList)
    for(let i = 0;i<data.length;i++){
      let targetId = data[i].deleted;
      for(let j = 0;j<this.annotationList.length;j++){
        let list = this.annotationList[j].sortedNodeList;
        if(list[0]>targetId || list[list.length-1]<targetId){
          continue
        }

        //二分查找已有标注中是否还有需要被替换的节点，如果有的话，将旧节点id更新成新的id
        let left = 0;
        let right = list.length;
        while(left<right){
          let mid = left + (right-left>>1);
          if(list[mid]<targetId){
            left = mid+1
          }else if(list[mid]>targetId){
            right = mid;
          }else{
            left = mid+1;
          }
        }
        if(list[left-1]==targetId){
          let index = _.findIndex(this.annotationList[j].originNodeList,(item)=>{
            return item==targetId
          });
          let t =  this.annotationList[j].originNodeList.slice()
          t.splice(index,1,data[i].newNodes[0],data[i].newNodes[1]);

          this.annotationList[j].headNodeId = t[0];
          this.annotationList[j].endNodeId = t[t.length-1];
          this.annotationList[j].originNodeList = t;
          this.annotationList[j].sortedNodeList =  this.annotationList[j].originNodeList.slice().sort((x:any,y:any)=>x-y)

        }

      }
    }


    if(data.length==1){
      //切割的句子是同一句子的情况
    }else{
      //切割句子为不同句子的时候

      let startNodeId = data[0].newNodes[1];
      let endNodeId = data[1].newNodes[0];
      let startNode = map.get(startNodeId) as ListNode;
      let endNode = map.get(endNodeId) as ListNode;
      let head:ListNode|null = startNode;
      let stack:number[] = [];

      //计算所有的原有节点，选出最大的基础高度

      let maxBasicHeight = 0;
      let leftOriginNode = map.get(data[0].deleted) as ListNode|null;
      let rightOriginNode = map.get(data[1].deleted) as ListNode;

      while(leftOriginNode){
        if(leftOriginNode.val!.annotationObject==undefined){
          maxBasicHeight = Math.max(0,maxBasicHeight)
        }else{
          maxBasicHeight = Math.max(
            (leftOriginNode.val!.annotationObject.annotationIds.length)*BASIC_ANNOTATION_PADDING+ leftOriginNode.val!.annotationObject.BasicHeight - Math.max(0,leftOriginNode.val!.annotationObject.annotationIds.length-1)*1.5,
            maxBasicHeight
          )

        }

        if(leftOriginNode.id==rightOriginNode.id){
          break
        }

        leftOriginNode = leftOriginNode.next;
      }



///////////////////////////////////////////////////////////
      while(head){
        stack.push(head.id);
        //如果map之前存有listnode，那么更新listnode
        if(this.map.has(head.id)){
          head.val!.annotationObject!.insertLabel(this.count)

          head.val!.annotationObject!.BasicHeight = maxBasicHeight;

        }else{
          let annotationObject = new AnnotationObject(head.id,this.count);


          annotationObject.BasicHeight = maxBasicHeight;

          head.val!.annotationObject = annotationObject;

          this.map.set(head.id,head)
        }


        if(head.id==endNode.id){
          break
        }
        head = head.next
      }
      let obj = {
        headNodeId:startNode?.id,
        endNodeId:endNode.id,
        originNodeList:stack.slice(),
        sortedNodeList:stack.sort((x,y)=>x-y) ,
        clientId:this.count,
        updated:true
      }
      this.annotationList.push(obj)
      this.count++
     //创建了新的annotationObject
     //寻找旧的annotationObject并改变其包含的annotationId值,删除需要被替换的listnode

    //  if(this.map.has())

      data.forEach(item=>{

        if(this.map.has(item.deleted)){
          this.count
          // let node = this.map.get(item.deleted);
          //删除旧节点，判断新增节点需要继承的信息
          let oldNode:ListNode = this.map.get(item.deleted)

          for(const nodeid of item.newNodes){

            if(this.map.has(nodeid)){
              //map中存储的节点肯定会有annotationObject
              let tar:ListNode = this.map.get(nodeid) ;
              tar.val!.annotationObject!.addLabel(oldNode.val!.annotationObject!.annotationIds);
              tar.val!.annotationObject!.levelMap = Object.assign({},oldNode.val!.annotationObject!.levelMap);
              tar.val!.annotationObject!.LabelName = oldNode.val!.annotationObject!.LabelName
            }else{
              let node = map.get(nodeid);
              let annotationObject = new AnnotationObject(nodeid);
              annotationObject.addLabel(oldNode.val!.annotationObject!.annotationIds)
              annotationObject.levelMap = Object.assign({},oldNode.val!.annotationObject!.levelMap);
              annotationObject!.LabelName = oldNode.val!.annotationObject!.LabelName


              this.map.set(nodeid,node)
              node!.val!.annotationObject = annotationObject;
            }

          }
          this.map.delete(item.deleted);
        }
      });


    }
  }

  initAnnotationObjectLevelMap(){

    //在这里找到需要进行计算的listnode并更新其annotationObject
    let set:any = new Set();

    for(const item of this.annotationList){
      if(item.updated){
        //这是新增的标签，寻找其head节点，查看其head到结尾节点中 ，是否有节点有多个annotationId的，如有的话，需要将其一并重新计算
        // let head = this.map.get(item.headNodeId);
        // while(head){
        //   head.value.annotationObject.annotationIds.forEach((id:any) => {
        //     set.add(id)
        //   });

        //   if(head.id == item.endNodeId){
        //     break;
        //   }
        //   head = head.next;
        // }
        set.add(item.clientId)

        item.updated = false
      }
    }
    set = Array.from(set) as Array<any>;

    let nodes:number[] = [];
    set.forEach((item:any)=>{

      let list = _.find(this.annotationList,(child)=>{
        return child.clientId == item
      });

      nodes = nodes.concat(list.originNodeList)
    })
    nodes = Array.from(new Set(nodes));

    //nodes是最终需要检测的所有listnodes的id集合
    set.sort();

    set.forEach((annotationId:any) => {
      nodes.forEach((nodeid)=>{
        let node = this.map.get(nodeid) as ListNode;

        node.val!.annotationObject!.initLevelMap(annotationId)
      })
    });


    console.log(this.map)


  }

  getCreated(){
    let list:number[] = []
    this.annotationList.forEach(item=>{
      if(item.updated){
        list.push(item.clientId)
      }
    });
    return list;
  }

  getAnnotationById(annotationId:number){
    let data = _.find(this.annotationList,{clientId:annotationId})
    return data
  }

  get exported(){
    return this.annotationList
  }


}
