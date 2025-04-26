class Node{
    constructor(data){
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

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
    }
}