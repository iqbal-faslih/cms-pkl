import ModalTambahJurnal from "./ModalTambahJurnal";
import ModalDetailJurnal from "./ModalDetailJurnal";
import ModalEditJurnal from "./ModalEditJurnal";
import ModalTidakMengisi from "./ModalTidakMengisi"; 

const JurnalModalsContainer = ({
  onSubmitSuccess,
  onEditClick,
  onUpdateSuccess,
}) => {
  return (
    <>
      <ModalTambahJurnal onSubmitSuccess={onSubmitSuccess} />
      <ModalDetailJurnal onEdit={onEditClick} />
      <ModalEditJurnal onUpdate={onUpdateSuccess} />
      <ModalTidakMengisi /> 
    </>
  );
};

export default JurnalModalsContainer;
