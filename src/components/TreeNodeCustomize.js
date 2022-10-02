import React, {useEffect, useState} from "react";
import {TreeSelect} from "antd";

export default function TreeNodeCustomize(props) {
    const {TreeNode} = TreeSelect;
    const {listCategoryTree, onChange, value} = props
    const [listNode, setListNode] = useState([])
    useEffect(() => {
        console.log("list",listCategoryTree)
        // setListNode(renderNode);
        setListNode( [
            {
                category_name: 'Một',
                id: '1',
                child_categories: [
                    {
                        category_name: 'Hai',
                        id: '2',
                    },
                    {
                        category_name: 'Ba',
                        id: '3',
                    },
                ],
            },
            {
                category_name: 'Bốn',
                id: '4',
            },
        ])
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
            treeData={listCategoryTree}
            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
            placeholder="Mục đích vay"
            allowClear
            // treeDefaultExpandAll
            onChange={onChange}
            style={{width: '20%', marginLeft: '20px'}}
            filterTreeNode={(search, item) => {
                return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
            }}
            fieldNames={{label:'category_name',value:'id',children:'child_categories'}}
        >



        </TreeSelect>
    );
};

