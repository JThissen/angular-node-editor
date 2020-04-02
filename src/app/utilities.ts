import { Node_Type } from './node/node-type.enum';
import { Node } from "./node/node";

export class Utilities 
{
    public static node_type_to_string(node_type: Node_Type) : string
    {
        switch(node_type)
        {
            case Node_Type.node_number: return "node_number";
            case Node_Type.node_add: return "node_add";
            case Node_Type.node_subtract: return "node_subtract";
            case Node_Type.node_multiply: return "node_multiply";
            case Node_Type.node_divide: return "node_divide";
            case Node_Type.node_modulus: return "node_modulus";
            default: return "node_number";
        }
    }

    public static is_digit(char: string) : boolean
    {
        let char_decimal = char[0].charCodeAt(0);
        let min: number = "0".charCodeAt(0);
        let max: number = "9".charCodeAt(0);
        return char_decimal >= min && char_decimal <= max;
    }

    public static find_node(dom_element: Element, nodes_container: Map<Node_Type, Array<Node>>) : Node
    {
        for(let [key, value] of nodes_container)
        {
            for(let node of value)
            {
                if(dom_element.id === node.id)
                    return node;
            }
        }
    }

    public static find_parent_dom_element(dom_element)
    {
        if(dom_element.id.includes(Utilities.node_type_to_string(Node_Type.node_number)))
            return dom_element.parentElement.parentElement;
        else
            return dom_element.id.includes("0") ? dom_element.parentElement.parentElement.parentElement : dom_element.parentElement.parentElement;
    }

    public static clear_canvases(context_foreground, context_background, canvas_background): void
    {
        context_background.clearRect(0, 0, canvas_background.width, canvas_background.height);
        context_foreground.clearRect(0, 0, canvas_background.width, canvas_background.height);
    }

    public static clear_foreground_canvas(context_foreground, canvas_background): void
    {
        context_foreground.clearRect(0, 0, canvas_background.width, canvas_background.height);
    }

    public static clear_background_canvas(context_background, canvas_background): void
    {
        context_background.clearRect(0, 0, canvas_background.width, canvas_background.height);
    }

    public static move_object(object: HTMLElement, container: HTMLElement, event: MouseEvent, sidebar: number = 120) : void
    {
        let object_rect = object.getBoundingClientRect();
        let container_rect = container.getBoundingClientRect();
        let new_pos_x = object_rect.x + event.movementX;
        let new_pos_y = object_rect.y + event.movementY;

        if(new_pos_x >= container_rect.x + sidebar && new_pos_x + object_rect.width <= container_rect.x + container_rect.width
        && new_pos_y >= container_rect.y && new_pos_y + object_rect.height <= container_rect.y + container_rect.height)
            object.style.transform = `translate3d(${new_pos_x}px, ${new_pos_y}px, 0px)`;
    }

    public static draw_grid(object: HTMLElement, context_background, step_size: number) : void
    {
      context_background.strokeStyle = "rgba(, 0, 0, 1)";
      
      let object_rect = object.getBoundingClientRect();
      
      for(let i = 0; i < object.clientWidth / step_size; i++)
      {
        context_background.beginPath();
  
        if(i % 4 === 0)
            context_background.lineWidth = 2;
        else
            context_background.lineWidth = 1;
  
        context_background.moveTo(object_rect.x + (i * step_size), object_rect.y);
        context_background.lineTo(object_rect.x + (i * step_size), object_rect.y + object_rect.height);
        context_background.stroke();
      }
  
      for(let i = 0; i < object.clientWidth; i++)
      {
        context_background.beginPath();
  
        if(i % 4 === 0)
          context_background.lineWidth = 2;
        else
          context_background.lineWidth = 1;
  
        context_background.moveTo(object_rect.x, object_rect.y + (i * step_size));
        context_background.lineTo(object_rect.x + object_rect.width, object_rect.y + (i * step_size));
        context_background.stroke();
      }
    }

    public static delete_nodes(parentElement: HTMLElement) : void
    {
        let children: HTMLCollection = parentElement.children;

        for(let i = children.length - 1; i > 0; i--)
            parentElement.removeChild(children[i]);
    }

    public static delete_node(parentElement: HTMLElement, id: string) : void
    {
        let children: HTMLCollection = parentElement.children;

        for(let i = children.length - 1; i > 0; i--)
        {
            if(children[i].id === id)
                parentElement.removeChild(children[i]);
        }
    }

    public static contains(target: string, input: Array<string>) : boolean
    {
        for(let i = 0; i < input.length; i++)
        {
            if(target.includes(input[i]))
                return true;
        }
        return false;
    }
}