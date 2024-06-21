'use client';

import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const data = [
  { value: 1000, label: 'Rent' },
  { value: 500, label: 'Groceries' },
  { value: 300, label: 'Transportation' },
  { value: 200, label: 'Entertainment' },
  { value: 150, label: 'Utilities' },
  { value: 250, label: 'Health' },
  { value: 400, label: 'Miscellaneous' },
  { value: 100, label: 'Insurance' },
  { value: 350, label: 'Dining Out' },
  { value: 450, label: 'Travel' },
  { value: 600, label: 'Clothing' },
  { value: 700, label: 'Education' },
  { value: 150, label: 'Gifts' },
  { value: 500, label: 'Home Maintenance' },
  { value: 100, label: 'Charity' },
];

const size = {
  width: 1000,
  height: 370,
};

const StyledText = styled('text')(({ theme }: any) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
  color: '#45ff53',
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function PieChartWithCenterLabel() {
  const [hoveredData, setHoveredData] = React.useState<{
    label: string;
    value: number;
    color: string;
  } | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<SVGElement>, item: any) => {
    setHoveredData(item);
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  React.useEffect(() => {
    const segments = document.getElementsByTagName('path');
    for (let i = 0; i < segments.length; i++) {
      segments[i].addEventListener('mouseenter', (e) =>
        handleMouseEnter(e as unknown as React.MouseEvent<SVGElement>, data[i])
      );
      segments[i].addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      for (let i = 0; i < segments.length; i++) {
        segments[i].removeEventListener('mouseenter', (e) =>
          handleMouseEnter(
            e as unknown as React.MouseEvent<SVGElement>,
            data[i]
          )
        );
        segments[i].removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }} >
      <div style={{flex: 1,   marginTop: '20%', marginRight: '20%', paddingRight: '15%', marginBottom: '30%', color: 'red' }} >
        <PieChart series={[{ data, innerRadius: 80 }]} {...size}>
          <PieCenterLabel>
            {hoveredData
              ? 
              `  ${hoveredData.label}:
                  ${hoveredData.value}
              `

              : 'Categories'}
          </PieCenterLabel>
        </PieChart>
      </div>
    </div>
  );
}
