import * as _ from 'lodash';
import { BASIC_ANNOTATION_PADDING } from './const';

export class AnnotationObject{
  domId:number
  labelIds:number[] = [];
  updated:boolean = false

  levelMap:any = {};

  private basicHeight:number = 0;

  constructor(domId:number,labelId?:number){
    this.domId = domId;
    if(labelId!==undefined){
      this.labelIds.push(labelId);;

    }

  }

  addLabel(ids:number[]){
    this.labelIds = this.labelIds.concat(ids);
    this.basicHeight = Math.max(this.basicHeight,(this.labelIds.length-1)*BASIC_ANNOTATION_PADDING)
  }
  insertLabel(id:number){
    this.labelIds.unshift(id);

    this.basicHeight = Math.max(this.basicHeight,(this.labelIds.length-1)*BASIC_ANNOTATION_PADDING)
  }



  initLevelMap(labelId:number){
    console.log(labelId,this)
    if(this.labelIds.indexOf(labelId)>-1){

      let height =   BASIC_ANNOTATION_PADDING + this.basicHeight;

      if(labelId==0){
        this.levelMap[labelId] = height
      }else{
        let index = _.findIndex(this.labelIds,(value)=>{
          return value == labelId
        });
        let len = this.labelIds.length;

        if(len-index==1){
          this.levelMap[labelId] = height
        }else{
          let sum = 0;
          //计算之前每一层的padding，新的一层需要减去他们的和
          for(let i = index+1;i<len;i++){
            sum+=this.levelMap[this.labelIds[i]];
          }

          // this.levelMap[labelId] = height - sum - 1.5*(len-1-index)
          this.levelMap[labelId] =  this.BasicHeight - sum + BASIC_ANNOTATION_PADDING - 1.5*(len-1-index)

        }

      }



    }


  }

  set BasicHeight(value:number){
    this.basicHeight = value
  }

  get BasicHeight(){
    return this.basicHeight
  }

}
