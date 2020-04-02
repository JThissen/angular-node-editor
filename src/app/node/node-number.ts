import { Node } from "./node";
import { Utilities } from "../utilities";
import { Node_Type } from "./node-type.enum";
import { Pair } from "../pair";

export class NodeNumber extends Node 
{
    public input_bar_content: number;

    public constructor()
    {
        super();
        this.input_bar_content = 0;
    }

    public create_node(parent_element: HTMLElement, node_type: Node_Type, header_name: string, no: number, position: Pair<number>) : void
    {
        let item = document.createElement("div");
        this.class_name = Utilities.node_type_to_string(node_type);
        item.className = this.class_name;
        item.id = this.id = this.class_name + "-" + no.toString();
        
        let header = document.createElement("div");
        header.className = this.class_name + "-header";
        header.innerText = header_name;
        item.appendChild(header);

        let contents = document.createElement("div");
        contents.className = this.class_name + "-contents";

        let input_bar = document.createElement("input");
        input_bar.className = this.class_name + "-input_bar";
        input_bar.id = this.class_name + "-input_bar-0";
        
        input_bar.type = "text";
        input_bar.setAttribute("value", this.input_bar_content.toString());
        input_bar.addEventListener("keydown", (event)=>
        {
            if(!this.validate_input_bar(event, input_bar))
                event.returnValue = false;
                event.cancelBubble = true;
        }, false);

        input_bar.addEventListener("keyup", (event)=>
        {
            this.input_bar_content = parseFloat(input_bar.value);

            if(this.output_slot_1 === null || this.output_slot_1 === undefined)
                return;

            this.output_slot_1.update_link_data();
        });

        let output = document.createElement("div");
        output.className = this.class_name + "-output";
        output.id = this.class_name + "-output-0";
        this.outputs.push(false);

        contents.appendChild(input_bar);
        contents.appendChild(output);
        item.appendChild(contents);

        this.node_element = item;
        item.style.transform = `translate3d(${position.x}px, ${position.y}px, 0px)`;
        parent_element.appendChild(item);
    }

    public validate_input_bar(event, input_bar: HTMLInputElement) : boolean
    {
        if(event.keyCode === 8)
            return true;

        if(event.key === "." && !input_bar.value.includes("."))
            return true;

        if(!Utilities.is_digit(event.key))
            return false;
        return true;
    }
}