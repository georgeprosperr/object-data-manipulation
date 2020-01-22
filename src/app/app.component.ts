import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'interview';
  table: Table = new Table(null);
  object = {
    headers: [
      {
        id: 'dx',
        name: 'Data'
      },
      {
        id: 'ou',
        name: 'Place'
      },
      {
        id: 'value',
        name: 'Value'
      }
    ],
    metaData: {
      names: {
        hTUspcBc4Yn: 'HIV Prevalence',
        EzE8xZ31zfC: 'Malaria Prevalence',
        E31SemmmFGb: 'TB Prevalence',
        dx: 'Data',
        ou: 'Place',
        R7TPl8q81Ft: 'Insect District'
      },
      dimensions: {
        dx: ['EzE8xZ31zfC', 'hTUspcBc4Yn', 'E31SemmmFGb'],
        ou: ['R7TPl8q81Ft']
      }
    },
    rows: [
      ['EzE8xZ31zfC', 'R7TPl8q81Ft', '47.0'],
      ['hTUspcBc4Yn', 'R7TPl8q81Ft', '50.6'],
      ['E31SemmmFGb', 'R7TPl8q81Ft', '7.8']
    ]
  };
  tableName = '';
  doneLoading = false;
  constructor() {

  }

  generateTable(table: string): void {
    this.doneLoading = false;
    let rowKey = '';
    let columnKey = '';
    if (table === 'table1') {
      this.table = new Table(null);
      this.tableName = 'Table 1';
      rowKey = 'ou';
      columnKey = 'dx';
    } else {
      this.table = new Table(null);
      this.tableName = 'Table 2';
      rowKey = 'dx';
      columnKey = 'ou';
    }

    const headerFirst = this.object.headers.find(header => header.id === rowKey).name;
    const headerSecond = this.object.headers.find(header => header.id === columnKey).name;

    const firstRowData = headerFirst + ' vs ' + headerSecond;
    this.table.header.push(firstRowData);
    // get list of places.
    this.object.metaData.dimensions[rowKey].forEach((placeKey) => {
      // get place name.
      const placeName = this.object.metaData.names[placeKey];
      this.table.header.push(placeName);
    });

    // start generating data row.
    const rows: Row[] = [];
    for (const dataKey of this.object.metaData.dimensions[columnKey]) {
      const row: Row = new Row(null);
      // push row name first.
      row.data.push(this.getPlaceName(dataKey, this.object.metaData.names));
      this.object.metaData.dimensions[rowKey].forEach((placeKey) => {
        let rowValue = '';
        if (table === 'table1') {
          rowValue = this.getRowData(dataKey, placeKey, this.object.rows);
        } else {
          rowValue = this.getRowData(placeKey, dataKey, this.object.rows);
        }
        row.data.push(rowValue);
      });
      rows.push(row);
    }
    // sort data based on selected.
    const sortedRows = this.sortRowFunction(rows, 0);
    this.table.rows.push(...sortedRows);
    this.doneLoading = true;
  }

  getRowData(rowKey, columnKey, rows: string[][]) {
    for (const row of rows) {
      if (row[0] === rowKey && row[1] === columnKey) {
        return row[2];
      }
    }
  }

  getPlaceName(placeKey, names: any): string {
    return (names && names[placeKey]) ? names[placeKey] : '-';
  }

  sortRowFunction(array: any, field: any): any[] {
    if (!array) {
      return array;
    }
    array.sort((first: any, second: any) => {
      const a = first.data;
      const b = second.data;
      if ((a[field] || '').toLowerCase() < (b[field] || '').toLowerCase()) {
        return -1;
      } else if ((a[field] || '').toLowerCase() > (b[field] || '').toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

class Table {
  header: string[];
  rows: Row[];

  constructor(table: Table) {
    this.header = (table && table.header) ? table.header : [];
    this.rows   = (table && table.rows)   ? table.rows   : [];
  }
}

class Row {
  data: string[];
  constructor(row: Row) {
    this.data = (row && row.data) ? row.data : [];
  }
}
