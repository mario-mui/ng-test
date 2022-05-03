import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { columnMenus, rowMenus } from './menus';
import { Dialog, DialogUtility } from '@syncfusion/ej2-popups';
import { CheckItem, ColForm, List, RowForm } from './type';
import { v4 as uuidv4 } from 'uuid';
import { extendArray, TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
 })
export class AppComponent implements OnInit {
  @ViewChild('treegridObj')
  treegridObj!: TreeGridComponent;

  @ViewChild('colFormDialog')
  colFormDialog!: DialogComponent;

  @ViewChild('FreezeCol')
  freezeCol!: any;

  @ViewChild('FilterCol')
  filterCol!: any;

  @ViewChild('MultiSort')
  multiSort!: any;

  colFormDialogVisible = false;
  rowFormDialogVisible = false;
  dataTypeList = ['Text', 'Number', 'Date', 'Boolean', 'DropDownList'];
  colFormModel!: ColForm;
  colReadOnly = false;
  colUpdate = false;
  freezeColModel = false;
  filterColModel = false;
  multiSortModel = false;

  dropDownListValues: string[] = [];
  dropDownListValue = '';
  addDropDownListValue = false;

  rowFormModel!: RowForm;
  rowUpdate = false;
  addChild = false;
  targetRow!: RowForm;
  rowCheckShow = false;
  cutRow = false;
  checkedRows: CheckItem[] = [];

  DialogObj!: Dialog;

  public data: List[] = [
    {
      id: uuidv4(),
      name: 'xxx',
      age: 12,
      children: [
        {
          id: uuidv4(),
          name: 'aaa',
          age: 22,
        }
      ],
    },
    {
      id: uuidv4(),
      name: 'bbb',
      age: 14,
    }
  ];
  public contextMenuItems: Object[] = [];

  cols: ColForm[] = [
    {
      id: 'name',
      name: 'name',
      dataType: 'Text',
      defaultValue: '',
      fontSize: '',
      fontColor: '',
      minColWidth: '',
      bg: '',
      alignment: '',
      textWrap: false
    },
    {
      id: 'age',
      name: 'age',
      dataType: 'Number',
      defaultValue: '',
      fontSize: '',
      fontColor: '',
      minColWidth: '',
      bg: '',
      alignment: '',
      textWrap: false
    }
  ]

  ngOnInit(): void {
    this.initColformModel();
    this.contextMenuItems = [
      ...columnMenus,
      ...rowMenus,
    ];
  }

  trackByFn(col: ColForm) {
    return col.name;
  }

  initColformModel() {
    this.colFormModel = {
      id: uuidv4(),
      name: '',
      dataType: 'Text',
      defaultValue: '',
      fontSize: '',
      fontColor: '#333',
      minColWidth: '',
      bg: '#fff',
      alignment: '',
      textWrap: false
    };
  }

  initRowFormModel() {
    this.rowFormModel = {};
    this.cols.forEach(col => {
      this.rowFormModel[col.name] = col.defaultValue || null;
    })
  }

  contentMenuClick(args: any) {
    const colName = args.column.headerText;
    const id = args.column.uid;
    this.targetRow = args.rowInfo?.rowData;
    switch (args.item.text) {
      case 'AddCol':
        this.colFormDialogVisible = true;
        this.initColformModel();
        this.colReadOnly = false;
        this.colUpdate = false;
        break;
      case 'ViewCol':
        this.colFormDialogVisible = true;
        this.colFormModel = this.cols.find(c => c.id === id) as ColForm;
        this.colReadOnly = true;
        this.colUpdate = false;
        break;
      case 'EditCol':
        this.colFormDialogVisible = true;
        this.colFormModel = this.cols.find(c => c.id === id) as ColForm;
        this.colReadOnly = false;
        this.colUpdate = true;
        break;
      case 'DelCol':
        this.DialogObj = DialogUtility.confirm({
          content: `Confirm to delete '${colName}' col`,
          okButton: {  text: 'OK', click: this.deleteColOkClick.bind(this, id) },
        });
        break;
      case 'AddNext':
        this.rowFormDialogVisible = true;
        this.initRowFormModel();
        this.rowUpdate = false;
        this.addChild = false;
        break;
      case 'AddChild':
        this.rowFormDialogVisible = true;
        this.initRowFormModel();
        this.rowUpdate = false;
        this.addChild = true;
        break;
      case 'DelRow':
        this.DialogObj = DialogUtility.confirm({
          content: 'Confirm to delete row',
          okButton: { text: 'OK', click: this.deleteRowOkClick.bind(this) },
        });
        break;
      case 'EditRow':
        this.rowFormDialogVisible = true;
        this.rowFormModel = this.targetRow;
        this.rowUpdate = true;
        this.addChild = false;
        break;
      case 'CopyRows':
        this.rowCheckShow = true;
        this.cutRow = false;
        break;
      case 'CutRows':
        this.rowCheckShow = true;
        this.cutRow = true;
        break;
      case 'PasteNext':
        this.pasteNext();
        break;
      case 'PasteChild':
        this.pasteChild();
        break;
    }   
  }

  change(e: any) {
    if (e.checked) {
      this.checkedRows.push(e.rowData);
    } else {
      const index = this.checkedRows.findIndex(cr => cr.id === e.rowData.id)
      if (index > -1) {
        this.checkedRows.splice(index, 1)
      }
    }
  }

  contentMenuOpen() {
    const elementFreeze = document.querySelectorAll('li#FreezeCol')[0];
    const elementFilter = document.querySelectorAll('li#FilterCol')[0];
    const elementMultiSort = document.querySelectorAll('li#MultiSort')[0];
    elementFreeze.innerHTML = '';
    elementFreeze.appendChild(this.freezeCol.wrapper);
    elementFilter.innerHTML = '';
    elementFilter.appendChild(this.filterCol.wrapper);
    elementMultiSort.innerHTML = '';
    elementMultiSort.appendChild(this.multiSort.wrapper);
  }

