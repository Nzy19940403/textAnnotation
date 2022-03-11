import { AnnotationObject } from './annotation-objects';
import { AnnotationCollection } from './annotation-collection';
import { NodesMapUpdateData } from './canvasModel';
export class MapOfList{
  private map = new Map();
  private list:List
  private collection:AnnotationCollection
  constructor(strs:string[],collection:AnnotationCollection){
    this.list = new List(strs,this.map);
    this.collection = collection;
  }

  getMap(){
    return this.map
  }

  updateNodesMap(data:NodesMapUpdateData):any[] {


    let updatedNodesInfo = this.list.updateNodesMap(data);

    //updatedNodesInfo包含了旧的节点和要替换该旧节点的新节点，所以要检查更新collection集合中已有的旧节点，并更新信息
    console.log(updatedNodesInfo)
    this.collection.updateAnnotation(updatedNodesInfo,this.map);

    updatedNodesInfo.forEach(item=>{
      this.map.delete(item.deleted)
    })

    let res:any[] = [];
    updatedNodesInfo.forEach(item=>{
      let obj:{deleted:number,newNodes:any[]} = {
        deleted:item.deleted,
        newNodes:[]
      }

      for(const nodeid of item.newNodes){
        let node = this.map.get(nodeid);
        obj.newNodes.push(node);
      }
      res.push(obj)
    })

    return res
  }

  getFormedData(){
    return this.list.getFormedData()
  }


}


export class List{

  private count:number = 0;
  private node:ListNode|null = null;
  private map:Map<number,ListNode>;
  private formedData:Array<any> = [];
  constructor(strs:string[],map:Map<number,ListNode>){
    this.map = map;
    this.node = this.initListNode(strs,map)
  }

  initListNode(strs:string[],map:Map<number,ListNode>){
    let dummy = new ListNode();
    let len = strs.length;
    let temp = dummy;
    for(let i = 0;i<len;i++){
      let node = new ListNode({
        data:strs[i]
      },this.count);
      temp.next = node;

      let obj = {
        index:this.count,
        value:strs[i]
      }
      this.formedData.push(obj)

      if(this.count>0){
        node.prev = temp
      }
      temp = temp.next;
      map.set(this.count,temp);
      this.count++;
    }
    temp.next = null;
    this.map = map;

    return dummy.next
  }

