import { Node } from "./node";
import { Utilities } from "../utilities";
import { Node_Type } from "./node-type.enum";
import { Pair } from "../pair";
import { Link } from "../link";

export class NodeAdd extends Node 
{
    private x: number;
    private y: number;
    private result: number;
    public input_slot_1: Link;
    public input_slot_2: Link;

    public constructor()
    {
        super();
        this.x = 0;
        this.y = 0;
        this.result = 0;
    }

    public create_node(parent_element: HTMLElement, node_type: Node_Type, header_name: string, no: number, position: Pair<number>) : void
    {
        let item = document.createElement("div");
        this.class_name = Utilities.node_type_to_string(node_type);
        item.className = this.class_name;
        item.id = this.id = this.class_name + "-" + no.toString();

        let logo = document.createElement("div");
        logo.className = this.class_name + "-logo";
        logo.innerHTML = "+";
        
        let header = document.createElement("div");
        header.className = this.class_name + "-header";
        header.innerText = header_name;
        item.appendChild(header);

        let contents = document.createElement("div");
        contents.className = this.class_name + "-contents";

        let inout = document.createElement("div");
        let input = document.createElement("div");
        let output = document.createElement("div");
        let input_1 = document.createElement("div");
        let result_bar = document.createElement("div");
        let result_bar_text = document.createElement("div");
        inout.className = this.class_name + "-inout";
        input.className = this.class_name + "-input";
        output.className = this.class_name + "-output";
        input_1.className = this.class_name + "-input";
        result_bar.className = this.class_name + "-result_bar";
        result_bar_text.className = this.class_name + "-result_bar_text";
        input.id = this.class_name + "-input-0";
        output.id = this.class_name + "-output-0";
        input_1.id = this.class_name + "-input-1";
        input_1.style.marginTop = "10px";
        result_bar_text.innerHTML = this.result.toString();
        this.inputs.push(false);
        this.inputs.push(false);
        this.outputs.push(false);
        
        inout.appendChild(input);
        inout.appendChild(output);
        result_bar.appendChild(result_bar_text);
        contents.appendChild(inout);
        contents.appendChild(input_1);
        contents.appendChild(result_bar);
        item.appendChild(contents);
        item.appendChild(logo);

        this.node_element = item;
        item.style.transform = `translate3d(${position.x}px, ${position.y}px, 0px)`;
        parent_element.appendChild(item);
    }

    public set_x(x: number) : void
    {
        this.x = x;
        this.set_result(this.x, this.y);
    }

    public set_y(y: number) : void
    {
        this.y = y;
        this.set_result(this.x, this.y);
    }

    public get_result() : number {return this.result};

    private set_result(x: number, y: number) : void
    {
        this.result = x + y;
        let result_bar = this.node_element.querySelector(`.${this.class_name}-result_bar_text`);
        result_bar.innerHTML = isNaN(this.result) ? this.invalid : Number.isInteger(this.result) ? this.result.toString() : this.result.toFixed(2).toString();
    }

    public get_x() : number {return this.x};
    public get_y() : number {return this.y};
}