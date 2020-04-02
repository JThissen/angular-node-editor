import { Node_Type } from './node-type.enum';
import { Link } from '../link';
import { Pair } from "../pair";

export abstract class Node
{
    public id: string;
    public inputs: Array<boolean>;
    public outputs: Array<boolean>;
    public class_name: string;
    public target: Element;
    public selected_member_id: string;
    public node_element: Element;
    public next_node: Node;
    public output_slot_1: Link;
    public invalid: string;

    protected constructor()
    {
        this.inputs = new Array<boolean>();
        this.outputs = new Array<boolean>();
        this.invalid = "Invalid";

        for(let i = 0; i < this.inputs.length; i++)
        {
            this.inputs[i] = false;
            this.outputs[i] = false;
        }
    }

    public abstract create_node(parent_element: HTMLElement, node_type: Node_Type, header_name: string, no: number, position: Pair<number>) : void;
}