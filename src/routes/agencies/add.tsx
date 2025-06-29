import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddEditAgencyForm from './AddEditAgencyForm';

const AddAgencyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
      <AddEditAgencyForm onClose={() => navigate('/agencies')} />
    </div>
  );
};

export default AddAgencyPage;
