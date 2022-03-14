import * as _ from 'lodash';
import { BASIC_ANNOTATION_BORDER_WIDTH, BASIC_ANNOTATION_PADDING } from './const';

export class AnnotationObject{
  domId:number
  annotationIds:number[] = [];
  updated:boolean = false

  levelMap:any = {};

  private labelName:string|null=null
  private basicHeight:number = 0;

  constructor(domId:number,annotationId?:number){
    this.domId = domId;
    if(annotationId!==undefined){
      this.annotationIds.push(annotationId);;

    }

  }

  addLabel(ids:number[]){
    this.annotationIds = this.annotationIds.concat(ids);
    this.basicHeight = Math.max(this.basicHeight,(this.annotationIds.length-1)*BASIC_ANNOTATION_PADDING)
  }
  insertLabel(id:number){
    this.annotationIds.unshift(id);

    this.basicHeight = Math.max(this.basicHeight,(this.annotationIds.length-1)*BASIC_ANNOTATION_PADDING)
  }



  initLevelMap(annotationId:number){
    console.log(annotationId,this)
    if(this.annotationIds.indexOf(annotationId)>-1){

      let height =   BASIC_ANNOTATION_PADDING + this.basicHeight;

      if(this.annotationIds.length==1){
        this.levelMap[annotationId] = height
      }else{
        let index = _.findIndex(this.annotationIds,(value)=>{
          return value == annotationId
        });
        let len = this.annotationIds.length;

        if(len-index==1){
          this.levelMap[annotationId] = height
        }else{
          let sum = 0;
          //计算之前每一层的padding，新的一层需要减去他们的和
          for(let i = index+1;i<len;i++){
            sum+=this.levelMap[this.annotationIds[i]];
          }

          // this.levelMap[annotationId] = height - sum - 1.5*(len-1-index)
          //basicheight减去之前sum完成的高度，然后加上本次的高度再减去这些线的宽度
          this.levelMap[annotationId] =  this.BasicHeight - sum + BASIC_ANNOTATION_PADDING - BASIC_ANNOTATION_BORDER_WIDTH * (len-1-index)

        }

      }



    }


  }


  set LabelName(value){
    this.labelName = value
  }
  get LabelName(){
    return this.labelName
  }

  set BasicHeight(value:number){
    this.basicHeight = value
  }

  get BasicHeight(){
    return this.basicHeight
  }

}