  updateNodesMap(data:NodesMapUpdateData):any[]{
     
    if(data.leftNodeId==data.rightNodeId){
      let leftNode = this.map.get(data.leftNodeId) as ListNode;
      let newLeftNodeId1 = this.count++;
      let newLeftNodeId2 = this.count++;
      let newLeftNodeId3 = this.count++;

      let newLeftNode1 = new ListNode({
        data:leftNode.val!.data.slice(0,data.leftNodeOffset)
      },newLeftNodeId1);

      let newLeftNode2 = new ListNode({
        data:leftNode.val!.data.slice(data.leftNodeOffset,data.rightNodeOffset)
      },newLeftNodeId2);

      let newLeftNode3 = new ListNode({
        data:leftNode.val!.data.slice(data.rightNodeOffset)
      },newLeftNodeId3);

      let leftNodePrev = leftNode.prev;
      let leftNodeNext = leftNode.next;

      if(leftNodePrev){
        //原节点有前置节点
        leftNodePrev.next = newLeftNode1;
        newLeftNode1.prev = leftNodePrev

        newLeftNode1.next = newLeftNode2;
        newLeftNode2.prev = newLeftNode1;

        newLeftNode2.next = newLeftNode3;
        newLeftNode3.prev = newLeftNode2;

        if(leftNodeNext){
          newLeftNode3.next = leftNodeNext;
          leftNodeNext.prev = newLeftNode3
        }else{
          newLeftNode3.next = null;
        }

      }else{
        //原节点没有前置节点

        newLeftNode1.prev = null;

        newLeftNode1.next = newLeftNode2;
        newLeftNode2.prev = newLeftNode1;

        newLeftNode2.next = newLeftNode3;
        newLeftNode3.prev = newLeftNode2;

        if(leftNodeNext){
          newLeftNode3.next = leftNodeNext;
          leftNodeNext.prev = newLeftNode3
        }else{
          newLeftNode3.next = null;
        }

      }


      this.map.set(newLeftNodeId1,newLeftNode1);
      this.map.set(newLeftNodeId2,newLeftNode2);
      this.map.set(newLeftNodeId3,newLeftNode3);

      return [
        {
          deleted:data.leftNodeId,
          newNodes:[newLeftNodeId1,newLeftNodeId2,newLeftNodeId3]
        }
      ]
    }else{
      let leftNode = this.map.get(data.leftNodeId) as ListNode;
      let rightNode = this.map.get(data.rightNodeId) as ListNode;

      let newLeftNodeId1 = this.count++;
      let newLeftNodeId2 = this.count++;

      let newRightNodeId1 = this.count++;
      let newRightNodeId2 = this.count++

      let leftNodePrev = leftNode.prev;
      let leftNodeNext = leftNode.next;

      let newLeftNode1 = new ListNode({
        data:leftNode.val!.data.slice(0,data.leftNodeOffset)
      },newLeftNodeId1);
      let newLeftNode2 = new ListNode({
        data:leftNode.val!.data.slice(data.leftNodeOffset)
      },newLeftNodeId2);

      //先处理左边节点的情况
      if(leftNodePrev){
        //如果左边的前一个结点不是null

        leftNodePrev.next = newLeftNode1;
        newLeftNode1.prev = leftNodePrev

        newLeftNode1.next = newLeftNode2;
        newLeftNode2.prev = newLeftNode1;

        if(leftNodeNext){
          newLeftNode2.next = leftNodeNext;
          leftNodeNext.prev = newLeftNode2
        }else{
          newLeftNode2.next = null;
        }

      }else{

        newLeftNode1.prev = null;

        newLeftNode1.next = newLeftNode2;
        newLeftNode2.prev = newLeftNode1;

        if(leftNodeNext){
          newLeftNode2.next = leftNodeNext;
          leftNodeNext.prev = newLeftNode2
        }else{
          newLeftNode2.next = null;
        }
      }

      //再处理右边节点的情况 ，这时候右边节点的前节点有可能已经被换成新的节点了
      let rightNodePrev = rightNode.prev;
      let rightNodeNext = rightNode.next;

      let newRightNode1 = new ListNode({
        data:rightNode.val!.data.slice(0,data.rightNodeOffset)
      },newRightNodeId1);
      let newRightNode2 = new ListNode({
        data:rightNode.val!.data.slice(data.rightNodeOffset)
      },newRightNodeId2);


      if(rightNodePrev){

        rightNodePrev.next = newRightNode1;
        newRightNode1.prev = rightNodePrev;
        newRightNode1.next = newRightNode2;
        newRightNode2.prev = newRightNode1;

        if(rightNodeNext){
          newRightNode2.next = rightNodeNext;
          rightNodeNext.prev = newRightNode2;

        }else{
          newRightNode2.next = null
        }

      }else{

        newRightNode1.prev = null;

        newRightNode1.next = newRightNode2;
        newRightNode2.prev = newRightNode1;

        if(rightNodeNext){
          newRightNode2.next = rightNodeNext;
          rightNodeNext.prev = newRightNode2;

        }else{
          newRightNode2.next = null
        }
      }

      this.map.set(newLeftNodeId1,newLeftNode1);
      this.map.set(newLeftNodeId2,newLeftNode2);
      this.map.set(newRightNodeId1,newRightNode1);
      this.map.set(newRightNodeId2,newRightNode2);

      return [{
        deleted:data.leftNodeId,
        newNodes:[newLeftNodeId1,newLeftNodeId2]
      },{
        deleted:data.rightNodeId,
        newNodes:[newRightNodeId1,newRightNodeId2]
      }];

    }

  }

  getFormedData():any{

    return this.formedData;
  }
}


export class ListNode {
  private value:{data:any,annotationObject?:AnnotationObject|undefined}|null = null;
  private nextNode:ListNode|null = null;
  private prevNode:ListNode|null = null;
  private nodeID:number|undefined

  constructor(data?:any,id?:number){
    if(data){
      this.value = data;
      this.nodeID = id;
    }
  }

  get id(){
    return this.nodeID as number;
  }
  get val(){
    return this.value
  }
  get next(){
    return this.nextNode
  }
  set next(node:ListNode|null){
    this.nextNode = node;
  }

  get prev(){
    return this.prevNode
  }
  set prev(node:ListNode|null){
    this.prevNode = node;
  }

}
