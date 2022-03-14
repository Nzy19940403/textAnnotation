import { ListNode } from './list';

import { CanvasController } from './canvasController';
import { Listener, Master } from './master';
import { CanvasModel, NodesMapUpdateData } from './canvasModel';
import { fromEvent, take } from 'rxjs';
import { findBottomChild, findpseudoElementWrapper, findTopParent } from './utils';

interface CanvasViewInterface {


  html(): HTMLDivElement
}

export class CanvasView implements CanvasViewInterface, Listener {
  private canvas: HTMLDivElement


  private controller: CanvasController

  constructor(canvasModel: CanvasModel & Master, canvasController: CanvasController) {
    this.canvas = document.createElement('div');
    this.canvas.setAttribute('id', 'canvas');
    this.controller = canvasController;


    this.setupEventHandlers()
    canvasModel.subscribe(this);

  }
  html() {
    return this.canvas
  }

  setupEventHandlers() {
    fromEvent(this.canvas, 'selectstart')
      .subscribe(
        res => {
          console.log(123);
          fromEvent(document, 'mouseup')
            .pipe(
              take(1)
            )
            .subscribe(
              res => {
                console.log('up');
                this.checkSelection();

              }
            )
        }
      );


  }
  checkSelection() {
    let selection = window.getSelection();
    let range = selection?.getRangeAt(0);
    if (!selection || selection?.type == 'Caret') return;



    let leftNodeId = Number(findTopParent(selection!.anchorNode!.parentElement,'sentence')!.getAttribute('data-id'))
    let leftNodeOffset = selection.anchorOffset
    let rightNodeId = Number(findTopParent(selection!.focusNode!.parentElement,'sentence')!.getAttribute('data-id'))
    let rightNodeOffset = selection.focusOffset


    let data = {
      leftNodeId: leftNodeId,
      leftNodeOffset: leftNodeOffset,
      rightNodeId: rightNodeId,
      rightNodeOffset: rightNodeOffset
    }

    data = this.controller.getFormedSelectionInfo(data)

    this.controller.updateNodesMap(data);

    this.updateAnnotation();
  }
  updateAnnotation() {
    let created = this.controller.exported;
    // this.controller.updateAnnotation()
    const event: CustomEvent = new CustomEvent('annotation.updated', {
      bubbles: false,
      cancelable: true,
      detail: {
        annotations:created
      },
    });

    this.canvas.dispatchEvent(event);
  }
  notify(model: CanvasModel & Master, reason: string, data?: any) {

    if (reason == 'ADD_VIEW') {
      model.renderData.forEach((item) => {

        let span = document.createElement('span');
        span.classList.add(`sentence`);
        span.classList.add(`sentence-${item.index}`);
        span.setAttribute('data-id', `${item.index}`);


      //   span.appendChild(inner)
        span.innerText = item.value;

        this.canvas.appendChild(span);
      })
    } else if (reason == 'UPDATE_NODES') {
      //这一步完成渲染标注之前的预处理，将调整节点的结构
      if (data.updateNodesInfo.length == 1) {
        //切割一句的情况


        for(const item of data.updateNodesInfo){
          let curDomNode = document.getElementsByClassName(`sentence-${item.deleted}`)[0];
          item.newNodes.forEach((element:any) => {

            // let start = element


            if(element.value.annotationObject!==undefined){
              let annotationObject = element.value.annotationObject;

              let span = document.createElement('span');
              span.classList.add(`sentence`);
              // span.classList.add(`taged`);
              span.classList.add(`sentence-${element.id}`);
              span.setAttribute('data-id',`${element.id}`);
              let level = annotationObject.annotationIds.length;
              let cur = span;
              let curLevel = 0;

              while(level>1){
                let annotationId = annotationObject.annotationIds[curLevel];
                let inner = document.createElement('span');
                inner.classList.add('inner');
                inner.setAttribute('data-annotationId',annotationId);
                cur.appendChild(inner);
                cur = inner;
                level--;
                curLevel++
              }
              let annotationId = annotationObject.annotationIds[curLevel];
              let inner = document.createElement('span');
              inner.classList.add('inner');
              inner.setAttribute('data-annotationId',annotationId);
              inner.innerHTML = element.value.data
              cur.appendChild(inner);

              // if(annotationObject.annotationIds.length==1){
              this.canvas.insertBefore(span,curDomNode)
              // }


            }else{
              let span = document.createElement('span');
              span.classList.add(`sentence`);
              span.classList.add(`sentence-${element.id}`);
              span.setAttribute('data-id',`${element.id}`)
              span.innerHTML = element.value.data

              this.canvas.insertBefore(span,curDomNode)

            }

          });
          curDomNode.remove();
        }

      } else {
        //切割多句的情况

        for(const item of data.updateNodesInfo){
          let curDomNode = document.getElementsByClassName(`sentence-${item.deleted}`)[0];


          item.newNodes.forEach((element:any) => {

            let start = element


            if(element.value.annotationObject!==undefined){
              let annotationObject = element.value.annotationObject;

              let span = document.createElement('span');
              span.classList.add(`sentence`);
              // span.classList.add(`taged`);
              span.classList.add(`sentence-${element.id}`);
              span.setAttribute('data-id',`${element.id}`);
              let level = annotationObject.annotationIds.length;
              let cur = span;
              let curLevel = 0;

              while(level>1){
                let annotationId = annotationObject.annotationIds[curLevel];
                let inner = document.createElement('span');
                inner.classList.add('inner');
                inner.setAttribute('data-annotationId',annotationId);
                cur.appendChild(inner);
                cur = inner;
                level--;
                curLevel++
              }
              let annotationId = annotationObject.annotationIds[curLevel];
              let inner = document.createElement('span');
              inner.classList.add('inner');
              inner.setAttribute('data-annotationId',annotationId);
              inner.innerHTML = element.value.data
              cur.appendChild(inner);

              // if(annotationObject.annotationIds.length==1){
              this.canvas.insertBefore(span,curDomNode)
              // }


            }else{
              let span = document.createElement('span');
              span.classList.add(`sentence`);
              span.classList.add(`sentence-${element.id}`);
              span.setAttribute('data-id',`${element.id}`)
              span.innerHTML = element.value.data

              this.canvas.insertBefore(span,curDomNode)

            }

          });
          curDomNode.remove()

        };

        //上面处理完两头节点的情况，现在更新中间节点

        let [createdId] = data.created;
        let createdAnnotation = this.controller.collection.getAnnotationById(createdId);
        let nodelist = createdAnnotation.originNodeList.slice();
        nodelist.pop();
        nodelist.shift();
        for(const nodeid of nodelist){
          let node = this.controller.map.get(nodeid);
          let curDomNode = document.getElementsByClassName(`sentence-${nodeid}`)[0];

          let annotationObject = node.value.annotationObject;

          let span = document.createElement('span');
          span.classList.add(`sentence`);
          // span.classList.add(`taged`);
          span.classList.add(`sentence-${node.id}`);
          span.setAttribute('data-id',`${node.id}`);
          let level = annotationObject.annotationIds.length;
          let cur = span;
          let curLevel = 0;

          while(level>1){
            let annotationId = annotationObject.annotationIds[curLevel];
            let inner = document.createElement('span');
            inner.classList.add('inner');
            inner.setAttribute('data-annotationId',annotationId);
            cur.appendChild(inner);
            cur = inner;
            level--;
            curLevel++
          }
          let annotationId = annotationObject.annotationIds[curLevel];
          let inner = document.createElement('span');
          inner.classList.add('inner');
          inner.setAttribute('data-annotationId',annotationId);
          inner.innerHTML = node.value.data
          cur.appendChild(inner);

          // span.appendChild(inner);
          // if(annotationObject.annotationIds.length==1){
          this.canvas.insertBefore(span,curDomNode)

          curDomNode.remove()
        }


      }
      document.getSelection()?.empty()
    }else if(reason=='RENDER_ANNOTATION'){
      //这一步完成对标注的渲染
      let exported = this.controller.exported;

      for(const annotation of exported){
        let startNode = this.controller.map.get(annotation.headNodeId);
        let endNode = this.controller.map.get(annotation.endNodeId);

        while(startNode){
          let dom = document.getElementsByClassName(`sentence-${startNode.id}`)[0] as HTMLElement;
          if(dom.classList.contains('taged')){

          }else{
            dom.classList.add('taged')
          }

          if(startNode.id==annotation.headNodeId){
            let t = findBottomChild(dom,'data-annotationId',annotation.clientId) as HTMLElement;
            if(t){
              if(t.classList.contains('head')){

              }else{
                t.classList.add('head')
              }
            }


          }
          if(startNode.id==annotation.endNodeId){

            let t = findBottomChild(dom,'data-annotationId',annotation.clientId) as HTMLElement

            if(t){
              if(t.classList.contains('end')){

              }else{
                t.classList.add('end');
                let after = document.createElement('span');
                after.classList.add('labelwrapper');
                t.appendChild(after)

                if((startNode as ListNode).val!.annotationObject!.LabelName){

                  let labelwrapper = findpseudoElementWrapper(t as Element);
                  // (labelwrapper as HTMLElement).style.color = 'blue';
                  (labelwrapper as HTMLElement).setAttribute('data-labelName',(startNode as ListNode).val!.annotationObject!.LabelName as string)
                }


              }

            }



          }
          let keys = Object.keys(startNode.value.annotationObject.levelMap)
          for(const level of keys){
            let t = findBottomChild(dom,'data-annotationId',level) as HTMLElement

            // let t =  dom.childNodes[0] as HTMLElement
            t.style.paddingTop = startNode.value.annotationObject.levelMap[level]+'px'
            t.style.paddingBottom = startNode.value.annotationObject.levelMap[level]+'px'
            // t.style.lineHeight = 30+'px'
          }


          if(startNode.id==endNode.id){
            break
          }

          startNode = startNode.next
        }
      }
    }else if(reason=='RENDER_ANNOTATION_LABEL'){

      let dom = document.getElementsByClassName(`sentence-${data.nodeId}`)[0];
      let span = findBottomChild(dom,'data-annotationid',data.annotationId);
      let node = this.controller.map.get(data.nodeId) as ListNode
      // span?.setAttribute('data-labelName',node.val!.annotationObject!.LabelName as string);

      let labelwrapper = findpseudoElementWrapper(span as Element);
      // (labelwrapper as HTMLElement).style.color = 'blue';

      if(node.val!.annotationObject!.LabelName){

        (labelwrapper as HTMLElement).setAttribute('data-labelName',node.val!.annotationObject!.LabelName as string);
      }else{
        (labelwrapper as HTMLElement).removeAttribute('data-labelName')
      }



    }
  }
}
