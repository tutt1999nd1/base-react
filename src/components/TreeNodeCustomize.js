import React, {useEffect, useState} from "react";
import {TreeSelect} from "antd";

export default function TreeNodeCustomize(props) {
    const {TreeNode} = TreeSelect;
    const {listCategoryTree, onChange, value} = props
    const [listNode, setListNode] = useState()
    useEffect(() => {
        console.log("list",listCategoryTree)
        // setListNode(renderNode);
    }, [listCategoryTree])
    const renderNode = (subNodes) => {

        console.log("subNodes",subNodes)
        // const element = <></>
        // for (let i = 0; i < arr.length; i++) {
        //
        // }
        return (
            <TreeNode key={new Date()} value={subNodes.id} title={subNodes.category_name}>
                {
                    subNodes.child_categories.map((node) => (
                    <TreeNode value={node.id} title={node.category_name}>
                        {renderNode(node)}
                    </TreeNode>
                ))
                }
            </TreeNode>
        )


    }

    return (
        // <div className={'header-container'}>
        <TreeSelect
            showSearch
            value={value}
            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
            placeholder="Mục đích vay"
            allowClear
            // treeDefaultExpandAll
            onChange={onChange}
            style={{width: '20%', marginLeft: '20px'}}
        >
            {
                listCategoryTree.map((node)=>(
                    renderNode(node)
                ))
            }


        </TreeSelect>
    );
};

