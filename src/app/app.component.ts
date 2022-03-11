import { Canvas } from './../assets/canvas';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
// import { Tree } from 'src/assets/tree';
// import { TreeNode } from './../assets/tree';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'textAnnotation';
  @ViewChild('wrapper',{static:true}) wrapper!:ElementRef
  annotations:any[] = [];
  canvas:Canvas
  constructor(
    private renderer:Renderer2
  ){
    this.canvas = new Canvas();


  }
  ngOnInit(): void {

    let dom = this.canvas.html()

    this.renderer.appendChild(this.wrapper.nativeElement,dom)

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

  makeLabel(labelDom:any,annotation:any){
    let value = labelDom.value;
    this.canvas.renderAnnotationLabel(annotation,value)

  }
}





