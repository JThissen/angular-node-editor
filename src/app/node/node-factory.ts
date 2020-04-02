import { Pair } from "../pair";
import { Node } from './node';
import { Node_Type } from './node-type.enum';
import { NodeAdd } from './node-add';
import { NodeNumber } from './node-number';
import { NodeSubtract } from './node-subtract';
import { NodeMultiply } from './node-multiply';
import { NodeDivide } from './node-divide';
import { NodeModulus } from './node-modulus';

export class NodeFactory 
{
    public nodes_container: Map<Node_Type, Array<Node>>;

    public constructor()
    {
        this.nodes_container = new Map<Node_Type, Array<Node>>();
    }

    public create_node(parent_element: HTMLElement, node_type: Node_Type, header_name: string, position: Pair<number>) : void
    {
        let node;

        switch(node_type)
        {
            case Node_Type.node_number: node = new NodeNumber(); break;
            case Node_Type.node_add: node = new NodeAdd(); break;
            case Node_Type.node_subtract: node = new NodeSubtract(); break;
            case Node_Type.node_multiply: node = new NodeMultiply(); break;
            case Node_Type.node_divide: node = new NodeDivide(); break;
            case Node_Type.node_modulus: node = new NodeModulus(); break;
            default: node = new NodeNumber(); break;
        }

        if(this.nodes_container.has(node_type))
        {
            let current_nodes: Array<Node> = this.nodes_container.get(node_type);
            node.create_node(parent_element, node_type, header_name, current_nodes.length, position);
            this.check_node_bounds(parent_element, node);
            current_nodes.push(node);
            this.nodes_container.set(node_type, current_nodes);
        }
        else
        {
            let nodes_array: Array<Node> = new Array<Node>();
            node.create_node(parent_element, node_type, header_name, 0, position);
            this.check_node_bounds(parent_element, node);
            nodes_array.push(node);
            this.nodes_container.set(node_type, nodes_array);
        }
    }

    public check_node_bounds(parent_element: HTMLElement, node) : void
    {
        let parent_element_rect = parent_element.getBoundingClientRect();
        let node_element = document.querySelector(`#${node.id}`);
        let node_element_rect = node_element.getBoundingClientRect();

        if(node_element_rect.x + node_element_rect.width > parent_element_rect.width)
            parent_element.removeChild(node_element);
    }
}