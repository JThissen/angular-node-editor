import { Pair } from "./pair"; 
import { Node } from "./node/node";
import { Node_Type } from "./node/node-type.enum";
import { NodeNumber } from './node/node-number';

export class Link 
{
    public id: string;
    public node_output_element;
    public node_input_element;
    public node_out_element;
    public node_in_element;
    public node_out: any;
    public node_in: any;
    public start_pos : Pair<number>;
    public end_pos : Pair<number>;
    public context;
    public line_width_inner: number;
    public line_width_outer: number;
    public start_color: number[];
    public end_color: number[];
    public bezier_curve_distance: number;
    public line_cap: string;
    public line_dash: number;

    public constructor(id: string, node_output_element: Element, node_input_element: Element, node_out_element: Element, node_in_element: Element, node_out: Node, node_in: Node, nodes_container: Map<Node_Type, Array<Node>>, context, start_color: number[] = [155, 227, 229], end_color: number[] = [227, 229, 155], line_width_inner: number = 2, line_width_outer: number = 8, bezier_curve_distance: number = 100, line_cap: string = "round")
    {
        this.id = id;
        this.node_output_element = node_output_element;
        this.node_input_element = node_input_element;
        this.context = context;
        this.line_width_inner = line_width_inner;
        this.line_width_outer = line_width_outer;
        this.start_color = start_color;
        this.end_color = end_color;
        this.bezier_curve_distance = bezier_curve_distance;
        this.node_out_element = node_out_element;
        this.node_in_element = node_in_element;
        this.node_out = node_out;
        this.node_in = node_in;
        this.line_cap = line_cap;
    }

    public update_link_data() : void
    {
        if(this.node_out instanceof NodeNumber)
        {
            if(this.node_input_element.id.includes("0"))
                this.node_in.set_x((<NodeNumber>this.node_out).input_bar_content);
            else if(this.node_input_element.id.includes("1"))
                this.node_in.set_y((<NodeNumber>this.node_out).input_bar_content);
        }
        else
        {
            if(this.node_input_element.id.includes("0"))
                this.node_in.set_x(this.node_out.get_result());
            else if(this.node_input_element.id.includes("1"))
                this.node_in.set_y(this.node_out.get_result());
        }

        if(this.node_in.output_slot_1)
            this.node_in.output_slot_1.update_link_data();
    }

    public static display_temporary_link(node_selected_output, end_x: number, end_y: number, color: string, context, line_width: number = 2, bezier_curve_distance: number = 100, line_dash: number = 5) : void
    {
        let node_selected_output_rect =  node_selected_output.getBoundingClientRect();
        context.lineWidth = line_width;
        context.strokeStyle = color;
        context.beginPath();
        context.setLineDash([line_dash, line_dash]);
        context.moveTo(node_selected_output_rect.x + node_selected_output_rect.width / 2, node_selected_output_rect.y + node_selected_output_rect.height / 2);
        context.bezierCurveTo(node_selected_output_rect.x + bezier_curve_distance, node_selected_output_rect.y, end_x - bezier_curve_distance, end_y, end_x, end_y);
        context.stroke();
    }

    public draw_link() : void
    {
        let node_output_rect = this.node_output_element.getBoundingClientRect();
        let node_input_rect = this.node_input_element.getBoundingClientRect();

        this.context.lineWidth = this.line_width_inner;
        let gradient = this.context.createLinearGradient(node_output_rect.x + node_output_rect.width / 2, node_output_rect.y + node_output_rect.height / 2, node_input_rect.x + node_input_rect.width / 2, node_input_rect.y + node_input_rect.height / 2);
        gradient.addColorStop(0, `rgba(${this.start_color[0]}, ${this.start_color[1]}, ${this.start_color[2]}, 1)`);
        gradient.addColorStop(1, `rgba(${this.end_color[0]}, ${this.end_color[1]}, ${this.end_color[2]}, 1)`);
        this.context.strokeStyle = gradient;
        this.context.lineCap = this.line_cap;
        this.context.beginPath();
        this.context.setLineDash([]);
        this.context.moveTo(node_output_rect.x + node_output_rect.width / 2, node_output_rect.y + node_output_rect.height / 2);
        this.context.bezierCurveTo(node_output_rect.x + this.bezier_curve_distance, node_output_rect.y, node_input_rect.x - this.bezier_curve_distance, node_input_rect.y, node_input_rect.x + node_input_rect.width / 2, node_input_rect.y + node_input_rect.height / 2);
        this.context.stroke();

        this.context.lineWidth = this.line_width_outer;
        gradient = this.context.createLinearGradient(node_output_rect.x + node_output_rect.width / 2, node_output_rect.y + node_output_rect.height / 2, node_input_rect.x + node_input_rect.width / 2, node_input_rect.y + node_input_rect.height / 2);
        gradient.addColorStop(0, `rgba(${this.start_color[0]}, ${this.start_color[1]}, ${this.start_color[2]}, 0.25)`);
        gradient.addColorStop(1, `rgba(${this.end_color[0]}, ${this.end_color[1]}, ${this.end_color[2]}, 0.25)`);
        this.context.strokeStyle = gradient;
        this.context.moveTo(node_output_rect.x + node_output_rect.width / 2, node_output_rect.y + node_output_rect.height / 2);
        this.context.bezierCurveTo(node_output_rect.x + this.bezier_curve_distance, node_output_rect.y, node_input_rect.x - this.bezier_curve_distance, node_input_rect.y, node_input_rect.x + node_input_rect.width / 2, node_input_rect.y + node_input_rect.height / 2);
        this.context.stroke();
    }
}