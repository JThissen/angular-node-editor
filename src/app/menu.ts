import { NodeFactory } from './node/node-factory';
import { Node_Type } from './node/node-type.enum';
import { Pair } from "./pair";

export class Menu 
{
    private class_name: string;
    private parent_element: HTMLElement;
    public visible: boolean;
    public position: Pair<number>;
    public node_menu_element;

    public constructor(parent_element: HTMLElement, class_name: string = "node_menu")
    {
        this.class_name = class_name;
        this.parent_element = parent_element;
        this.visible = false;
        this.position = new Pair<number>(0, 0);
        this.create_base_menu();
    }

    private create_base_menu() : void
    {
        let node_menu = document.createElement("div");
        node_menu.className = this.class_name;
        node_menu.style.visibility = "hidden";
        let node_menu_header = document.createElement("div");
        node_menu_header.className = this.class_name + "-header";
        node_menu_header.innerHTML = "Create node";
        let node_menu_contents = document.createElement("div");
        node_menu_contents.className = this.class_name + "-contents";

        node_menu.appendChild(node_menu_header);
        node_menu.appendChild(node_menu_contents);

        this.node_menu_element = node_menu;
    }

    public add_item(node_factory: NodeFactory, node_type: Node_Type, name: string) : void
    {
        let node_menu_contents = this.node_menu_element.querySelector(`.${this.class_name}-contents`);
        let node_menu_item = document.createElement("div");
        node_menu_item.className = this.class_name + "-item";
        node_menu_item.innerHTML = name;
        node_menu_item.addEventListener("click", (event)=>{node_factory.create_node(this.parent_element, node_type, name, this.position)})
        node_menu_contents.appendChild(node_menu_item);
    }

    public create_menu() : void
    {
        this.parent_element.appendChild(this.node_menu_element);
    }

    public toggle_menu(event?) : void
    {
        if(event !== undefined)
        {
            this.position.x = event.x;
            this.position.y = event.y;
        }

        if(this.node_menu_element.style.visibility === "visible")
        {
            this.node_menu_element.style.visibility = "hidden";
            this.visible = false;
        }
        else
        {
            this.node_menu_element.style.visibility = "visible";
            this.visible = true;
        }
    }
}