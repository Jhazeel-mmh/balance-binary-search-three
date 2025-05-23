class Node{
    constructor(data){
        this.data = data;
        this.left = null;
        this.right = null;
    }
};

class Tree{
    constructor(array){
        this.root = this.buildTree(array);
    }

    buildTree(array){
        const newArray = [];
        array.forEach(element => {
            if (!newArray.includes(element)){
                newArray.push(element);
            }
        });

        newArray.sort((a, b) => a - b);

        let len = newArray.length;

        let rootIndex = Math.floor((len - 1) / 2);
        let root = new Node(newArray[rootIndex]);
        let q = [
            {
                node: root, 
                range: [0, len - 1]
            }
        ]
        let frontIndex = 0;
        while (frontIndex < q.length){
            let curr = q[frontIndex];
            let frontNode = curr.node;
            let [s, e] = curr.range;
            let midIndex = s + Math.floor((e - s) / 2);

            if (s < midIndex){
                let midLeftIndex = s + Math.floor((midIndex - 1 - s) / 2);
                let leftMidNode = new Node(newArray[midLeftIndex]);
                frontNode.left = leftMidNode;

                q.push(
                    {
                        node: leftMidNode,
                        range: [s, midIndex - 1]
                    }
                )
            }

            if (e > midIndex){
                let midRightIndex = midIndex + 1 + Math.floor((e - midIndex - 1) / 2);
                let rightMidNode = new Node(newArray[midRightIndex]);
                frontNode.right = rightMidNode;

                q.push(
                    {
                        node: rightMidNode,
                        range: [midIndex + 1, e]
                    }
                )
            }

            frontIndex++;
        }
        return root;
    };

    prettyPrint(){
        this.__prettyPrint(this.root)
    }

    __prettyPrint(node, prefix = "", isLeft = true){
        if (node === null) {
          return;
        }
        if (node.right !== null) {
          this.__prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
        if (node.left !== null) {
          this.__prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
      };
    
    insert(value){
        this.root = this.__insertRecur(value, this.root);
      }

    __insertRecur(value, node){

        if (node === null){
            return new Node(value);
        }

        if (node.data === value){
            return node;
        }
        
        if (value < node.data){
            node.left = this.__insertRecur(value, node.left);
        }

        if (value > node.data){
            node.right = this.__insertRecur(value, node.right);
        }

        return node;
      }

    /*__insertRecur(value, node){
        let right = false, left = false;

        if (value <= node.data){
            left = !left;
        }

        if (value > node.data){
            right = !right;
        }

        if (left){
            if (node.left === null){
                node.left = new Node(value);
                return;
            }
            this.__insertRecur(value, node.left);
        }

        if (right){
            if (node.right === null){
                node.right = new Node(value);
            }
            this.__insertRecur(value, node.right);
        }
    }*/
    
    deleteItem(value){
        this.root = __deleteItemRecur(value, this.root);
    };

    __getSucc(node){
        let cur = node.right;
        while (cur !== null && cur.left !== null){
            cur = cur.left;
        }
        return cur;
    };
     
    __deleteItemRecur(value, node){
        if (node === null){
            return node;
        }

        if (value < node.data){
            node.left = this.__deleteItemRecur(value, node.left);
        } else if (value > node.data){
            node.right = this.__deleteItemRecur(value, node.right);
        } else {

            if (node.left === null){
                return node.right;
            }

            if (node.right === null){
                return node.left;
            }

            const succ = this.__getSucc(node);
            node.data = succ.data;
            node.right = this.__deleteItemRecur(succ.data, node.right);
        }
    };

    find(value){
        return this.__findRecur(value, this.root);
    };

    __findRecur(value, node){
        if (node === null){
            return null;
        }

        if (node.data === value){
            return node;
        }

        if (value < node.data){
            return this.__findRecur(value, node.left);
        } else if (value > node.data){
            return this.__findRecur(value, node.right);
        }
    };

    levelOrder(callback){
        if (typeof callback !== 'function') {
            throw new TypeError('The argument should be a function');
        }
        if (this.root === null) return;
        let frontIndex = 0;
        const queue = [];
        queue.push(this.root);
        while (frontIndex < queue.length){
            let curNode = queue[frontIndex];
            callback(curNode);
            if (curNode.left !== null) queue.push(curNode.left);
            if (curNode.right !== null) queue.push(curNode.right);
            frontIndex++;
        }
    };

    inOrder(callback){
        if (typeof callback !== 'function') {
            throw new TypeError('The argument should be a function');
        }
        if (this.root === null) return;
        this.__inOrderRecur(callback, this.root);
    }

    preOrder(callback){
        if (typeof callback !== 'function') {
            throw new TypeError('The argument should be a function');
        }
        if (this.root === null) return;
        this.__preOrderRecur(callback, this.root);
    }

    postOrder(callback){
        if (typeof callback !== 'function') {
            throw new TypeError('The argument should be a function');
        }
        if (this.root === null) return;
        this.__postOrderRecur(callback, this.root);
    }

    __inOrderRecur(callback, node){
        if (node === null) return;
        this.__inOrderRecur(callback, node.left);
        callback(node);
        this.__inOrderRecur(callback, node.right);
    }

    __preOrderRecur(callback, node){
        if (node === null) return;
        callback(node);
        this.__preOrderRecur(callback, node.left);
        this.__preOrderRecur(callback, node.right);
    }

    __postOrderRecur(callback, node){
        if (node === null) return;
        callback(node);
        this.__postOrderRecur(callback, node.left);
        this.__postOrderRecur(callback, node.right);
    }

    height(value){
        const node = this.find(value);
        if (node === null) return null;
        return this.__heightRecur(node);
    }

    __heightRecur(node){
        if (node === null) return -1;

        if (node.right === null && node.left === null) return 0;

        let leftSubTree = this.__heightRecur(node.left);
        let rightSubTree = this.__heightRecur(node.right);

        return 1 + Math.max(leftSubTree, rightSubTree);
    }

    depth(value){
        let count = 0;
        return __depthRecur(value, count, this.root);
    }

    __depthRecur(value, count, node){
        if (node === null) return null;
        if (value === node.data){
            return count;
        }

        if (value < node.data){
            return this.__depthRecur(value, count + 1, node.left);
        } 

        if (value > node.data){
            return this.__depthRecur(value, count + 1, node.right);
        }
    }

    isBalanced(){
        return this.__isBalancedRecur(this.root);
    }

    __isBalancedRecur(node){
        if (node === null) return true;

        let leftHeight = this.__heightRecur(node.left);
        let rightHeight = this.__heightRecur(node.right);

        let difference = Math.abs(leftHeight - rightHeight);
        if (difference > 1) return false;

        return this.__isBalancedRecur(node.left) && this.__isBalancedRecur(node.right);
    }
    
    rebalance(){
        const array = [];
        this.inOrder(node => array.push(node.data));
        this.root = this.buildTree(array);
    }
}

const myBbst = new Tree([2, 4, 6, 8, 10, 12, 14,33, 33, 45])

myBbst.prettyPrint()
 
myBbst.insert(2);

console.log("------------------------------------------------")
myBbst.prettyPrint()
console.log(myBbst.isBalanced())