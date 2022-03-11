export function findTopParent(dom:HTMLElement|null,clasName:string):HTMLElement|null{

  if(!dom|| dom==document.body){
    return null
  }

  if(dom.classList.contains(clasName)){
    return dom
  }else{
    return findTopParent(dom.parentElement,clasName)
  }

}

export function findBottomChild(dom:Element|null ,attrKey?:string,attrValue?:any):Element|null{

  if(!dom){
    return null
  }

  if(attrKey){
    if(dom.getAttribute(attrKey)==attrValue){
      return dom
    }
  }


  if(!attrKey){
    if(dom.children.length>0){
      return findBottomChild(dom.children[0]);
    }else{
      return dom
    }
  }else{

    if(dom.children.length>0){
      return findBottomChild(dom.children[0],attrKey,attrValue);
    }else{
      return null
    }
  }

}

export function findpseudoElementWrapper(dom:Element){
  if(dom.children.length>0){
    let length = dom.children.length;
    for(let i = 0;i<length;i++){
      if(dom.children[i].classList.contains('labelwrapper')){
        return dom.children[i]
      }
    }
    return null
  }else{
    return null
  }
}
