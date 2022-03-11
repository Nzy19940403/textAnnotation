

interface TreeRender{
  depth:number,
  firstNodes:TreeNode|null,
  prevNodeList:(TreeNode|null)[],
  waitingList:(TreeNode|null)[]
}
class TreeRender{

  constructor(nodes:(number|null)[] , wrapper?:HTMLElement){

    Object.defineProperties(this,{
      depth:{
        value:0,
        writable:true,
        enumerable:false
      },
      firstNodes:{
        value:null,
        writable:true
      },
      prevNodeList:{
        value:[],
        writable:true
      },
      waitingList:{
        value:[],
        writable:true
      }
    })

    this.makeTreeNode(nodes);

    this.connectTreeNode();

    if(wrapper){
      this.initTreeDom(wrapper)
    }

  }
  private makeTreeNode(nodes:(number|null)[]){
    this.waitingList = nodes.map(item=>{

      return typeof item ==='number'?new TreeNode(item):null
    })

  }
  private connectTreeNode(){

    let validLen = 0;
    if(this.depth==0){
      validLen = 1
    }else{
      let nums = 0
      this.prevNodeList.forEach(item=>{
        if(item){
          nums++
        }
      });
      validLen = 2*nums;
    }


    let list = this.waitingList.splice(0,validLen)

    if(this.prevNodeList.length){
      let currentIndex = 0
      this.prevNodeList.forEach((item)=>{
        if(!item) return
        let targetIndex = 2*currentIndex
        item.left = list[targetIndex]?list[targetIndex]:null;
        item.right = list[targetIndex+1]?list[targetIndex+1]:null;
        currentIndex++
      })
    }

    if(this.depth == 0){
      [this.firstNodes] = list
    }

    this.prevNodeList = list;
    this.depth+=1;

    if(this.waitingList.length){
      this.connectTreeNode()
    }
  }

  private initTreeDom(wrapper:HTMLElement){
    let res:any[] = [];
    const getNodeWidth = (root:TreeNode|null , depth:number):any=>{
      if(!root) return 50;

      let itemWidth = getNodeWidth(root.left , depth+1) + getNodeWidth(root.right,depth+1);

      let obj = {
        depth:depth,
        width:itemWidth,
        node:root
      }
      res.push(obj);
      return itemWidth;
    }
    getNodeWidth(this.firstNodes,0);

    const draw = (list:any[])=>{
      let nodelist:any[] = [];
      while(list.length){
        let item = list.pop();
        if(!nodelist[item.depth]){
          nodelist[item.depth] = []
        }
        nodelist[item.depth].push(item);
      }

      return nodelist;
    }
    let list = draw(res.reverse());

    list.forEach(item=>{
      let dom = document.createElement('div');

      item.forEach((element:any) => {
        let node = document.createElement('div');
        node.innerHTML = element.node.val;
        node.style.display = 'inline-block';
        node.style.width = element.width+'px';
        node.style.textAlign = 'center';
        node.style.lineHeight = '40px';
        dom.appendChild(node)
      });

      wrapper.appendChild(dom);

    })

  }
}

export class Tree extends TreeRender{
  constructor(nodes:(number|null)[] ,wrapper?:HTMLElement){
    super(nodes)
  }

  get root(){
    return this.firstNodes
  }
}

export class TreeNode{
  val:number ;
  left:TreeNode|null = null;
  right:TreeNode|null = null;

  constructor(value:any){
    this.val = value
  }
}




export class List {
  head:ListNode|null
  constructor(nums:number[]){
    let dummy = new ListNode();
    let head = dummy;
    nums.forEach(item=>{
      let node = new ListNode(item);
      dummy.next = node;
      dummy = dummy.next;
    })
    this.head = head.next

  }


}

export class ListNode{
  val:number
  next:ListNode|null = null;
  constructor(value?:any){
    this.val = value
  }
}
