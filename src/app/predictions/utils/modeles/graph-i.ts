export interface GraphI {
  labels:Array<string>;
  datasets:Array<GraphSetI>;
}

export interface GraphSetI{
    label:string;
    data: Array<number>;
    fill: boolean;
    tension: number;
    borderColor: string;
}