  deleteColOkClick(id: string) {
    this.cols = this.cols.filter(c => c.id !== id);
    this.DialogObj.hide();
  }

  deleteNodeInTree(tree: List[], row: RowForm) {
    const index = tree.findIndex(t => t.id === row.id)
    if (index > -1) {
      tree.splice(index, 1);
    } else {
      tree.forEach(t => {
        if (t.children && t.children.length) {
          this.deleteNodeInTree(t.children, row)
        }
      })
    }
  }

  deleteRowOkClick() {
    const dataSource: List[] = extendArray((this.treegridObj as TreeGridComponent).dataSource as object[]);
    this.deleteNodeInTree(dataSource, this.targetRow);
    (this.treegridObj as TreeGridComponent).dataSource = dataSource; // Refresh the TreeGrid.
    this.DialogObj.hide();
  }

  addCol() {
    if (this.colUpdate) {
      const index = this.cols.findIndex(c => c.id === this.colFormModel.id)
      this.cols[index] = this.colFormModel;
      const column = this.treegridObj.getColumnByUid(this.colFormModel.id as string);
      column.headerText = this.colFormModel.name;
      this.treegridObj.refreshColumns();
    } else {
      this.cols.push(this.colFormModel);
    }
    if (this.colFormModel.dataType === 'DropDownList') {
      this.colFormModel.options == this.dropDownListValues;
    }
    if (this.colFormModel.defaultValue) {
      this.data = this.data.map(item => ({
        ...item,
        [this.colFormModel.name]: this.colFormModel.defaultValue,
      }))
    }
    this.colFormDialogVisible = false;
  }

  addRow() {
    const dataSource: List[] = extendArray((this.treegridObj as TreeGridComponent).dataSource as object[]);
    const row = {
      id: uuidv4(),
      ...this.rowFormModel,
    }
    if (this.addChild) {
      const item = dataSource.find(d => d.id === this.targetRow.id)
      if (item) {
        if (item.children && item.children.length) {
          item.children.push(row)
        } else {
          item.children = [row]
        }  
      }
    } else {
      const index = dataSource.findIndex(d => d.id === this.targetRow.id)
      dataSource.splice(index+1, 0, row)
    }
    (this.treegridObj as TreeGridComponent).dataSource = dataSource; // Refresh the TreeGrid
    this.rowFormDialogVisible = false;
  }

  editRow() {
    const dataSource: List[] = extendArray((this.treegridObj as TreeGridComponent).dataSource as object[]);
    const node = this.findNodeInTree(dataSource, this.targetRow);
    Object.assign(node, this.rowFormModel);
    (this.treegridObj as TreeGridComponent).dataSource = dataSource; // Refresh the TreeGrid
    this.rowFormDialogVisible = false;
  }

  findNodeInTree(tree: List[], row: RowForm): RowForm | null {
    if (!tree) {
      return null
    }
    const index = tree.findIndex(t => t.id === row.id)
    if (index > -1) {
      return tree[index]
    } else {
      let result = null;
      for(let i=0; result == null && i < tree.length; i++){
        result = this.findNodeInTree(tree[i].children as List[], row);
      }
      return result
    }
  }

  showCheck = (col: ColForm, isShow: boolean) => {
    const index = this.cols.findIndex(c => c.id === col.id);
    return index === 0;
  }

  getStyle(col: ColForm) {
    return {
      style: {
        'font-size': col.fontSize,
        'color': col.fontColor,
        'background-color': col.bg,
        'word-wrap': col.textWrap ? 'break-word': 'normal'
      }
    }
  }

  addDropDownListValueToList() {
    this.dropDownListValues.push(this.dropDownListValue);
    this.addDropDownListValue = false;
    this.dropDownListValue = '';
  }

  rmDrowDownListValue(i: number) {
    this.dropDownListValues.splice(i, 1)
  }

  formatCheckRows() {
    const list: CheckItem[] = this.checkedRows;
    const filter = this.checkedRows.filter(r => !(r.parentItem && list.find(l => l.id === r.parentItem?.id)));
    return filter.map(r => r.taskData) as List[];
  }

  newUUIDForCopy(list: List[]) {
    list.forEach(l => {
      l.id = uuidv4();
      if (l.children?.length) {
        this.newUUIDForCopy(l.children)
      }
    })
  }

  prePaster(dataSource: List[]) {
    const list = this.formatCheckRows();
    if (this.cutRow) {
      list.forEach(item => {
        this.deleteNodeInTree(dataSource, item)
      })
    } else {
      this.newUUIDForCopy(list);
    }
    return list;
  }

  pasteNext() {
    const dataSource: List[] = extendArray((this.treegridObj as TreeGridComponent).dataSource as object[]);
    const list = this.prePaster(dataSource)
    const index = dataSource.findIndex(d => d.id === this.targetRow.id)
    dataSource.splice(index+1, 0, ...list);
    (this.treegridObj as TreeGridComponent).dataSource = dataSource; // Refresh the TreeGrid.
    this.checkedRows = [];
  }

  pasteChild() {
    const dataSource: List[] = extendArray((this.treegridObj as TreeGridComponent).dataSource as object[]);
    const list = this.prePaster(dataSource)
    const item = dataSource.find(d => d.id === this.targetRow.id)
    if (item) {
      if (item.children && item.children.length) {
        item.children.concat(list)
      } else {
        item.children = list
      }  
    }
    (this.treegridObj as TreeGridComponent).dataSource = dataSource; // Refresh the TreeGrid.
    this.checkedRows = [];
  }
}