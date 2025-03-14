import React from 'react';
import '../../css/entranceLayout.css'
import SidebarR from '../studentspage/studentSideBar';
import BioEntranceDisplay from '../teacherspage/biology/bioEntranceDisplay';
//import { useOutletContext } from 'react-router-dom';


const EntranceLayout = () => {
  //const student = useOutletContext();
  return (
    <>
     
    <div className="layout-container">
     <SidebarR />
      <BioEntranceDisplay />
    </div>
    </>
  );
};

export default EntranceLayout;