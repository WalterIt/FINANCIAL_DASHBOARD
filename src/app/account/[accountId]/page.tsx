'use client'

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { usePathname } from 'next/navigation'
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridRowsProp,
  GridRowModesModel,
  GridEventListener,
  GridRowId,
  GridRowModes,
  GridRowEditStopReasons,
  GridRowModel,
  GridActionsCellItem,
  GridColDef,
  GridToolbarContainer,
  GridSlots,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { randomId, randomTraderName, randomCreatedDate, randomArrayItem } from '@mui/x-data-grid-generator';
import './styles.module.css';
import PieChartWithCenterLabel from '../chart/page';

const roles = ['Market', 'Finance', 'Development'];

const randomRole = () => {
  return randomArrayItem(roles);
};

const initialRows: GridRowsProp = [
  {
    id: randomId(),
    name: randomTraderName(),
    age: 25,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 36,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 28,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 23,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
];




const AccountPage = () => {
  const pathname = usePathname().split('/').pop();
  const pageName = pathname?.split('-').join(' ');
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const rowAddedRef = React.useRef(false); // Ref to track if the row has been added

  React.useEffect(() => {
    if (!rowAddedRef.current) {
      const id = randomId();
      setRows((oldRows) => [...oldRows, { id, name: '', age: '', joinDate: '', role: '', isNew: true }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
      rowAddedRef.current = true; // Set the ref to true after adding the row
    }
  }, []);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    console.log('Handle Save Click:', rowModesModel);
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
      console.log('EDITED:', rows);
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows((rows) => rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    // Add new empty row
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', joinDate: '', role: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));

    console.log('UPDATED ROW:', updatedRow);
    return updatedRow;
  };

    
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 180, editable: true, headerClassName: 'super-app-theme--header'},
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
      align: 'left',
      headerAlign: 'left',
      editable: true,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'joinDate',
      headerName: 'Join date',
      type: 'date',
      width: 180,
      editable: true,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'role',
      headerName: 'Department',
      width: 220,
      editable: true,
      headerClassName: 'super-app-theme--header',
      type: 'singleSelect',
      valueOptions: roles,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon className="text-teal-600"/>}
            label="Edit"
            className="text-black"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon className="text-rose-500" />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <DefaultLayout>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl uppercase font-semibold text-black dark:text-white">
          {pageName}
        </h2>
      </div>
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'red', // Set header background color
          },
          '& .actions': {
            color: 'text.primary',
          },
          '& .textPrimary': {
            color: '#24303F',
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar as GridSlots['toolbar'],
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          checkboxSelection
          className={`customDataGrid rounded-sm text-[#852828] dark:text-[#c8c7c7] border border-stroke px-1 pb-2.5 pt-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1`}
        />
      </Box>
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'red', // Set header background color
          },
          '& .actions': {
            color: 'text.primary',
          },
          '& .textPrimary': {
            color: '#24303F',
          },
        }}
        className="mt-12 dark:text-[#c8c7c7] border border-stroke px-1 pb-2.5 pt-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
      >
        <PieChartWithCenterLabel  />
      </Box>
    </DefaultLayout>
  );
};

export default AccountPage;



interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleAddTransaction = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', joinDate: new Date(), role: randomRole(), isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleAddTransaction}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

// import { PieChart } from '@mui/x-charts/PieChart';
// import { useDrawingArea } from '@mui/x-charts/hooks';
// import { styled } from '@mui/material/styles';

// const data = [
//   { value: 1000, label: 'Rent' },
//   { value: 500, label: 'Groceries' },
//   { value: 300, label: 'Transportation' },
//   { value: 200, label: 'Entertainment' },
//   { value: 150, label: 'Utilities' },
//   { value: 250, label: 'Health' },
//   { value: 400, label: 'Miscellaneous' },
//   { value: 100, label: 'Insurance' },
//   { value: 350, label: 'Dining Out' },
//   { value: 450, label: 'Travel' },
//   { value: 600, label: 'Clothing' },
//   { value: 700, label: 'Education' },
//   { value: 150, label: 'Gifts' },
//   { value: 500, label: 'Home Maintenance' },
//   { value: 100, label: 'Charity' },
// ];

// const size = {
//   width: 990,
//   height: 400,
// };

// const StyledText = styled('text')(({ theme }: any) => ({
//   fill: theme.palette.text.primary,
//   textAnchor: 'middle',
//   dominantBaseline: 'central',
//   fontSize: 20,
// }));

// function PieCenterLabel({ children }: { children: React.ReactNode }) {
//   const { width, height, left, top } = useDrawingArea();
//   return (
//     <StyledText x={left + width / 2} y={top + height / 2}>
//       {children}
//     </StyledText>
//   );
// }

// export  function PieChartWithCenterLabel() {
//   const [hoveredData, setHoveredData] = React.useState<{
//     label: string;
//     value: number;
//   } | null>(null);

//   const handleMouseEnter = (event: React.MouseEvent<SVGElement>, item: any) => {
//     setHoveredData(item);
//   };

//   const handleMouseLeave = () => {
//     setHoveredData(null);
//   };

//   React.useEffect(() => {
//     const segments = document.getElementsByTagName('path');
//     for (let i = 0; i < segments.length; i++) {
//       segments[i].addEventListener('mouseenter', (e) =>
//         handleMouseEnter(e as unknown as React.MouseEvent<SVGElement>, data[i])
//       );
//       segments[i].addEventListener('mouseleave', handleMouseLeave);
//     }
//     return () => {
//       for (let i = 0; i < segments.length; i++) {
//         segments[i].removeEventListener('mouseenter', (e) =>
//           handleMouseEnter(
//             e as unknown as React.MouseEvent<SVGElement>,
//             data[i]
//           )
//         );
//         segments[i].removeEventListener('mouseleave', handleMouseLeave);
//       }
//     };
//   }, []);

//   return (
//     <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center' }} className='mx-auto pr-[28%]'>
//       <div style={{ flex: 2 }}>
//         <PieChart series={[{ data, innerRadius: 80 }]} {...size} className="text-white  dark:text-[#c8c7c7] border border-stroke px-1 pb-2.5 pt-2">
//           <PieCenterLabel >
//             {hoveredData
//               ? `${hoveredData.label}: ${hoveredData.value}`
//               : 'Categories'}
//           </PieCenterLabel>
//         </PieChart>
//       </div>
//     </div>
//   );
// }
