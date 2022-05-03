export interface ColForm {
  id?: string;
  name: string;
  dataType: 'Text' | 'Number' | 'Date' | 'Boolean' | 'DropDownList';
  defaultValue: any;
  options?: string[];
  minColWidth: string;
  fontSize: string;
  fontColor: string;
  bg: string;
  alignment: string;
  textWrap: boolean;
}

export interface List {
  id?: string;
  [key: string]: any;
  children?: RowForm[];
}

export interface RowForm {
  id?: string;
  pId?: string;
  [key: string]: any;
}

export interface CheckItem extends RowForm {
  parentItem?: RowForm;
  taskData?: RowForm;
}