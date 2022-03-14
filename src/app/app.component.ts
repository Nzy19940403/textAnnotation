import { Canvas } from './../assets/canvas';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
// import { Tree } from 'src/assets/tree';
import { TreeNode, List, ListNode } from './../assets/tree';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'textAnnotation';
  @ViewChild('editor',{static:true}) editorwrapper!:ElementRef
  annotations:any[] = [];
  canvas:Canvas

  labels:any[] = [
    {name: '标签1', color: 'primary'},
    {name: '标签2', color: 'accent'},
    {name: '标签3', color: 'warn'},
  ]
  constructor(
    private renderer:Renderer2
  ){
    this.canvas = new Canvas();

    this.canvas.setupLabels(this.labels)
  }

  trackFunc = (index:number,item:any)=>{

    return item.clientId
  }

  joinSpan = (data:any[])=>{
    let str = this.canvas.joinSpan(data)
    return str

  }
  ngOnInit(): void {

    let dom = this.canvas.html()

    this.renderer.appendChild(this.editorwrapper.nativeElement,dom)

    this.canvas.setup();

    fromEvent<any>(dom,'annotation.updated')
    .subscribe(
      res=>{
        console.log(res)

        this.annotations = [...res.detail.annotations];

        this.canvas.renderAnnotation();


      }
    )

  }

  makeLabel(label:any,annotation:any){

    this.canvas.setRememberLabel(label)
    this.canvas.renderCertainAnnotationLabel(annotation,label)

  }
  doConnect(data:any){

    let headDom = document.getElementsByClassName(`sentence-${data.headNodeId}`)[0];
    let headRect = headDom.getBoundingClientRect();


    debugger
  }
  changeRememberLabel(data:any){

    this.canvas.setRememberLabel(data.name)
  }
}





