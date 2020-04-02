import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { NodeFactory } from './node/node-factory';
import { Node } from "./node/node";
import { Node_Type } from './node/node-type.enum';
import { Link } from "./link";
import { Links} from "./links";
import { Utilities } from './utilities';
import { Menu } from './menu';
import { NodeNumber } from './node/node-number';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
  "./node_css/node_number.css",
  "./node_css/node_add.css",
  "./node_css/node_subtract.css",
  "./node_css/node_multiply.css",
  "./node_css/node_divide.css",
  "./node_css/node_modulus.css",
  "./node_css/node_menu.css"],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent
{
  public canvas_background: HTMLCanvasElement;
  public canvas_foreground: HTMLCanvasElement;
  public context_background;
  public context_foreground;
  public container: HTMLElement;
  public grid_visible: boolean;
  public node_factory: NodeFactory;
  public selected_node: Node;
  public drawing_link: boolean;
  public links: Links;
  public menu: Menu;
  public text_grid: string;
  public text_delete_node: string;
  public delete_node_active: boolean;
  
  public constructor()
  {
    this.grid_visible = true;
    this.node_factory = new NodeFactory();
    this.drawing_link = false;
    this.text_grid = "Hide grid";
    this.text_delete_node = "Delete node";
    this.delete_node_active = false;
  }

  public ngOnInit() : void
  {
    this.container = <HTMLElement>document.querySelector("#container");
    this.canvas_background = document.querySelector("#canvas-background");
    this.canvas_foreground = document.querySelector("#canvas-foreground");
    this.context_background = this.canvas_background.getContext("2d");
    this.context_foreground = this.canvas_foreground.getContext("2d");
    this.canvas_background.width = this.canvas_background.clientWidth;
    this.canvas_background.height = this.canvas_background.clientHeight;
    this.canvas_foreground.width = this.canvas_foreground.clientWidth;
    this.canvas_foreground.height = this.canvas_foreground.clientHeight;
    this.context_background.translate(0.5, 0.5);
    this.links = new Links(this.context_foreground);
    let delete_node_icon = <HTMLElement>document.querySelector("#sidebar-item-icon-delete_node");
    let delete_node = <HTMLElement>document.querySelector("#sidebar-item-delete_node");

    this.container.addEventListener("dblclick", (event) => {this.on_double_click(event)}, false);
    this.container.addEventListener("mousedown", (event) => {this.on_mouse_down(event)}, false);
    this.container.addEventListener("mouseup", (event) => {this.on_mouse_up(event)}, false);
    this.container.addEventListener("mousemove", (event) => {this.on_mouse_move(event)}, false);
    window.addEventListener("resize", (event) => {this.resize()}, false);
    delete_node.addEventListener("mouseover", (event)=>{delete_node_icon.style.color = this.delete_node_active ? "rgba(255, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)";});
    delete_node.addEventListener("mouseout", (event)=>{delete_node_icon.style.color = this.delete_node_active ? "rgba(255, 0, 0, 1)" : "rgba(255, 255, 255, 1)";});

    this.menu = new Menu(this.container);
    this.menu.add_item(this.node_factory, Node_Type.node_number, "Number (float)");
    this.menu.add_item(this.node_factory, Node_Type.node_add, "Add");
    this.menu.add_item(this.node_factory, Node_Type.node_subtract, "Subtract");
    this.menu.add_item(this.node_factory, Node_Type.node_multiply, "Multiply");
    this.menu.add_item(this.node_factory, Node_Type.node_divide, "Divide");
    this.menu.add_item(this.node_factory, Node_Type.node_modulus, "Modulus");
    this.menu.create_menu();
  }

  private on_mouse_move(event) : void
  {
    event.preventDefault();
    Utilities.clear_canvases(this.context_foreground, this.context_background, this.canvas_background);

    if(this.grid_visible)
      Utilities.draw_grid(this.container, this.context_background, 20);

    if(this.selected_node !== null && this.selected_node !== undefined)
    {
      if(this.selected_node.target !== null && this.selected_node.target !== undefined)
      {
        if(this.selected_node.target.className.includes("header"))
        {
          let selected_node_html = <HTMLElement>document.querySelector(`#${this.selected_node.id}`);
          if(selected_node_html === null)
            return;
          Utilities.move_object(selected_node_html, this.container, event);
        }
      }
      else
      {
        let selected_node_element = document.querySelector(`#${this.selected_node.id}`);
        let selected_node_output = selected_node_element.querySelector(`#${this.selected_node.selected_member_id}`);
        this.drawing_link = true;
        Link.display_temporary_link(selected_node_output, event.clientX, event.clientY, "rgba(200, 200, 200,1)", this.context_foreground);
      }
    }
    this.links.redraw_links();
  }
 
  private on_mouse_down(event) : void
  {
    let parent = event.target.parentElement.parentElement;
    let parent_node_add = event.target.parentElement.parentElement.parentElement;

    if(event.target.className.includes("input_bar"))
      return;
    else if(parent.className.includes("node_number"))
    {
      let parent_id = parent.id;
      this.search_node_container(event, parent_id);
    }
    else if(Utilities.contains(parent_node_add.className, ["node_add", "node_subtract", "node_multiply", "node_divide", "node_modulus"]))
    {
      let parent_id = parent_node_add.id;
      this.search_node_container(event, parent_id);
    }
    else if(event.target.className.includes("header"))
    {
      for(let [key, value] of this.node_factory.nodes_container)
      {
        for(let i of value)
        {
          if(event.target.parentElement.id === i.id)
          {
            this.selected_node = i;
            this.selected_node.target = event.target;
            this.selected_node.selected_member_id = null;
          }
        }
      }
    }
    else
      this.search_node_container(event, event.target.id);

    if(this.delete_node_active)
    {
      if(this.selected_node === undefined || this.selected_node === null)
        return;

      this.search_node_container_delete(this.selected_node.id);
      Utilities.delete_node(this.container, this.selected_node.id);
    }
  }

  private on_mouse_up(event) : void
  {
    if(this.menu.visible)
      this.menu.toggle_menu();

    if(this.selected_node === undefined || this.selected_node === null)
      return;

    if(this.selected_node.selected_member_id !== null && this.selected_node.selected_member_id !== undefined)
    {
      if(this.drawing_link && this.selected_node.selected_member_id.includes("output") && event.target.className.includes("input"))
      {
        this.drawing_link = false;
        let node_out_element = document.querySelector(`#${this.selected_node.id}`);
        let node_output_element = node_out_element.querySelector(`#${this.selected_node.selected_member_id}`);
        let node_input_element = event.target;
        this.links.create_link(node_output_element, node_input_element, this.node_factory.nodes_container, this.context_foreground);
      }
    }

    for(let [key, value] of this.node_factory.nodes_container)
    {
      for(let i of value)
      {
        if(this.selected_node !== null)
        {
          this.selected_node.target = null;
          this.selected_node = null;
        }
      }
    }
  }

  private on_double_click(event: MouseEvent) : void
  {
    if(this.delete_node_active)
      return;

    this.menu.node_menu_element.style.transform = `translate3d(${event.x}px, ${event.y}px, 0px)`;
    this.menu.toggle_menu(event);
  }

  private resize() : void
  {
    this.canvas_background.width = this.canvas_background.clientWidth;
    this.canvas_background.height = this.canvas_background.clientHeight;
    this.canvas_foreground.width = this.canvas_foreground.clientWidth;
    this.canvas_foreground.height = this.canvas_foreground.clientHeight;
    Utilities.clear_canvases(this.context_foreground, this.context_background, this.canvas_background);
    this.context_background.translate(0.5, 0.5);
    Utilities.draw_grid(this.container, this.context_background, 20);
    this.links.redraw_links();
  }

  public show_grid() : void
  {
    this.grid_visible = !this.grid_visible;
    this.text_grid = this.grid_visible ? "Hide grid" : "Show grid";
    
    if(this.grid_visible)
      Utilities.draw_grid(this.container, this.context_background, 20);
    else
      Utilities.clear_background_canvas(this.context_background, this.canvas_background);
  }

  public clear_screen() : void
  {
    this.canvas_background.width = this.canvas_background.clientWidth;
    this.canvas_background.height = this.canvas_background.clientHeight;
    this.canvas_foreground.width = this.canvas_foreground.clientWidth;
    this.canvas_foreground.height = this.canvas_foreground.clientHeight;
    this.links.links_container.length = 0;
    Utilities.delete_nodes(this.container);
    Utilities.clear_canvases(this.context_foreground, this.context_background, this.canvas_background);
    this.context_background.translate(0.5, 0.5);
    Utilities.draw_grid(this.container, this.context_background, 20);
  }

  public delete_node() : void
  {
    this.delete_node_active = !this.delete_node_active;
    this.text_delete_node = this.delete_node_active ? "Delete node (active)" : "Delete node";
    this.container.style.backgroundColor = this.delete_node_active ? "rgba(255, 0, 0, 0.1)" : "rgba(31, 31, 31, 1)";
  }

  private search_node_container(event, id: string) : void
  {
    for(let [key, value] of this.node_factory.nodes_container)
    {
      for(let i of value)
      {
        if(id === i.id)
        {
          this.selected_node = i; 
          this.selected_node.selected_member_id = event.target.id;
          this.selected_node.target = null;
        }
      }
    }
  }

  private search_node_container_delete(id: string) : void
  {
    for(let [key, value] of this.node_factory.nodes_container)
    {
      for(let i of value.entries())
      {
        if(id === i[1].id)
        {
          let current_nodes: Array<Node> = this.node_factory.nodes_container.get(key);
          let current_node: any = current_nodes[i[0]];
          current_nodes.splice(i[0], 1);
          this.node_factory.nodes_container.set(key, current_nodes);

          if(current_node instanceof NodeNumber)
          {
            for(let i = 0; i < this.links.links_container.length; i++)
            {
                if(this.links.links_container[i] === undefined || this.links.links_container[i] === null ||
                  current_node.output_slot_1 === undefined || current_node.output_slot_1 === null)
                  continue;

                if(this.links.links_container[i].id === current_node.output_slot_1.id)
                {
                    this.links.links_container.splice(i, 1);

                    if(current_node.output_slot_1.node_input_element.id.includes("0"))
                      current_node.output_slot_1.node_in.set_x(0);
                    else if(current_node.output_slot_1.node_input_element.id.includes("1"))
                      current_node.output_slot_1.node_in.set_y(0);

                    current_node.output_slot_1 = null;
                }
            }
          }
          else
          {
            let delete_indices: Array<string> = new Array<string>();

            for(let i = 0; i <= this.links.links_container.length; i++)
            {
              if(this.links.links_container[i] === undefined || this.links.links_container[i] === null)
                continue;

              if(current_node.output_slot_1 !== undefined && current_node.output_slot_1 !== null && (this.links.links_container[i].id === current_node.output_slot_1.id))
              {
                delete_indices.push(current_node.output_slot_1.id);

                if(current_node.output_slot_1.node_input_element.id.includes("0"))
                  current_node.output_slot_1.node_in.set_x(0);
                else if(current_node.output_slot_1.node_input_element.id.includes("1"))
                  current_node.output_slot_1.node_in.set_y(0);

                current_node.output_slot_1 = null;
              }
              else if(current_node.input_slot_1 !== undefined && current_node.input_slot_1 !== null && (this.links.links_container[i].id === current_node.input_slot_1.id))
              {
                delete_indices.push(current_node.input_slot_1.id);
                current_node.input_slot_1.node_out.output_slot_1 = null;
                current_node.input_slot_1 = null;
              }
              else if(current_node.input_slot_2 !== undefined && current_node.input_slot_2 !== null && (this.links.links_container[i].id === current_node.input_slot_2.id))
              {
                delete_indices.push(current_node.input_slot_2.id);
                current_node.input_slot_2.node_out.output_slot_1 = null;
                current_node.input_slot_2 = null;
              }
            }

            for(let i = 0; i < this.links.links_container.length; i++)
            {
              for(let j = 0; j < delete_indices.length; j++)
              {
                if(this.links.links_container[i].id === delete_indices[j])
                  this.links.links_container.splice(i, 1);
              }
            }
          }
        }
      }
    }

    this.resize();
  }
}