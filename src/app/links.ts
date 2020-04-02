import { Link } from './link';
import { Node } from "./node/node";
import { Node_Type } from "./node/node-type.enum";
import { Utilities } from "./utilities";
import { NodeNumber } from "./node/node-number";

export class Links 
{
    public links_container: Array<Link>;
    public context;

    public constructor(context)
    {
        this.links_container = new Array<Link>();
        this.context = context;
    }

    public create_link(node_output_element: Element, node_input_element: Element, nodes_container: Map<Node_Type, Array<Node>>, context) : void
    {
        let id = `link-${this.links_container.length}`;
        let node_out_element = Utilities.find_parent_dom_element(node_output_element);
        let node_in_element = Utilities.find_parent_dom_element(node_input_element);
        let node_out: any = Utilities.find_node(node_out_element, nodes_container);
        let node_in: any = Utilities.find_node(node_in_element, nodes_container);
        let remove_link: Link;

        if(node_out.output_slot_1)
        {
            for(let i = 0; i < this.links_container.length; i++)
            {
                if(this.links_container[i].id === node_out.output_slot_1.id)
                {
                    remove_link = this.links_container[i];
                    this.links_container.splice(i, 1);
                    node_out.output_slot_1 = null;
                }
            }
        }

        if(node_input_element.id.includes("0") && node_in.input_slot_1 !== null)
        {
             for(let i = 0; i < this.links_container.length; i++)
             {
                 if(node_in.input_slot_1 && this.links_container[i].id === node_in.input_slot_1.id)
                     this.links_container.splice(i, 1);
             }
            node_in.input_slot_1 = null;
        }
        else if(node_input_element.id.includes("1") && node_in.input_slot_2 !== null)
        {
             for(let i = 0; i < this.links_container.length; i++)
             {
                 if(node_in.input_slot_2 && this.links_container[i].id === node_in.input_slot_2.id)
                     this.links_container.splice(i, 1);
             }
            node_in.input_slot_2 = null;
        }

        if(remove_link)
        {
            if(node_in.input_slot_1 && node_in.input_slot_1.id === remove_link.id)
            {
                node_in.input_slot_1 = null;
                node_in.set_x(0);
            }
            else if(node_in.input_slot_2 && node_in.input_slot_2.id === remove_link.id)
            {
                node_in.input_slot_2 = null;
                node_in.set_y(0);
            }
        }

        if(node_out instanceof NodeNumber)
        {
            if(node_input_element.id.includes("0"))
                node_in.set_x((<NodeNumber>node_out).input_bar_content);
            else if(node_input_element.id.includes("1"))
                node_in.set_y((<NodeNumber>node_out).input_bar_content);
        }
        else
        {
            if(node_input_element.id.includes("0"))
                node_in.set_x(node_out.get_result());
            else if(node_input_element.id.includes("1"))
                node_in.set_y(node_out.get_result());
        }

        let link = new Link(id, node_output_element, node_input_element, node_out_element, node_in_element, node_out, node_in, nodes_container, context);
        
        node_out.output_slot_1 = link;

        if(node_input_element.id.includes("0"))
            node_in.input_slot_1 = link;
        else if(node_input_element.id.includes("1"))
            node_in.input_slot_2 = link;

        link.draw_link();
        this.links_container.push(link);
    }

    public redraw_links() : void
    {
        for(let i = 0; i < this.links_container.length; i++)
        {
            let link = this.links_container[i];
            link.draw_link();
        }
    }
}