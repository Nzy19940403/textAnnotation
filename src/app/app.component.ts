import { Canvas } from './../assets/canvas';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'textAnnotation';
  @ViewChild('wrapper',{static:true}) wrapper!:ElementRef
  annotations:any[] = []
  constructor(
    private renderer:Renderer2
  ){
   
  }
  ngOnInit(): void {
    let canvas = new Canvas();
    let dom = canvas.html()

    this.renderer.appendChild(this.wrapper.nativeElement,dom)

    canvas.setup();

    fromEvent<any>(dom,'annotation.updated')
    .subscribe(
      res=>{
        console.log(res)

        this.annotations = [...res.detail.annotations];

        canvas.renderAnnotation();


      }
    )

  }
}





