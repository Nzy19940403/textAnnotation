export interface Master{
  subscribe(listener:Listener):void;
  unsubscribe(listener:Listener):void;
  unsubscribeAll():void;
  notify(reason:string,data?:any):void;
}

export interface Listener{
  notify(master:Master,reason:string,data?:any):void;
}

export class MasterImpl implements Master{
  private listeners:Listener[];

  constructor(){
    this.listeners = [];
  }

  public subscribe(listener:Listener){
    this.listeners.push(listener);

  }
  public unsubscribe(listener: Listener){
    for(let i = 0 ; i < this.listeners.length ; i++){
      if(this.listeners[i] === listener){

      }
    }
  }
  public unsubscribeAll(){
    this.listeners = [];
  }

  public notify(reason:string,data?:any):void{

    for(const  listener of this.listeners){

      listener.notify(this,reason,data)
    }
  }
}

